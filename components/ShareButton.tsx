import React, { useState } from 'react';
import { createShare, copyShareToClipboard, CreateShareParams } from '../services/shareService';
import { Language } from '../types';

interface ShareButtonProps {
  shareParams: CreateShareParams;
  question: string;
  language: Language;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  shareParams,
  question,
  language,
  variant = 'secondary',
  className = '',
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isZh = language === 'zh';

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // Create share link
      const { shareUrl } = await createShare(shareParams);

      // Copy to clipboard
      const success = await copyShareToClipboard(question, shareUrl, language);

      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(isZh ? '复制失败,请手动复制链接' : 'Failed to copy, please copy manually');
      }
    } catch (error) {
      console.error('[ShareButton] Failed to share:', error);
      alert(isZh ? '分享失败,请稍后重试' : 'Failed to share, please try again');
    } finally {
      setIsSharing(false);
    }
  };

  const buttonStyles = variant === 'primary'
    ? 'bg-[#DD8424] text-black opacity-80 hover:opacity-90'
    : 'bg-[rgba(189,161,255,0.2)] border border-[rgba(189,161,255,0.2)] text-[#BDA1FF] opacity-80 hover:opacity-90';

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3 rounded-[100px] text-[14px] md:text-[16px] font-bold transition-opacity disabled:opacity-50 ${buttonStyles} ${className}`}
      >
        {isSharing ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{isZh ? '分享中...' : 'Sharing...'}</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{isZh ? '分享' : 'Share'}</span>
          </>
        )}
      </button>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl"
            style={{
              background: 'rgba(40, 36, 70, 0.95)',
              border: '1px solid rgba(189, 161, 255, 0.3)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)'
            }}
          >
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">
              {isZh ? '分享链接已复制,请发送给朋友们吧!' : 'Share link copied, send it to your friends!'}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
