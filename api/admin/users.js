import { getUserStats, isAdminAuthorized } from "../../server/admin.js";
import { pool } from "../../server/db.js";
import { ensureSchema } from "../../server/schema.js";

let schemaInitialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "method_not_allowed" });
  }

  try {
    // Check admin authorization
    if (!(await isAdminAuthorized(req))) {
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

    const stats = await getUserStats();
    return res.json({ ok: true, ...stats });
  } catch (error) {
    console.error("[admin/users] Error:", error);
    return res.status(500).json({ ok: false, message: "internal_error", details: error.message });
  }
}
