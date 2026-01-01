import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: '.env.server.local' });

/**
 * Run topic_full share type migration
 */
async function migrateTopicFullShare() {
  const pool = getPool();

  console.log('[migrate-topic-full-share] Starting topic_full share type migration...');

  try {
    // Read SQL file
    const sqlPath = join(__dirname, '../migrations/007_add_topic_full_share_type.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await pool.query(sql);

    console.log('[migrate-topic-full-share] ✓ topic_full share type added successfully');
    console.log('[migrate-topic-full-share] Migration completed!');
  } catch (error) {
    console.error('[migrate-topic-full-share] Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration
migrateTopicFullShare()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
