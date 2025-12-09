import { config } from 'dotenv';
import { getPool } from '../services/db.js';

// 加载环境变量
config({ path: '.env.server.local' });

/**
 * 初始化数据库表
 */
async function initDatabase() {
  const pool = getPool();

  console.log('[init-db] Starting database initialization...');

  try {
    // 创建 prompts 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'zh',
        trigger_type TEXT NOT NULL,
        variables JSONB NOT NULL DEFAULT '[]',
        template TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(key, language)
      )
    `);

    console.log('[init-db] ✓ Created prompts table');

    // 创建索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_prompts_key_language ON prompts(key, language)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_prompts_trigger_type ON prompts(trigger_type)
    `);

    console.log('[init-db] ✓ Created indexes');

    console.log('[init-db] Database initialization completed successfully!');
  } catch (error) {
    console.error('[init-db] Initialization failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 运行初始化
initDatabase()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
