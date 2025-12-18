import jwt from 'jsonwebtoken';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'change-me-in-production';
const JWT_EXPIRY = '7d'; // 7 days
const COOKIE_NAME = 'auth_token';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  membership_expires_at?: string | null;
}

// Sign a JWT token with user data
export function signToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    membership_expires_at: user.membership_expires_at,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: 'ai-tarot-cards',
  });
}

// Verify and decode a JWT token
export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'ai-tarot-cards',
    }) as User;
  } catch (err) {
    return null;
  }
}

// Get user from request (via cookie or Authorization header)
export function getUserFromRequest(req: any): User | null {
  let token: string | null = null;

  // First, try to get token from Authorization header (localStorage-based auth)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
    console.log('[JWT] ✅ Using token from Authorization header (localStorage-based)');
  }

  // Fallback to cookie (cookie-based auth)
  if (!token) {
    const cookieHeader = req.headers.cookie || '';
    const cookies = parseCookie(cookieHeader);
    token = cookies[COOKIE_NAME];

    if (token) {
      console.log('[JWT] ✅ Using token from cookie (cookie-based)');
    } else {
      console.log('[JWT] ⚠️  No auth_token cookie found');
      console.log('[JWT] Cookie header present:', !!cookieHeader);
      console.log('[JWT] All cookies:', Object.keys(cookies).join(', ') || 'none');
    }
  }

  if (!token) {
    console.log('[JWT] ❌ No token found in Authorization header or cookie');
    console.log('[JWT] Headers available:', Object.keys(req.headers).join(', '));
    return null;
  }

  const user = verifyToken(token);
  if (user) {
    console.log('[JWT] ✅ Token verified, user:', user.email);
  } else {
    console.log('[JWT] ❌ Token verification failed');
  }

  return user;
}

// Set auth cookie in response
export function setAuthCookie(res: any, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';

  // For production, use 'lax' instead of 'none' for better mobile browser compatibility
  const cookieOptions = {
    httpOnly: true,
    secure: true, // Always true for production OAuth
    sameSite: 'lax' as const, // Better mobile support than 'none'
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  };

  const cookie = serializeCookie(COOKIE_NAME, token, cookieOptions);

  console.log('[JWT] Setting auth cookie with options:', cookieOptions);
  res.setHeader('Set-Cookie', cookie);
}

// Clear auth cookie
export function clearAuthCookie(res: any): void {
  const cookie = serializeCookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}
