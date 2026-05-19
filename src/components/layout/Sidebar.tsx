'use client';

import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Compass, FlaskConical, Briefcase, GitCompare, Star, Bell, TrendingUp, PanelLeftClose, PanelLeftOpen, Sun, Moon, Languages, Fuel, Calculator, Layers, ChevronDown, Check } from 'lucide-react';
import { useI18n, LANGUAGES, type Lang } from '@/services/i18n';
import { useTheme } from '@/services/theme';
import { WalletButton } from '@/components/ui/WalletButton';

export type Page = 'overview' | 'analytics' | 'strategies' | 'explorer' | 'simulator' | 'portfolio' | 'compare' | 'watchlist' | 'alerts' | 'gas' | 'yieldCalc' | 'protocols';

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
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const NAV_SECTIONS: { label: string; items: { id: Page; icon: React.ReactNode; label: string }[] }[] = [
    {
      label: t('nav.discover'),
      items: [
        { id: 'overview', icon: <LayoutDashboard size={15} />, label: t('nav.overview') },
        { id: 'analytics', icon: <BarChart3 size={15} />, label: t('nav.analytics') },
        { id: 'strategies', icon: <TrendingUp size={15} />, label: t('nav.strategies') },
        { id: 'explorer', icon: <Compass size={15} />, label: t('nav.explorer') },
      ],
    },
    {
      label: t('nav.tools'),
      items: [
        { id: 'simulator', icon: <FlaskConical size={15} />, label: t('nav.simulator') },
        { id: 'portfolio', icon: <Briefcase size={15} />, label: t('nav.portfolio') },
        { id: 'compare', icon: <GitCompare size={15} />, label: t('nav.compare') },
        { id: 'gas', icon: <Fuel size={15} />, label: t('nav.gas') },
        { id: 'yieldCalc', icon: <Calculator size={15} />, label: t('nav.yieldCalc') },
        { id: 'protocols', icon: <Layers size={15} />, label: t('nav.protocols') },
      ],
    },
    {
      label: t('nav.personal'),
      items: [
        { id: 'watchlist', icon: <Star size={15} />, label: t('nav.watchlist') },
        { id: 'alerts', icon: <Bell size={15} />, label: t('nav.alerts') },
      ],
    },
  ];

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <aside className="app-sidebar" style={{ width: collapsed ? 60 : 240, transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <div className="sidebar-logo" style={{ padding: collapsed ? '20px 12px 16px' : '20px 18px 16px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div className="sidebar-logo-mark">N</div>
        {!collapsed && <div className="sidebar-logo-text">NexusYield</div>}
      </div>

      <nav className="flex-1 overflow-y-auto py-1">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="sidebar-section" style={{ padding: collapsed ? '0 6px' : '0 10px' }}>
            {!collapsed && <div className="sidebar-section-label">{section.label}</div>}
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`sidebar-link ${active === item.id ? 'active' : ''}`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '7px 9px' }}
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

      <div className="sidebar-footer" style={{ padding: collapsed ? '10px 6px' : '14px 18px' }}>
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

        <div className={`mt-3 flex items-center ${collapsed ? 'flex-col gap-1.5' : 'gap-1'}`}>
          <button
            onClick={toggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] transition-all hover:bg-[var(--accent-muted)] hover:text-[var(--accent-bright)]"
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div className="lang-dropdown" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex h-7 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold text-[var(--text-3)] transition-all hover:bg-[var(--accent-muted)] hover:text-[var(--accent-bright)]"
              title="Language"
            >
              <Languages size={13} />
              {!collapsed && (
                <>
                  <span>{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
                  <ChevronDown size={10} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
            {langOpen && (
              <div className="lang-dropdown-menu">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`lang-dropdown-item ${lang === l.code ? 'active' : ''}`}
                  >
                    <span className="text-[14px]">{l.flag}</span>
                    <span className="flex-1">{l.label}</span>
                    {lang === l.code && <Check size={12} className="text-[var(--accent-bright)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] transition-all hover:bg-[var(--accent-muted)] hover:text-[var(--accent-bright)]"
            title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
