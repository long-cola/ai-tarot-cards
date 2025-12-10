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
            w-full px-6 py-4
            bg-white/5 backdrop-blur-sm
            border-2 border-white/10
            rounded-full
            text-white placeholder:text-white/40
            focus:outline-none focus:border-white/30
            transition-all duration-200
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-400' : ''}
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
