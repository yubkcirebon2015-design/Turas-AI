import React from 'react';

export const IslamicStarIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'text-amber-500', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.2 6.8L19 4.6L16.8 9.4L21.6 11.6L16.8 13.8L19 18.6L14.2 16.4L12 21.2L9.8 16.4L5 18.6L7.2 13.8L2.4 11.6L7.2 9.4L5 4.6L9.8 6.8L12 2Z" />
    <circle cx="12" cy="11.6" r="3" fill="#ffffff" fillOpacity="0.4" />
  </svg>
);

export const IslamicArchFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative border border-amber-600/30 rounded-2xl bg-gradient-to-b from-emerald-950/5 via-amber-500/5 to-transparent p-6 ${className}`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#faf8f5] dark:bg-[#0c1311] px-4">
      <IslamicStarIcon size={20} className="text-amber-600 dark:text-amber-400" />
    </div>
    {children}
  </div>
);

export const ArabesqueDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 my-6 text-amber-600/60 dark:text-amber-400/50 ${className}`}>
    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600/40 to-amber-600/60 dark:via-amber-400/30 dark:to-amber-400/50" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L14 8L19 6L16 11L21 12L16 13L19 18L14 16L12 21L10 16L5 18L8 13L3 12L8 11L5 6L10 8L12 3Z" />
    </svg>
    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-amber-600/40 to-amber-600/60 dark:via-amber-400/30 dark:to-amber-400/50" />
  </div>
);
