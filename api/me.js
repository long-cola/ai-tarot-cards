// Standalone /api/me endpoint - bypasses Express middleware
export default async function handler(req, res) {
  // For now, always return no user (until we fix session/passport)
  // This unblocks the frontend from loading
  res.status(200).json({
    user: null,
    plan: 'guest',
    daily_limit: 0,
    used_today: 0,
    remaining_today: 0
  });
}
