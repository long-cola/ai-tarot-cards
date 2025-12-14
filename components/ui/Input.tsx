import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full max-w-[800px] mx-auto
            h-[75px]
            px-6 py-6
            text-[24px] placeholder:text-[24px]
            bg-[rgb(168,85,247)]
            border-0
            rounded-[16px]
            text-white placeholder:text-[rgb(155,130,198)] text-left
            focus:outline-none focus:ring-2 focus:ring-[rgba(168,85,247,0.8)]
            transition-all duration-200
            shadow-lg
            ${icon ? 'pl-12' : ''}
            ${error ? 'ring-2 ring-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 px-4">{error}</p>
      )}
    </div>
  );
};
