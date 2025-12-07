import { pool } from "./db.js";

export const getTopicDetailWithEvents = async (topicId) => {
  if (!pool) return null;
  const topicRes = await pool.query(`select * from topics where id=$1 limit 1`, [topicId]);
  if (!topicRes.rows.length) return null;
  const eventsRes = await pool.query(
    `select * from topic_events where topic_id=$1 order by created_at asc`,
    [topicId]
  );
  return { topic: topicRes.rows[0], events: eventsRes.rows };
};
