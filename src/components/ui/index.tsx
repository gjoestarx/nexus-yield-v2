'use client';

import { cn } from '@/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

export function Card({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('card', className)} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-semibold text-[var(--text-primary)]', className)}>{children}</h3>;
}

const BADGE_VARIANTS = {
  default: 'bg-white/[0.04] text-[var(--text-secondary)]',
  success: 'bg-[var(--green-dim)] text-[var(--green)]',
  warning: 'bg-[var(--gold-dim)] text-[var(--gold)]',
  danger: 'bg-[var(--red-dim)] text-[var(--red)]',
  info: 'bg-[var(--accent-dim)] text-[var(--accent)]',
  chain: 'bg-[var(--blue-dim)] text-[var(--blue)]',
};

export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: keyof typeof BADGE_VARIANTS; className?: string }) {
  return (
    <span className={cn('badge', BADGE_VARIANTS[variant], className)}>
      {children}
    </span>
  );
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg' }) {
  const variants = {
    primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-bright)]',
    secondary: 'bg-white/[0.04] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-white/[0.07] hover:text-[var(--text-primary)]',
    ghost: 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.03]',
    danger: 'bg-[var(--red-dim)] text-[var(--red)] hover:bg-[var(--red)]/15',
  };
  const sizes = { sm: 'px-3 py-1.5 text-[11px]', md: 'px-4 py-2 text-[12px]', lg: 'px-5 py-2.5 text-[13px]' };
  return (
    <button className={cn('inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed', variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div onClick={() => onChange(!checked)} className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-[var(--accent)]' : 'bg-white/10')}>
        <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </div>
      {label && <span className="text-[12px] text-[var(--text-muted)]">{label}</span>}
    </label>
  );
}
