import {
  isAdminAuthorized,
  createAdminUser,
  getUserStats,
  getUserTopics,
  getTopicEvents,
  getRedemptionCodes,
  downgradeUser,
} from '../services/admin.js';
import { getPool } from '../services/db.js';
import { generateCodes } from '../services/redemption.js';
import {
  getAllPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from '../services/promptService.js';
import { getAnalytics, getAnalyticsSummary } from '../services/analyticsService.js';

export default async function handler(req: any, res: any) {
  // Strip query string for clean path matching
  const fullPath = req.url || '';
  const path = fullPath.split('?')[0];
  const method = req.method;

  console.log('[admin] Request:', method, path);

  // POST /api/admin/create - Create admin user
  if (path.includes('/create') && method === 'POST') {
    return handleCreateAdmin(req, res);
  }

  // Check admin authorization for all other endpoints
  if (!(await isAdminAuthorized(req))) {
    console.log('[admin] Authorization failed');
    return res.status(403).json({ ok: false, message: 'forbidden' });
  }

  console.log('[admin] Authorization passed');

  // GET /api/admin/codes - Get redemption codes
  if (path === '/api/admin/codes' && method === 'GET') {
    return handleGetCodes(req, res);
  }

  // POST /api/admin/codes/generate - Generate codes
  if (path.includes('/codes/generate') && method === 'POST') {
    return handleGenerateCodes(req, res);
  }

  // GET /api/admin/prompts - Get all prompts
  if (path === '/api/admin/prompts' && method === 'GET') {
    return handleGetPrompts(req, res);
  }

  // POST /api/admin/prompts - Create prompt
  if (path === '/api/admin/prompts' && method === 'POST') {
    return handleCreatePrompt(req, res);
  }

  // PUT /api/admin/prompts/:id - Update prompt
  const promptUpdateMatch = path.match(/\/admin\/prompts\/([^/]+)$/);
  if (promptUpdateMatch && method === 'PUT') {
    return handleUpdatePrompt(req, res, promptUpdateMatch[1]);
  }

  // DELETE /api/admin/prompts/:id - Delete prompt
  const promptDeleteMatch = path.match(/\/admin\/prompts\/([^/]+)$/);
  if (promptDeleteMatch && method === 'DELETE') {
    return handleDeletePrompt(req, res, promptDeleteMatch[1]);
  }

  // GET /api/admin/analytics - Get analytics data
  if (path === '/api/admin/analytics' && method === 'GET') {
    return handleGetAnalytics(req, res);
  }

  // GET /api/admin/users - Get user stats (must check before users/:id/topics)
  if (path === '/api/admin/users' && method === 'GET') {
    return handleGetUsers(req, res);
  }

  // POST /api/admin/users/:id/downgrade - Downgrade user
  const userDowngradeMatch = path.match(/\/admin\/users\/([^/]+)\/downgrade/);
  if (userDowngradeMatch && method === 'POST') {
    return handleDowngradeUser(req, res, userDowngradeMatch[1]);
  }

  // GET /api/admin/users/:id/topics - Get user's topics
  const userIdMatch = path.match(/\/admin\/users\/([^/]+)\/topics/);
  if (userIdMatch && method === 'GET') {
    return handleGetUserTopics(req, res, userIdMatch[1]);
  }

  // GET /api/admin/topics/:id/events - Get topic events
  const topicEventsMatch = path.match(/\/admin\/topics\/([^/]+)\/events/);
  if (topicEventsMatch && method === 'GET') {
    return handleGetTopicEvents(req, res, topicEventsMatch[1]);
  }

  // GET /api/admin/topics/:id - Get topic detail
  const topicIdMatch = path.match(/\/admin\/topics\/([^/]+)/);
  if (topicIdMatch && method === 'GET' && !path.includes('/events')) {
    return handleGetTopicDetail(req, res, topicIdMatch[1]);
  }

  console.log('[admin] No route matched for:', path);
  return res.status(404).json({ ok: false, message: 'not_found' });
}

// Create admin user (requires ADMIN_CODE_SECRET)
async function handleCreateAdmin(req: any, res: any) {
  const { ADMIN_CODE_SECRET } = process.env;

  if (!ADMIN_CODE_SECRET || req.headers['x-admin-secret'] !== ADMIN_CODE_SECRET) {
    return res.status(403).json({ ok: false, message: 'forbidden' });
  }

  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'email and password required' });
  }

  try {
    const admin = await createAdminUser(email, password, name);
    res.json({ ok: true, admin });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
}

