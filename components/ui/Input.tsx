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
            w-full max-w-full sm:max-w-[500px] md:max-w-[800px] mx-auto
            h-[60px] sm:h-[68px] md:h-[75px]
            px-6 sm:px-12 md:px-[147px]
            py-4 sm:py-5 md:py-[23px]
            text-[18px] sm:text-[20px] md:text-[24px]
            placeholder:text-[18px] sm:placeholder:text-[20px] md:placeholder:text-[24px]
            bg-[rgba(168,85,247,0.1)]
            border border-[rgba(168,85,247,0.3)]
            rounded-[12px] md:rounded-[16px]
            text-white placeholder:text-[#9B83C6] text-center
            focus:outline-none focus:border-[rgba(168,85,247,0.5)]
            transition-all duration-200
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
            backdrop-blur-[6px]
            ${icon ? 'pl-10 sm:pl-12' : ''}
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
