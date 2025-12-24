import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Simple Logo Icon - using CSS shapes for now */}
      <div className="relative w-[39px] h-[17px]">
        {/* Outer ellipse */}
        <div
          className="absolute"
          style={{
            width: '38.58px',
            height: '16.79px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            top: '4.65px',
          }}
        />
        {/* Middle ellipse */}
        <div
          className="absolute"
          style={{
            width: '28.64px',
            height: '13.29px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            left: '4.97px',
            top: '6.39px',
          }}
        />
        {/* Inner circle */}
        <div
          className="absolute"
          style={{
            width: '16.79px',
            height: '16.79px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            left: '10.89px',
            top: '4.65px',
          }}
        />
        {/* Star */}
        <div
          className="absolute"
          style={{
            width: '8.99px',
            height: '8.99px',
            background: '#D9D9D9',
            borderRadius: '0.1px',
            left: '14.79px',
            top: '8.54px',
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      {/* Logo Text */}
      <div
        className="almendra"
        style={{
          fontFamily: "'Almendra', serif",
          fontWeight: 700,
          fontSize: '18.46px',
          lineHeight: '24px',
          background: 'linear-gradient(0deg, #F8F8F8, #F8F8F8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Mystic Tarotcard
      </div>
    </div>
  );
};
