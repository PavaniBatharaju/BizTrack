import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  showArrow = true,
  disabled,
  className = '',
  ...props
}) => {
  const isButtonDisabled = disabled || isLoading;

  const baseStyles =
    'w-full py-3 sm:py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] focus:ring-indigo-500',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 focus:ring-slate-900',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs focus:ring-slate-400',
  };

  return (
    <button
      disabled={isButtonDisabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
          <span>{loadingText || 'Please wait...'}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {showArrow && variant === 'primary' && <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
        </>
      )}
    </button>
  );
};
