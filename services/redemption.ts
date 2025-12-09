import crypto from 'crypto';
import { getPool } from './db.js';
import { startMembershipCycle } from './plan.js';

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export async function redeemCode(code: string, userId: string) {
  const pool = getPool();
  const now = new Date();
  const result = await pool.query(`SELECT * FROM redemption_codes WHERE code = $1 LIMIT 1`, [code]);

  if (!result.rows.length) {
    return { ok: false, reason: 'not_found' };
  }

  const row = result.rows[0];
  if (row.redeemed_by) {
    return { ok: false, reason: 'used' };
  }

  if (row.expires_at && new Date(row.expires_at) < now) {
    return { ok: false, reason: 'expired' };
  }

  const userRes = await pool.query(
    `SELECT membership_expires_at FROM users WHERE id=$1 LIMIT 1`,
    [userId]
  );
  const currentExpiry = userRes.rows[0]?.membership_expires_at
    ? new Date(userRes.rows[0].membership_expires_at)
    : null;

  const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
  const newExpiry = addDays(baseDate, row.duration_days || 30);

  await pool.query(`UPDATE users SET membership_expires_at=$1 WHERE id=$2`, [newExpiry, userId]);
  await startMembershipCycle({ userId, durationDays: row.duration_days || 30, source: 'redeem' });
  await pool.query(
    `UPDATE redemption_codes SET redeemed_by=$1, redeemed_at=NOW() WHERE code=$2`,
    [userId, code]
  );

  return { ok: true, membership_expires_at: newExpiry.toISOString() };
}

export async function generateCodes({
  count = 1,
  durationDays = 30,
  validDays = 365,
}: {
  count?: number;
  durationDays?: number;
  validDays?: number;
}) {
  const pool = getPool();
  const expiresAt = validDays ? addDays(new Date(), validDays) : null;
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(5).toString('hex');
    codes.push(code);
    await pool.query(
      `INSERT INTO redemption_codes (code, duration_days, expires_at) VALUES ($1,$2,$3)`,
      [code, durationDays, expiresAt]
    );
  }

  return codes;
}
