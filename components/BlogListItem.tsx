import React from 'react';

interface BlogListItemProps {
  image: string;
  title: string;
  description: string;
  blogId: string;
  onClick?: (blogId: string) => void;
}

export const BlogListItem: React.FC<BlogListItemProps> = ({
  image,
  title,
  description,
  blogId,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick?.(blogId)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        gap: '24px',
        width: '100%',
        height: '173px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '325px',
          height: '173px',
          borderRadius: '16px',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <img
          src={image}
          alt={title}
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
          alignItems: 'flex-start',
          padding: '0px',
          gap: '12px',
          flex: 1,
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '24px',
            color: '#E8E3FF',
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: '#CDBFEE',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
