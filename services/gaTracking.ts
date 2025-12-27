/**
 * Google Analytics 4 Event Tracking Service
 *
 * This service provides convenient methods for tracking custom events in GA4.
 * Events are only sent if GA4 is properly configured.
 */

// Check if gtag is available
const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track when a user starts a tarot reading
 */
export const trackTarotReadingStart = (question: string, readingType: 'quick' | 'topic_baseline' | 'topic_event') => {
  if (isGAEnabled()) {
    window.gtag!('event', 'tarot_reading_start', {
      'event_category': 'engagement',
      'event_label': readingType,
      'reading_type': readingType,
      'question_length': question.length,
    });
  }
};

/**
 * Track when a card is drawn during a reading
 */
export const trackCardDrawn = (cardName: string, position: string, isReversed: boolean) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'card_drawn', {
      'event_category': 'engagement',
      'card_name': cardName,
      'card_position': position,
      'is_reversed': isReversed,
    });
  }
};

/**
 * Track when a user creates a new big topic
 */
export const trackTopicCreation = (topicTitle: string) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'topic_created', {
      'event_category': 'conversion',
      'event_label': 'big_topic',
      'value': 1,
    });
  }
};

/**
 * Track when a user creates an event under a topic
 */
export const trackEventCreation = (eventName: string, topicId: string) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'event_created', {
      'event_category': 'engagement',
      'event_label': 'topic_event',
      'topic_id': topicId,
    });
  }
};

/**
 * Track when a user shares a reading
 */
export const trackShare = (shareType: 'quick' | 'topic_event' | 'topic_baseline', question: string) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'share', {
      'method': 'link_copy',
      'content_type': shareType,
      'item_id': 'tarot_reading',
      'question': question.substring(0, 100), // Limit to 100 chars
    });
  }
};

/**
 * Track when a user upgrades to Pro membership
 */
export const trackUpgrade = (plan: string, value: number) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'purchase', {
      'transaction_id': `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      'value': value,
      'currency': 'CNY',
      'items': [{
        'item_name': 'Pro Membership',
        'item_category': 'membership',
        'price': value,
        'quantity': 1
      }]
    });
  }
};

/**
 * Track user login
 */
export const trackLogin = (method: 'google' | 'email') => {
  if (isGAEnabled()) {
    window.gtag!('event', 'login', {
      'method': method,
    });
  }
};

/**
 * Track user signup
 */
export const trackSignup = (method: 'google' | 'email') => {
  if (isGAEnabled()) {
    window.gtag!('event', 'sign_up', {
      'method': method,
    });
  }
};

/**
 * Track page views manually (if needed)
 */
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'page_view', {
      'page_path': pagePath,
      'page_title': pageTitle,
    });
  }
};

/**
 * Track errors
 */
export const trackError = (errorMessage: string, errorContext: string) => {
  if (isGAEnabled()) {
    window.gtag!('event', 'exception', {
      'description': `${errorContext}: ${errorMessage}`,
      'fatal': false,
    });
  }
};
