import pg from "pg";
import dotenv from "dotenv";

// Load env early so connection string is available when this module initializes
dotenv.config({ path: ".env.server.local" });
dotenv.config();

const { Pool } = pg;

let connectionString = process.env.DATABASE_URL;

// Neon 在 serverless 环境可能因 channel_binding 参数导致握手失败，移除该参数
if (connectionString?.includes("channel_binding")) {
  connectionString = connectionString.replace(/([\?&])channel_binding=[^&]+&?/gi, "$1");
  if (connectionString.endsWith("?") || connectionString.endsWith("&")) {
    connectionString = connectionString.slice(0, -1);
  }
}

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
      // Serverless-optimized settings for Neon pooled connections
      max: 1, // Minimize connections in serverless
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      // Note: statement_timeout and options are not supported by Neon pooled connections
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
