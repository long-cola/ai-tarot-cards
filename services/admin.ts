import { getPool } from './db.js';
import bcrypt from 'bcryptjs';

// Verify admin credentials against database
export async function verifyAdminCredentials(email: string, password: string) {
  const pool = getPool();
  try {
    const res = await pool.query(
      `SELECT id, email, password_hash FROM admin_users WHERE email = $1`,
      [email]
    );

    if (res.rows.length === 0) {
      return false;
    }

    const admin = res.rows[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);

    return isValid ? admin : false;
  } catch (err) {
    console.error('[Admin] Error verifying credentials:', err);
    return false;
  }
}

// Create a new admin user (for initial setup or adding new admins)
export async function createAdminUser(email: string, password: string, name: string | null = null) {
  const pool = getPool();
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const res = await pool.query(
      `INSERT INTO admin_users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );
    return res.rows[0];
  } catch (err: any) {
    if (err.code === '23505') {
      throw new Error('Admin user with this email already exists');
    }
    throw err;
  }
}

export async function isAdminAuthorized(req: any): Promise<boolean> {
  const auth = req.headers['authorization'];

  if (auth && auth.startsWith('Basic ')) {
    const decoded = Buffer.from(auth.replace('Basic ', ''), 'base64').toString('utf8');
    const [email, password] = decoded.split(':');

    const admin = await verifyAdminCredentials(email, password);

    if (admin) {
      req.adminUser = admin; // Attach admin info to request
      return true;
    }
  }

  const secret = req.headers['x-admin-secret'];
  if (secret && process.env.ADMIN_CODE_SECRET && secret === process.env.ADMIN_CODE_SECRET) {
    return true;
  }

  return false;
}

export async function getUserStats() {
  const pool = getPool();

  const res = await pool.query(`
    SELECT
      u.id,
      u.email,
      u.name,
      u.created_at,
      u.membership_expires_at,
      (CASE WHEN u.membership_expires_at IS NOT NULL AND u.membership_expires_at > NOW() THEN 'member' ELSE 'free' END) as plan,
      COALESCE(t.topic_count, 0) as topic_count,
      COALESCE(e.event_count, 0) as event_count
    FROM users u
    LEFT JOIN (
      SELECT user_id, COUNT(*) as topic_count
      FROM topics
      GROUP BY user_id
    ) t ON t.user_id = u.id
    LEFT JOIN (
      SELECT user_id, COUNT(*) as event_count
      FROM topic_events
      GROUP BY user_id
    ) e ON e.user_id = u.id
    ORDER BY u.created_at DESC
  `);
  return { total: res.rows.length, users: res.rows };
}

export async function getUserTopics(userId: string) {
  const pool = getPool();

  const res = await pool.query(
    `SELECT t.*,
      COALESCE(e.event_count, 0) as event_count
     FROM topics t
     LEFT JOIN (
       SELECT topic_id, COUNT(*) as event_count
       FROM topic_events
       GROUP BY topic_id
     ) e ON e.topic_id = t.id
     WHERE t.user_id=$1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function getTopicEvents(topicId: string) {
  const pool = getPool();
  const res = await pool.query(
    `SELECT * FROM topic_events WHERE topic_id=$1 ORDER BY created_at ASC`,
    [topicId]
  );
  return res.rows;
}
