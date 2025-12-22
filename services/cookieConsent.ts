/**
 * Cookie Consent Management Service
 * Handles GDPR-compliant cookie consent for analytics and tracking
 */

export type CookieConsent = 'accepted' | 'rejected' | null;

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

/**
 * Get the current cookie consent status
 */
export function getCookieConsent(): CookieConsent {
  if (typeof document === 'undefined') return null;

  const consent = localStorage.getItem(CONSENT_COOKIE_NAME);
  if (consent === 'accepted' || consent === 'rejected') {
    return consent as CookieConsent;
  }
  return null;
}

/**
 * Save cookie consent choice
 */
export function saveCookieConsent(consent: 'accepted' | 'rejected'): void {
  if (typeof document === 'undefined') return;

  // Save to localStorage (persistent)
  localStorage.setItem(CONSENT_COOKIE_NAME, consent);

  // Also set a cookie for backend compatibility
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);

  document.cookie = `${CONSENT_COOKIE_NAME}=${consent}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

  console.log(`[Cookie Consent] User ${consent} cookies`);
}

/**
 * Initialize Google Analytics if consent is given
 */
export function initializeGoogleAnalytics(): void {
  const consent = getCookieConsent();

  if (consent !== 'accepted') {
    console.log('[Google Analytics] Not initialized - user has not accepted cookies');
    return;
  }

  // Check if GA is already loaded
  if (typeof window.gtag !== 'undefined') {
    console.log('[Google Analytics] Already initialized');
    return;
  }

  // Load Google Analytics script
  const GA_ID = 'G-HMM0NB3C8L';

  // Create and append GA script
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    'send_page_view': true,
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=Lax;Secure',
    'allow_google_signals': true,
    'allow_ad_personalization_signals': false
  });

  console.log('[Google Analytics] Initialized with user consent');
}

/**
 * Disable Google Analytics tracking
 */
export function disableGoogleAnalytics(): void {
  // Set GA disable flag
  window['ga-disable-G-HMM0NB3C8L'] = true;

  // Clear GA cookies
  const gaCookies = ['_ga', '_gat', '_gid'];
  gaCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });

  console.log('[Google Analytics] Disabled and cookies cleared');
}

/**
 * Handle cookie consent acceptance
 */
export function acceptCookies(): void {
  saveCookieConsent('accepted');
  initializeGoogleAnalytics();
}

/**
 * Handle cookie consent rejection
 */
export function rejectCookies(): void {
  saveCookieConsent('rejected');
  disableGoogleAnalytics();
}

// Type augmentation for window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
