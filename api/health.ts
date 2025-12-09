// Health check endpoint for serverless warmup
export default function handler(req: any, res: any) {
  res.json({ ok: true, status: 'healthy', timestamp: Date.now() });
}

export const config = {
  maxDuration: 5,
};
