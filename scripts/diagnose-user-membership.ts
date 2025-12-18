import { config } from 'dotenv';
import { getPool } from '../services/db.js';

// 加载环境变量
config({ path: '.env.server.local' });

/**
 * 诊断用户会员状态
 * 用法: npx tsx scripts/diagnose-user-membership.ts <user_email>
 */
async function diagnoseUserMembership(email: string) {
  const pool = getPool();

  console.log('[diagnose] Diagnosing membership for:', email);
  console.log('');

  try {
    // 1. 查询用户基本信息
    const userResult = await pool.query(
      `SELECT id, email, name, membership_expires_at, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User not found with email:', email);
      return;
    }

    const user = userResult.rows[0];
    console.log('=== User Information ===');
    console.log('Email:', user.email);
    console.log('Name:', user.name || 'N/A');
    console.log('User ID:', user.id);
    console.log('Created:', user.created_at);
    console.log('Membership Expires:', user.membership_expires_at || 'N/A');

    const now = new Date();
    const expiresAt = user.membership_expires_at ? new Date(user.membership_expires_at) : null;
    const membershipValid = expiresAt && expiresAt > now;

    console.log('\n📊 Membership Status (from users table):');
    if (membershipValid) {
      console.log('✅ ACTIVE - Expires at:', expiresAt?.toISOString());
      const daysRemaining = Math.ceil((expiresAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      console.log(`   ${daysRemaining} days remaining`);
    } else if (expiresAt) {
      console.log('❌ EXPIRED - Expired at:', expiresAt?.toISOString());
      const daysExpired = Math.ceil((now.getTime() - expiresAt.getTime()) / (1000 * 60 * 60 * 24));
      console.log(`   Expired ${daysExpired} days ago`);
    } else {
      console.log('❌ FREE - No membership_expires_at set');
    }

    // 2. 查询 membership_cycles
    const cyclesResult = await pool.query(
      `SELECT *
       FROM membership_cycles
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [user.id]
    );

    console.log('\n=== Membership Cycles (latest 5) ===');
    if (cyclesResult.rows.length === 0) {
      console.log('⚠️  No membership cycles found');
    } else {
      cyclesResult.rows.forEach((cycle, index) => {
        const startsAt = new Date(cycle.starts_at);
        const endsAt = new Date(cycle.ends_at);
        const isActive = startsAt <= now && endsAt > now;

        console.log(`\n${index + 1}. Cycle ID: ${cycle.id}`);
        console.log(`   Plan: ${cycle.plan}`);
        console.log(`   Status: ${isActive ? '✅ ACTIVE' : '⚪ INACTIVE'}`);
        console.log(`   Starts: ${cycle.starts_at}`);
        console.log(`   Ends: ${cycle.ends_at}`);
        console.log(`   Topic Quota: ${cycle.topic_quota}`);
        console.log(`   Event Quota: ${cycle.event_quota_per_topic}`);
        console.log(`   Source: ${cycle.source}`);
        console.log(`   Created: ${cycle.created_at}`);
      });
    }

    // 3. 检查 webhook 执行记录（如果有相关表）
    // 这里可以添加 webhook 日志查询

    // 4. 建议
    console.log('\n=== Diagnosis & Recommendations ===');

    if (!membershipValid) {
      console.log('\n❌ Issue: Membership is not active');
      console.log('\nPossible causes:');
      console.log('1. Webhook not executed - Payment successful but database not updated');
      console.log('2. membership_expires_at not set in users table');
      console.log('3. Payment failed or still processing');

      const activeCycle = cyclesResult.rows.find(c => {
        const s = new Date(c.starts_at);
        const e = new Date(c.ends_at);
        return s <= now && e > now;
      });

      if (activeCycle) {
        console.log('\n✅ Found active membership_cycle:');
        console.log('   Plan:', activeCycle.plan);
        console.log('   Expires:', activeCycle.ends_at);

        if (activeCycle.plan === 'pro' || activeCycle.plan === 'member') {
          console.log('\n🔧 Fix: Update users.membership_expires_at');
          console.log(`   Run: UPDATE users SET membership_expires_at = '${activeCycle.ends_at}' WHERE id = '${user.id}';`);
        }
      } else if (cyclesResult.rows.length > 0 && (cyclesResult.rows[0].plan === 'pro' || cyclesResult.rows[0].plan === 'member')) {
        console.log('\n⚠️  Latest cycle is not active but shows paid plan');
        console.log('   This might indicate a date/time issue or webhook timing problem');
      }
    } else {
      console.log('\n✅ Membership appears active in users table');

      const activeCycle = cyclesResult.rows.find(c => {
        const s = new Date(c.starts_at);
        const e = new Date(c.ends_at);
        return s <= now && e > now && (c.plan === 'pro' || c.plan === 'member');
      });

      if (!activeCycle) {
        console.log('\n⚠️  No active paid membership_cycle found');
        console.log('   User might need to refresh their JWT token');
        console.log('   Solution: User should log out and log back in');
      } else {
        console.log('\n✅ All checks passed - membership should be working');
        console.log('\nIf user still sees paywall:');
        console.log('1. User should log out and log back in (refresh JWT token)');
        console.log('2. Check browser console for any errors');
        console.log('3. Deploy the latest code fixes');
      }
    }

  } catch (error) {
    console.error('[diagnose] Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 从命令行参数获取邮箱
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx tsx scripts/diagnose-user-membership.ts <user_email>');
  process.exit(1);
}

// 运行诊断
diagnoseUserMembership(email)
  .then(() => {
    console.log('\n\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
