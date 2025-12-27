import React, { useState, useEffect, useRef } from 'react';
import { AppPhase, DrawnCard, SPREAD_LABELS, Language, SessionUser, Plan, Topic, TopicEvent, PlanQuota, TopicWithUsage } from './types';
import { MAJOR_ARCANA, TRANSLATIONS } from './constants';
import { getTarotReading } from './services/bailianService';
import { Card } from './components/Card';
import { StarryBackground } from './components/StarryBackground';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { BlogListPage } from './components/BlogListPage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { TopicListPage } from './components/TopicListPage';
import { TopicDetailPage } from './components/TopicDetailPage';
import { ReadingResultPage } from './components/ReadingResultPage';
import { SharedReadingPage } from './components/SharedReadingPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { PricingPage } from './components/PricingPage';
import { Footer } from './components/Footer';
import { CookieConsent as CookieConsentBanner } from './components/CookieConsent';
import { QuickQuestionCard } from './components/ui';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_BASE_URL, apiClient } from './services/apiClient';
import { getSession, consumeUsage, redeemMembership, logout } from './services/authService';
import { listTopics, createTopic, getTopicDetail, addTopicEvent, deleteTopic } from './services/topicService';
import {
  CookieConsent as CookieConsentStatus,
  getCookieConsent,
  initializeGoogleAnalytics,
  disableGoogleAnalytics,
} from './services/cookieConsent';
import { toPng } from 'html-to-image';

// Header with Title and Language Switch
const Header = ({ 
  title, 
  onBack, 
  showBack, 
  language, 
  onToggleLanguage,
  user,
  plan,
  onLogin,
  onLogout,
  authLoading,
  onOpenTopics,
  quota,
  onRedeem,
  onUpgrade,
}: { 
  title: string, 
  onBack?: () => void, 
  showBack: boolean,
  language: Language,
  onToggleLanguage: () => void,
  user: SessionUser | null,
  plan: Plan,
  onLogin: () => void,
  onLogout: () => void,
  authLoading: boolean,
  onOpenTopics: () => void,
  quota: PlanQuota | null,
  onRedeem: () => void,
  onUpgrade: () => void,
}) => (
  <div className="sticky top-0 z-40 w-full pt-4 pb-4 px-4 bg-slate-950/20 backdrop-blur-sm border-b border-white/5 flex items-center justify-between h-[64px] box-border transition-all duration-300">
     <div className="w-12 flex justify-start">
       {showBack && (
         <button onClick={onBack} className="p-2 text-white/80 hover:text-white transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
           </svg>
         </button>
       )}
     </div>
     
     <h1 className="text-[17px] font-medium tracking-wide text-white/90 font-sans shadow-black drop-shadow-md truncate">
       {title}
     </h1>

     <div className="flex items-center gap-2">
        <button 
          onClick={onToggleLanguage} 
          className="text-xs font-cinzel border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 px-2 py-1 rounded transition-colors"
        >
          {language === 'zh' ? 'EN' : '中'}
        </button>
        {plan === 'member' && (
          <span className="text-[10px] px-2 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-100">
            {language === 'zh' ? '会员' : 'Member'}
          </span>
        )}
        <div className="relative">
          {authLoading ? (
            <div className="w-10 h-8 border border-white/10 rounded-md flex items-center justify-center text-white/60 text-xs">...</div>
          ) : user ? (
            <details className="group relative">
              <summary className="list-none flex items-center gap-2 cursor-pointer">
            <div className="text-[10px] text-slate-300/80">
              {user.name || user.email || (language === 'zh' ? '已登录' : 'Logged in')}
            </div>
                <svg className="w-3 h-3 text-white/70 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.173l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </summary>
              <div
                className="absolute right-0 mt-2 flex flex-col justify-center items-center z-50"
                style={{
                  width: '229px',
                  padding: '24px 0px 32px',
                  gap: '24px',
                  background: '#282446',
                  border: '1px solid #443E71',
                  borderRadius: '16px',
                }}
              >
                {/* User Info Section */}
                <div className="flex flex-col justify-center items-center w-full" style={{ gap: '12px' }}>
                  {/* Username */}
                  <div
                    className="w-full flex items-center justify-center text-center"
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 700,
                      fontSize: '24px',
                      lineHeight: '29px',
                      color: '#E2DBFF',
                    }}
                  >
                    {user.name || user.email?.split('@')[0] || (language === 'zh' ? '用户' : 'User')}
                  </div>

                  {/* User Type Badge */}
                  {plan === 'member' ? (
                    <div className="flex flex-row justify-center items-center w-full" style={{ gap: '4px' }}>
                      <div
                        className="flex flex-row justify-center items-center"
                        style={{
                          padding: '2px 8px',
                          background: 'rgba(233, 215, 195, 0.1)',
                          border: '0.5px solid #DD8424',
                          borderRadius: '100px',
                          fontFamily: "'Noto Serif SC', serif",
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '17px',
                          color: '#DD8424',
                        }}
                      >
                        PRO
                      </div>
                      <span
                        style={{
                          fontFamily: "'Noto Serif SC', serif",
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '17px',
                          color: '#8F88AB',
                        }}
                      >
                        {language === 'zh' ? '用户' : 'User'}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="w-full flex items-center justify-center text-center"
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#8F88AB',
                      }}
                    >
                      {language === 'zh' ? '免费用户' : 'Free User'}
                    </div>
                  )}
                </div>

                {/* Quota Info Section */}
                <div
                  className="flex flex-col items-start w-full"
                  style={{
                    padding: '0px 24px',
                    gap: '12px',
                  }}
                >
                  {/* Topic Quota */}
                  <div
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#8F88AB',
                    }}
                  >
                    {language === 'zh'
                      ? `今日命题剩余 ${topicQuota?.topic_quota_remaining ?? 0}/${topicQuota?.topic_quota_total ?? (plan === 'member' ? 30 : 1)}`
                      : `Topics remaining ${topicQuota?.topic_quota_remaining ?? 0}/${topicQuota?.topic_quota_total ?? (plan === 'member' ? 30 : 1)}`}
                  </div>

                  {/* Event Quota */}
                  <div
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#8F88AB',
                    }}
                  >
                    {language === 'zh'
                      ? `每命题事件上限 ${topicQuota?.event_quota_per_topic ?? (plan === 'member' ? 500 : 3)}`
                      : `Events per topic ${topicQuota?.event_quota_per_topic ?? (plan === 'member' ? 500 : 3)}`}
                  </div>

                  {/* Expiry Date (for Pro users only) */}
                  {plan === 'member' && topicQuota?.expires_at && (
                    <div
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#8F88AB',
                      }}
                    >
                      {language === 'zh'
                        ? `Pro 会员到期： ${new Date(topicQuota.expires_at).toLocaleDateString('zh-CN')}`
                        : `Pro expires: ${new Date(topicQuota.expires_at).toLocaleDateString('en-US')}`}
                    </div>
                  )}
                </div>

                {/* Buttons Section */}
                <div
                  className="flex flex-col items-start w-full"
                  style={{
                    padding: '0px 24px',
                    gap: '12px',
                  }}
                >
                  {/* Upgrade Button (for free users only) */}
                  {plan === 'free' && (
                    <button
                      onClick={() => setShowPaywall(true)}
                      className="flex flex-row justify-center items-center w-full"
                      style={{
                        height: '40px',
                        padding: '16px 64px',
                        background: '#DD8424',
                        borderRadius: '100px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Noto Serif SC', serif",
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '19px',
                          color: '#000000',
                          opacity: 0.8,
                        }}
                      >
                        {language === 'zh' ? '升级为 Pro 用户' : 'Upgrade to Pro'}
                      </span>
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="flex flex-row justify-center items-center w-full"
                    style={{
                      height: '40px',
                      padding: '7px 20px',
                      background: 'rgba(189, 161, 255, 0.2)',
                      border: '1px solid rgba(189, 161, 255, 0.2)',
                      borderRadius: '100px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '19px',
                        color: '#BDA1FF',
                      }}
                    >
                      {language === 'zh' ? '退出登录' : 'Logout'}
                    </span>
                  </button>
                </div>
              </div>
            </details>
          ) : (
            <button 
              onClick={onLogin} 
              className="text-[10px] px-3 py-2 bg-amber-500/80 hover:bg-amber-500 text-slate-900 font-semibold rounded-md transition-colors"
            >
              {language === 'zh' ? '使用 Chrome 登录' : 'Login with Chrome'}
            </button>
          )}
        </div>
     </div>
  </div>
);

// Wisdom Loader Component
const WisdomLoader = ({ language }: { language: Language }) => {
  const quotes = language === 'zh' 
    ? [
      "爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。",
      "对方是深情或薄幸、卓越或平庸，都不重要。",
      "重要的是你能否在心动与心碎中，看清自己的贪嗔痴。",
      "情关不是考验对方的战场，而是修练自我的道场。",
      "所有关系的困境，都是内心投射的倒影。",
      "破情关者，破的是对“被爱”的执迷。",
      "见本性者，见的是本自具足的清明。",
      "原来世上从无他人，唯有你与自己的千百种面相。"
    ]
    : [
      "The true value of love is not meeting the right person, but seeing your true self.",
      "Whether they are devoted or fickle, it does not matter.",
      "What matters is seeing your own attachments amidst the heartbreak.",
      "Relationships are not a battlefield, but a dojo for the self.",
      "All relationship dilemmas are reflections of inner projections.",
      "Breaking emotional barriers is breaking the obsession with 'being loved'.",
      "To see one's true nature is to see the clarity within.",
      "There are no others, only the thousand faces of yourself."
    ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 space-y-8 max-w-lg mx-auto text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xl animate-pulse">👁️</span>
          </div>
        </div>
        
        <div className="min-h-[80px] flex items-center justify-center">
          <p className="text-sm md:text-base text-purple-100/90 font-mystic leading-relaxed tracking-wide animate-fade-in key={index}">
            “{quotes[index]}”
          </p>
        </div>
     </div>
  );
};

const markdownComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-amber-200/90 tracking-wide mb-3 border-l-4 border-amber-400/40 pl-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-amber-100/90 mb-2">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-slate-200/90">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-slate-200/90">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-amber-300 font-semibold">{children}</strong>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-relaxed text-slate-200/90 break-words mb-2">{children}</p>
  ),
};

const QUESTION_SUGGESTIONS: Record<Language, string[]> = {
  zh: [
    "我要不要辞职？",
    "这段关系是否继续？",
    "要不要搬到另一个城市？",
    "要不要接受这份工作机会？",
    "是否应该开始创业项目？",
  ],
  en: [
    "Should I quit my job?",
    "Should I continue this relationship?",
    "Should I move to another city?",
    "Should I accept this job offer?",
    "Should I start this new venture?",
  ],
};

const formatCardLabel = (card: DrawnCard, language: Language) => {
  const isZh = language === 'zh';
  const name = isZh ? card.nameCn : card.name;
  const status = isZh ? (card.isReversed ? "逆位" : "正位") : (card.isReversed ? "Reversed" : "Upright");
  const posName = isZh ? ["过去", "现在", "未来"][card.position] ?? "事件" : ["Past", "Present", "Future"][card.position] ?? "Event";
  return `${posName}: ${name} (${status})`;
};

