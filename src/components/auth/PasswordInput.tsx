import React, { useState, forwardRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, id, error, helperText, className = '', required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={id}
          className="block text-xs font-bold text-slate-800 tracking-wide uppercase"
        >
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>

        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id={id}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={`w-full py-2.5 sm:py-3 pl-10 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50/80 border rounded-xl transition-all duration-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
              error
                ? 'border-rose-300 ring-rose-400 focus:ring-rose-500 bg-rose-50/20'
                : 'border-slate-200/90 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/25'
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden focus:text-indigo-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {error ? (
          <p id={`${id}-error`} className="text-xs font-semibold text-rose-600 pl-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${id}-helper`} className="text-[11px] text-slate-500 pl-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
