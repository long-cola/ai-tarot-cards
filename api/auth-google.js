// Google OAuth login - redirect to Google
export default function handler(req, res) {
  const {
    GOOGLE_CLIENT_ID,
    SERVER_URL = "https://ai-tarot-cards.vercel.app",
  } = process.env;

  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "Google OAuth not configured" });
  }

  const redirectUri = `${SERVER_URL}/api/auth/google/callback`;
  const scope = "profile email";
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=select_account`;

  res.redirect(302, googleAuthUrl);
}
