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

    const response = await fetch(`${API_BASE}/api/tarot-reading`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: send cookies for authentication
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

      // Handle authentication errors - throw error instead of returning message
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }

      // Handle API errors
      console.error("Tarot reading API error:", response.status, errorData);
      throw new Error(`API error: ${response.status} ${errorData.message || ''}`);
    }

    const data = await response.json();

    if (!data.ok || !data.reading) {
      throw new Error("Invalid response from server");
    }

    return data.reading;
  } catch (error) {
    console.error("Tarot reading error:", error);
    return isZh
      ? "与灵界的连接似乎受到了干扰，请检查你的网络信号，静心后重试。"
      : "Connection to the spiritual realm seems interrupted. Please check your signal and try again.";
  }
};
