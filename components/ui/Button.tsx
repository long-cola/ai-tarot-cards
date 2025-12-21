import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black transition-all duration-200 disabled:cursor-not-allowed active:scale-95 touch-manipulation';

  const variants = {
    primary: 'bg-[rgb(221,131,36)] hover:bg-[#c97520] text-black shadow-lg hover:shadow-xl rounded-full disabled:opacity-50',
    secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-full',
    outline: 'border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10 rounded-full',
    ghost: 'text-white/80 hover:text-white hover:bg-white/10 rounded-lg',
  };

  const sizes = {
    sm: 'px-3 md:px-4 py-2 text-xs md:text-sm min-h-[36px] md:min-h-[40px]',
    md: 'px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base min-h-[42px] md:min-h-[48px]',
    lg: 'px-12 md:px-16 py-3 md:py-4 text-[18px] md:text-[20px] min-w-[180px] md:min-w-[208px] min-h-[52px] md:min-h-[56px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
