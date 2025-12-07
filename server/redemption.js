import crypto from "crypto";
import { pool } from "./db.js";
import { startMembershipCycle } from "./plan.js";

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export const redeemCode = async (code, userId) => {
  const now = new Date();
  const result = await pool.query(`select * from redemption_codes where code = $1 limit 1`, [code]);
  if (!result.rows.length) {
    return { ok: false, reason: "not_found" };
  }

  const row = result.rows[0];
  if (row.redeemed_by) {
    return { ok: false, reason: "used" };
  }

  if (row.expires_at && new Date(row.expires_at) < now) {
    return { ok: false, reason: "expired" };
  }

  const userRes = await pool.query(
    `select membership_expires_at from users where id=$1 limit 1`,
    [userId]
  );
  const currentExpiry = userRes.rows[0]?.membership_expires_at
    ? new Date(userRes.rows[0].membership_expires_at)
    : null;

  const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
  const newExpiry = addDays(baseDate, row.duration_days || 30);

  await pool.query(`update users set membership_expires_at=$1 where id=$2`, [newExpiry, userId]);
  await startMembershipCycle({ userId, durationDays: row.duration_days || 30, source: "redeem" });
  await pool.query(
    `update redemption_codes set redeemed_by=$1, redeemed_at=now() where code=$2`,
    [userId, code]
  );

  return { ok: true, membership_expires_at: newExpiry.toISOString() };
};

export const generateCodes = async ({ count = 1, durationDays = 30, validDays = 365 }) => {
  const expiresAt = validDays ? addDays(new Date(), validDays) : null;
  const codes = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(5).toString("hex");
    codes.push(code);
    await pool.query(
      `insert into redemption_codes (code, duration_days, expires_at) values ($1,$2,$3)`,
      [code, durationDays, expiresAt]
    );
  }

  return codes;
};
