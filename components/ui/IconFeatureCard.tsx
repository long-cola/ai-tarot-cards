import React from 'react';
import { colors, typography } from './tokens';

interface IconFeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const IconFeatureCard: React.FC<IconFeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '301px',
      }}
    >
      {/* Icon */}
      <img
        src={icon}
        alt={title}
        loading="lazy"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '100px',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
        }}
      >
        <h3
          style={{
            fontFamily: typography.fontFamily.base,
            fontWeight: typography.fontWeight.normal,
            fontSize: typography.fontSize.lg,
            lineHeight: typography.lineHeight.relaxed,
            color: colors.text.primary,
            textAlign: 'center',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: typography.fontFamily.base,
            fontWeight: typography.fontWeight.normal,
            fontSize: typography.fontSize.sm,
            lineHeight: '22px',
            color: colors.text.secondary,
            textAlign: 'center',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
