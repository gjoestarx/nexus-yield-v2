'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
 return twMerge(clsx(inputs));
}

export function Card({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
 return (
  <div className={cn('surface', className)} style={style} onClick={onClick}>
 {children}
  </div>
 );
}

export function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral' }) {
 const map = { success: 'tag-positive', warning: 'tag-warning', danger: 'tag-negative', info: 'tag-info', accent: 'tag-accent', neutral: 'tag-neutral' };
 return <span className={cn('tag', map[variant])}>{children}</span>;
}

export function Button({ children, variant = 'primary', size, className, onClick, disabled, type }: {
 children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md';
 className?: string; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit';
}) {
 const map = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger' };
 return (
  <button type={type} className={cn('btn', map[variant], size === 'sm' && 'text-[11px] px-3 py-1.5', className)} onClick={onClick} disabled={disabled}>
 {children}
  </button>
 );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
 return (
  <label className="flex items-center gap-2 cursor-pointer">
 <div className={cn('w-8 h-[18px] rounded-full relative transition-colors', checked ? 'bg-[var(--accent)]' : 'bg-[var(--bg-3)]')} onClick={() => onChange(!checked)}>
  <div className={cn('absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all', checked ? 'left-[16px]' : 'left-[2px]')} />
 </div>
 {label && <span className="text-[12px] text-[var(--text-2)]">{label}</span>}
  </label>
 );
}
