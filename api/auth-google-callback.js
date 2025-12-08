import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";
import { signToken, setAuthCookie } from "../server/jwt.js";

let schemaEnsured = false;

export default async function handler(req, res) {
  // FIRST LOG - at the very start to confirm function is called
  console.log("[OAuth Callback] ===== FUNCTION INVOKED =====");
  console.log("[OAuth Callback] Method:", req.method);
  console.log("[OAuth Callback] URL:", req.url);
  console.log("[OAuth Callback] Headers:", JSON.stringify(req.headers, null, 2));
  console.log("[OAuth Callback] Query:", JSON.stringify(req.query, null, 2));

  const { code } = req.query;

  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SERVER_URL = "https://ai-tarot-cards.vercel.app",
    CLIENT_ORIGINS,
  } = process.env;

  const clientOrigin = CLIENT_ORIGINS?.split(',')[0] || 'https://ai-tarot-cards.vercel.app';

  console.log("[OAuth Callback] Started, code present:", !!code);
  console.log("[OAuth Callback] SERVER_URL:", SERVER_URL);
  console.log("[OAuth Callback] CLIENT_ORIGINS:", CLIENT_ORIGINS);

  if (!code) {
    console.error("[OAuth Callback] No code in query");
    return res.redirect(`${clientOrigin}?auth=failure&reason=nocode`);
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("[OAuth Callback] Missing OAuth config");
    return res.redirect(`${clientOrigin}?auth=failure&reason=config`);
  }

  try {
    // Exchange code for access token
    console.log("[OAuth Callback] Exchanging code for token...");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${SERVER_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[OAuth Callback] Token exchange failed:", tokenResponse.status, errorText);
      return res.redirect(`${clientOrigin}?auth=failure&reason=token`);
    }

    const { access_token } = await tokenResponse.json();
    console.log("[OAuth Callback] Got access token");

    // Get user info from Google
    console.log("[OAuth Callback] Fetching user info...");
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      console.error("[OAuth Callback] User info fetch failed:", userResponse.status);
      return res.redirect(`${clientOrigin}?auth=failure&reason=userinfo`);
    }

    const googleUser = await userResponse.json();
    const { id: googleId, email, name, picture: avatar } = googleUser;
    console.log("[OAuth Callback] Got user info for:", email);

    // Get or create user in database
    const pool = getPool();
    if (!pool) {
      console.error("[OAuth Callback] Database not configured");
      return res.redirect(`${clientOrigin}?auth=failure&reason=db`);
    }

    // Ensure schema exists
    if (!schemaEnsured) {
      console.log("[OAuth Callback] Ensuring database schema...");
      try {
        await ensureSchema();
        schemaEnsured = true;
        console.log("[OAuth Callback] Schema ensured");
      } catch (schemaError) {
        console.error("[OAuth Callback] Schema error:", schemaError);
        return res.redirect(`${clientOrigin}?auth=failure&reason=schema`);
      }
    }

    console.log("[OAuth Callback] Checking existing user...");
    const existing = await pool.query(
      `SELECT * FROM users WHERE provider = $1 AND provider_id = $2 LIMIT 1`,
      ["google", googleId]
    );

    let user;
    if (existing.rows.length) {
      console.log("[OAuth Callback] Existing user found, updating...");
      user = existing.rows[0];
      // Update user info
      await pool.query(
        `UPDATE users SET email=$1, name=$2, avatar=$3, updated_at=NOW() WHERE id=$4`,
        [email, name, avatar, user.id]
      );
    } else {
      console.log("[OAuth Callback] Creating new user...");
      // Create new user
      const insert = await pool.query(
        `INSERT INTO users (provider, provider_id, email, name, avatar) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        ["google", googleId, email, name, avatar]
      );
      user = insert.rows[0];
      console.log("[OAuth Callback] New user created:", user.id);
    }

    // Sign JWT and set cookie
    console.log("[OAuth Callback] Signing JWT for user:", user.id);
    const token = signToken(user);
    setAuthCookie(res, token);
    console.log("[OAuth Callback] Cookie set with token (length:", token?.length, ")");
    console.log("[OAuth Callback] User agent:", req.headers['user-agent']);
    console.log("[OAuth Callback] Client origin:", clientOrigin);

    // For mobile browsers, also pass token in URL as fallback
    // The frontend will store it in localStorage and use Authorization header
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(req.headers['user-agent']);
    console.log("[OAuth Callback] Is mobile:", isMobile);

    if (isMobile) {
      // Pass token in URL for mobile browsers (cookie may not work reliably)
      return res.redirect(302, `${clientOrigin}?auth=success&token=${encodeURIComponent(token)}`);
    } else {
      // Desktop: use cookie-based auth
      return res.redirect(302, `${clientOrigin}?auth=success`);
    }
  } catch (error) {
    console.error("[OAuth Callback] Unexpected error:", error);
    console.error("[OAuth Callback] Error stack:", error.stack);
    return res.redirect(`${clientOrigin}?auth=failure&reason=error&msg=${encodeURIComponent(error.message)}`);
  }
}

export const config = {
  maxDuration: 30,
};
