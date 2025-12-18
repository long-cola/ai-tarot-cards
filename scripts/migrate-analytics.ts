import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
config({ path: '.env.server.local' });

/**
 * 运行 analytics 迁移
 */
async function migrateAnalytics() {
  const pool = getPool();

  console.log('[migrate-analytics] Starting analytics migration...');

  try {
    // 读取 SQL 文件
    const sqlPath = join(__dirname, '../services/migrations/add-analytics.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // 执行 SQL
    await pool.query(sql);

    console.log('[migrate-analytics] ✓ Analytics tables and functions created successfully');
    console.log('[migrate-analytics] Migration completed!');
  } catch (error) {
    console.error('[migrate-analytics] Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 运行迁移
migrateAnalytics()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
