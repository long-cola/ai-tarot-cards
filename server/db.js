import pg from "pg";
import dotenv from "dotenv";

// Load env early so connection string is available when this module initializes
dotenv.config({ path: ".env.server.local" });
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("[db] DATABASE_URL is not set. Database features will be unavailable until configured.");
}

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : null;
