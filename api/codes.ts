import { getUserFromRequest } from '../services/jwt';
import { redeemCode, generateCodes } from '../services/redemption';

export default async function handler(req: any, res: any) {
  // Strip query string
  const fullPath = req.url || '';
  const path = fullPath.split('?')[0];
  const method = req.method;

  console.log('[codes] Request:', method, path);

  // POST /api/codes/generate - Generate codes (admin only)
  if (path.includes('/generate') && method === 'POST') {
    return handleGenerateCodes(req, res);
  }

  // POST /api/codes/redeem - Redeem a code (authenticated user)
  if (path.includes('/redeem') && method === 'POST') {
    return handleRedeemCode(req, res);
  }

  console.log('[codes] No route matched');
  return res.status(404).json({ ok: false, message: 'not_found' });
}

// Generate redemption codes (admin only)
async function handleGenerateCodes(req: any, res: any) {
  const { ADMIN_CODE_SECRET } = process.env;

  if (!ADMIN_CODE_SECRET || req.headers['x-admin-secret'] !== ADMIN_CODE_SECRET) {
    return res.status(403).json({ ok: false, message: 'forbidden' });
  }

  try {
    const { count = 1, durationDays = 30, validDays = 365 } = req.body || {};
    const codes = await generateCodes({
      count: Math.min(count, 50),
      durationDays,
      validDays,
    });
    res.json({ ok: true, codes });
  } catch (error: any) {
    console.error('[/api/codes/generate] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

// Redeem a code
async function handleRedeemCode(req: any, res: any) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ ok: false, message: 'not_authenticated' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ ok: false, message: 'missing_code' });
  }

  try {
    const result = await redeemCode(code.trim(), user.id);
    if (!result.ok) {
      return res.status(400).json({ ok: false, reason: result.reason });
    }

    res.json({
      ok: true,
      membership_expires_at: result.membership_expires_at,
      plan: 'member',
    });
  } catch (error: any) {
    console.error('[/api/codes/redeem] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

export const config = {
  maxDuration: 10,
};
