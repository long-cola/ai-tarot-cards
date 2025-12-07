import { getPool } from "../server/db.js";
import { signToken, setAuthCookie } from "../server/jwt.js";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.CLIENT_ORIGINS?.split(',')[0] || 'https://ai-tarot-cards.vercel.app'}?auth=failure`);
  }

  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SERVER_URL = "https://ai-tarot-cards.vercel.app",
    CLIENT_ORIGINS,
  } = process.env;

  const clientOrigin = CLIENT_ORIGINS?.split(',')[0] || 'https://ai-tarot-cards.vercel.app';

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${clientOrigin}?auth=failure&reason=config`);
  }

  try {
    // Exchange code for access token
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
      console.error("Token exchange failed:", await tokenResponse.text());
      return res.redirect(`${clientOrigin}?auth=failure&reason=token`);
    }

    const { access_token } = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      console.error("User info fetch failed");
      return res.redirect(`${clientOrigin}?auth=failure&reason=userinfo`);
    }

    const googleUser = await userResponse.json();
    const { id: googleId, email, name, picture: avatar } = googleUser;

    // Get or create user in database
    const pool = getPool();
    if (!pool) {
      console.error("Database not configured");
      return res.redirect(`${clientOrigin}?auth=failure&reason=db`);
    }

    const existing = await pool.query(
      `SELECT * FROM users WHERE provider = $1 AND provider_id = $2 LIMIT 1`,
      ["google", googleId]
    );

    let user;
    if (existing.rows.length) {
      user = existing.rows[0];
      // Update user info
      await pool.query(
        `UPDATE users SET email=$1, name=$2, avatar=$3, updated_at=NOW() WHERE id=$4`,
        [email, name, avatar, user.id]
      );
    } else {
      // Create new user
      const insert = await pool.query(
        `INSERT INTO users (provider, provider_id, email, name, avatar) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        ["google", googleId, email, name, avatar]
      );
      user = insert.rows[0];
    }

    // Sign JWT and set cookie
    const token = signToken(user);
    setAuthCookie(res, token);

    // Redirect to frontend with success
    res.redirect(`${clientOrigin}?auth=success`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return res.redirect(`${clientOrigin}?auth=failure&reason=error`);
  }
}

export const config = {
  maxDuration: 30,
};
