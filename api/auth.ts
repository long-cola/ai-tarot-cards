import { getPool } from '../services/db.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../services/jwt.js';

export default async function handler(req: any, res: any) {
  // Strip query string
  const fullPath = req.url || '';
  const path = fullPath.split('?')[0];

  console.log('[auth] Request:', req.method, path);

  // POST /api/auth/logout - Handle logout
  if (path.includes('/logout')) {
    clearAuthCookie(res);
    return res.json({ ok: true });
  }

  // GET /api/auth/google/callback - Handle OAuth callback
  if (path.includes('/google/callback')) {
    return handleGoogleCallback(req, res);
  }

  // GET /api/auth/google - Initiate Google OAuth
  if (path.includes('/google')) {
    return handleGoogleLogin(req, res);
  }

  console.log('[auth] No route matched');
  return res.status(404).json({ error: 'Not found' });
}

// Handle Google OAuth login
function handleGoogleLogin(req: any, res: any) {
  console.log('[OAuth Start] ===== INITIATING GOOGLE OAUTH =====');

  const {
    GOOGLE_CLIENT_ID,
    SERVER_URL = 'https://ai-tarotcard.com',
  } = process.env;

  console.log('[OAuth Start] GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'present' : 'MISSING');
  console.log('[OAuth Start] SERVER_URL:', SERVER_URL);

  if (!GOOGLE_CLIENT_ID) {
    console.error('[OAuth Start] GOOGLE_CLIENT_ID not configured!');
    return res.status(500).json({ error: 'Google OAuth not configured' });
  }

  const redirectUri = `${SERVER_URL}/api/auth/google/callback`;
  console.log('[OAuth Start] Redirect URI:', redirectUri);

  const scope = 'profile email';
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=select_account`;

  console.log('[OAuth Start] Redirecting to Google');
  res.redirect(302, googleAuthUrl);
}

// Handle Google OAuth callback
async function handleGoogleCallback(req: any, res: any) {
  console.log('[OAuth Callback] ===== FUNCTION INVOKED =====');
  console.log('[OAuth Callback] Method:', req.method);
  console.log('[OAuth Callback] URL:', req.url);

  const { code } = req.query;

  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SERVER_URL = 'https://ai-tarotcard.com',
    CLIENT_ORIGINS,
  } = process.env;

  // Prioritize SERVER_URL for production environments
  // Only use CLIENT_ORIGINS for local development
  const isLocalDev = SERVER_URL.includes('localhost') || SERVER_URL.includes('127.0.0.1');
  const clientOrigin = isLocalDev && CLIENT_ORIGINS
    ? CLIENT_ORIGINS.split(',')[0]
    : SERVER_URL;

  console.log('[OAuth Callback] Environment - SERVER_URL:', SERVER_URL);
  console.log('[OAuth Callback] Environment - Is Local Dev:', isLocalDev);
  console.log('[OAuth Callback] Redirect to:', clientOrigin);
  console.log('[OAuth Callback] Started, code present:', !!code);

  if (!code) {
    console.error('[OAuth Callback] No code in query');
    return res.redirect(`${clientOrigin}?auth=failure&reason=nocode`);
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('[OAuth Callback] Missing OAuth config');
    return res.redirect(`${clientOrigin}?auth=failure&reason=config`);
  }

  try {
    // Exchange code for access token
    console.log('[OAuth Callback] Exchanging code for token...');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${SERVER_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[OAuth Callback] Token exchange failed:', tokenResponse.status, errorText);
      return res.redirect(`${clientOrigin}?auth=failure&reason=token`);
    }

    const { access_token } = await tokenResponse.json();
    console.log('[OAuth Callback] Got access token');

    // Get user info from Google
    console.log('[OAuth Callback] Fetching user info...');
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      console.error('[OAuth Callback] User info fetch failed:', userResponse.status);
      return res.redirect(`${clientOrigin}?auth=failure&reason=userinfo`);
    }

    const googleUser = await userResponse.json();
    const { id: googleId, email, name, picture: avatar } = googleUser;
    console.log('[OAuth Callback] Got user info for:', email);

    // Get or create user in database
    const pool = getPool();

    console.log('[OAuth Callback] Checking existing user...');
    const existing = await pool.query(
      `SELECT * FROM users WHERE provider = $1 AND provider_id = $2 LIMIT 1`,
      ['google', googleId]
    );

    let user;
    if (existing.rows.length) {
      console.log('[OAuth Callback] Existing user found, updating...');
      user = existing.rows[0];
      // Update user info
      await pool.query(
        `UPDATE users SET email=$1, name=$2, avatar=$3, updated_at=NOW() WHERE id=$4`,
        [email, name, avatar, user.id]
      );
    } else {
      console.log('[OAuth Callback] Creating new user...');
      // Create new user
      const insert = await pool.query(
        `INSERT INTO users (provider, provider_id, email, name, avatar) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        ['google', googleId, email, name, avatar]
      );
      user = insert.rows[0];
      console.log('[OAuth Callback] New user created:', user.id);
    }

    // Sign JWT and set cookie
    console.log('[OAuth Callback] Signing JWT for user:', user.id);
    const token = signToken(user);
    setAuthCookie(res, token);
    console.log('[OAuth Callback] Cookie set with token (length:', token?.length, ')');

    // Always pass token in URL as fallback for all browsers
    // This ensures auth works even if cookies are blocked or not persisting
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(req.headers['user-agent'] || '');
    console.log('[OAuth Callback] Is mobile:', isMobile);
    console.log('[OAuth Callback] Passing token in URL for reliable auth fallback');

    // Pass token in URL for all browsers (cookie is still set as primary method)
    return res.redirect(302, `${clientOrigin}?auth=success&token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('[OAuth Callback] Unexpected error:', error);
    console.error('[OAuth Callback] Error stack:', error.stack);
    return res.redirect(
      `${clientOrigin}?auth=failure&reason=error&msg=${encodeURIComponent(error.message)}`
    );
  }
}

export const config = {
  maxDuration: 30,
};
