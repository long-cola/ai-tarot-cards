import React, { useState, useEffect } from 'react';

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
 */
export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  showAfter = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > showAfter);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-50 transition-all duration-300 hover:bg-white/25"
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
    </button>
  );
};
