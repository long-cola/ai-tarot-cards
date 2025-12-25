import { DrawnCard, Language } from "../types.js";

// Get API base URL from environment or default to current origin
const getApiBase = (): string => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  // In production, use current origin; in dev, use localhost:3001
  if (import.meta.env.DEV) {
    return "http://localhost:3001";
  }
  return window.location.origin;
};

export const getTarotReading = async (
  question: string,
  cards: DrawnCard[],
  language: Language,
  promptKey?: string,
  variables?: Record<string, any>
): Promise<string> => {
  const isZh = language === 'zh';

  try {
    const API_BASE = getApiBase();

    // Get token from localStorage (mobile fallback)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if token exists (important for mobile browsers)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[getTarotReading] Added Authorization header with token from localStorage');
    } else {
      console.log('[getTarotReading] No token in localStorage, relying on cookie');
    }

    const response = await fetch(`${API_BASE}/api/tarot-reading`, {
      method: "POST",
      headers,
      credentials: "include", // Important: send cookies for authentication (desktop fallback)
      body: JSON.stringify({
        question,
        cards,
        language,
        promptKey,
        variables
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('[getTarotReading] API error:', {
        status: response.status,
        errorData,
        hasToken: !!token
      });

      // Handle authentication errors - throw error instead of returning message
      if (response.status === 401) {
        console.error('[getTarotReading] 401 Unauthorized - authentication failed');
        throw new Error('UNAUTHORIZED');
      }

      // Handle API errors
      throw new Error(`API error: ${response.status} ${errorData.message || ''}`);
    }

    const data = await response.json();

    if (!data.ok || !data.reading) {
      throw new Error("Invalid response from server");
    }

    console.log('[getTarotReading] ✅ Reading received successfully');
    return data.reading;
  } catch (error: any) {
    console.error('[getTarotReading] Error:', error);

    // Re-throw UNAUTHORIZED errors so they can be handled by the caller
    if (error.message === 'UNAUTHORIZED') {
      throw error;
    }

    // Return user-friendly message for other errors
    return isZh
      ? "与灵界的连接似乎受到了干扰，请检查你的网络信号，静心后重试。"
      : "Connection to the spiritual realm seems interrupted. Please check your signal and try again.";
  }
};