// Get all users with stats
async function handleGetUsers(req: any, res: any) {
  try {
    const stats = await getUserStats();
    res.json({ ok: true, ...stats });
  } catch (error: any) {
    console.error('[/api/admin/users] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Get user's topics
async function handleGetUserTopics(req: any, res: any, userId: string) {
  try {
    const topics = await getUserTopics(userId);
    res.json({ ok: true, topics });
  } catch (error: any) {
    console.error('[/api/admin/users/:id/topics] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Get topic events
async function handleGetTopicEvents(req: any, res: any, topicId: string) {
  try {
    const events = await getTopicEvents(topicId);
    res.json({ ok: true, events });
  } catch (error: any) {
    console.error('[/api/admin/topics/:id/events] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Get topic detail with events
async function handleGetTopicDetail(req: any, res: any, topicId: string) {
  try {
    const pool = getPool();

    const topicRes = await pool.query(`SELECT * FROM topics WHERE id=$1 LIMIT 1`, [topicId]);
    if (!topicRes.rows.length) {
      return res.status(404).json({ ok: false, message: 'topic_not_found' });
    }

    const eventsRes = await pool.query(
      `SELECT * FROM topic_events WHERE topic_id=$1 ORDER BY created_at ASC`,
      [topicId]
    );

    res.json({
      ok: true,
      topic: topicRes.rows[0],
      events: eventsRes.rows,
    });
  } catch (error: any) {
    console.error('[/api/admin/topics/:id] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Get all redemption codes
async function handleGetCodes(req: any, res: any) {
  try {
    const codes = await getRedemptionCodes();
    res.json({ ok: true, codes });
  } catch (error: any) {
    console.error('[/api/admin/codes] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Generate redemption codes
async function handleGenerateCodes(req: any, res: any) {
  try {
    const { count = 1, durationDays = 30, validDays = 365 } = req.body || {};
    const codes = await generateCodes({
      count: Math.min(count, 50),
      durationDays,
      validDays,
    });
    res.json({ ok: true, codes });
  } catch (error: any) {
    console.error('[/api/admin/codes/generate] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Get all prompts
async function handleGetPrompts(req: any, res: any) {
  try {
    const prompts = await getAllPrompts();
    res.json({ ok: true, prompts });
  } catch (error: any) {
    console.error('[/api/admin/prompts] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Create prompt
async function handleCreatePrompt(req: any, res: any) {
  try {
    const { key, language, trigger_type, variables, template } = req.body || {};

    if (!key || !language || !trigger_type || !template) {
      return res.status(400).json({
        ok: false,
        message: 'key, language, trigger_type and template are required'
      });
    }

    if (!['initial', 'event'].includes(trigger_type)) {
      return res.status(400).json({
        ok: false,
        message: 'trigger_type must be "initial" or "event"'
      });
    }

    const prompt = await createPrompt({
      key,
      language,
      trigger_type,
      variables: variables || [],
      template,
    });

    res.json({ ok: true, prompt });
  } catch (error: any) {
    console.error('[/api/admin/prompts] Create error:', error);
    res.status(500).json({ ok: false, message: error.message || 'internal_error' });
  }
}

// Update prompt
async function handleUpdatePrompt(req: any, res: any, promptId: string) {
  try {
    const { key, language, trigger_type, variables, template, is_active } = req.body || {};

    const updateData: any = {};
    if (key !== undefined) updateData.key = key;
    if (language !== undefined) updateData.language = language;
    if (trigger_type !== undefined) {
      if (!['initial', 'event'].includes(trigger_type)) {
        return res.status(400).json({
          ok: false,
          message: 'trigger_type must be "initial" or "event"'
        });
      }
      updateData.trigger_type = trigger_type;
    }
    if (variables !== undefined) updateData.variables = variables;
    if (template !== undefined) updateData.template = template;
    if (is_active !== undefined) updateData.is_active = is_active;

    const prompt = await updatePrompt(promptId, updateData);

    if (!prompt) {
      return res.status(404).json({ ok: false, message: 'prompt_not_found' });
    }

    res.json({ ok: true, prompt });
  } catch (error: any) {
    console.error('[/api/admin/prompts/:id] Update error:', error);
    res.status(500).json({ ok: false, message: error.message || 'internal_error' });
  }
}

// Delete prompt
async function handleDeletePrompt(req: any, res: any, promptId: string) {
  try {
    const deleted = await deletePrompt(promptId);

    if (!deleted) {
      return res.status(404).json({ ok: false, message: 'prompt_not_found' });
    }

    res.json({ ok: true });
  } catch (error: any) {
    console.error('[/api/admin/prompts/:id] Delete error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Get analytics data
async function handleGetAnalytics(req: any, res: any) {
  try {
    // Get query parameters for date range
    const url = new URL(req.url, `http://${req.headers.host}`);
    const days = parseInt(url.searchParams.get('days') || '30', 10);

    // Calculate date range
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get analytics data
    const analytics = await getAnalytics(startDate, endDate);
    const summary = await getAnalyticsSummary(startDate, endDate);

    res.json({
      ok: true,
      startDate,
      endDate,
      days,
      summary,
      analytics,
    });
  } catch (error: any) {
    console.error('[/api/admin/analytics] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Downgrade user from Pro to Free
async function handleDowngradeUser(req: any, res: any, userId: string) {
  try {
    await downgradeUser(userId);
    res.json({ ok: true, message: 'User downgraded successfully' });
  } catch (error: any) {
    console.error('[/api/admin/users/:id/downgrade] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

export const config = {
  maxDuration: 10,
};
