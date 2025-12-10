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
    <Card onClick={onClick} className="px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-white/90 text-sm font-medium">{question}</span>
      </div>
    </Card>
  );
};
