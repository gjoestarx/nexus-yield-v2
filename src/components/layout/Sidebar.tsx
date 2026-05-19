'use client';

import { LayoutDashboard, BarChart3, Compass, FlaskConical, Briefcase, GitCompare, Star, Bell, TrendingUp, PanelLeftClose, PanelLeftOpen, Sun, Moon, Languages } from 'lucide-react';
import { useI18n } from '@/services/i18n';
import { useTheme } from '@/services/theme';
import { WalletButton } from '@/components/ui/WalletButton';

export type Page = 'overview' | 'analytics' | 'strategies' | 'explorer' | 'simulator' | 'portfolio' | 'compare' | 'watchlist' | 'alerts';

interface SidebarProps {
  active: Page;
  onNavigate: (page: Page) => void;
  poolCount: number;
  alertCount: number;
  chainCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ active, onNavigate, poolCount, alertCount, chainCount, collapsed, onToggleCollapse }: SidebarProps) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const NAV_SECTIONS: { label: string; items: { id: Page; icon: React.ReactNode; label: string }[] }[] = [
    {
      label: t('nav.discover'),
      items: [
        { id: 'overview', icon: <LayoutDashboard size={16} />, label: t('nav.overview') },
        { id: 'analytics', icon: <BarChart3 size={16} />, label: t('nav.analytics') },
        { id: 'strategies', icon: <TrendingUp size={16} />, label: t('nav.strategies') },
        { id: 'explorer', icon: <Compass size={16} />, label: t('nav.explorer') },
      ],
    },
    {
      label: t('nav.tools'),
      items: [
        { id: 'simulator', icon: <FlaskConical size={16} />, label: t('nav.simulator') },
        { id: 'portfolio', icon: <Briefcase size={16} />, label: t('nav.portfolio') },
        { id: 'compare', icon: <GitCompare size={16} />, label: t('nav.compare') },
      ],
    },
    {
      label: t('nav.personal'),
      items: [
        { id: 'watchlist', icon: <Star size={16} />, label: t('nav.watchlist') },
        { id: 'alerts', icon: <Bell size={16} />, label: t('nav.alerts') },
      ],
    },
  ];

  return (
    <aside className="app-sidebar" style={{ width: collapsed ? 64 : 240, transition: 'width 0.2s ease' }}>
      <div className="sidebar-logo" style={{ padding: collapsed ? '24px 12px 20px' : '24px 20px 20px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div className="sidebar-logo-mark">N</div>
        {!collapsed && <div className="sidebar-logo-text">NexusYield</div>}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="sidebar-section" style={{ padding: collapsed ? '0 8px' : '0 12px' }}>
            {!collapsed && <div className="sidebar-section-label">{section.label}</div>}
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`sidebar-link ${active === item.id ? 'active' : ''}`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '8px 10px' }}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && item.id === 'alerts' && alertCount > 0 && (
                  <span className="tag tag-warning text-[9px]">{alertCount}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ padding: collapsed ? '12px 8px' : '16px 20px' }}>
        {!collapsed && <WalletButton />}
        {!collapsed && (
          <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--text-4)]">
            <span>{poolCount.toLocaleString()} {t('sidebar.pools')}</span>
            <span>{chainCount} {t('sidebar.chains')}</span>
          </div>
        )}
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2">
            <div className="dot-live" />
            <span className="text-[10px] text-[var(--text-3)]">{t('sidebar.live')}</span>
          </div>
        )}

        <div className={`mt-3 flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>
          <button
            onClick={toggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] transition-colors hover:bg-[var(--bg-3)] hover:text-[var(--text-1)]"
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
            className="flex h-7 items-center gap-1 rounded-md px-1.5 text-[10px] font-medium text-[var(--text-3)] transition-colors hover:bg-[var(--bg-3)] hover:text-[var(--text-1)]"
            title="Switch language"
          >
            <Languages size={12} />
            {!collapsed && <span>{lang === 'en' ? 'EN' : 'ID'}</span>}
          </button>

          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] transition-colors hover:bg-[var(--bg-3)] hover:text-[var(--text-1)]"
            title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
