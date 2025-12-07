import { pool } from "./db.js";

const ADMIN_EMAIL = process.env.ADMIN_USER_EMAIL || "catadioptric19941@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_USER_PASSWORD || "Admin@!23";

export const isAdminAuthorized = (req) => {
  const auth = req.headers["authorization"];
  if (auth && auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.replace("Basic ", ""), "base64").toString("utf8");
    const [email, password] = decoded.split(":");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) return true;
  }
  const secret = req.headers["x-admin-secret"];
  if (secret && process.env.ADMIN_CODE_SECRET && secret === process.env.ADMIN_CODE_SECRET) {
    return true;
  }
  return false;
};

export const getUserStats = async () => {
  if (!pool) return { total: 0, users: [] };
  const res = await pool.query(`
    select
      u.id,
      u.email,
      u.name,
      u.created_at,
      u.membership_expires_at,
      (case when u.membership_expires_at is not null and u.membership_expires_at > now() then 'member' else 'free' end) as plan,
      (select count(*) from topics t where t.user_id = u.id) as topic_count,
      (select count(*) from topic_events e where e.user_id = u.id) as event_count
    from users u
    order by u.created_at desc
  `);
  return { total: res.rows.length, users: res.rows };
};

export const getUserTopics = async (userId) => {
  if (!pool) return [];
  const res = await pool.query(
    `select t.*, 
      (select count(*) from topic_events e where e.topic_id = t.id) as event_count
     from topics t
     where t.user_id=$1
     order by t.created_at desc`,
    [userId]
  );
  return res.rows;
};

export const getTopicEvents = async (topicId) => {
  if (!pool) return [];
  const res = await pool.query(
    `select * from topic_events where topic_id=$1 order by created_at asc`,
    [topicId]
  );
  return res.rows;
};
