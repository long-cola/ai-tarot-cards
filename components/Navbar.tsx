import React, { useState, useEffect } from 'react';
import { Button } from './ui';

interface NavbarProps {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onLanguageToggle?: () => void;
  onQuickReadingClick?: () => void;
  onTopicsClick?: () => void;
  onUpgradeClick?: () => void;
  language: 'zh' | 'en';
  user: any;
  isAuthenticated: boolean;
  plan?: 'guest' | 'free' | 'member';
  topicQuota?: {
    plan: 'guest' | 'free' | 'member';
    topic_quota_total: number;
    topic_quota_remaining: number;
    event_quota_per_topic: number;
    expires_at?: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoginClick,
  onLogoutClick,
  onLanguageToggle,
  onQuickReadingClick,
  onTopicsClick,
  onUpgradeClick,
  language,
  user,
  isAuthenticated,
  plan = 'guest',
  topicQuota,
}) => {
  const isZh = language === 'zh';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug: Log quota info when it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[Navbar] User quota info:', {
        user: user?.email,
        plan,
        topicQuota,
      });
    }
  }, [isAuthenticated, user, plan, topicQuota]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10'
          : 'bg-[#0F172A]/40 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        {/* Left: Hamburger Menu (Mobile) or Logo (Desktop) */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button (Mobile only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>

          {/* Logo */}
          <h1 className="text-white text-base md:text-xl font-semibold tracking-wide">
            <span className="hidden sm:inline">Life Tarotcards</span>
            <span className="sm:hidden">{isZh ? '塔罗' : 'Tarot'}</span>
          </h1>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onQuickReadingClick}
            className="text-white hover:text-white/80 transition-colors text-[16px]"
            style={{ fontWeight: 400 }}
          >
            {isZh ? '遇事占卜' : 'Quick Reading'}
          </button>
          <button
            onClick={onTopicsClick}
            className="text-white hover:text-white/80 transition-colors text-[16px]"
            style={{ fontWeight: 400 }}
          >
            {isZh ? '人生命题' : 'Life Topics'}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white text-xs font-medium transition-all"
          >
            {language.toUpperCase()}
          </button>

          {/* Login/User */}
          {isAuthenticated ? (
            <details className="group relative">
              <summary className="list-none flex items-center gap-1 md:gap-2 cursor-pointer">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name || user.email || (isZh ? '用户头像' : 'User Avatar')}
                    loading="lazy"
                    width="32"
                    height="32"
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/20"
                  />
                )}
                <div className="text-[9px] md:text-[10px] text-slate-300/80 hidden sm:block">
                  {user?.name || user?.email || (isZh ? '已登录' : 'Logged in')}
                </div>
                <svg className="w-3 h-3 text-white/70 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.173l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                </svg>
              </summary>
              <div
                className="absolute right-0 mt-2 w-[200px] sm:w-[229px] flex flex-col justify-center items-center z-50"
                style={{
                  padding: '20px 0px 24px',
                  gap: '20px',
                  background: '#282446',
                  border: '1px solid #443E71',
                  borderRadius: '16px',
                }}
              >
                {/* User Info Section */}
                <div className="flex flex-col justify-center items-center w-full px-4 sm:px-6" style={{ gap: '12px' }}>
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
                    {user?.name || user?.email?.split('@')[0] || (isZh ? '用户' : 'User')}
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
                        {isZh ? '用户' : 'User'}
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
                      {isZh ? '免费用户' : 'Free User'}
                    </div>
                  )}
                </div>

                {/* Quota Info Section */}
                <div
                  className="flex flex-col items-start w-full px-4 sm:px-6"
                  style={{
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
                    {isZh
                      ? `本周期命题剩余 ${topicQuota?.topic_quota_remaining ?? '?'}/${topicQuota?.topic_quota_total ?? '?'}`
                      : `Topics remaining ${topicQuota?.topic_quota_remaining ?? '?'}/${topicQuota?.topic_quota_total ?? '?'}`}
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
                    {isZh
                      ? `每命题事件上限 ${topicQuota?.event_quota_per_topic ?? '?'}`
                      : `Events per topic ${topicQuota?.event_quota_per_topic ?? '?'}`}
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
                      {isZh
                        ? `Pro 会员到期： ${new Date(topicQuota.expires_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '/')}`
                        : `Pro expires: ${new Date(topicQuota.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}`}
                    </div>
                  )}
                </div>

                {/* Buttons Section */}
                <div
                  className="flex flex-col items-start w-full px-4 sm:px-6"
                  style={{
                    gap: '12px',
                  }}
                >
                  {/* Upgrade Button (for free users only) */}
                  {plan === 'free' && (
                    <button
                      onClick={onUpgradeClick}
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
                        {isZh ? '升级为 Pro 用户' : 'Upgrade to Pro'}
                      </span>
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={onLogoutClick}
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
                      {isZh ? '退出登录' : 'Logout'}
                    </span>
                  </button>
                </div>
              </div>
            </details>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoginClick}
              className="text-xs md:text-sm px-3 md:px-4"
            >
              {isZh ? '登录' : 'Login'}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#282446] border-b border-white/10 shadow-lg animate-slideDown">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => {
                onQuickReadingClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">🔮</span>
              <span className="text-white text-sm font-medium">
                {isZh ? '遇事占卜' : 'Quick Reading'}
              </span>
            </button>
            <button
              onClick={() => {
                onTopicsClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">📖</span>
              <span className="text-white text-sm font-medium">
                {isZh ? '人生命题' : 'Life Topics'}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
    <style>{`
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-slideDown {
        animation: slideDown 0.2s ease-out;
      }
    `}</style>
  </>
  );
};
