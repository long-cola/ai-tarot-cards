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
        px-[22px] py-3
        h-[46px]
        bg-[rgba(168,85,247,0.05)]
        border border-[rgba(168,85,247,0.1)]
        hover:bg-[rgba(168,85,247,0.1)]
        rounded-[9999px]
        transition-all duration-200
        cursor-pointer
        active:scale-95
        flex items-center justify-center gap-2.5
        shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
      "
    >
      <span className="text-[14px] leading-[22px] text-[#CDBFEE] text-center whitespace-nowrap">{question}</span>
    </button>
  );
};
