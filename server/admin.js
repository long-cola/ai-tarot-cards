import { pool } from "./db.js";
import bcrypt from "bcryptjs";

// Verify admin credentials against database
export const verifyAdminCredentials = async (email, password) => {
  if (!pool) {
    console.error("[Admin] Database pool not available");
    return false;
  }
  try {
    console.log("[Admin] Querying database for email:", email);
    const res = await pool.query(
      `SELECT id, email, password_hash FROM admin_users WHERE email = $1`,
      [email]
    );
    console.log("[Admin] Query result rows:", res.rows.length);

    if (res.rows.length === 0) {
      console.log("[Admin] No admin user found with email:", email);
      return false;
    }

    const admin = res.rows[0];
    console.log("[Admin] Found admin user, comparing password...");
    console.log("[Admin] Password length:", password.length);
    console.log("[Admin] Password (first 5 chars):", password.substring(0, 5));
    console.log("[Admin] Hash:", admin.password_hash);

    const isValid = await bcrypt.compare(password, admin.password_hash);
    console.log("[Admin] Password comparison result:", isValid);

    return isValid ? admin : false;
  } catch (err) {
    console.error("[Admin] Error verifying credentials:", err);
    return false;
  }
};

// Create a new admin user (for initial setup or adding new admins)
export const createAdminUser = async (email, password, name = null) => {
  if (!pool) throw new Error("Database not available");
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const res = await pool.query(
      `INSERT INTO admin_users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );
    return res.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Admin user with this email already exists");
    }
    throw err;
  }
};

export const isAdminAuthorized = async (req) => {
  const auth = req.headers["authorization"];
  console.log("[Admin] Authorization header:", auth ? "present" : "missing");

  if (auth && auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.replace("Basic ", ""), "base64").toString("utf8");
    const [email, password] = decoded.split(":");
    console.log("[Admin] Attempting to verify credentials for:", email);

    const admin = await verifyAdminCredentials(email, password);
    console.log("[Admin] Verification result:", admin ? "success" : "failed");

    if (admin) {
      req.adminUser = admin; // Attach admin info to request
      return true;
    }
  }

  const secret = req.headers["x-admin-secret"];
  if (secret && process.env.ADMIN_CODE_SECRET && secret === process.env.ADMIN_CODE_SECRET) {
    console.log("[Admin] Authorized via x-admin-secret header");
    return true;
  }

  console.log("[Admin] Authorization failed");
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
