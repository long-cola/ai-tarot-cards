import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast Notification Component
 *
 * Displays a temporary notification message at the top center of the screen.
 * Automatically dismisses after the specified duration.
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] animate-slide-down"
      style={{
        maxWidth: '90vw',
        width: 'auto',
      }}
    >
      <div
        className="px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md"
        style={{
          background: 'rgba(40, 36, 70, 0.95)',
          border: '1px solid rgba(189, 161, 255, 0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#4ADE80" strokeWidth="2" />
            <path
              d="M8 12L11 15L16 9"
              stroke="#4ADE80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className="text-[15px] font-medium"
            style={{ color: '#E2DBFF' }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