const App: React.FC = () => {
  // Check if we have pending reading in localStorage to restore after OAuth
  const getPendingReading = () => {
    // Only restore pending reading if coming from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const isOAuthCallback = params.get('auth') === 'success';

    console.log('[getPendingReading] OAuth callback check:', { isOAuthCallback, url: window.location.href });

    if (!isOAuthCallback) {
      // Not an OAuth callback, don't restore pending reading
      console.log('[getPendingReading] Not OAuth callback, skipping restore');
      return null;
    }

    try {
      const pendingStr = localStorage.getItem('pendingReading');
      console.log('[getPendingReading] localStorage pendingReading:', pendingStr ? 'exists' : 'not found');

      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        const age = Date.now() - (pending.timestamp || 0);
        console.log('[getPendingReading] Pending age:', age, 'ms, question:', pending.question, 'cards:', pending.cards?.length);

        // Only restore if less than 30 minutes old
        if (age < 30 * 60 * 1000) {
          console.log('[getPendingReading] ✅ Restoring pending reading:', {
            question: pending.question,
            cardsCount: pending.cards?.length,
            hasReading: !!pending.reading
          });
          return pending;
        } else {
          console.log('[getPendingReading] ❌ Pending reading too old, removing');
          localStorage.removeItem('pendingReading');
        }
      }
    } catch (e) {
      console.error('[getPendingReading] Failed to parse pending reading:', e);
    }
    return null;
  };

  const initialPending = getPendingReading();

  const [phase, setPhase] = useState<AppPhase>(initialPending ? AppPhase.ANALYSIS : AppPhase.INPUT);
  const [question, setQuestion] = useState(initialPending?.question || '');
  const [deck, setDeck] = useState<typeof MAJOR_ARCANA>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(initialPending?.cards || []);
  const [reading, setReading] = useState(initialPending?.reading || '');
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    }
    return 'en';
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState<SessionUser | null>(null);
  const [plan, setPlan] = useState<Plan>('guest');
  const [remainingToday, setRemainingToday] = useState<number | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [usageError, setUsageError] = useState('');
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState('');
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [shareError, setShareError] = useState('');
  const [shareMode, setShareMode] = useState(false);
  const [topicQuota, setTopicQuota] = useState<PlanQuota | null>(null);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicList, setTopicList] = useState<TopicWithUsage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicEvents, setTopicEvents] = useState<TopicEvent[]>([]);
  const [topicEventUsage, setTopicEventUsage] = useState<{ used: number; remaining: number | null } | null>(null);
  const [topicError, setTopicError] = useState('');
  const [createdTopicId, setCreatedTopicId] = useState<string | null>(null);
  const [isSavingTopic, setIsSavingTopic] = useState(false);
  const [topicSaveMessage, setTopicSaveMessage] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventCard, setEventCard] = useState<DrawnCard | null>(null);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isEventSaving, setIsEventSaving] = useState(false);
  const [eventReading, setEventReading] = useState('');
  const [eventError, setEventError] = useState('');
  const [upgradeHint, setUpgradeHint] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showMemberLimitModal, setShowMemberLimitModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [pendingBaseline, setPendingBaseline] = useState<{ question: string; cards: DrawnCard[] } | null>(
    initialPending ? { question: initialPending.question, cards: initialPending.cards } : null
  );
  const [processingPending, setProcessingPending] = useState(false);
  const [eventDeck, setEventDeck] = useState<typeof MAJOR_ARCANA>([]);
  const [eventCanDraw, setEventCanDraw] = useState(false);
  const [isEventShuffling, setIsEventShuffling] = useState(false);
  const eventShuffleInterval = useRef<NodeJS.Timeout | null>(null);
  const eventShuffleTimeout = useRef<NodeJS.Timeout | null>(null);
  const [shareDataLoaded, setShareDataLoaded] = useState(false);
  const [showTopicListPage, setShowTopicListPage] = useState(false);
  const [showTopicDetailPage, setShowTopicDetailPage] = useState(false);
  const [showSharedReadingPage, setShowSharedReadingPage] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showTermsPage, setShowTermsPage] = useState(false);
  const [showBlogPage, setShowBlogPage] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [showPricingPage, setShowPricingPage] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentStatus>(() => getCookieConsent());
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [sharedReadingId, setSharedReadingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];
  
  // Initialize Deck
  useEffect(() => {
    setDeck([...MAJOR_ARCANA]);
  }, []);

  // Initialize cookie consent + analytics state
  useEffect(() => {
    const consent = getCookieConsent();
    setCookieConsent(consent);
    if (consent === 'accepted') {
      initializeGoogleAnalytics();
    } else if (consent === 'rejected') {
      disableGoogleAnalytics();
    }
  }, []);

  // Parse URL for initial page routing
  useEffect(() => {
    if (shareDataLoaded) return;

    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Extract route from pathname (handle both /en/route and /zh/route)
    const pathParts = pathname.split('/').filter(p => p);
    // Remove language prefix if present
    const route = pathParts.filter(p => p !== 'zh' && p !== 'en')[0];

    // Check for page routes
    if (route === 'pricing') {
      setShowPricingPage(true);
      setShareDataLoaded(true);
      return;
    }
    if (route === 'blog') {
      setShowBlogPage(true);
      setShareDataLoaded(true);
      return;
    }
    if (route === 'bigtopic') {
      setShowTopicListPage(true);
      setShareDataLoaded(true);
      // Load topics
      setTopicsLoading(true);
      listTopics().then(res => {
        setTopicList(res.topics || []);
        if (res.quota) setTopicQuota(res.quota);
      }).catch(err => {
        console.error("load topics failed", err);
      }).finally(() => {
        setTopicsLoading(false);
      });
      return;
    }

    // Check for privacy/terms view
    const view = params.get('view');
    if (view === 'privacy') {
      setShowPrivacyPage(true);
      setShareDataLoaded(true);
      return;
    }
    if (view === 'terms') {
      setShowTermsPage(true);
      setShareDataLoaded(true);
      return;
    }

    // Check for new share format (shareId parameter)
    const shareId = params.get('shareId');
    if (shareId) {
      setSharedReadingId(shareId);
      setShowSharedReadingPage(true);
      setShareDataLoaded(true);
      return;
    }

    // Legacy share format (base64 encoded data)
    const share = params.get('share');
    if (share) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(share)));
        if (decoded.question && decoded.reading && Array.isArray(decoded.cards)) {
          setQuestion(decoded.question);
          setReading(decoded.reading);
          setDrawnCards(decoded.cards);
          setPhase(AppPhase.ANALYSIS);
          setShareMode(true);
        }
      } catch (e) {
        console.error("parse share failed", e);
      }
    }
    setShareDataLoaded(true);
  }, [shareDataLoaded]);

  // Init event deck
  useEffect(() => {
    setEventDeck([...MAJOR_ARCANA]);
    return () => {
      if (eventShuffleInterval.current) clearInterval(eventShuffleInterval.current);
      if (eventShuffleTimeout.current) clearTimeout(eventShuffleTimeout.current);
    };
  }, []);

  // Debug: Log authentication state on mount
  useEffect(() => {
    console.log("=== APP MOUNTED ===");
    console.log("URL:", window.location.href);
    console.log("localStorage.auth_token:", localStorage.getItem('auth_token') ? "present" : "absent");
    console.log("document.cookie:", document.cookie || "empty");
    console.log("User-Agent:", navigator.userAgent);
    console.log("==================");
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const pathParts = pathname.split('/').filter(p => p);
      const route = pathParts.filter(p => p !== 'zh' && p !== 'en')[0];

      // Reset all page states
      setShowPricingPage(false);
      setShowBlogPage(false);
      setShowTopicListPage(false);
      setShowTopicDetailPage(false);
      setShowPrivacyPage(false);
      setShowTermsPage(false);
      setSelectedBlogId(null);

      // Set the correct page based on route
      if (route === 'pricing') {
        setShowPricingPage(true);
      } else if (route === 'blog') {
        setShowBlogPage(true);
      } else if (route === 'bigtopic') {
        setShowTopicListPage(true);
        // Load topics
        setTopicsLoading(true);
        listTopics().then(res => {
          setTopicList(res.topics || []);
          if (res.quota) setTopicQuota(res.quota);
        }).catch(err => {
          console.error("load topics failed", err);
        }).finally(() => {
          setTopicsLoading(false);
        });
      }
      // If no route matches, user is back on home page (default state)
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load session
  useEffect(() => {
    const loadSession = async () => {
      console.log("[Session] Loading initial session, user agent:", navigator.userAgent);
      console.log("[Session] Cookies available:", document.cookie ? "yes" : "no");
      const token = localStorage.getItem('auth_token');
      console.log("[Session] Token in localStorage:", token ? `yes (length: ${token.length})` : "no");
      try {
        const data = await getSession();
        console.log("[Session] Got session data:", data?.user ? "user found" : "no user", "plan:", data?.plan);
        console.log("[Session] Full user data:", data?.user);
        console.log("[Session] membership_expires_at:", data?.user?.membership_expires_at, "type:", typeof data?.user?.membership_expires_at);
        if (data?.user) {
          setUser(data.user);
          setPlan((data.plan as Plan) || 'free');
          setRemainingToday(data.remaining_today ?? null);
          if (data.topic_quota_total) {
            setTopicQuota({
              plan: (data.plan as Plan) || 'free',
              topic_quota_total: data.topic_quota_total,
              topic_quota_remaining: data.topic_quota_remaining ?? data.topic_quota_total,
              event_quota_per_topic: data.event_quota_per_topic ?? 0,
              expires_at: data.cycle_expires_at ?? data.membership_expires_at,
              downgrade_limited_topic_id: data.downgrade_limited_topic_id ?? null,
            });
          } else {
            setTopicQuota(null);
          }
          setUpgradeHint('');
        } else {
          console.log("[Session] No user found, setting guest mode");
          setUser(null);
          setPlan('guest');
          setRemainingToday(null);
          setTopicQuota(null);
          setUpgradeHint('');
          setShowPaywall(false);
        }
      } catch (e) {
        console.error("Session load error", e);
      } finally {
        setAuthLoading(false);
      }
    };
    loadSession();
  }, []);

  // Track page view after session is loaded and user accepted analytics cookies
  useEffect(() => {
    if (authLoading || cookieConsent !== 'accepted') return; // Wait for auth + consent

    const trackVisit = async () => {
      try {
        // Get or create visitor ID
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('visitor_id', visitorId);
        }

        // Get user ID if available
        const userId = user?.id;

        // Track page view
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorId,
            userId,
            pagePath: window.location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        });

        console.log('[Analytics] Page view tracked for visitor:', visitorId, 'user:', userId);
      } catch (error) {
        console.error('[Analytics] Failed to track page view:', error);
      }
    };

    trackVisit();
  }, [authLoading, user, cookieConsent]);

  // Handle payment success callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    if (paymentStatus === 'success') {
      console.log('[Payment] Payment success detected!');

      // Remove payment parameter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('payment');
      window.history.replaceState({}, '', newUrl.toString());

      // Show success message
      alert(language === 'zh'
        ? '支付成功！正在激活会员权限，请稍候...'
        : 'Payment successful! Activating membership, please wait...');

      // Reload session with retry logic
      // Webhook processing may take a few seconds
      const reloadWithRetry = async (attempt = 1, maxAttempts = 5) => {
        console.log(`[Payment] Checking membership status (attempt ${attempt}/${maxAttempts})...`);

        await fetchSession();

        // Check if plan was updated to member/pro
        const currentPlan = localStorage.getItem('current_plan');
        if (currentPlan === 'member' || currentPlan === 'pro') {
          console.log('[Payment] Membership activated successfully!');
          alert(language === 'zh'
            ? '会员权限已激活！您现在是 Pro 用户了 🎉'
            : 'Membership activated! You are now a Pro user 🎉');
          return;
        }

        // If not upgraded yet and still have attempts left, retry
        if (attempt < maxAttempts) {
          console.log(`[Payment] Not upgraded yet, retrying in 2 seconds...`);
          setTimeout(() => reloadWithRetry(attempt + 1, maxAttempts), 2000);
        } else {
          console.error('[Payment] Failed to detect membership upgrade after', maxAttempts, 'attempts');
          alert(language === 'zh'
            ? '支付成功，但会员激活延迟。请刷新页面或联系客服。'
            : 'Payment successful, but activation delayed. Please refresh or contact support.');
        }
      };

      // Start checking after a small delay to allow webhook processing
      setTimeout(() => reloadWithRetry(), 1000);
    }
  }, [language]);

  // Handle OAuth callback - reload session when auth=success is detected
  useEffect(() => {
    console.log("[OAuth] Checking for OAuth callback, URL:", window.location.href);
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const token = params.get('token');
    console.log("[OAuth] Auth status:", authStatus, "Token present:", !!token);

    if (authStatus === 'success') {
      console.log("[OAuth] ✅ OAuth success detected!");
      // Store token in localStorage if provided (mobile fallback)
      if (token) {
        console.log("[OAuth] Received token in URL (length:", token.length, "), storing in localStorage (mobile mode)");
        localStorage.setItem('auth_token', token);
        console.log("[OAuth] Token stored in localStorage successfully");
      } else {
        console.log("[OAuth] No token in URL, relying on cookie (desktop mode)");
      }

      // Remove auth parameter and token from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth');
      newUrl.searchParams.delete('token');
      window.history.replaceState({}, '', newUrl.toString());
      console.log("[OAuth] URL cleaned, new URL:", newUrl.toString());

      // Reload session to get updated user info
      // Add retry logic for mobile browsers where cookie may not be immediately available
      const reloadSession = async (retryCount = 0) => {
        const maxRetries = 3;
        const retryDelay = 500; // 500ms between retries

        setAuthLoading(true);
        try {
          // Add a small delay before first attempt to allow cookie to be set
          if (retryCount === 0) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }

          const data = await getSession();
          console.log("[OAuth] getSession returned:", data?.user ? "user found" : "no user", "attempt:", retryCount + 1);
          if (data?.user) {
            setUser(data.user);
            setPlan((data.plan as Plan) || 'free');
            setRemainingToday(data.remaining_today ?? null);
            if (data.topic_quota_total) {
              setTopicQuota({
                plan: (data.plan as Plan) || 'free',
                topic_quota_total: data.topic_quota_total,
                topic_quota_remaining: data.topic_quota_remaining ?? data.topic_quota_total,
                event_quota_per_topic: data.event_quota_per_topic ?? 0,
                expires_at: data.cycle_expires_at ?? data.membership_expires_at,
                downgrade_limited_topic_id: data.downgrade_limited_topic_id ?? null,
              });
            } else {
              setTopicQuota(null);
            }
            setUpgradeHint('');
            console.log("[OAuth] Session reloaded successfully after", retryCount, "retries");

            // Check if there's a pending reading to restore
            // Note: initialPending already restored the state during component mount
            // Just clean up localStorage here
            try {
              const pendingStr = localStorage.getItem('pendingReading');
              if (pendingStr) {
                console.log("[OAuth] Pending reading already restored during init, cleaning up localStorage");
                localStorage.removeItem('pendingReading');
              }
            } catch (e) {
              console.error("[OAuth] Failed to clean up pending reading:", e);
            }

            // Clear auth loading state on success
            setAuthLoading(false);
          } else if (retryCount < maxRetries) {
            // No user data, retry after delay
            console.log("[OAuth] No user data, retrying in", retryDelay, "ms (attempt", retryCount + 1, "of", maxRetries, ")");
            setTimeout(() => reloadSession(retryCount + 1), retryDelay);
            return; // Don't clear loading state yet
          } else {
            console.error("[OAuth] Failed to load session after", maxRetries, "retries");
            setAuthLoading(false);
          }
        } catch (e) {
          console.error("Session reload error after OAuth", e);
          if (retryCount < maxRetries) {
            console.log("[OAuth] Retrying in", retryDelay, "ms (attempt", retryCount + 1, "of", maxRetries, ")");
            setTimeout(() => reloadSession(retryCount + 1), retryDelay);
            return; // Don't clear loading state yet
          } else {
            setAuthLoading(false);
          }
        }
      };
      reloadSession();
    } else if (authStatus === 'failure') {
      // Remove auth parameter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth');
      window.history.replaceState({}, '', newUrl.toString());

      // Show error message
      console.error("OAuth authentication failed");
      setAuthLoading(false);
    }
  }, []);

  // 登录后恢复未登录时缓存的基准占卜请求
  useEffect(() => {
    const runPending = async () => {
      if (!user || !pendingBaseline || processingPending || phase !== AppPhase.ANALYSIS) {
        console.log('[PendingBaseline] Skip:', { hasUser: !!user, hasPending: !!pendingBaseline, processing: processingPending, phase });
        return;
      }

      // If reading already exists (restored from localStorage with the reading), no need to fetch again
      if (reading) {
        console.log('[PendingBaseline] Reading already exists from localStorage, skipping API call');
        setPendingBaseline(null);
        setProcessingPending(false);
        // Clean up pendingReading from localStorage since it's been used
        localStorage.removeItem('pendingReading');
        console.log('[PendingBaseline] Cleaned up pendingReading from localStorage');
        return;
      }

      console.log('[PendingBaseline] Fetching reading for restored session...');
      setProcessingPending(true);
      setIsReadingLoading(true);

      try {
        // Check usage allowance first
        const allowed = await ensureUsageAllowance();
        if (!allowed) {
          console.log('[PendingBaseline] Usage not allowed');
          setReading('');
          return;
        }

        // Prepare variables for first reading
        const isZh = language === 'zh';
        const baselineCardsStr = pendingBaseline.cards
          .map(c => formatCardLabel(c, language))
          .join(isZh ? '，' : ', ');

        const promptKey = isZh ? 'prompt_first_zh' : 'prompt_first_en';
        const variables = {
          question: pendingBaseline.question,
          baseline_cards: baselineCardsStr
        };

        console.log('[PendingBaseline] Sending to API:', { promptKey, variables });

        const result = await getTarotReading(
          pendingBaseline.question,
          pendingBaseline.cards,
          language,
          promptKey,
          variables
        );
        setReading(result);
        setUsageError('');
        setPendingBaseline(null);
        // Clean up pendingReading from localStorage since it's been used
        localStorage.removeItem('pendingReading');
        console.log('[PendingBaseline] Reading fetched successfully and cleaned up localStorage');
      } catch (err: any) {
        console.error("[PendingBaseline] Fetch failed", err);
        if (err.message === 'UNAUTHORIZED') {
          setReading('');
          setUser(null);
          setPlan('guest');
        } else {
          setUsageError(language === 'zh' ? '登录后拉取解读失败，请重试。' : 'Failed to resume reading after login.');
        }
      } finally {
        setIsReadingLoading(false);
        setProcessingPending(false);
      }
    };
    runPending();
  }, [user, pendingBaseline, processingPending, phase, language, reading]);

  const loginWithGoogle = () => {
    console.log('[loginWithGoogle] Starting login flow, current state:', {
      phase,
      hasQuestion: !!question,
      cardsCount: drawnCards.length,
      hasReading: !!reading,
      userAgent: navigator.userAgent
    });

    // Save current reading state before redirecting to OAuth
    // Save even if reading is empty - it will be fetched after login
    if (phase === AppPhase.ANALYSIS && question && drawnCards.length > 0) {
      try {
        const pendingData = {
          question,
          cards: drawnCards,
          reading: reading || '',  // Save reading if exists, empty string otherwise
          timestamp: Date.now()
        };
        const pendingStr = JSON.stringify(pendingData);
        localStorage.setItem('pendingReading', pendingStr);

        // Verify it was saved
        const saved = localStorage.getItem('pendingReading');
        console.log('[loginWithGoogle] ✅ Saved pendingReading to localStorage:', {
          question,
          cardsCount: drawnCards.length,
          hasReading: !!reading,
          savedLength: saved?.length,
          verified: saved === pendingStr
        });
      } catch (e) {
        console.error('[loginWithGoogle] ❌ Failed to save reading to localStorage:', e);
        alert('Warning: Failed to save your reading state. You may need to draw cards again after login.');
      }
    } else {
      console.log('[loginWithGoogle] ⚠️ Skipping save - conditions not met:', {
        isAnalysisPhase: phase === AppPhase.ANALYSIS,
        hasQuestion: !!question,
        hasCards: drawnCards.length > 0
      });
    }

    console.log('[loginWithGoogle] Redirecting to Google OAuth...');
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setPlan('guest');
      setRemainingToday(null);
      setTopicQuota(null);
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
    } catch (e) {
      console.error("logout failed", e);
    }
  };

  const fetchSession = async () => {
    try {
      const data = await getSession();
      console.log('[fetchSession] Got session data:', data?.user ? 'user found' : 'no user', 'plan:', data?.plan);
      console.log('[fetchSession] membership_expires_at:', data?.user?.membership_expires_at);
      if (data?.user) {
        const userPlan = (data.plan as Plan) || 'free';
        setUser(data.user);
        setPlan(userPlan);
        setRemainingToday(data.remaining_today ?? null);

        // Save plan to localStorage for payment success check
        localStorage.setItem('current_plan', userPlan);

        if (data.topic_quota_total) {
          setTopicQuota({
            plan: userPlan,
            topic_quota_total: data.topic_quota_total,
            topic_quota_remaining: data.topic_quota_remaining ?? data.topic_quota_total,
            event_quota_per_topic: data.event_quota_per_topic ?? 0,
            expires_at: data.cycle_expires_at ?? data.membership_expires_at,
            downgrade_limited_topic_id: data.downgrade_limited_topic_id ?? null,
          });
        } else {
          setTopicQuota(null);
        }
        setUpgradeHint('');
      }
    } catch (e) {
      console.error('[fetchSession] Error:', e);
    }
  };

  const ensureUsageAllowance = async (): Promise<boolean> => {
    if (!user) {
      // Don't set usageError - just save the pending request and return false
      // The ReadingResultPage will show the login prompt
      const pending = { question, cards: drawnCards };
      setPendingBaseline(pending);

      // Save to localStorage so it persists across page reload during OAuth
      try {
        localStorage.setItem('pendingReading', JSON.stringify({
          question,
          cards: drawnCards,
          timestamp: Date.now()
        }));
        console.log('[PendingReading] Saved to localStorage:', { question, cardsCount: drawnCards.length });
      } catch (e) {
        console.error('[PendingReading] Failed to save to localStorage:', e);
      }

      return false;
    }
    try {
      const res = await consumeUsage();
      console.log('[Usage] Consume success:', res);
      setPlan((res.plan as Plan) || plan);
      setRemainingToday(res.remaining ?? null);
      setUsageError('');
      return true;
    } catch (err: any) {
      console.error('[Usage] Failed to consume:', err);
      console.log('[Usage] Error details:', {
        status: err?.status,
        data: err?.data,
        message: err?.data?.message,
        plan: err?.data?.plan,
        used_today: err?.data?.used_today,
        daily_limit: err?.data?.daily_limit,
      });

      // Check if it's a daily limit error
      if (err?.data?.message === 'daily_limit_reached') {
        const { plan: userPlan, used_today, daily_limit } = err.data;

        console.log('[Usage] Daily limit reached:', { userPlan, used_today, daily_limit });

        if (userPlan === 'member') {
          // Member reached daily limit (50 times) - Show simple modal, not paywall
          console.log('[Usage] Showing member limit modal');
          setShowMemberLimitModal(true);
        } else {
          // Free user reached daily limit (2 times) - Show paywall
          console.log('[Usage] Showing paywall for free user');
          setShowPaywall(true);
          setUsageError(
            language === 'zh'
              ? `今日免费次数已用完（${used_today}/${daily_limit}），请输入兑换码开启会员。`
              : `Free daily limit reached (${used_today}/${daily_limit}). Redeem a code to unlock membership.`
          );
        }
      } else if (err?.data?.requireRedemption) {
        console.log('[Usage] Showing paywall due to requireRedemption flag');
        setShowPaywall(true);
        setUsageError(language === 'zh' ? '今日免费次数已用完，请输入兑换码开启会员。' : 'Free daily limit reached. Redeem a code to unlock membership.');
      } else if (err?.status === 401) {
        setUsageError(language === 'zh' ? '会话已过期，请重新登录。' : 'Session expired, please log in again.');
        setUser(null);
        setPlan('guest');
      } else {
        console.log('[Usage] Unknown error, showing generic message');
        setUsageError(language === 'zh' ? '请求受限，请稍后再试。' : 'Request blocked. Please try again later.');
      }
      return false;
    }
  };

  const handleRedeem = async () => {
    if (!redeemCodeInput.trim()) return;
    try {
      const res = await redeemMembership(redeemCodeInput.trim());

      // Save new token to localStorage if provided (for mobile browsers)
      if (res.token) {
        localStorage.setItem('auth_token', res.token);
        console.log('[Redeem] Updated auth token in localStorage');
      }

      setRedeemFeedback(language === 'zh' ? '兑换成功，会员已开通！' : 'Redeemed successfully. Membership activated!');
      setPlan('member');
      setRemainingToday(50);

      // Refresh session to get updated user info
      await fetchSession();

      // Close both paywall and redeem modal
      setShowRedeem(false);
      setShowPaywall(false);
      console.log('[Redeem] Membership activated, paywall closed');
    } catch (err: any) {
      const reason = err?.data?.reason;
      const msg = {
        not_found: language === 'zh' ? '兑换码不存在' : 'Code not found',
        used: language === 'zh' ? '兑换码已被使用' : 'Code already used',
        expired: language === 'zh' ? '兑换码已过期' : 'Code expired',
      }[reason as string] || (language === 'zh' ? '兑换失败，请重试' : 'Redeem failed, try again');
      setRedeemFeedback(msg);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      console.log('[Upgrade] User not logged in, showing login button');
      return;
    }

    setIsUpgrading(true);
    try {
      console.log('[Upgrade] Calling checkout API...');
      const response = await apiClient.post('/api/checkout');

      if (response.ok && response.checkout_url) {
        console.log('[Upgrade] Redirecting to checkout URL:', response.checkout_url);
        // Redirect to Creem checkout page
        window.location.href = response.checkout_url;
      } else {
        throw new Error('Invalid response from checkout API');
      }
    } catch (err: any) {
      console.error('[Upgrade] Checkout failed:', err);
      alert(
        language === 'zh'
          ? '无法创建支付会话，请稍后重试。'
          : 'Failed to create checkout session. Please try again later.'
      );
      setIsUpgrading(false);
    }
    // Note: Don't set isUpgrading to false on success since we're redirecting
  };

  // Fisher-Yates shuffle algorithm for proper randomization
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle Input Submit
  const handleStart = () => {
    if (!question.trim()) return;

    setErrorMsg('');
    setPhase(AppPhase.SHUFFLING);
  };

  // Shuffle Logic
  useEffect(() => {
    if (phase === AppPhase.SHUFFLING) {
      const shuffleInterval = setInterval(() => {
        setDeck(prev => shuffleArray(prev));
      }, 100);

      const timer = setTimeout(() => {
        clearInterval(shuffleInterval);
        setPhase(AppPhase.DRAWING);
      }, 3000);

      return () => {
        clearInterval(shuffleInterval);
        clearTimeout(timer);
      };
    }
  }, [phase]);

  // Draw Logic
  const handleCardDraw = (index: number) => {
    if (drawnCards.length >= 3 || isInteracting) return;

    setIsInteracting(true);

    const selectedBaseCard = deck[index];
    const isReversed = Math.random() > 0.5;
    
    const newCard: DrawnCard = {
      ...selectedBaseCard,
      isReversed,
      position: drawnCards.length
    };

    const newDrawn = [...drawnCards, newCard];
    setDrawnCards(newDrawn);
    
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);

    if (newDrawn.length === 3) {
      // Immediately transition to ANALYSIS phase to show loading animation
      setTimeout(() => setPhase(AppPhase.ANALYSIS), 0);
    } else {
      setTimeout(() => {
        setIsInteracting(false);
      }, 500);
    }
  };

  // Analysis Logic - triggers immediately after drawing 3 cards
  useEffect(() => {
    if (phase === AppPhase.ANALYSIS && drawnCards.length === 3 && !reading) {
      // Immediately start the reading process
      const fetchReading = async () => {
        // Check if user is logged in first
        const allowed = await ensureUsageAllowance();
        if (!allowed) {
          // Don't set loading state for unauthenticated users
          // Just set empty reading to show login prompt
          setReading('');
          setIsReadingLoading(false);
          return;
        }

        // User is logged in, proceed with loading and fetching
        setIsReadingLoading(true);

        // Prepare variables for first reading
        const isZh = language === 'zh';
        const baselineCardsStr = drawnCards
          .map(c => formatCardLabel(c, language))
          .join(isZh ? '，' : ', ');

        const promptKey = isZh ? 'prompt_first_zh' : 'prompt_first_en';
        const variables = {
          question: question,
          baseline_cards: baselineCardsStr
        };

        console.log('[First Reading] Sending to API:', {
          promptKey,
          question,
          baselineCardsStr,
          variables
        });

        try {
          const result = await getTarotReading(question, drawnCards, language, promptKey, variables);
          setReading(result);
        } catch (err: any) {
          console.error('[First Reading] Error:', err);
          if (err.message === 'UNAUTHORIZED') {
            // User logged out during the reading process
            setReading('');
            setUser(null);
            setPlan('guest');
          } else {
            // Other errors, show generic error message
            setReading(language === 'zh'
              ? '与灵界的连接似乎受到了干扰，请检查你的网络信号，静心后重试。'
              : 'Connection to the spiritual realm seems interrupted. Please check your signal and try again.');
          }
        } finally {
          setIsReadingLoading(false);
        }
      };

      fetchReading();
    }
  }, [phase, drawnCards, question, language]);

  const handleSaveTopic = async () => {
    if (!user) {
      setTopicError(language === 'zh' ? '请先登录后再创建命题。' : 'Please log in to save as a topic.');
      return;
    }
    if (!reading || drawnCards.length < 3) {
      setTopicError(language === 'zh' ? '请先完成抽牌并获取解读。' : 'Finish the reading first.');
      return;
    }
    if (createdTopicId) {
      setTopicSaveMessage(language === 'zh' ? '已创建命题' : 'Topic already created');
      // Navigate to the created topic detail page
      await loadTopicDetail(createdTopicId);
      return;
    }
    setTopicError('');
    setTopicSaveMessage('');
    try {
      setIsSavingTopic(true);
      const res = await createTopic({
        title: question || t.appTitle,
        language,
        baseline_cards: drawnCards,
        baseline_reading: reading,
      });
      setCreatedTopicId(res.topic.id);
      if (res.quota) setTopicQuota(res.quota);
      setTopicSaveMessage(t.topicSaved);

      // Automatically navigate to the created topic detail page
      await loadTopicDetail(res.topic.id);

      // Ensure scroll to top after page loads
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 200);
    } catch (err: any) {
      console.error("topic save failed", err);
      const reason = err?.data?.reason;
      if (reason === 'topic_quota_exhausted') {
        setTopicError(language === 'zh' ? '命题额度已用尽，请稍后重试或升级会员。' : 'Topic quota reached. Please retry or upgrade.');
        setUpgradeHint(language === 'zh' ? '命题额度已用尽，请升级会员或兑换会员码。' : 'Topic quota reached. Upgrade or redeem.');
        setShowPaywall(true);
      } else {
        setTopicError(language === 'zh' ? '保存失败，请稍后重试或升级会员。' : 'Save failed, retry or upgrade.');
      }
    } finally {
      setIsSavingTopic(false);
    }
  };

  const handleSaveImage = async () => {
    if (!readingRef.current) return;
    setIsSavingImage(true);
    setSaveError('');
    setShareError('');
    try {
      const dataUrl = await toPng(readingRef.current, {
        cacheBust: true,
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        useCors: true,
      });
      const link = document.createElement('a');
      link.download = 'tarot-reading.png';
      link.href = dataUrl;
      link.click();
      setShareError('');
    } catch (err) {
      console.error("save image failed", err);
      try {
        const dataUrl = await toPng(readingRef.current!, {
          cacheBust: true,
          backgroundColor: '#0f172a',
          pixelRatio: 1.5,
          useCors: true,
        });
        window.open(dataUrl, '_blank');
        setSaveError(language === 'zh' ? '已在新标签打开图片，请手动保存。' : 'Opened image in new tab for manual save.');
      } catch (e2) {
        setSaveError(language === 'zh' ? '保存图片失败，请重试。' : 'Failed to save image. Please try again.');
      }
    } finally {
      setIsSavingImage(false);
    }
  };

  // Update browser URL for client-side routing
  const updateUrl = (route: string) => {
    const langPrefix = language === 'zh' ? '/zh' : '';
    const newUrl = route === '/' ? langPrefix || '/' : `${langPrefix}/${route}`;
    window.history.pushState({}, '', newUrl);
  };

  const resetApp = () => {
    setPhase(AppPhase.INPUT);
    setQuestion('');
    setDrawnCards([]);
    setReading('');
    setDeck([...MAJOR_ARCANA]);
    setIsInteracting(false);
    setErrorMsg('');
    setCreatedTopicId(null);
    setTopicSaveMessage('');
    setTopicError('');
    setTopicEvents([]);
    setSelectedTopic(null);
    setEventName('');
    setEventCard(null);
    setEventReading('');
    setEventError('');
    setShareMode(false);
    setShareLink('');
    setShareError('');
    setShowTopicListPage(false);
    setShowTopicDetailPage(false);
    setShowPricingPage(false);
    // Clean up any pending reading from localStorage
    localStorage.removeItem('pendingReading');
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      if (typeof window !== 'undefined') {
        const { pathname, search, hash } = window.location;
        const strippedPath = pathname.startsWith('/zh') ? pathname.replace(/^\/zh/, '') || '/' : pathname || '/';
        const normalizedPath = strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`;
        const nextPath =
          next === 'zh'
            ? `/zh${normalizedPath === '/' ? '/' : normalizedPath}${search}${hash}`
            : `${normalizedPath}${search}${hash}`;
        window.history.replaceState({}, '', nextPath);
      }
      return next;
    });
  };

  const handleCookieConsentChange = (status: Exclude<CookieConsentStatus, null>) => {
    setCookieConsent(status);
    if (status === 'accepted') {
      initializeGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
    setShowCookieSettings(false);
  };

  const handleSuggestionClick = (text: string) => {
    setQuestion(text);
    setErrorMsg('');
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const openTopicsModal = async () => {
    setTopicModalOpen(true);
    setTopicError('');
    setTopicsLoading(true);
    try {
      const res = await listTopics();
      setTopicList(res.topics || []);
      if (res.quota) setTopicQuota(res.quota);
    } catch (err) {
      console.error("load topics failed", err);
      setTopicError(language === 'zh' ? '加载命题列表失败' : 'Failed to load topics');
    } finally {
      setTopicsLoading(false);
    }
  };

  const loadTopicDetail = async (id: string) => {
    setTopicsLoading(true);
    setTopicError('');
    try {
      const res = await getTopicDetail(id);
      setSelectedTopic(res.topic);
      setTopicEvents(res.events || []);
      if (res.quota) setTopicQuota(res.quota);
      if (res.event_usage) setTopicEventUsage(res.event_usage);
      setEventName('');
      setEventCard(null);
      setEventReading('');
      setEventError('');

      // Show detail page instead of modal
      setShowTopicListPage(false);
      setShowTopicDetailPage(true);

      // Scroll to top to show the event input form
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    } catch (err) {
      console.error("load topic detail failed", err);
      setTopicError(language === 'zh' ? '加载命题详情失败' : 'Failed to load topic detail');
    } finally {
      setTopicsLoading(false);
    }
  };

  const viewCreatedTopic = async () => {
    setTopicModalOpen(true);
    if (createdTopicId) {
      await loadTopicDetail(createdTopicId);
    }
  };

  const closeTopicModal = () => {
    setTopicModalOpen(false);
    setSelectedTopic(null);
    setTopicEvents([]);
    setEventName('');
    setEventCard(null);
    setEventReading('');
    setEventError('');
  };

  const handleDeleteTopic = async (id: string) => {
    const confirmMsg = language === 'zh'
      ? '确定要删除这个命题吗？删除后将无法恢复。'
      : 'Are you sure you want to delete this topic? This action cannot be undone.';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setTopicsLoading(true);
    setTopicError('');
    try {
      const res = await deleteTopic(id);
      if (res.quota) setTopicQuota(res.quota);

      // Refresh topic list
      const listRes = await listTopics();
      setTopicList(listRes.topics || []);
      if (listRes.quota) setTopicQuota(listRes.quota);
    } catch (err) {
      console.error("delete topic failed", err);
      setTopicError(language === 'zh' ? '删除命题失败' : 'Failed to delete topic');
    } finally {
      setTopicsLoading(false);
    }
  };

const buildEventQuestion = (card: DrawnCard, topic?: Topic, events: TopicEvent[] = []) => {
    const isZh = language === 'zh';
    const baselineCards = topic?.baseline_cards || [];
    const baselineStr = baselineCards.length
      ? baselineCards.map(c => formatCardLabel(c, language)).join(isZh ? "，" : ", ")
      : (isZh ? "暂无" : "None");
    const baselineReading = topic?.baseline_reading ? topic.baseline_reading.slice(0, 800) : '';
    const historyStr = events.length
      ? events.map(ev => {
          const dateStr = ev.created_at ? new Date(ev.created_at).toLocaleDateString() : '';
          const cardStr = ev.cards?.map(c => formatCardLabel(c as DrawnCard, language)).join(isZh ? "，" : ", ");
          return isZh
            ? `${dateStr}、${ev.name}${cardStr ? `、${cardStr}` : ""}`
            : `${dateStr}: ${ev.name}${cardStr ? ` | ${cardStr}` : ""}`;
        }).join(isZh ? "；" : "; ")
      : (isZh ? "暂无历史事件" : "No past events");

    const currentCardStr = formatCardLabel(card, language);

    if (isZh) {
      return `你是一位专业的塔罗师AI助手，精通78张塔罗牌的象征意义、正逆位解读、牌阵应用和灵性指导。你以温和、中立且富有洞察力的方式为用户提供塔罗解读服务，注重启发而非预言，强调个人能动性和内在成长。
你将按照下面的结构进行解读：
**【单牌解读结构】**
1. 🃏 **卡片展示**：[牌名 - 正/逆位]
2. 🔑 **核心象征**：简要说明该牌的基本含义
3. 💡 **情境解读**：结合用户问题分析此牌在当前情境下的意义
**【多牌综合解读】**
分析牌间关系、能量流动和整体故事线，结合用户给你的问题指出可能的：
- ⚖️ **挑战与机遇**
- 🌍 **内在与外在因素**
- 🚀 **行动建议方向**
**核心价值观：**
"爱情真正的价值，从来不是让你遇见对的人，而是让你照见真的自己。所有关系的困境，都是内心投射的倒影。破情关者，破的是对'被爱'的执迷。见本性者，见的是本自具足的清明。"
请在涉及情感问题时，引用或基于上述哲学观点进行深层解读。
请使用Markdown格式输出，保持排版清晰优雅。
我的问题是：${topic?.title || question}
我对这个抽牌抽的结果：${baselineStr}
我对这个问题还进行事件补充：${historyStr}
当前事件名称：${eventName}
本次事件抽到的牌：${currentCardStr}`;
    }
    return `You are a professional Tarot AI. Use the following structure:
1) 🃏 Card display [name - Upright/Reversed]
2) 🔑 Core symbolism
3) 💡 Contextual interpretation for the user's situation
Then provide a synthesis: Challenges & opportunities; Internal vs external factors; Actionable direction.
Core philosophy: "The true value of love is not meeting the right person, but seeing your true self..."
Please use Markdown formatting.
My topic: ${topic?.title || question}
Baseline cards: ${baselineStr}
Baseline reading summary: ${baselineReading || "None"}
Event history: ${historyStr}
Current event: ${eventName}
Card drawn: ${currentCardStr}`;
  };

  const handleDrawEventCard = () => {
    if (!selectedTopic) {
      setEventError(language === 'zh' ? '请选择命题后再创建事件。' : 'Select a topic first.');
      return;
    }
    if (eventCard) {
      setEventError(language === 'zh' ? '已抽取本次事件的牌，如需更换请重置事件。' : 'Card already drawn for this event. Reset to draw again.');
      return;
    }
    if (!eventCanDraw) {
      setEventError(language === 'zh' ? '请先洗牌，再抽牌。' : 'Please shuffle before drawing.');
      return;
    }
    const index = Math.floor(eventDeck.length / 2 + Math.random() * 5 - 2);
    const picked = eventDeck[Math.max(0, Math.min(eventDeck.length - 1, index))];
    const drawn: DrawnCard = {
      ...picked,
      isReversed: Math.random() > 0.5,
      position: 0,
    };
    setEventCard(drawn);
    setEventReading('');
    setEventError('');
    setEventCanDraw(false);
  };

  const handleGenerateEvent = async () => {
    if (!selectedTopic) {
      setEventError(language === 'zh' ? '请选择命题后再创建事件。' : 'Select a topic first.');
      return;
    }
    if (!eventName.trim()) {
      setEventError(language === 'zh' ? '请输入事件名称。' : 'Please enter an event name.');
      return;
    }
    if (!eventCard) {
      setEventError(language === 'zh' ? '请先抽一张牌。' : 'Please draw a card first.');
      return;
    }
    // Pre-check downgrade restriction
    console.log('[Event] Quota check:', {
      plan: topicQuota?.plan,
      downgrade_limited_topic_id: topicQuota?.downgrade_limited_topic_id,
      selectedTopicId: selectedTopic.id,
      event_quota_per_topic: topicQuota?.event_quota_per_topic,
      topicEventUsage
    });

    if (topicQuota?.plan === 'free' && topicQuota?.downgrade_limited_topic_id && topicQuota.downgrade_limited_topic_id !== selectedTopic.id) {
      setEventError(language === 'zh' ? '降级后仅可在最近的命题继续添加事件，请升级会员。' : 'After downgrade, only the latest topic can receive events. Please upgrade.');
      setShowPaywall(true);
      return;
    }
    // Pre-check event quota if known
    if (topicEventUsage && topicEventUsage.remaining === 0) {
      setEventError(language === 'zh' ? '该命题事件次数已用完，请升级会员。' : 'Event quota for this topic is used up.');
      setShowPaywall(true);
      return;
    }
    if (!eventCard) {
      setEventError(language === 'zh' ? '请先抽牌。' : 'Draw a card first.');
      return;
    }
    setEventError('');
    setEventReading('');
    setIsEventLoading(true);
    setIsEventSaving(false);
    try {
      // Prepare variables for prompt template
      const isZh = language === 'zh';
      const baselineCards = selectedTopic?.baseline_cards || [];
      const baselineCardsStr = baselineCards.length
        ? baselineCards.map(c => formatCardLabel(c, language)).join(isZh ? "，" : ", ")
        : (isZh ? "暂无" : "None");

      const historyStr = topicEvents.length
        ? topicEvents.map(ev => {
            const dateStr = ev.created_at ? new Date(ev.created_at).toLocaleDateString() : '';
            const cardStr = ev.cards?.map(c => formatCardLabel(c as DrawnCard, language)).join(isZh ? "，" : ", ");
            return isZh
              ? `${dateStr}、${ev.name}${cardStr ? `、${cardStr}` : ""}`
              : `${dateStr}: ${ev.name}${cardStr ? ` | ${cardStr}` : ""}`;
          }).join(isZh ? "；" : "; ")
        : (isZh ? "暂无历史事件" : "No past events");

      const currentCardStr = formatCardLabel(eventCard, language);

      // Use prompt_case_zh or prompt_case_en
      const promptKey = isZh ? 'prompt_case_zh' : 'prompt_case_en';
      const variables = {
        question: selectedTopic?.title || question,
        baseline_cards: baselineCardsStr,
        baseline_reading: selectedTopic?.baseline_reading || '',
        history: historyStr,
        event_name: eventName.trim(),
        current_card: currentCardStr
      };

      console.log('[Event Reading] Sending to API:', {
        promptKey,
        variables: {
          question: variables.question,
          baseline_cards: variables.baseline_cards.substring(0, 50) + '...',
          baseline_reading: variables.baseline_reading.substring(0, 50) + '...',
          history: variables.history.substring(0, 50) + '...',
          event_name: variables.event_name,
          current_card: variables.current_card
        }
      });

      const readingText = await getTarotReading(
        selectedTopic?.title || question,
        [eventCard],
        language,
        promptKey,
        variables
      );
      // If API returns generic reading, still store
      setEventReading(readingText);
      setIsEventSaving(true);
      const saveRes = await addTopicEvent(selectedTopic.id, {
        name: eventName.trim(),
        cards: [eventCard],
        reading: readingText,
      });

      if (saveRes.event) {
        setTopicEvents(prev => [...prev, saveRes.event]);
      }
      if (saveRes.event_usage) setTopicEventUsage(saveRes.event_usage);
      if (saveRes.quota) setTopicQuota(saveRes.quota);
      setEventName('');
      setEventCard(null);
      setEventReading('');
      setEventError('');
      setEventCanDraw(false);
      setEventDeck([...MAJOR_ARCANA]);
    } catch (err: any) {
      console.error("create event failed", err);
      const reason = err?.data?.reason;
      if (reason === 'event_quota_exhausted') {
        setEventError(language === 'zh' ? '该命题事件次数已用完，请升级会员。' : 'Event quota reached for this topic.');
        setUpgradeHint(language === 'zh' ? '升级会员可获得更高事件次数。' : 'Upgrade to unlock more event requests.');
        setShowPaywall(true);
      } else if (reason === 'downgraded_topic_locked') {
        setEventError(language === 'zh' ? '当前免费模式仅可对最近命题创建事件。' : 'Only the latest topic can receive events in free mode.');
      } else {
        setEventError(language === 'zh' ? '创建事件失败，请稍后重试。' : 'Failed to create event. Please try again.');
      }
    } finally {
      setIsEventLoading(false);
      setIsEventSaving(false);
    }
  };

  const resetEventForm = () => {
    setEventName('');
    setEventCard(null);
    setEventReading('');
    setEventError('');
    setEventCanDraw(false);
    setIsEventShuffling(false);
    setEventDeck([...MAJOR_ARCANA]);
  };

  const startEventShuffle = () => {
    if (isEventLoading || isEventSaving) return;
    setEventCard(null);
    setEventReading('');
    setEventError('');
    setEventCanDraw(false);
    setIsEventShuffling(true);
    setEventDeck([...MAJOR_ARCANA]);
    if (eventShuffleInterval.current) clearInterval(eventShuffleInterval.current);
    if (eventShuffleTimeout.current) clearTimeout(eventShuffleTimeout.current);
    eventShuffleInterval.current = setInterval(() => {
      setEventDeck(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 120);
    eventShuffleTimeout.current = setTimeout(() => {
      if (eventShuffleInterval.current) clearInterval(eventShuffleInterval.current);
      setIsEventShuffling(false);
      setEventCanDraw(true);
    }, 1500);
  };

  return (
    <div
      className="min-h-full flex flex-col items-center overflow-x-hidden font-sans relative"
      style={{ backgroundColor: '#140F2A' }}
    >
      <StarryBackground />

      <Navbar
        onLoginClick={loginWithGoogle}
        onLogoutClick={handleLogout}
        onLanguageToggle={toggleLanguage}
        onQuickReadingClick={() => {
          setShowTopicListPage(false);
          setShowBlogPage(false);
          setShowPricingPage(false);
          updateUrl('/');
          resetApp();
        }}
        onTopicsClick={async () => {
          setShowTopicListPage(true);
          setShowBlogPage(false);
          setShowPricingPage(false);
          updateUrl('bigtopic');
          setTopicError('');
          setTopicsLoading(true);
          try {
            const res = await listTopics();
            setTopicList(res.topics || []);
            if (res.quota) setTopicQuota(res.quota);
          } catch (err) {
            console.error("load topics failed", err);
            setTopicError(language === 'zh' ? '加载命题列表失败' : 'Failed to load topics');
          } finally {
            setTopicsLoading(false);
          }
        }}
        onBlogClick={() => {
          setShowBlogPage(true);
          setShowTopicListPage(false);
          setShowTopicDetailPage(false);
          setShowPrivacyPage(false);
          setShowTermsPage(false);
          setShowPricingPage(false);
          setSelectedBlogId(null);
          updateUrl('blog');
        }}
        onPricingClick={() => {
          setShowPricingPage(true);
          setShowBlogPage(false);
          setShowTopicListPage(false);
          setShowTopicDetailPage(false);
          setShowPrivacyPage(false);
          setShowTermsPage(false);
          setSelectedBlogId(null);
          updateUrl('pricing');
        }}
        language={language}
        user={user}
        isAuthenticated={!!user}
        plan={plan}
        topicQuota={topicQuota}
        onUpgradeClick={() => setShowPaywall(true)}
      />

      {/* Expiry banner */}
      {topicQuota?.plan === 'member' && topicQuota.expires_at && (() => {
        const days = Math.ceil((new Date(topicQuota.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days <= 3 && days >= 0;
      })() && (
        <div className="w-full bg-amber-500/20 border-b border-amber-400/50 text-amber-100 text-sm px-4 py-2 text-center">
          {language === 'zh'
            ? `会员将在 ${Math.ceil((new Date(topicQuota.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天后到期，为不影响使用请尽快续费。`
            : `Membership expires in ${Math.ceil((new Date(topicQuota.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} day(s). Renew soon to avoid limits.`}
        </div>
      )}

      <main className="relative z-10 w-full flex-1 flex flex-col items-center min-h-0">
        {upgradeHint && (
          <div className="w-full max-w-3xl mb-4 mx-4 bg-amber-500/15 border border-amber-400/40 text-amber-100 text-sm px-4 py-3 rounded-lg">
            {upgradeHint}
          </div>
        )}

        {/* Shared Reading Page */}
        {showSharedReadingPage && sharedReadingId && (
          <div className="px-4 py-4 w-full">
            <SharedReadingPage
              shareId={sharedReadingId}
              language={language}
            />
          </div>
        )}

        {/* Privacy Policy Page */}
        {showPrivacyPage && (
          <div className="px-4 py-4 w-full">
            <PrivacyPolicyPage language={language} />
          </div>
        )}

        {/* Terms of Service Page */}
        {showTermsPage && (
          <div className="px-4 py-4 w-full">
            <TermsOfServicePage language={language} />
          </div>
        )}

        {/* Pricing Page */}
        {showPricingPage && !showTopicListPage && !showTopicDetailPage && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && (
          <PricingPage
            language={language}
            onStartReading={() => {
              setShowPricingPage(false);
              resetApp();
            }}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

        {/* Blog Page */}
        {showBlogPage && !selectedBlogId && (
          <BlogListPage
            language={language}
            onStartReading={() => {
              setShowBlogPage(false);
              resetApp();
            }}
            onStartBigTopic={() => {
              setShowBlogPage(false);
              setShowTopicListPage(true);
            }}
            onBlogClick={(blogId) => {
              setSelectedBlogId(blogId);
            }}
          />
        )}

        {/* Blog Detail Page */}
        {showBlogPage && selectedBlogId && (
          <BlogDetailPage
            language={language}
            blogId={selectedBlogId}
            onBack={() => {
              setSelectedBlogId(null);
            }}
            onStartReading={() => {
              setShowBlogPage(false);
              setSelectedBlogId(null);
              resetApp();
            }}
            onStartBigTopic={() => {
              setShowBlogPage(false);
              setSelectedBlogId(null);
              setShowTopicListPage(true);
            }}
          />
        )}

        {/* Topic List Page */}
        {showTopicListPage && !showTopicDetailPage && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && (
          <div className="px-4 py-4 w-full">
            <TopicListPage
              topics={topicList}
              language={language}
              quota={topicQuota}
              onCreateNewTopic={() => {
                setShowTopicListPage(false);
                resetApp();
              }}
              onTopicClick={(topicId) => {
                loadTopicDetail(topicId);
              }}
              onDeleteTopic={handleDeleteTopic}
            />
          </div>
        )}

        {/* Topic Detail Page */}
        {showTopicDetailPage && selectedTopic && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && (
          <div className="px-4 py-4 w-full">
            <TopicDetailPage
              topic={selectedTopic}
              events={topicEvents}
              language={language}
              plan={plan}
              eventUsage={topicEventUsage}
              onBack={() => {
                setShowTopicDetailPage(false);
                setShowTopicListPage(true);
                setSelectedTopic(null);
                setTopicEvents([]);
              }}
              onEventAdded={(newEvent) => {
                setTopicEvents(prev => [...prev, newEvent]);
              }}
              onUpgrade={() => setShowPaywall(true)}
            />
          </div>
        )}

        {/* Phase: INPUT */}
        {phase === AppPhase.INPUT && !showTopicListPage && !showTopicDetailPage && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && !showPricingPage && (
          <HomePage
            language={language}
            question={question}
            onQuestionSubmit={(q) => {
              setQuestion(q);
              handleStart();
            }}
            onQuickQuestionClick={(q) => {
              setQuestion(q);
              // Don't auto-start, just fill the input
            }}
            onBlogClick={(blogId) => {
              setSelectedBlogId(blogId);
              setShowBlogPage(true);
            }}
          />
        )}

        {/* Phase: SHUFFLING */}
        {phase === AppPhase.SHUFFLING && !showTopicListPage && !showTopicDetailPage && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && !showPricingPage && (
          <div className="flex flex-col items-center justify-center flex-1 animate-fade-in w-full">
             <div className="relative w-40 h-64">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 rounded-xl bg-slate-800 border-2 border-purple-900/80 shadow-2xl"
                    style={{
                      transform: `translate(${Math.sin(Date.now() / 80 + i) * 20}px, ${Math.cos(Date.now() / 80 + i) * 10}px) rotate(${Math.sin(Date.now() / 150 + i) * 12}deg)`,
                      transition: 'transform 0.05s linear',
                      zIndex: i
                    }}
                  >
                     <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/40 via-slate-900 to-black flex items-center justify-center rounded-lg overflow-hidden">
                        <div className="absolute inset-0 border border-white/5 rounded-lg"></div>
                        <span className="text-purple-500/20 text-5xl font-mystic">☾</span>
                     </div>
                  </div>
                ))}
             </div>
             <p className="mt-16 text-amber-200/90 tracking-[0.3em] text-lg animate-pulse font-mystic drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
               {t.shuffling}
             </p>
          </div>
        )}

        {/* Phase: DRAWING */}
        {phase === AppPhase.DRAWING && !showTopicListPage && !showTopicDetailPage && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && !showPricingPage && (
          <div className="w-full h-full flex flex-col animate-fade-in relative pt-20 md:pt-24">
            <div className="text-center z-20 mb-6 md:mb-8">
               <h2 className="text-xl text-purple-100 mb-1 tracking-widest font-mystic">{t.drawTitle}</h2>
               <div className="flex justify-center gap-1">
                 {[0, 1, 2].map(i => (
                   <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${drawnCards.length > i ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                 ))}
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg mx-auto mb-6 z-20 px-2">
              {[0, 1, 2].map((slot) => (
                <div key={slot} className="flex flex-col">
                  <div className="aspect-[2/3.5] border border-purple-500/20 rounded-lg flex items-center justify-center bg-slate-900/40 backdrop-blur-sm relative transition-all duration-500 shadow-inner">
                    {drawnCards[slot] ? (
                       <div className="animate-fade-in w-full h-full p-1">
                          <Card card={drawnCards[slot]} isRevealed={false} className="w-full h-full" language={language} />
                       </div>
                    ) : (
                      <div className="text-center opacity-30">
                         <div className="text-xl mb-1 font-mystic text-purple-200">{slot + 1}</div>
                         <div className="text-[8px] uppercase tracking-widest font-cinzel">
                          {language === 'zh' ? (['过去', '现在', '未来'][slot]) : (['Past', 'Present', 'Future'][slot])}
                         </div>
                      </div>
                    )}
                    {drawnCards.length === slot && !isInteracting && (
                      <div className="absolute inset-0 border border-amber-500/50 rounded-lg animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)] pointer-events-none"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={`relative flex-1 w-full min-h-[280px] flex justify-center items-end perspective-1000 overflow-hidden ${isInteracting ? 'pointer-events-none grayscale-[0.5]' : ''} transition-all duration-500`}>
               <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-slate-950 via-purple-950/30 to-transparent pointer-events-none"></div>

               <div className="relative w-full max-w-md h-80 mb-6 md:mb-8">
                 {deck.map((card, index) => {
                    const total = deck.length;
                    const center = (total - 1) / 2;
                    const offset = index - center;
                    
                    const degreePerCard = 4; 
                    const rotation = offset * degreePerCard;
                    const translateY = Math.abs(offset) * 2 + (Math.abs(offset) > 5 ? Math.abs(offset) : 0); 
                    const translateX = offset * 12;

                    return (
                      <div 
                        key={card.id}
                        onClick={() => handleCardDraw(index)}
                        className="absolute bottom-0 left-1/2 cursor-pointer transition-all duration-300 group touch-manipulation"
                        style={{
                          width: '80px',
                          height: '128px',
                          marginLeft: '-40px',
                          transformOrigin: '50% 120%', 
                          transform: `translateX(${translateX}px) rotate(${rotation}deg) translateY(${translateY}px)`,
                          zIndex: index + 10,
                        }}
                      >
                        <div className="w-full h-full rounded-md bg-slate-800 border border-purple-500/40 shadow-xl group-hover:-translate-y-4 transition-transform relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 to-black"></div>
                           <div className="absolute inset-1 border border-white/5 rounded-sm flex items-center justify-center">
                              <span className="text-purple-300/20 text-xl font-mystic">☾</span>
                           </div>
                        </div>
                      </div>
                    );
                 })}
               </div>
               <p className="absolute bottom-4 text-xs text-slate-500 tracking-widest font-cinzel opacity-60">SCROLL OR TAP TO DRAW</p>
            </div>
          </div>
        )}

        {/* Phase: REVEAL & ANALYSIS */}
        {(phase === AppPhase.REVEAL || phase === AppPhase.ANALYSIS) && !showTopicListPage && !showTopicDetailPage && !showSharedReadingPage && !showPrivacyPage && !showTermsPage && !showBlogPage && !showPricingPage && (
          <ReadingResultPage
            question={question}
            cards={drawnCards}
            reading={reading}
            language={language}
            isLoading={isReadingLoading}
            onSaveTopic={handleSaveTopic}
            onTryAgain={resetApp}
            isSaving={isSavingTopic}
            topicCreated={!!createdTopicId}
            user={user}
            onLogin={loginWithGoogle}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenCookieSettings={() => setShowCookieSettings(true)}
      />

      <CookieConsentBanner
        language={language}
        forceShow={showCookieSettings}
        onConsentChange={handleCookieConsentChange}
        onClose={() => setShowCookieSettings(false)}
      />

      {(phase === AppPhase.INPUT || phase === AppPhase.ANALYSIS) && (
         <div className="fixed bottom-4 left-0 w-full text-center pointer-events-none z-0">
             <div className="text-[10px] text-slate-700 uppercase tracking-widest font-cinzel opacity-50">Mystic Tarot v1.1</div>
         </div>
      )}

      {/* Member Daily Limit Modal - Simple notification */}
      {showMemberLimitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="text-center space-y-4">
              <div className="text-5xl">🌙</div>
              <h3 className="text-xl text-amber-200 font-semibold">
                {language === 'zh' ? '今日占卜额度已用完' : 'Daily Reading Limit Reached'}
              </h3>
              <p className="text-slate-300">
                {language === 'zh'
                  ? '今天的占卜次数已达上限（50次），请明天再来吧。'
                  : 'You have reached today\'s limit (50 readings). Please come back tomorrow.'}
              </p>
            </div>
            <button
              onClick={() => setShowMemberLimitModal(false)}
              className="w-full px-4 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold transition-colors"
            >
              {language === 'zh' ? '知道了' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {/* Paywall Modal - For free users to upgrade/redeem */}
      {(showRedeem || showPaywall) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            className="flex flex-col items-start gap-[24px]"
            style={{
              width: '526px',
              padding: '32px 0px',
              background: 'rgba(40, 36, 70, 0.8)',
              border: '1px solid #443E71',
              borderRadius: '16px',
            }}
          >
            {/* Content Container */}
            <div className="flex flex-col justify-center items-center gap-[16px] w-full">
              {/* Title */}
              <h2
                className="w-full h-[29px] flex items-center justify-center text-center"
                style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '29px',
                  color: '#E2DBFF',
                }}
              >
                {language === 'zh' ? '阁下今日的免费额度已用完' : 'Daily Free Quota Exhausted'}
              </h2>

              {/* Description */}
              <p
                className="flex items-center justify-center text-center"
                style={{
                  width: '446px',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#8F88AB',
                }}
              >
                {language === 'zh'
                  ? '升级为 Pro 用户即刻享受每日 30 次免费占卜次数，500 个命题事件上限'
                  : 'Upgrade to Pro for 30 daily readings and 500 events per topic'}
              </p>

              {/* Comparison Card */}
              <div
                className="flex flex-col items-center gap-[16px]"
                style={{
                  width: '410px',
                  padding: '16px 0px',
                  background: '#3C3665',
                  borderRadius: '16px',
                }}
              >
                <div className="flex flex-row justify-center items-center gap-[16px] w-full" style={{ padding: '8px 0px' }}>
                  {/* Free User */}
                  <div
                    className="flex flex-col justify-center items-start gap-[10px] flex-1"
                    style={{ padding: '0px 0px 0px 32px' }}
                  >
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#E2DBFF',
                    }}>
                      {language === 'zh' ? '免费用户' : 'Free User'}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#8F88AB',
                    }}>
                      {language === 'zh' ? '每日占卜次数：1' : 'Daily readings: 1'}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#8F88AB',
                    }}>
                      {language === 'zh' ? '每命题事件上限 3' : 'Events per topic: 3'}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 700,
                      fontSize: '32px',
                      lineHeight: '38px',
                      color: '#E2DBFF',
                    }}>
                      0 $
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{
                    width: '1px',
                    height: '105px',
                    background: '#443E71',
                  }} />

                  {/* Pro User */}
                  <div
                    className="flex flex-col justify-center items-start gap-[10px] flex-1"
                    style={{ padding: '0px 0px 0px 32px' }}
                  >
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#FFA84A',
                    }}>
                      {language === 'zh' ? 'Pro 用户' : 'Pro User'}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#8F88AB',
                    }}>
                      {language === 'zh' ? '每日占卜次数：30' : 'Daily readings: 30'}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#8F88AB',
                    }}>
                      {language === 'zh' ? '每命题事件上限 500' : 'Events per topic: 500'}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 700,
                      fontSize: '32px',
                      lineHeight: '38px',
                      color: '#DD8424',
                    }}>
                      9.9 $ / month
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row justify-center items-center gap-[20px] w-full">
              {/* Upgrade Button */}
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="flex flex-row justify-center items-center"
                style={{
                  minWidth: '160px',
                  height: '40px',
                  padding: '16px 32px',
                  background: '#DD8424',
                  borderRadius: '100px',
                  opacity: isUpgrading ? 0.5 : 1,
                  cursor: isUpgrading ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: '#000000',
                  opacity: 0.8,
                }}>
                  {isUpgrading
                    ? (language === 'zh' ? '处理中...' : 'Processing...')
                    : (language === 'zh' ? '升级' : 'Upgrade')}
                </span>
              </button>

              {/* Redeem Code Button */}
              <button
                onClick={() => setShowRedeem(true)}
                className="flex flex-row justify-center items-center"
                style={{
                  width: '130px',
                  height: '40px',
                  padding: '7px 20px',
                  background: 'rgba(189, 161, 255, 0.2)',
                  border: '1px solid rgba(189, 161, 255, 0.2)',
                  borderRadius: '100px',
                }}
              >
                <span style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: '#BDA1FF',
                }}>
                  {language === 'zh' ? '使用兑换码' : 'Use Code'}
                </span>
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => { setShowRedeem(false); setShowPaywall(false); }}
                className="flex flex-row justify-center items-center"
                style={{
                  width: '130px',
                  height: '40px',
                  padding: '7px 20px',
                  background: 'rgba(189, 161, 255, 0.2)',
                  border: '1px solid rgba(189, 161, 255, 0.2)',
                  borderRadius: '100px',
                }}
              >
                <span style={{
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: '#BDA1FF',
                }}>
                  {language === 'zh' ? '取消' : 'Cancel'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Code Modal */}
      {showRedeem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
          <div
            className="flex flex-col items-center gap-[24px]"
            style={{
              width: '400px',
              padding: '32px',
              background: 'rgba(40, 36, 70, 0.95)',
              border: '1px solid #443E71',
              borderRadius: '16px',
            }}
          >
            <h3 style={{
              fontFamily: "'Noto Serif SC', serif",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '24px',
              color: '#E2DBFF',
            }}>
              {language === 'zh' ? '输入兑换码' : 'Enter Redemption Code'}
            </h3>

            <input
              type="text"
              className="w-full px-4 py-3 text-white focus:outline-none"
              style={{
                background: '#3C3665',
                border: '1px solid #443E71',
                borderRadius: '8px',
                fontFamily: "'Noto Serif SC', serif",
                fontSize: '14px',
              }}
              placeholder={language === 'zh' ? '请输入兑换码' : 'Enter code'}
              value={redeemCodeInput}
              onChange={(e) => setRedeemCodeInput(e.target.value)}
            />

            {redeemFeedback && (
              <div style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: '14px',
                color: redeemFeedback.includes('成功') || redeemFeedback.includes('success') ? '#4ADE80' : '#FFA84A',
              }}>
                {redeemFeedback}
              </div>
            )}

            <div className="flex gap-[16px] w-full">
              <button
                onClick={() => { setShowRedeem(false); setRedeemCodeInput(''); setRedeemFeedback(''); }}
                className="flex-1 flex justify-center items-center"
                style={{
                  height: '40px',
                  padding: '7px 20px',
                  background: 'rgba(189, 161, 255, 0.2)',
                  border: '1px solid rgba(189, 161, 255, 0.2)',
                  borderRadius: '100px',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#BDA1FF',
                }}
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleRedeem}
                className="flex-1 flex justify-center items-center"
                style={{
                  height: '40px',
                  padding: '16px 64px',
                  background: '#DD8424',
                  borderRadius: '100px',
                  fontFamily: "'Noto Serif SC', serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#000000',
                  opacity: 0.8,
                }}
              >
                {language === 'zh' ? '兑换' : 'Redeem'}
              </button>
            </div>
          </div>
        </div>
      )}

      {topicModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-amber-200 font-semibold">{t.topicsList}</h3>
                {topicQuota && (
                  <div className="text-xs text-slate-400 mt-1">
                    {language === 'zh'
                      ? `${t.topicsQuota}：${topicQuota.topic_quota_remaining}/${topicQuota.topic_quota_total}`
                      : `${t.topicsQuota}: ${topicQuota.topic_quota_remaining}/${topicQuota.topic_quota_total}`}
                    {topicQuota.expires_at && (
                      <span className="ml-2 text-amber-300/80">
                        {language === 'zh' ? `到期：${new Date(topicQuota.expires_at).toLocaleDateString()}` : `Expires: ${new Date(topicQuota.expires_at).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {selectedTopic && (
                  <button
                    onClick={() => {
                      setSelectedTopic(null);
                      setTopicEvents([]);
                      setTopicEventUsage(null);
                    }}
                    className="px-3 py-2 text-xs bg-slate-800 text-slate-200 border border-white/10 rounded-md"
                  >
                    {language === 'zh' ? '返回列表' : 'Back'}
                  </button>
                )}
                <button
                  onClick={closeTopicModal}
                  className="px-3 py-2 text-xs bg-slate-800 text-slate-200 border border-white/10 rounded-md"
                >
                  {language === 'zh' ? '关闭' : 'Close'}
                </button>
              </div>
            </div>

            {topicError && <div className="text-red-400 text-sm">{topicError}</div>}

            {topicsLoading && (
              <div className="text-slate-400 text-sm">{language === 'zh' ? '加载中...' : 'Loading...'}</div>
            )}

            {!topicsLoading && !selectedTopic && (
              <>
                {topicList.length === 0 ? (
                  <div className="text-slate-500 text-sm">{t.topicsEmpty}</div>
                ) : (
                  <div className="space-y-2">
                    {topicList.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => loadTopicDetail(topic.id)}
                        className="w-full text-left bg-slate-800/60 border border-white/5 hover:border-amber-400/30 rounded-xl px-4 py-3 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-slate-100">{topic.title}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(topic.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {typeof (topic as any).event_count !== 'undefined' && (
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span>
                              {language === 'zh'
                                ? `事件数：${(topic as any).event_count}`
                                : `Events: ${(topic as any).event_count}`}
                            </span>
                            {topic.event_remaining != null ? (
                              <span className="text-[11px] text-amber-200">
                                {language === 'zh'
                                  ? `剩余 ${topic.event_remaining}`
                                  : `Remaining ${topic.event_remaining}`}
                              </span>
                            ) : topicQuota?.event_quota_per_topic != null ? (
                              <span className="text-[11px] text-amber-200">
                                {language === 'zh'
                                  ? `剩余 ${Math.max(topicQuota.event_quota_per_topic - Number((topic as any).event_count || 0), 0)}`
                                  : `Remaining ${Math.max(topicQuota.event_quota_per_topic - Number((topic as any).event_count || 0), 0)}`}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {!topicsLoading && selectedTopic && (
              <div className="space-y-3">
                <div className="text-xl text-amber-200">{selectedTopic.title}</div>
                {topicEventUsage && (
                  <div className="text-xs text-slate-400">
                    {language === 'zh'
                      ? `事件已用：${topicEventUsage.used}，剩余：${topicEventUsage.remaining ?? '∞'}`
                      : `Events used: ${topicEventUsage.used}, Remaining: ${topicEventUsage.remaining ?? '∞'}`}
                  </div>
                )}
                {selectedTopic.baseline_cards && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedTopic.baseline_cards.map((c) => (
                      <div key={c.id} className="w-20">
                        <Card card={c} isRevealed language={language} />
                      </div>
                    ))}
                  </div>
                )}
                {selectedTopic.baseline_reading && (
                  <div className="bg-slate-800/60 border border-white/5 rounded-xl p-4 text-sm text-slate-200 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {selectedTopic.baseline_reading}
                    </ReactMarkdown>
                  </div>
                )}
                <div className="space-y-2 border border-white/5 rounded-xl p-4 bg-slate-800/40">
                  <div className="text-sm text-slate-200 font-semibold">
                    {language === 'zh' ? '创建新事件（洗牌-抽牌-解读）' : 'Create Event (shuffle-draw-read)'}
                  </div>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder={language === 'zh' ? '事件名称，如“复盘一次争吵”' : 'Event name e.g. “Review of an argument”'}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={startEventShuffle}
                      disabled={isEventLoading || isEventSaving}
                      className="px-4 py-2 text-xs bg-slate-800 text-slate-200 rounded-lg border border-white/10 disabled:opacity-50"
                    >
                      {isEventShuffling ? (language === 'zh' ? '洗牌中...' : 'Shuffling...') : (language === 'zh' ? '洗牌' : 'Shuffle')}
                    </button>
                    <button
                      onClick={handleDrawEventCard}
                      disabled={isEventLoading || isEventSaving || !!eventCard}
                      className="px-4 py-2 text-xs bg-slate-800 text-slate-200 rounded-lg border border-white/10 disabled:opacity-50"
                    >
                      {language === 'zh' ? '抽一张牌' : 'Draw a card'}
                    </button>
                    <button
                      onClick={handleGenerateEvent}
                      disabled={isEventLoading || isEventSaving}
                      className="px-4 py-2 text-xs bg-amber-500 text-slate-900 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {isEventSaving
                        ? (language === 'zh' ? '保存中...' : 'Saving...')
                        : isEventLoading
                        ? (language === 'zh' ? '占卜中...' : 'Reading...')
                        : (language === 'zh' ? '生成解读并保存' : 'Generate & Save')}
                    </button>
                    <button
                      onClick={resetEventForm}
                      disabled={isEventLoading || isEventSaving}
                      className="px-3 py-2 text-xs bg-slate-900 text-slate-200 rounded-lg border border-white/10 disabled:opacity-50"
                    >
                      {language === 'zh' ? '重置事件' : 'Reset Event'}
                    </button>
                    {eventError && <div className="text-xs text-red-400">{eventError}</div>}
                  </div>
                  <div className="relative w-full h-40 mt-2">
                    <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                      <div className="relative w-full max-w-md h-36">
                        {eventDeck.slice(0, 18).map((card, index) => {
                          const total = Math.min(eventDeck.length, 18);
                          const center = (total - 1) / 2;
                          const offset = index - center;
                          const degreePerCard = 3;
                          const rotation = offset * degreePerCard;
                          const translateY = Math.abs(offset) * 1.5;
                          const translateX = offset * 8;
                          return (
                            <div
                              key={`${card.id}-${index}`}
                              className={`absolute bottom-0 left-1/2 transition-all duration-300 ${eventCanDraw ? 'hover:-translate-y-2' : ''}`}
                              style={{
                                width: '60px',
                                height: '96px',
                                marginLeft: '-30px',
                                transformOrigin: '50% 120%',
                                transform: `translateX(${translateX}px) rotate(${rotation}deg) translateY(${translateY}px)`,
                                zIndex: index,
                                opacity: isEventShuffling ? 0.7 : 1,
                              }}
                            >
                              <div className="w-full h-full rounded-md bg-slate-800 border border-purple-500/40 shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 to-black"></div>
                                <div className="absolute inset-1 border border-white/5 rounded-sm flex items-center justify-center">
                                  <span className="text-purple-300/20 text-xl font-mystic">☾</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {eventCard && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce-slow">
                            <div className="w-24">
                              <Card card={eventCard} isRevealed language={language} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {eventCard && eventReading && (
                    <div className="flex gap-4 items-start">
                      <div className="w-20">
                        <Card card={eventCard} isRevealed language={language} />
                      </div>
                      <div className="flex-1 text-sm text-slate-200 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {eventReading}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-slate-300 flex items-center justify-between">
                    <span>{language === 'zh' ? '事件记录' : 'Events'}</span>
                    {topicEventUsage && (
                      <span className="text-xs text-slate-400">
                        {language === 'zh'
                          ? `已用 ${topicEventUsage.used} / 剩余 ${topicEventUsage.remaining ?? '∞'}`
                          : `Used ${topicEventUsage.used} / Remaining ${topicEventUsage.remaining ?? '∞'}`}
                      </span>
                    )}
                  </div>
                {topicEvents.length === 0 ? (
                  <div className="text-xs text-slate-500">
                    {language === 'zh' ? '暂无事件，稍后可添加。' : 'No events yet.'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topicEvents.map((ev) => (
                      <div key={ev.id} className="border border-white/5 rounded-lg p-3 bg-slate-800/40">
                        <div className="flex items-center justify-between text-slate-200">
                          <span>{ev.name}</span>
                          <span className="text-xs text-slate-500">{new Date(ev.created_at).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {language === 'zh' ? '事件对话次数：1（单张牌）' : 'Event dialog count: 1 (single card)'}
                        </div>
                        {ev.cards && ev.cards.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {ev.cards.map((c) => (
                              <div key={c.id} className="w-16">
                                <Card card={c} isRevealed language={language} />
                                </div>
                              ))}
                            </div>
                          )}
                          {ev.reading && (
                            <div className="mt-2 text-sm text-slate-200 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {ev.reading}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes flipIn {
          0% { opacity: 0; transform: rotateY(90deg) scale(0.9); }
          100% { opacity: 1; transform: rotateY(0deg) scale(1); }
        }
        .animate-card-flip {
          animation: flipIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spinReverse 1.5s linear infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
