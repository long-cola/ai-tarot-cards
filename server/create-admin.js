import dotenv from "dotenv";
import { createAdminUser } from "./admin.js";
import { getPool } from "./db.js";
import { ensureSchema } from "./schema.js";

// Load environment variables
dotenv.config({ path: ".env.server.local" });
dotenv.config();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || null;

  if (!email || !password) {
    console.error("Usage: node server/create-admin.js <email> <password> [name]");
    console.error("Example: node server/create-admin.js admin@example.com SecurePassword123 'Admin User'");
    process.exit(1);
  }

  try {
    console.log("[create-admin] Initializing database schema...");
    await ensureSchema();

    console.log(`[create-admin] Creating admin user: ${email}`);
    const admin = await createAdminUser(email, password, name);

    console.log("[create-admin] Admin user created successfully!");
    console.log("Admin details:", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      created_at: admin.created_at,
    });

    process.exit(0);
  } catch (error) {
    console.error("[create-admin] Error:", error.message);
    process.exit(1);
  } finally {
    // Close database connection
    const pool = getPool();
    if (pool) {
      await pool.end();
    }
  }
}

main();
