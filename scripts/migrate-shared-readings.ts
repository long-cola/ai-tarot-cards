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
 * Run shared_readings migration
 */
async function migrateSharedReadings() {
  const pool = getPool();

  console.log('[migrate-shared-readings] Starting shared_readings migration...');

  try {
    // Read SQL file
    const sqlPath = join(__dirname, '../migrations/004_add_shared_readings.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await pool.query(sql);

    console.log('[migrate-shared-readings] ✓ shared_readings table created successfully');
    console.log('[migrate-shared-readings] Migration completed!');
  } catch (error) {
    console.error('[migrate-shared-readings] Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration
migrateSharedReadings()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
