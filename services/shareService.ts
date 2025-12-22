import { apiClient } from './apiClient';
import { DrawnCard, Language } from '../types';

export interface CreateShareParams {
  shareType: 'quick' | 'topic_event' | 'topic_baseline';
  question?: string;
  cards?: DrawnCard[];
  reading?: string;
  language?: Language;
  topicId?: string;
  eventId?: string;
}

export interface ShareData {
  shareType: 'quick' | 'topic_event' | 'topic_baseline';
  question: string;
  cards: DrawnCard[];
  reading: string;
  language: Language;
  topicTitle?: string;
  viewCount: number;
  createdAt: string;
}

/**
 * Create a shareable link
 */
export async function createShare(params: CreateShareParams): Promise<{ shareId: string; shareUrl: string }> {
  const response = await apiClient.post('/api/share', params);

  if (!response.ok) {
    throw new Error(response.message || 'Failed to create share');
  }

  // Use query parameter format instead of path parameter
  const baseUrl = 'https://ai-tarotcard.com';
  const langPrefix = params.language === 'zh' ? '/zh' : '';
  const shareUrl = `${baseUrl}${langPrefix}/?shareId=${response.shareId}`;

  return {
    shareId: response.shareId,
    shareUrl,
  };
}

/**
 * Get shared reading data (public, no auth required)
 */
export async function getSharedReading(shareId: string): Promise<ShareData> {
  const response = await apiClient.get(`/api/share/${shareId}`);

  if (!response.ok) {
    throw new Error(response.message || 'Failed to fetch shared reading');
  }

  return response.data;
}

/**
 * Copy share text to clipboard
 */
export async function copyShareToClipboard(
  question: string,
  shareUrl: string,
  language: Language
): Promise<boolean> {
  const shareText = language === 'zh'
    ? `我给你分享了一个超准的塔罗解读:${question},快来看看吧:${shareUrl}`
    : `I'm sharing a super accurate Tarot reading with you: ${question}, check it out: ${shareUrl}`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareText);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('[shareService] Failed to copy to clipboard:', error);
    return false;
  }
}
