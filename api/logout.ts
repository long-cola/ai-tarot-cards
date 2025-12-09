import { clearAuthCookie } from '../services/jwt.js';

export default function handler(req: any, res: any) {
  clearAuthCookie(res);
  res.json({ ok: true });
}

export const config = {
  maxDuration: 5,
};
