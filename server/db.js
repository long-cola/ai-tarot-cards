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

// Lazy pool initialization for serverless environments
let _pool = null;

export const getPool = () => {
  if (!connectionString) return null;

  if (!_pool) {
    _pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      // Serverless-optimized settings
      max: 1, // Minimize connections in serverless
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
  }

  return _pool;
};

// For backwards compatibility
export const pool = new Proxy({}, {
  get(target, prop) {
    const p = getPool();
    if (!p) return undefined;
    const value = p[prop];
    return typeof value === 'function' ? value.bind(p) : value;
  }
});
