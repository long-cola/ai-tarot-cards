import React from 'react';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  hover = true,
}) => {
  const baseStyles = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-200';
  const hoverStyles = hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer' : '';
  const clickableStyles = onClick ? 'active:scale-95' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

interface QuickQuestionCardProps {
  icon?: string;
  question: string;
  onClick?: () => void;
}

export const QuickQuestionCard: React.FC<QuickQuestionCardProps> = ({
  icon = '✨',
  question,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        px-5 py-3
        h-[46px]
        bg-[rgb(168,85,247)]
        hover:bg-[rgb(178,95,255)]
        rounded-full
        transition-all duration-200
        cursor-pointer
        active:scale-95
        flex items-center gap-2
        shadow-md hover:shadow-lg
      "
    >
      <span className="text-base">{icon}</span>
      <span className="text-[rgb(205,190,238)] text-[14px] font-normal">{question}</span>
    </button>
  );
};
