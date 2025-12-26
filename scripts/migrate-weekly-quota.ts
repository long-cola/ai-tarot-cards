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
 * 运行 weekly quota 迁移
 * 添加新的配额系统表：
 * - weekly_topic_usage: 追踪免费用户每周创建的 topics
 * - topic_event_snapshots: 记录降级时的 events 数量
 */
async function migrateWeeklyQuota() {
  const pool = getPool();

  console.log('[migrate-weekly-quota] Starting weekly quota migration...');

  try {
    // 读取 SQL 文件
    const sqlPath = join(__dirname, '../services/migrations/add-weekly-quota-tables.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // 执行 SQL
    await pool.query(sql);

    console.log('[migrate-weekly-quota] ✓ Weekly quota tables created successfully');
    console.log('[migrate-weekly-quota]   - weekly_topic_usage');
    console.log('[migrate-weekly-quota]   - topic_event_snapshots');
    console.log('[migrate-weekly-quota] Migration completed!');
  } catch (error) {
    console.error('[migrate-weekly-quota] Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 运行迁移
migrateWeeklyQuota()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
