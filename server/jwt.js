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
  const isProduction = process.env.NODE_ENV === "production";

  // For production, use 'lax' instead of 'none' for better mobile browser compatibility
  // 'lax' works for most same-site scenarios while 'none' can be blocked by mobile browsers
  const cookieOptions = {
    httpOnly: true,
    secure: true, // Always true for production OAuth
    sameSite: "lax", // Changed from 'none' to 'lax' for better mobile support
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  };

  const cookie = serializeCookie(COOKIE_NAME, token, cookieOptions);

  console.log("[JWT] Setting auth cookie with options:", cookieOptions);
  res.setHeader("Set-Cookie", cookie);
};

// Clear auth cookie
export const clearAuthCookie = (res) => {
  const cookie = serializeCookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax", // Match the setting in setAuthCookie
    maxAge: 0,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};
