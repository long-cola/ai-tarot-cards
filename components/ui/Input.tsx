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
            h-[80px]
            px-[147px] py-[23px]
            bg-[rgba(168,85,247,0.1)]
            border border-[rgba(168,85,247,0.3)]
            rounded-2xl
            text-white placeholder:text-white/40 text-center
            focus:outline-none focus:border-[rgba(168,85,247,0.5)]
            transition-all duration-200
            backdrop-blur-[12px]
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
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
