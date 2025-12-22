import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
  getCookieConsent,
  acceptCookies,
  rejectCookies,
  CookieConsent as ConsentStatus,
} from '../services/cookieConsent';

interface CookieConsentProps {
  language: Language;
  forceShow?: boolean;
  onConsentChange?: (status: Exclude<ConsentStatus, null>) => void;
  onClose?: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  language,
  forceShow = false,
  onConsentChange,
  onClose,
}) => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => getCookieConsent());
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isZh = language === 'zh';
  const prefix = isZh ? '/zh' : '';

  useEffect(() => {
    if (consentStatus === null && !forceShow) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [consentStatus, forceShow]);

  useEffect(() => {
    if (forceShow) {
      setShowBanner(true);
      setShowSettings(true);
    }
  }, [forceShow]);

  const handleAcceptAll = () => {
    acceptCookies();
    setConsentStatus('accepted');
    setShowBanner(false);
    setShowSettings(false);
    onConsentChange?.('accepted');
    onClose?.();
  };

  const handleRejectAll = () => {
    rejectCookies();
    setConsentStatus('rejected');
    setShowBanner(false);
    setShowSettings(false);
    onConsentChange?.('rejected');
    onClose?.();
  };

  const handleCloseSettings = () => {
    if (forceShow) {
      setShowBanner(false);
      setShowSettings(false);
      onClose?.();
      return;
    }
    setShowSettings(false);
  };

  const shouldRender = showBanner && (forceShow || consentStatus === null);
  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fade-in" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
        <div className="max-w-6xl mx-auto px-4 pb-4 md:pb-6">
          <div className="bg-slate-900/95 backdrop-blur-lg border-2 border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
            {!showSettings ? (
              // Simple Banner
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🍪</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-purple-100">
                      {isZh ? '🌍 我们重视您的隐私' : '🌍 We Value Your Privacy'}
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                      {isZh ? (
                        <>
                          我们使用 Cookie 来改善您的体验并分析网站流量。我们使用 <strong className="text-purple-200">Google Analytics</strong> 来了解用户如何使用我们的服务。
                          您可以选择接受或拒绝非必要的 Cookie。
                          查看我们的
                          <a
                            href={`${prefix}/?view=privacy`}
                            className="text-purple-400 hover:text-purple-300 underline mx-1"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `${prefix}/?view=privacy`;
                            }}
                          >
                            隐私政策
                          </a>
                          了解更多信息。
                        </>
                      ) : (
                        <>
                          We use cookies to improve your experience and analyze site traffic. We use <strong className="text-purple-200">Google Analytics</strong> to understand how users interact with our service.
                          You can accept or reject non-essential cookies.
                          See our
                          <a
                            href={`${prefix}/?view=privacy`}
                            className="text-purple-400 hover:text-purple-300 underline mx-1"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `${prefix}/?view=privacy`;
                            }}
                          >
                            Privacy Policy
                          </a>
                          for more information.
                        </>
                      )}
                    </p>

                    {/* Age Restriction Notice */}
                    <p className="text-xs text-amber-300/80 flex items-center gap-2">
                      <span>⚠️</span>
                      {isZh
                        ? '本服务仅适用于 18 岁及以上用户。使用本网站即表示您确认已年满 18 岁。'
                        : 'This service is for users 18 years and older. By using this site, you confirm you are 18+.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-4 py-2.5 rounded-lg border border-purple-500/30 bg-slate-800/50 text-purple-200 hover:bg-slate-700/50 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      {isZh ? '⚙️ 自定义' : '⚙️ Customize'}
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      {isZh ? '拒绝' : 'Reject'}
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors text-sm whitespace-nowrap shadow-lg shadow-purple-900/50"
                    >
                      {isZh ? '✓ 接受全部' : '✓ Accept All'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Detailed Settings
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-100">
                    {isZh ? '🍪 Cookie 设置' : '🍪 Cookie Settings'}
                  </h3>
                  <button
                    onClick={handleCloseSettings}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-purple-200">
                            {isZh ? '必要 Cookie' : 'Essential Cookies'}
                          </h4>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                            {isZh ? '始终启用' : 'Always Active'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {isZh
                            ? '这些 Cookie 对于网站的基本功能至关重要，包括身份验证和会话管理。无法禁用。'
                            : 'These cookies are essential for basic website functionality, including authentication and session management. Cannot be disabled.'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-purple-200">
                            {isZh ? '分析 Cookie (Google Analytics)' : 'Analytics Cookies (Google Analytics)'}
                          </h4>
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            {isZh ? '可选' : 'Optional'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          {isZh
                            ? '帮助我们了解用户如何与网站互动，以改善服务。我们使用 Google Analytics 进行匿名化的流量分析。'
                            : 'Help us understand how users interact with our website to improve our service. We use Google Analytics for anonymized traffic analysis.'}
                        </p>
                        <ul className="text-xs text-slate-500 space-y-1 ml-4 list-disc">
                          <li>{isZh ? '页面浏览统计' : 'Page view statistics'}</li>
                          <li>{isZh ? '用户行为分析（匿名）' : 'User behavior analysis (anonymous)'}</li>
                          <li>{isZh ? '网站性能监控' : 'Website performance monitoring'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-6 py-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium"
                  >
                    {isZh ? '仅使用必要 Cookie' : 'Only Essential Cookies'}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors shadow-lg shadow-purple-900/50"
                  >
                    {isZh ? '✓ 接受全部 Cookie' : '✓ Accept All Cookies'}
                  </button>
                </div>

                {/* Links */}
                <div className="text-center text-xs text-slate-500 pt-2">
                  {isZh ? '了解更多：' : 'Learn more:'}
                  <a
                    href={`${prefix}/?view=privacy`}
                    className="text-purple-400 hover:text-purple-300 underline ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${prefix}/?view=privacy`;
                    }}
                  >
                    {isZh ? '隐私政策' : 'Privacy Policy'}
                  </a>
                  <span className="mx-2">•</span>
                  <a
                    href={`${prefix}/?view=terms`}
                    className="text-purple-400 hover:text-purple-300 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${prefix}/?view=terms`;
                    }}
                  >
                    {isZh ? '服务条款' : 'Terms of Service'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};
