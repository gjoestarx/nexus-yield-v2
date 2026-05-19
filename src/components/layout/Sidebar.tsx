'use client';

import { LayoutDashboard, BarChart3, Compass, FlaskConical, Briefcase, GitCompare, Star, Bell, TrendingUp, Wallet } from 'lucide-react';

export type Page = 'overview' | 'analytics' | 'strategies' | 'explorer' | 'simulator' | 'portfolio' | 'compare' | 'watchlist' | 'alerts';

interface SidebarProps {
 active: Page;
 onNavigate: (page: Page) => void;
 poolCount: number;
 alertCount: number;
 chainCount: number;
}

const NAV_SECTIONS: { label: string; items: { id: Page; icon: React.ReactNode; label: string; badge?: string }[] }[] = [
 {
  label: 'Discover',
  items: [
 { id: 'overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
 { id: 'analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
 { id: 'strategies', icon: <TrendingUp size={16} />, label: 'Strategies' },
 { id: 'explorer', icon: <Compass size={16} />, label: 'Explorer' },
  ],
 },
 {
  label: 'Tools',
  items: [
 { id: 'simulator', icon: <FlaskConical size={16} />, label: 'Simulator' },
 { id: 'portfolio', icon: <Briefcase size={16} />, label: 'Portfolio' },
 { id: 'compare', icon: <GitCompare size={16} />, label: 'Compare' },
  ],
 },
 {
  label: 'Personal',
  items: [
 { id: 'watchlist', icon: <Star size={16} />, label: 'Watchlist' },
 { id: 'alerts', icon: <Bell size={16} />, label: 'Alerts' },
  ],
 },
];

export function Sidebar({ active, onNavigate, poolCount, alertCount, chainCount }: SidebarProps) {
 return (
  <aside className="app-sidebar">
 <div className="sidebar-logo">
  <div className="sidebar-logo-mark">N</div>
  <div className="sidebar-logo-text">NexusYield</div>
 </div>

 <nav className="flex-1 overflow-y-auto py-2">
  {NAV_SECTIONS.map((section) => (
   <div key={section.label} className="sidebar-section">
  <div className="sidebar-section-label">{section.label}</div>
  {section.items.map((item) => (
   <button
    key={item.id}
    onClick={() => onNavigate(item.id)}
    className={`sidebar-link ${active === item.id ? 'active' : ''}`}
   >
    <span className="sidebar-link-icon">{item.icon}</span>
    <span className="flex-1">{item.label}</span>
    {item.id === 'alerts' && alertCount > 0 && (
   <span className="tag tag-warning text-[9px]">{alertCount}</span>
    )}
   </button>
  ))}
   </div>
  ))}
 </nav>

 <div className="sidebar-footer">
  <div className="flex items-center justify-between text-[10px] text-[var(--text-4)]">
   <span>{poolCount.toLocaleString()} pools</span>
   <span>{chainCount} chains</span>
  </div>
  <div className="mt-2 flex items-center gap-2">
   <div className="dot-live" />
   <span className="text-[10px] text-[var(--text-3)]">Live data</span>
  </div>
 </div>
  </aside>
 );
}
