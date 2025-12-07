import jwt from "jsonwebtoken";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "change-me-in-production";
const JWT_EXPIRY = "7d"; // 7 days
const COOKIE_NAME = "auth_token";

// Sign a JWT token with user data
export const signToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    membership_expires_at: user.membership_expires_at,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: "ai-tarot-cards",
  });
};

// Verify and decode a JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "ai-tarot-cards",
    });
  } catch (err) {
    return null;
  }
};

// Get user from request (via cookie)
export const getUserFromRequest = (req) => {
  const cookies = parseCookie(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];

  if (!token) return null;

  return verifyToken(token);
};

// Set auth cookie in response
export const setAuthCookie = (res, token) => {
  const cookie = serializeCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};

// Clear auth cookie
export const clearAuthCookie = (res) => {
  const cookie = serializeCookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};
