import React, { useState } from 'react';
import { colors, typography } from './tokens';

interface AccordionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderBottom: `1px solid ${colors.border}`,
        padding: '16px 0',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          gap: '10px',
        }}
      >
        <span
          style={{
            fontFamily: typography.fontFamily.base,
            fontWeight: typography.fontWeight.normal,
            fontSize: typography.fontSize.lg,
            lineHeight: typography.lineHeight.relaxed,
            color: colors.text.primary,
            textAlign: 'left',
          }}
        >
          {title}
        </span>

        {/* Arrow Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        >
          <path
            d="M17 10L12 15L7 10"
            stroke={colors.text.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: '8px',
            fontFamily: typography.fontFamily.base,
            fontWeight: typography.fontWeight.normal,
            fontSize: typography.fontSize.sm,
            lineHeight: '22px',
            color: colors.text.secondary,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
