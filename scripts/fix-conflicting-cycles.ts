import { config } from 'dotenv';
import { getPool } from '../services/db.js';

// 加载环境变量
config({ path: '.env.server.local' });

/**
 * 修复有冲突的 membership cycles
 * 找到同时有活跃 member/pro 和 free cycles 的用户，结束他们的 free cycles
 */
async function fixConflictingCycles() {
  const pool = getPool();

  console.log('[fix-cycles] Finding users with conflicting active cycles...\n');

  try {
    // 查找同时有活跃 paid 和 free cycles 的用户
    const conflictQuery = `
      SELECT DISTINCT u.email, u.id, u.name
      FROM users u
      WHERE EXISTS (
        SELECT 1 FROM membership_cycles mc1
        WHERE mc1.user_id = u.id
          AND mc1.plan IN ('member', 'pro')
          AND mc1.starts_at <= NOW()
          AND mc1.ends_at > NOW()
      )
      AND EXISTS (
        SELECT 1 FROM membership_cycles mc2
        WHERE mc2.user_id = u.id
          AND mc2.plan = 'free'
          AND mc2.starts_at <= NOW()
          AND mc2.ends_at > NOW()
      )
    `;

    const usersResult = await pool.query(conflictQuery);

    if (usersResult.rows.length === 0) {
      console.log('✓ No conflicting cycles found!');
      return;
    }

    console.log(`Found ${usersResult.rows.length} users with conflicting cycles:\n`);

    for (const user of usersResult.rows) {
      console.log(`\nUser: ${user.email} (${user.name || 'N/A'})`);
      console.log(`  ID: ${user.id}`);

      // 查看这个用户的所有活跃 cycles
      const cyclesResult = await pool.query(
        `SELECT plan, starts_at, ends_at, source, created_at
         FROM membership_cycles
         WHERE user_id = $1
           AND starts_at <= NOW()
           AND ends_at > NOW()
         ORDER BY
           CASE
             WHEN plan = 'pro' THEN 1
             WHEN plan = 'member' THEN 2
             WHEN plan = 'free' THEN 3
           END,
           created_at DESC`,
        [user.id]
      );

      console.log(`  Active cycles:`);
      cyclesResult.rows.forEach(cycle => {
        console.log(`    - ${cycle.plan} (${cycle.source}) ends ${cycle.ends_at}`);
      });

      // 结束 free cycles
      const updateResult = await pool.query(
        `UPDATE membership_cycles
         SET ends_at = NOW()
         WHERE user_id = $1
           AND plan = 'free'
           AND starts_at <= NOW()
           AND ends_at > NOW()
         RETURNING id`,
        [user.id]
      );

      if (updateResult.rowCount && updateResult.rowCount > 0) {
        console.log(`  ✓ Ended ${updateResult.rowCount} free cycle(s)`);
      }
    }

    console.log('\n\n✓ Fix completed successfully!');
    console.log(`\nSummary: Fixed ${usersResult.rows.length} user(s) with conflicting cycles`);

  } catch (error) {
    console.error('[fix-cycles] Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 运行修复
fixConflictingCycles()
  .then(() => {
    console.log('\n\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
