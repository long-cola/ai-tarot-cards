import React from 'react';
import { colors, typography } from './tokens';

interface BlogCardProps {
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '484px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Image Container */}
      <div
        style={{
          width: '100%',
          height: '260px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

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
