// Google OAuth login - redirect to Google
export default function handler(req, res) {
  console.log("[OAuth Start] ===== INITIATING GOOGLE OAUTH =====");

  const {
    GOOGLE_CLIENT_ID,
    SERVER_URL = "https://ai-tarot-cards.vercel.app",
  } = process.env;

  console.log("[OAuth Start] GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? "present" : "MISSING");
  console.log("[OAuth Start] SERVER_URL:", SERVER_URL);

  if (!GOOGLE_CLIENT_ID) {
    console.error("[OAuth Start] GOOGLE_CLIENT_ID not configured!");
    return res.status(500).json({ error: "Google OAuth not configured" });
  }

  const redirectUri = `${SERVER_URL}/api/auth/google/callback`;
  console.log("[OAuth Start] Redirect URI:", redirectUri);

  const scope = "profile email";
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=select_account`;

  console.log("[OAuth Start] Redirecting to Google, full URL:", googleAuthUrl);
  res.redirect(302, googleAuthUrl);
}
