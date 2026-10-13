import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  clickable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  clickable = true,
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const Content = (
    <div className="flex items-center gap-3 group select-none">
      <div
        className={`${iconSizes[size]} bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/25 transition-transform duration-200 group-hover:scale-105`}
      >
        <TrendingUp className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-slate-950'
            }`}
          >
            BizTrack
          </span>
          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
              isLight
                ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-200/80'
            }`}
          >
            PRO
          </span>
        </div>
        {showTagline && (
          <p
            className={`text-[11px] font-medium tracking-tight mt-1 ${
              isLight ? 'text-indigo-200/80' : 'text-slate-500'
            }`}
          >
            Smart Business Finance Tracking Made Simple
          </p>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-xl">
        {Content}
      </Link>
    );
  }

  return Content;
};
