'use client';

import { cn } from '@/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

export function Card({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm transition-all', className)} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-[var(--text-primary)]', className)}>{children}</h3>;
}

const BADGE_VARIANTS = {
  default: 'bg-white/10 text-[var(--text-secondary)]',
  success: 'bg-[var(--green-dim)] text-[var(--green)]',
  warning: 'bg-[var(--amber-dim)] text-[var(--amber)]',
  danger: 'bg-[var(--red-dim)] text-[var(--red)]',
  info: 'bg-[var(--cyan-dim)] text-[var(--cyan)]',
  chain: 'bg-[var(--purple-dim)] text-[var(--purple)]',
};

export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: keyof typeof BADGE_VARIANTS; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', BADGE_VARIANTS[variant], className)}>
      {children}
    </span>
  );
}

const BUTTON_VARIANTS = {
  default: 'bg-[var(--cyan)] text-white hover:bg-[var(--cyan)]/90',
  secondary: 'bg-white/10 text-[var(--text-primary)] hover:bg-white/15',
  ghost: 'hover:bg-white/5 hover:text-[var(--text-primary)]',
  danger: 'bg-[var(--red)] text-white hover:bg-[var(--red)]/90',
};

const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({ children, variant = 'default', size = 'md', className, ...props }: {
  children: ReactNode; variant?: keyof typeof BUTTON_VARIANTS; size?: keyof typeof BUTTON_SIZES; className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] disabled:pointer-events-none disabled:opacity-50', BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <div className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-[var(--cyan)]' : 'bg-white/10')} onClick={() => onChange(!checked)}>
        <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-4' : 'translate-x-0.5')} />
      </div>
      {label && <span className="text-sm text-[var(--text-muted)]">{label}</span>}
    </label>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-white/5', className)} />;
}
