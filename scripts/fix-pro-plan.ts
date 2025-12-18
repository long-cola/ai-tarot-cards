import { config } from 'dotenv';
import { getPool } from '../services/db.js';

// 加载环境变量
config({ path: '.env.server.local' });

/**
 * 修复数据库中 plan='pro' 的记录，将其统一改为 'member'
 * 这样可以确保所有付费用户都能正确显示会员状态
 */
async function fixProPlan() {
  const pool = getPool();

  console.log('[fix-pro-plan] Starting to fix pro plan records...');

  try {
    // 查询有多少条 plan='pro' 的记录
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM membership_cycles WHERE plan = 'pro'`
    );
    const count = parseInt(countResult.rows[0]?.count || '0');

    console.log(`[fix-pro-plan] Found ${count} records with plan='pro'`);

    if (count === 0) {
      console.log('[fix-pro-plan] No records to fix.');
      return;
    }

    // 更新所有 plan='pro' 的记录为 'member'
    const updateResult = await pool.query(
      `UPDATE membership_cycles SET plan = 'member' WHERE plan = 'pro' RETURNING id`
    );

    console.log(`[fix-pro-plan] ✓ Updated ${updateResult.rowCount} records from 'pro' to 'member'`);
    console.log('[fix-pro-plan] Fixed record IDs:', updateResult.rows.map(r => r.id));
    console.log('[fix-pro-plan] Fix completed successfully!');
  } catch (error) {
    console.error('[fix-pro-plan] Fix failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 运行修复
fixProPlan()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
