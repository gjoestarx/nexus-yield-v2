'use client';

import { cn } from '@/utils';
import { WalletButton } from '@/components/ui/WalletButton';

export type Page = 'overview' | 'analytics' | 'strategies' | 'explorer' | 'simulator' | 'portfolio' | 'compare' | 'watchlist' | 'alerts';

const NAV_SECTIONS = [
  {
    label: 'Discover',
    items: [
      { id: 'overview' as Page, icon: '◈', label: 'Overview' },
      { id: 'analytics' as Page, icon: '◇', label: 'Analytics' },
      { id: 'explorer' as Page, icon: '⬡', label: 'Explorer' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'strategies' as Page, icon: '▣', label: 'Strategies' },
      { id: 'simulator' as Page, icon: '△', label: 'Simulator' },
      { id: 'portfolio' as Page, icon: '◉', label: 'Portfolio' },
      { id: 'compare' as Page, icon: '⟷', label: 'Compare' },
    ],
  },
  {
    label: 'Personal',
    items: [
      { id: 'watchlist' as Page, icon: '☆', label: 'Watchlist' },
      { id: 'alerts' as Page, icon: '◆', label: 'Alerts' },
    ],
  },
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
    <aside className="sidebar fixed left-0 top-0 z-50 flex h-screen flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--rose)] text-[12px] font-black text-white">
              N
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--green)]" />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight text-gradient">NexusYield</div>
            <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">Intelligence</div>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="px-4 mb-4">
        <WalletButton />
      </div>

      {/* Pool count */}
      {poolCount !== undefined && (
        <div className="mx-4 mb-4 rounded-[10px] bg-[var(--accent-dim)] px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ animation: 'pulse-soft 2s infinite' }} />
            <span className="text-[11px] font-semibold text-[var(--accent)]">{poolCount.toLocaleString()}</span>
            <span className="text-[10px] text-[var(--text-muted)]">live pools</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="px-3 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = active === item.id;
                const showBadge = item.id === 'alerts' && alertCount && alertCount > 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn('sidebar-item', isActive && 'active')}
                  >
                    <span className="w-4 text-center text-[11px]">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {showBadge && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--rose)] px-1 text-[9px] font-bold text-white">
                        {alertCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-[9px] text-[var(--text-muted)]">DefiLlama</div>
          <div className="text-[9px] text-[var(--text-muted)]">{chainCount ?? 29} chains</div>
        </div>
      </div>
    </aside>
  );
}
