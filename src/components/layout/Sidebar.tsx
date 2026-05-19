'use client';

import { cn } from '@/utils';
import { WalletButton } from '@/components/ui/WalletButton';

export type Page = 'overview' | 'analytics' | 'strategies' | 'explorer' | 'simulator' | 'portfolio' | 'compare' | 'watchlist' | 'alerts';

const NAV: { id: Page; icon: string; label: string }[] = [
  { id: 'overview', icon: '◈', label: 'Overview' },
  { id: 'analytics', icon: '◇', label: 'Analytics' },
  { id: 'strategies', icon: '▣', label: 'Strategies' },
  { id: 'explorer', icon: '⬡', label: 'Explorer' },
  { id: 'simulator', icon: '△', label: 'Simulator' },
  { id: 'portfolio', icon: '◉', label: 'Portfolio' },
  { id: 'compare', icon: '⟷', label: 'Compare' },
  { id: 'watchlist', icon: '☆', label: 'Watchlist' },
  { id: 'alerts', icon: '◆', label: 'Alerts' },
];

interface SidebarProps {
  active: Page;
  onNavigate: (p: Page) => void;
  poolCount?: number;
  alertCount?: number;
  chainCount?: number;
}

export function Sidebar({ active, onNavigate, poolCount, alertCount, chainCount }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[200px] flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--rose)] text-[11px] font-black text-white tracking-tight">
            N
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-tight text-gradient">NexusYield</div>
            <div className="text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">Intelligence</div>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="px-4 mb-3">
        <WalletButton />
      </div>

      {/* Status */}
      {poolCount !== undefined && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-[var(--accent-dim)] px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ animation: 'pulse-soft 2s infinite' }} />
          <span className="text-[10px] font-medium text-[var(--accent)]">
            {poolCount.toLocaleString()} live pools
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const isActive = active === item.id;
          const showBadge = item.id === 'alerts' && alertCount && alertCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all',
                isActive
                  ? 'bg-[var(--accent-dim)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/[0.02] hover:text-[var(--text-primary)]'
              )}
            >
              <span className={cn('text-[10px] w-4 text-center', isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]')}>
                {item.icon}
              </span>
              {item.label}
              {showBadge && (
                <span className="ml-auto inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--rose)] px-1 text-[9px] font-bold text-white">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-5 py-3">
        <div className="text-[8px] uppercase tracking-[0.15em] text-[var(--text-muted)]">Powered by DefiLlama</div>
        <div className="text-[8px] text-[var(--text-muted)]">{chainCount ?? 29} chains</div>
      </div>
    </aside>
  );
}
