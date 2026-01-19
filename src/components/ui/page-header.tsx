'use client';

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  gradient: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  gradient,
  children,
  icon,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'animate-slide-up relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-2xl',
        `bg-gradient-to-r ${gradient}`
      )}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Large decorative blur circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      {/* Small floating dots - animated */}
      <div
        className="absolute top-4 right-[12%] w-3 h-3 bg-white/40 rounded-full animate-bounce"
        style={{ animationDelay: '0s', animationDuration: '2s' }}
      />
      <div
        className="absolute top-6 right-[4%] w-2 h-2 bg-white/30 rounded-full animate-bounce"
        style={{ animationDelay: '0.3s', animationDuration: '2.5s' }}
      />
      <div
        className="absolute bottom-4 right-[15%] w-3 h-3 bg-white/30 rounded-full animate-bounce"
        style={{ animationDelay: '0.2s', animationDuration: '2.3s' }}
      />
      <div
        className="absolute bottom-6 right-[6%] w-2 h-2 bg-white/40 rounded-full animate-bounce"
        style={{ animationDelay: '0.5s', animationDuration: '2.8s' }}
      />

      {/* Sparkle decorations */}
      <Sparkles className="absolute top-4 left-4 w-5 h-5 text-white/30" />
      <Sparkles className="absolute bottom-4 right-4 w-4 h-4 text-white/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm sm:text-base text-white/80 mt-1">{description}</p>
          </div>
        </div>
        {children && <div className="flex flex-col sm:flex-row gap-2">{children}</div>}
      </div>
    </div>
  );
}
