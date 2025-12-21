import { trackPageView } from '../services/analyticsService.js';

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { visitorId, userId, pagePath, userAgent, referrer } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    await trackPageView({
      visitorId,
      userId: userId || undefined,
      pagePath: pagePath || '/',
      userAgent: userAgent || req.headers['user-agent'] || '',
      referrer: referrer || req.headers['referer'] || '',
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[Analytics API] Error:', error);
    return res.status(500).json({ error: 'Failed to track page view' });
  }
}

export const config = {
  maxDuration: 10,
};
