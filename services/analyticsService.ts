/**
 * Analytics Service
 * Track page views, readings, and other user activities
 */

import { query } from './db.js';

/**
 * Track a page view
 */
export async function trackPageView(data: {
  visitorId: string;
  userId?: string;
  pagePath?: string;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Insert page view record
    await query(
      `INSERT INTO page_views (visitor_id, user_id, page_path, user_agent, referrer, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [data.visitorId, data.userId || null, data.pagePath || '/', data.userAgent || '', data.referrer || '']
    );

    // Check if this visitor has visited today
    const existingVisit = await query(
      `SELECT 1 FROM page_views
       WHERE visitor_id = $1
       AND date(created_at) = $2
       LIMIT 1`,
      [data.visitorId, today]
    );

    // Increment page views
    await query(`SELECT increment_analytics($1, 'page_views', 1)`, [today]);

    // If this is the first visit today, increment unique visitors
    if (existingVisit.rows.length === 1) {
      await query(`SELECT increment_analytics($1, 'unique_visitors', 1)`, [today]);
    }

    console.log('[Analytics] Page view tracked:', data.visitorId);
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Track a baseline reading (first tarot reading)
 */
export async function trackBaselineReading() {
  try {
    const today = new Date().toISOString().split('T')[0];
    await query(`SELECT increment_analytics($1, 'baseline_readings', 1)`, [today]);
    console.log('[Analytics] Baseline reading tracked');
  } catch (error) {
    console.error('[Analytics] Error tracking baseline reading:', error);
  }
}

/**
 * Track an event reading
 */
export async function trackEventReading() {
  try {
    const today = new Date().toISOString().split('T')[0];
    await query(`SELECT increment_analytics($1, 'event_readings', 1)`, [today]);
    console.log('[Analytics] Event reading tracked');
  } catch (error) {
    console.error('[Analytics] Error tracking event reading:', error);
  }
}

/**
 * Track a new user registration
 */
export async function trackNewUser() {
  try {
    const today = new Date().toISOString().split('T')[0];
    await query(`SELECT increment_analytics($1, 'new_users', 1)`, [today]);
    console.log('[Analytics] New user tracked');
  } catch (error) {
    console.error('[Analytics] Error tracking new user:', error);
  }
}

/**
 * Track a new topic creation
 */
export async function trackNewTopic() {
  try {
    const today = new Date().toISOString().split('T')[0];
    await query(`SELECT increment_analytics($1, 'new_topics', 1)`, [today]);
    console.log('[Analytics] New topic tracked');
  } catch (error) {
    console.error('[Analytics] Error tracking new topic:', error);
  }
}

/**
 * Get analytics for a date range
 */
export async function getAnalytics(startDate: string, endDate: string) {
  try {
    const result = await query(
      `SELECT
        date,
        page_views,
        unique_visitors,
        baseline_readings,
        event_readings,
        new_users,
        new_topics
       FROM daily_analytics
       WHERE date >= $1 AND date <= $2
       ORDER BY date DESC`,
      [startDate, endDate]
    );

    return result.rows;
  } catch (error) {
    console.error('[Analytics] Error getting analytics:', error);
    throw error;
  }
}

/**
 * Get analytics summary (totals)
 */
export async function getAnalyticsSummary(startDate: string, endDate: string) {
  try {
    const result = await query(
      `SELECT
        SUM(page_views) as total_page_views,
        SUM(unique_visitors) as total_unique_visitors,
        SUM(baseline_readings) as total_baseline_readings,
        SUM(event_readings) as total_event_readings,
        SUM(new_users) as total_new_users,
        SUM(new_topics) as total_new_topics
       FROM daily_analytics
       WHERE date >= $1 AND date <= $2`,
      [startDate, endDate]
    );

    return result.rows[0];
  } catch (error) {
    console.error('[Analytics] Error getting analytics summary:', error);
    throw error;
  }
}
