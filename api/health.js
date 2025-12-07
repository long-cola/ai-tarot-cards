// Standalone health check - no dependencies
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    timestamp: Date.now(),
    env: process.env.NODE_ENV || 'development'
  });
}
