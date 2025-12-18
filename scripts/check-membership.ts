import { config } from 'dotenv';
import { getPool } from '../services/db.js';

// 加载环境变量
config({ path: '.env.server.local' });

/**
 * 检查会员状态数据
 */
async function checkMembership() {
  const pool = getPool();

  console.log('[check-membership] Checking membership data...\n');

  try {
    // 检查所有用户的会员状态
    const usersResult = await pool.query(
      `SELECT id, email, name, membership_expires_at, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 10`
    );

    console.log('=== Recent Users ===');
    usersResult.rows.forEach(user => {
      const now = new Date();
      const expiresAt = user.membership_expires_at ? new Date(user.membership_expires_at) : null;
      const isValid = expiresAt && expiresAt > now;

      console.log(`\nUser: ${user.email}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Membership expires: ${user.membership_expires_at || 'N/A'}`);
      console.log(`  Status: ${isValid ? '✓ ACTIVE' : '✗ EXPIRED/FREE'}`);
    });

    // 检查 membership_cycles 表
    const cyclesResult = await pool.query(
      `SELECT mc.*, u.email
       FROM membership_cycles mc
       JOIN users u ON mc.user_id = u.id
       ORDER BY mc.created_at DESC
       LIMIT 10`
    );

    console.log('\n\n=== Recent Membership Cycles ===');
    cyclesResult.rows.forEach(cycle => {
      const now = new Date();
      const startsAt = new Date(cycle.starts_at);
      const endsAt = new Date(cycle.ends_at);
      const isActive = startsAt <= now && endsAt > now;

      console.log(`\nCycle ID: ${cycle.id}`);
      console.log(`  User: ${cycle.email}`);
      console.log(`  Plan: ${cycle.plan}`);
      console.log(`  Starts: ${cycle.starts_at}`);
      console.log(`  Ends: ${cycle.ends_at}`);
      console.log(`  Topic Quota: ${cycle.topic_quota}`);
      console.log(`  Event Quota: ${cycle.event_quota_per_topic}`);
      console.log(`  Source: ${cycle.source}`);
      console.log(`  Status: ${isActive ? '✓ ACTIVE' : '✗ INACTIVE'}`);
    });

    // 统计各种 plan 的数量
    const planStatsResult = await pool.query(
      `SELECT plan, COUNT(*) as count
       FROM membership_cycles
       GROUP BY plan`
    );

    console.log('\n\n=== Plan Statistics ===');
    planStatsResult.rows.forEach(stat => {
      console.log(`${stat.plan}: ${stat.count} cycles`);
    });

  } catch (error) {
    console.error('[check-membership] Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 运行检查
checkMembership()
  .then(() => {
    console.log('\n\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
