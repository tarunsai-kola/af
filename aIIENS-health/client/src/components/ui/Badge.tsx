import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'error' | 'info' | 'neutral' | 'brand' | 'default' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  brand: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
  default: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  outline: 'bg-transparent text-slate-400 border-slate-500/30',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  error: 'bg-red-400',
  info: 'bg-sky-400',
  neutral: 'bg-slate-400',
  brand: 'bg-brand-400',
  default: 'bg-slate-400',
  outline: 'bg-slate-400',
};

export function Badge({
  variant = 'neutral',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
