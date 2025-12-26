import React, { useState, useRef } from 'react';
import { createShare, copyShareToClipboard, CreateShareParams } from '../services/shareService';
import { trackShare } from '../services/gaTracking';
import { Language } from '../types';
import * as htmlToImage from 'html-to-image';
import QRCode from 'qrcode';

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh';

  // 打开分享选项弹窗
  const handleShareClick = () => {
    setShowShareModal(true);
  };

  // 生成分享链接
  const handleShareLink = async () => {
    setShowShareModal(false);
    setIsSharing(true);

    try {
      // Create share link
      const { shareUrl } = await createShare(shareParams);

      // Copy to clipboard with message
      const shareText = isZh
        ? `我分享给你一个超准的塔罗，快来看看吧：${shareUrl}`
        : `I'm sharing a super accurate Tarot reading with you, check it out: ${shareUrl}`;

      const success = await copyToClipboard(shareText);

      if (success) {
        // Track successful share in Google Analytics
        trackShare(shareParams.shareType, question);

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

  // 保存为图片
  const handleSaveImage = async () => {
    setShowShareModal(false);
    setIsSharing(true);

    try {
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL('https://ai-tarotcard.com', {
        width: 120,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Create temporary container for image
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Create image content
      const imageElement = createImageElement(qrCodeDataUrl);
      container.appendChild(imageElement);

      // Wait for fonts to load
      await document.fonts.ready;

      // Convert to image
      const dataUrl = await htmlToImage.toPng(imageElement, {
        width: 600,
        height: imageElement.offsetHeight,
        backgroundColor: '#140F2A',
        pixelRatio: 2,
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Download image
      const link = document.createElement('a');
      link.download = `tarot-reading-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      trackShare(shareParams.shareType + '_image', question);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('[ShareButton] Failed to generate image:', error);
      alert(isZh ? '生成图片失败,请稍后重试' : 'Failed to generate image, please try again');
    } finally {
      setIsSharing(false);
    }
  };

  // 创建图片元素
  const createImageElement = (qrCodeDataUrl: string): HTMLDivElement => {
    const { question: q, cards, reading } = shareParams;
    const div = document.createElement('div');
    div.style.width = '600px';
    div.style.background = '#140F2A';
    div.style.padding = '40px';
    div.style.color = '#E8E3FF';
    div.style.fontFamily = "'Noto Serif SC', serif";
    div.style.boxSizing = 'border-box';

    // 创建问题标题
    const title = document.createElement('h2');
    title.style.fontSize = '24px';
    title.style.marginBottom = '20px';
    title.style.fontWeight = '700';
    title.style.lineHeight = '1.4';
    title.textContent = q || question;
    div.appendChild(title);

    // 创建解读内容
    const readingContent = document.createElement('div');
    readingContent.style.margin = '30px 0';
    readingContent.style.fontSize = '16px';
    readingContent.style.lineHeight = '1.8';
    readingContent.style.whiteSpace = 'pre-wrap';
    readingContent.textContent = reading || '';
    div.appendChild(readingContent);

    // 创建底部分隔线和二维码区域
    const footer = document.createElement('div');
    footer.style.marginTop = '40px';
    footer.style.paddingTop = '30px';
    footer.style.borderTop = '1px solid #443E71';
    footer.style.textAlign = 'center';

    // 二维码
    const qrImg = document.createElement('img');
    qrImg.src = qrCodeDataUrl;
    qrImg.alt = 'QR Code';
    qrImg.style.width = '120px';
    qrImg.style.height = '120px';
    footer.appendChild(qrImg);

    // 提示文字
    const hint = document.createElement('p');
    hint.style.marginTop = '10px';
    hint.style.fontSize = '14px';
    hint.style.color = '#8F88AB';
    hint.textContent = isZh ? '扫码体验更多塔罗解读' : 'Scan to experience more Tarot readings';
    footer.appendChild(hint);

    div.appendChild(footer);

    return div;
  };

  // 复制到剪贴板的辅助函数
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('[ShareButton] Failed to copy to clipboard:', error);
      return false;
    }
  };

  const buttonStyles = variant === 'primary'
    ? 'bg-[#DD8424] text-black opacity-80 hover:opacity-90'
    : 'bg-[rgba(189,161,255,0.2)] border border-[rgba(189,161,255,0.2)] text-[#BDA1FF] opacity-80 hover:opacity-90';

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShareClick}
        disabled={isSharing}
        className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3 rounded-[100px] text-[14px] md:text-[16px] font-bold transition-opacity disabled:opacity-50 ${buttonStyles} ${className}`}
      >
        {isSharing ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{isZh ? '处理中...' : 'Processing...'}</span>
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

      {/* Share options modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="flex flex-col gap-5 p-6 rounded-2xl max-w-md w-full"
            style={{
              background: '#282446',
              border: '1px solid #443E71',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-center text-xl font-bold"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                color: '#E2DBFF',
              }}
            >
              {isZh ? '选择分享方式' : 'Choose Share Method'}
            </h3>

            {/* Save as Image Button */}
            <button
              onClick={handleSaveImage}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-full text-base font-bold transition-opacity hover:opacity-90"
              style={{
                background: '#DD8424',
                color: '#000000',
                opacity: 0.8,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{isZh ? '保存为图片' : 'Save as Image'}</span>
            </button>

            {/* Generate Share Link Button */}
            <button
              onClick={handleShareLink}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-full text-base font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'rgba(189, 161, 255, 0.2)',
                border: '1px solid rgba(189, 161, 255, 0.2)',
                color: '#BDA1FF',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>{isZh ? '生成分享链接' : 'Generate Share Link'}</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="py-3 text-center text-sm font-medium opacity-60 hover:opacity-80 transition-opacity"
              style={{ color: '#BDA1FF' }}
            >
              {isZh ? '取消' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

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
              {isZh ? '成功！请分享给朋友们吧' : 'Success! Share it with your friends'}
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
