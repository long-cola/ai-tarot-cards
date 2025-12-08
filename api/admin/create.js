import { createAdminUser } from "../../server/admin.js";
import { pool } from "../../server/db.js";
import { ensureSchema } from "../../server/schema.js";

let schemaInitialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "x-admin-secret, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "method_not_allowed" });
  }

  try {
    const ADMIN_CODE_SECRET = process.env.ADMIN_CODE_SECRET;

    if (!ADMIN_CODE_SECRET || req.headers["x-admin-secret"] !== ADMIN_CODE_SECRET) {
      return res.status(403).json({ ok: false, message: "forbidden" });
    }

    if (!pool) {
      return res.status(500).json({ ok: false, message: "db_not_configured" });
    }

    // Ensure schema on first request
    if (!schemaInitialized) {
      await ensureSchema();
      schemaInitialized = true;
    }

    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password required" });
    }

    const admin = await createAdminUser(email, password, name);
    return res.json({ ok: true, admin });
  } catch (error) {
    console.error("[admin/create] Error:", error);
    return res.status(400).json({ ok: false, message: error.message });
  }
}
