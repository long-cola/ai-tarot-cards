import { Pool } from '@neondatabase/serverless';

// Serverless-optimized Neon connection pool
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  // Reuse existing pool in serverless environment
  if (!pool) {
    console.log('[db] Creating new Neon connection pool');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Serverless-optimized settings
      max: 1, // Single connection for serverless
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
  }

  return pool;
}

// For Auth.js adapter
export async function query(text: string, params?: any[]) {
  const pool = getPool();
  return pool.query(text, params);
}
