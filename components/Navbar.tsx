import React from 'react';
import { Button } from './ui';

interface NavbarProps {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onLanguageToggle?: () => void;
  onQuickReadingClick?: () => void;
  onTopicsClick?: () => void;
  language: 'zh' | 'en';
  user: any;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoginClick,
  onLogoutClick,
  onLanguageToggle,
  onQuickReadingClick,
  onTopicsClick,
  language,
  user,
  isAuthenticated,
}) => {
  const isZh = language === 'zh';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1b3a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Life Tarotcards
          </h1>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onQuickReadingClick}
            className="text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            {isZh ? '遇事占卜' : 'Quick Reading'}
          </button>
          <button
            onClick={onTopicsClick}
            className="text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            {isZh ? '人生命题' : 'Life Topics'}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white text-xs font-medium transition-all"
          >
            {language.toUpperCase()}
          </button>

          {/* Login/User */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name || user.email}
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
              )}
              <button
                onClick={onLogoutClick}
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                {isZh ? '退出' : 'Logout'}
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoginClick}
            >
              {isZh ? '使用 Chrome 登录' : 'Sign in with Chrome'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
