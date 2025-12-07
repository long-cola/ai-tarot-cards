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

// --- 在现有 import 语句之后，添加路径和配置 ---
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 【唯一且正确】加载你的自定义环境文件
dotenv.config({ path: path.resolve(__dirname, ".env.server.local") });
// --- 配置结束 ---



const app = express();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
  CLIENT_ORIGIN = "http://localhost:5173",
  SERVER_URL = "http://localhost:3001",
  ADMIN_CODE_SECRET,
  HOST = "0.0.0.0",
} = process.env;

if (!SESSION_SECRET) {
  console.warn("[server] SESSION_SECRET is not set. Please configure it in .env.server.local");
}

configurePassport({
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/api/auth/google/callback`,
});

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ ok: false, message: "not_authenticated" });
  }
  return next();
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "healthy" });
});

app.get("/api/me", async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.json({ user: null });
  }
  const user = req.user;
  const planInfo = getPlanInfo(user);
  const today = await getTodayUsage(user.id);
  res.json({
    user,
    plan: planInfo.plan,
    membership_expires_at: user.membership_expires_at,
    daily_limit: planInfo.dailyLimit,
    used_today: today.count,
    remaining_today: Math.max(planInfo.dailyLimit - today.count, 0),
  });
});

app.post("/api/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });
});

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${CLIENT_ORIGIN}?auth=failure` }),
  (_req, res) => {
    res.redirect(`${CLIENT_ORIGIN}?auth=success`);
  }
);

app.post("/api/usage/consume", requireAuth, async (req, res) => {
  if (!pool) return res.status(500).json({ ok: false, message: "db_not_configured" });
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

  const { count = 1, durationDays = 30, validDays = 365 } = req.body || {};
  const codes = await generateCodes({ count: Math.min(count, 50), durationDays, validDays });
  res.json({ ok: true, codes });
});

const PORT = process.env.PORT || 3001;

const start = async () => {
  if (pool) {
    try {
      await ensureSchema();
      console.log("[server] Database schema ensured");
    } catch (err) {
      console.error("[server] Failed to ensure schema", err);
    }
  }
  app.listen(PORT, HOST, () => {
    console.log(`[server] listening on ${HOST}:${PORT}`);
  });
};

start();
