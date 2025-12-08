import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import { configurePassport } from "./auth.js";
import { ensureSchema } from "./schema.js";
import { pool } from "./db.js";
import { getPlanInfo, getTodayUsage, incrementUsage } from "./usage.js";
import { redeemCode, generateCodes } from "./redemption.js";
import { ensureActiveCycleForUser, getPlanQuotaSummary } from "./plan.js";
import { getUserStats, getUserTopics, getTopicEvents, isAdminAuthorized, createAdminUser } from "./admin.js";
import { getTopicDetailWithEvents } from "./topics.js";

// Load env for local/dev; on Vercel, env is injected automatically
dotenv.config({ path: ".env.server.local" });
dotenv.config();

const app = express();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
  CLIENT_ORIGINS, // comma-separated list for prod
  CLIENT_ORIGIN = "http://localhost:5173",
  SERVER_URL = "http://localhost:3001",
  ADMIN_CODE_SECRET,
  BAILIAN_API_KEY,
} = process.env;

const allowedOrigins = (CLIENT_ORIGINS || CLIENT_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

if (!SESSION_SECRET) {
  console.warn("[server] SESSION_SECRET is not set. Please configure it in .env.server.local or env vars.");
}

// Early health check endpoint (before any middleware) for fast serverless warmup
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "healthy", timestamp: Date.now() });
});

