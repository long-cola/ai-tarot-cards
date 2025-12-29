import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getScrollContainer, getScrollTop, scrollToTop } from '../utils/scroll';

interface ScrollToTopButtonProps {
  /**
   * Minimum scroll distance (in pixels) before button appears
   * @default 300
   */
  showAfter?: number;
}

/**
 * Scroll to Top Button Component
 *
 * A fixed position button that appears in the bottom-right corner
 * when the user scrolls down. Clicking it smoothly scrolls back to the top.
 * Uses React Portal to render directly to document.body for proper z-index layering.
 */
export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  showAfter = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = getScrollContainer();
    const target = scrollContainer || window;

    const handleScroll = () => {
      setIsVisible(getScrollTop() > showAfter);
    };

    target.addEventListener('scroll', handleScroll as EventListener);
    handleScroll(); // Check initial scroll position

    return () => {
      target.removeEventListener('scroll', handleScroll as EventListener);
    };
  }, [showAfter]);

  const handleScrollToTop = () => {
    scrollToTop('smooth');
  };

  if (!isVisible || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <button
      onClick={handleScrollToTop}
      className="fixed transition-all duration-300 hover:bg-white/25"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        width: '40px',
        height: '40px',
        right: '20px',
        bottom: '20px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '100px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
      aria-label="Scroll to top"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 19V5M12 5L5 12M12 5L19 12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>,
    document.body
  );
};