// Lazy passport configuration - only initialize when needed
let passportConfigured = false;
const ensurePassportConfigured = () => {
  if (passportConfigured) return;

  configurePassport({
    googleClientId: GOOGLE_CLIENT_ID,
    googleClientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/api/auth/google/callback`,
  });

  passportConfigured = true;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow same-origin or non-browser
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// Session middleware - only for auth routes
const sessionMiddleware = session({
  secret: SESSION_SECRET || "change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

// Apply session/passport middleware conditionally for auth routes
const authMiddleware = (req, res, next) => {
  ensurePassportConfigured();
  sessionMiddleware(req, res, (err) => {
    if (err) return next(err);
    passport.initialize()(req, res, (err2) => {
      if (err2) return next(err2);
      passport.session()(req, res, next);
    });
  });
};

// Schema initialization is disabled in production to avoid timeouts
// Schema should be initialized manually using: node server/create-admin.js
// or by running ensureSchema() once during deployment
const ensureSchemaOnce = async () => {
  // No-op in production - schema should already exist
  return;
};

const requireAuth = [
  authMiddleware,
  (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ ok: false, message: "not_authenticated" });
    }
    return next();
  }
];

app.get("/api/me", authMiddleware, async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.json({ user: null });
  }
  await ensureSchemaOnce();
  const user = req.user;
  const planInfo = getPlanInfo(user);
  const today = await getTodayUsage(user.id);
  const quota = await getPlanQuotaSummary(user);
  res.json({
    user,
    plan: quota?.plan || planInfo.plan,
    membership_expires_at: user.membership_expires_at,
    daily_limit: planInfo.dailyLimit,
    used_today: today.count,
    remaining_today: Math.max(planInfo.dailyLimit - today.count, 0),
    topic_quota_total: quota?.topic_quota_total ?? null,
    topic_quota_remaining: quota?.topic_quota_remaining ?? null,
    event_quota_per_topic: quota?.event_quota_per_topic ?? null,
    cycle_expires_at: quota?.expires_at ?? null,
    downgrade_limited_topic_id: quota?.downgrade_limited_topic_id ?? null,
  });
});

app.post("/api/logout", authMiddleware, (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });
});

app.get("/api/auth/google", authMiddleware, (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

app.get(
  "/api/auth/google/callback",
  authMiddleware,
  (req, res, next) => {
    passport.authenticate("google", { failureRedirect: `${CLIENT_ORIGIN}?auth=failure` })(req, res, next);
  },
  (_req, res) => {
    res.redirect(`${CLIENT_ORIGIN}?auth=success`);
  }
);

app.post("/api/usage/consume", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const user = req.user;
  const planInfo = getPlanInfo(user);
  const today = await getTodayUsage(user.id);

  if (today.count >= planInfo.dailyLimit) {
    return res.status(429).json({
      ok: false,
      message: "daily_limit_reached",
      plan: planInfo.plan,
      used_today: today.count,
      daily_limit: planInfo.dailyLimit,
      requireRedemption: planInfo.plan === "free",
    });
  }

  await incrementUsage(user.id, today.date);
  const remaining = planInfo.dailyLimit - (today.count + 1);
  res.json({
    ok: true,
    plan: planInfo.plan,
    remaining,
    daily_limit: planInfo.dailyLimit,
    membership_expires_at: user.membership_expires_at,
  });
});

app.post("/api/codes/redeem", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const { code } = req.body;
  if (!code) return res.status(400).json({ ok: false, message: "missing_code" });

  const result = await redeemCode(code.trim(), req.user.id);
  if (!result.ok) {
    return res.status(400).json({ ok: false, reason: result.reason });
  }

  res.json({
    ok: true,
    membership_expires_at: result.membership_expires_at,
    plan: "member",
  });
});

app.post("/api/codes/generate", async (req, res) => {
  if (!ADMIN_CODE_SECRET || req.headers["x-admin-secret"] !== ADMIN_CODE_SECRET) {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();

  const { count = 1, durationDays = 30, validDays = 365 } = req.body || {};
  const codes = await generateCodes({ count: Math.min(count, 50), durationDays, validDays });
  res.json({ ok: true, codes });
});

// Admin: create admin user (protected by ADMIN_CODE_SECRET)
app.post("/api/admin/create", async (req, res) => {
  if (!ADMIN_CODE_SECRET || req.headers["x-admin-secret"] !== ADMIN_CODE_SECRET) {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();

  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "email and password required" });
  }

  try {
    const admin = await createAdminUser(email, password, name);
    res.json({ ok: true, admin });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

// Admin: user stats
app.get("/api/admin/users", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const stats = await getUserStats();
  res.json({ ok: true, ...stats });
});

// Admin: user topics and events
app.get("/api/admin/users/:id/topics", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const topics = await getUserTopics(req.params.id);
  res.json({ ok: true, topics });
});

app.get("/api/admin/topics/:id/events", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const events = await getTopicEvents(req.params.id);
  res.json({ ok: true, events });
});

app.get("/api/admin/topics/:id", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(403).json({ ok: false, message: "forbidden" });
  }
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const data = await getTopicDetailWithEvents(req.params.id);
  if (!data) return res.status(404).json({ ok: false, message: "topic_not_found" });
  res.json({ ok: true, ...data });
});

app.post("/api/tarot-reading", requireAuth, async (req, res) => {
  if (!BAILIAN_API_KEY) {
    return res.status(500).json({
      ok: false,
      message: "bailian_api_key_not_configured"
    });
  }

  const { question, cards, language } = req.body;

  if (!question || !cards || !Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({
      ok: false,
      message: "invalid_request"
    });
  }

  try {
    const isZh = language === 'zh';

    // Format cards based on language
    const cardsString = cards.map(c => {
      const posName = isZh ? ["过去", "现在", "未来"][c.position] : ["The Past", "The Present", "The Future"][c.position];
      const cardName = isZh ? c.nameCn : c.name;
      const status = isZh
        ? (c.isReversed ? "逆位" : "正位")
        : (c.isReversed ? "Reversed" : "Upright");
      return `${posName}: ${cardName} (${status})`;
    }).join(isZh ? "，" : ", ");

    // System instructions (must match frontend constants.ts)
    const TAROT_SYSTEM_INSTRUCTION_ZH = `你是一位专业的塔罗师AI助手，精通78张塔罗牌的象征意义、正逆位解读、牌阵应用和灵性指导。你以温和、中立且富有洞察力的方式为用户提供塔罗解读服务，注重启发而非预言，强调个人能动性和内在成长。

你将按照下面的结构进行解读：

**【单牌解读结构】**
(请针对抽出的每一张牌分别进行以下解读)
1. 🃏 **卡片展示**：[牌名 - 正/逆位]
2. 🔑 **核心象征**：简要说明该牌的基本含义
3. 💡 **情境解读**：结合用户问题分析此牌在当前情境下的意义

**【多牌综合解读】**
(综合所有牌面进行总结)
分析牌间关系、能量流动和整体故事线，结合用户给你的问题指出可能的：
- ⚖️ **挑战与机遇**
- 🌍 **内在与外在因素**
- 🚀 **行动建议方向**

**核心价值观：**
"爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。所有关系的困境，都是内心投射的倒影。破情关者，破的是对'被爱'的执迷。见本性者，见的是本自具足的清明。"
请在涉及情感问题时，引用或基于上述哲学观点进行深层解读。

请使用Markdown格式输出，保持排版清晰优雅。`;

    const TAROT_SYSTEM_INSTRUCTION_EN = `You are a professional AI Tarot Reader, expert in the symbolism of the 78 Tarot cards, upright and reversed meanings, spread applications, and spiritual guidance. You provide readings in a gentle, neutral, and insightful manner, focusing on inspiration rather than fortune-telling, emphasizing personal agency and inner growth.

Please follow this structure for your reading:

**[Single Card Analysis]**
(Analyze each drawn card individually)
1. 🃏 **Card**: [Card Name - Upright/Reversed]
2. 🔑 **Core Symbolism**: Briefly explain the basic meaning.
3. 💡 **Contextual Interpretation**: Analyze the card's meaning in the context of the user's question.

**[Synthesis & Guidance]**
(Synthesize all cards)
Analyze the relationships between cards, energy flow, and the overall narrative. Combine with the user's question to point out:
- ⚖️ **Challenges & Opportunities**
- 🌍 **Internal & External Factors**
- 🚀 **Suggested Actions**

**Core Philosophy:**
"The true value of love is not to meet the right person, but to see your true self. All relationship dilemmas are reflections of inner projections. To break through emotional barriers is to break the obsession with 'being loved'. To see one's true nature is to see the clarity that is already complete within."
When dealing with relationship questions, please use this philosophy for deep interpretation.

Please use Markdown format for clear and elegant output.`;

    const formatHint = isZh
      ? "请使用Markdown富文本输出，包含分节小标题、列表和重点加粗，不要只用纯文本段落。"
      : "Please use Markdown rich text with section headings, bullet lists, and bold emphasis—avoid plain unstructured text.";

    const prompt = isZh
      ? `我给你的牌：{${cardsString}}，我的问题：{${question}}。\n\n${formatHint}`
      : `Cards drawn: {${cardsString}}, My question: {${question}}.\n\n${formatHint}`;

    const systemInstruction = isZh ? TAROT_SYSTEM_INSTRUCTION_ZH : TAROT_SYSTEM_INSTRUCTION_EN;

    // Call Bailian API
    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BAILIAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-flash",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bailian API error:", response.status, errorText);
      return res.status(500).json({
        ok: false,
        message: "ai_api_error",
        details: `${response.status}: ${errorText}`
      });
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(messageContent)
      ? messageContent.map((part) => typeof part === "string" ? part : (part?.text ?? "")).join("").trim()
      : (messageContent ?? "");

    if (!text) {
      return res.status(500).json({
        ok: false,
        message: "empty_response"
      });
    }

    res.json({ ok: true, reading: text });
  } catch (error) {
    console.error("Tarot reading error:", error);
    res.status(500).json({
      ok: false,
      message: "internal_error",
      details: error.message
    });
  }
});

app.get("/api/topics", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const user = req.user;
  const quota = await getPlanQuotaSummary(user);
  const topicsRes = await pool.query(
    `
      select t.*,
        (select count(*) from topic_events e where e.topic_id = t.id) as event_count
      from topics t
      where t.user_id=$1
      order by t.created_at desc
    `,
    [user.id]
  );
  const topics = topicsRes.rows.map((row) => {
    const count = Number(row.event_count || 0);
    const remaining = quota?.event_quota_per_topic != null
      ? Math.max(quota.event_quota_per_topic - count, 0)
      : null;
    return { ...row, event_remaining: remaining };
  });
  res.json({ ok: true, topics, quota });
});

app.post("/api/topics", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const user = req.user;
  const { title, language = "zh", baseline_cards = null, baseline_reading = null } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ ok: false, message: "missing_title" });
  }

  const quota = await getPlanQuotaSummary(user);
  if (quota && quota.topic_quota_remaining !== null && quota.topic_quota_remaining <= 0) {
    return res.status(403).json({ ok: false, reason: "topic_quota_exhausted", quota });
  }

  const cycle = quota?.cycle || (await ensureActiveCycleForUser(user));
  if (!cycle) return res.status(500).json({ ok: false, message: "cycle_unavailable" });

  const insert = await pool.query(
    `insert into topics (user_id, cycle_id, title, language, baseline_cards, baseline_reading)
     values ($1,$2,$3,$4,$5,$6)
     returning *`,
    [user.id, cycle.id, title.trim(), language, baseline_cards, baseline_reading]
  );

  const updatedQuota = await getPlanQuotaSummary(user);
  res.json({ ok: true, topic: insert.rows[0], quota: updatedQuota });
});

app.get("/api/topics/:id", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const user = req.user;
  const topicId = req.params.id;

  const topicRes = await pool.query(
    `select * from topics where id=$1 and user_id=$2 limit 1`,
    [topicId, user.id]
  );
  if (!topicRes.rows.length) {
    return res.status(404).json({ ok: false, message: "topic_not_found" });
  }

  const eventsRes = await pool.query(
    `select * from topic_events where topic_id=$1 order by created_at asc`,
    [topicId]
  );

  const quota = await getPlanQuotaSummary(user);
  const eventCount = eventsRes.rows.length;
  res.json({
    ok: true,
    topic: topicRes.rows[0],
    events: eventsRes.rows,
    quota,
    event_usage: {
      used: eventCount,
      remaining: quota?.event_quota_per_topic != null
        ? Math.max(quota.event_quota_per_topic - eventCount, 0)
        : null,
    },
  });
});

app.post("/api/topics/:id/events", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
  await ensureSchemaOnce();
  const user = req.user;
  const topicId = req.params.id;
  const { name, cards = null, reading = null } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, message: "missing_event_name" });
  }

  const topicRes = await pool.query(
    `select * from topics where id=$1 and user_id=$2 limit 1`,
    [topicId, user.id]
  );
  if (!topicRes.rows.length) {
    return res.status(404).json({ ok: false, message: "topic_not_found" });
  }
  const topic = topicRes.rows[0];

  const quota = await getPlanQuotaSummary(user);
  if (quota?.plan === "free" && quota?.downgrade_limited_topic_id && quota.downgrade_limited_topic_id !== topic.id) {
    return res.status(403).json({ ok: false, reason: "downgraded_topic_locked", quota });
  }

  const eventCountRes = await pool.query(
    `select count(*) as count from topic_events where topic_id=$1`,
    [topicId]
  );
  const eventCount = Number(eventCountRes.rows[0]?.count ?? 0);

  if (quota?.event_quota_per_topic != null && eventCount >= quota.event_quota_per_topic) {
    return res.status(403).json({ ok: false, reason: "event_quota_exhausted", quota, used: eventCount });
  }

  const cycleId = topic.cycle_id || quota?.cycle?.id || null;
  const insert = await pool.query(
    `insert into topic_events (topic_id, cycle_id, user_id, name, cards, reading)
     values ($1,$2,$3,$4,$5,$6)
     returning *`,
    [topicId, cycleId, user.id, name.trim(), cards, reading]
  );

  await pool.query(`update topics set updated_at=now() where id=$1`, [topicId]);

  const newCount = eventCount + 1;
  const remaining = quota?.event_quota_per_topic != null
    ? Math.max(quota.event_quota_per_topic - newCount, 0)
    : null;

  res.json({
    ok: true,
    event: insert.rows[0],
    event_usage: { used: newCount, remaining },
    quota,
  });
});

export { app };
