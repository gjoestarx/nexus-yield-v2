'use client';

import { useState, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import type { StrategyMode } from '@/types';
import { useI18n } from '@/services/i18n';

interface HeaderBarProps {
  title: string;
  subtitle: string;
  mode: StrategyMode;
  onModeChange: (mode: StrategyMode) => void;
  timestamp: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResultCount: number;
  refreshInterval: number;
  onRefreshIntervalChange: (seconds: number) => void;
  lastRefreshTime: number;
}

export function HeaderBar({
  title, subtitle, mode, onModeChange,
  searchQuery, onSearchChange, searchResultCount,
  refreshInterval, onRefreshIntervalChange, lastRefreshTime,
}: HeaderBarProps) {
  const { t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const [elapsed, setElapsed] = useState('0s');

  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - lastRefreshTime) / 1000);
      setElapsed(s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);
    }, 1000);
    return () => clearInterval(id);
  }, [lastRefreshTime]);

  const MODES: { value: StrategyMode; label: string }[] = [
    { value: 'conservative', label: t('header.conservative') },
    { value: 'balanced', label: t('header.balanced') },
    { value: 'aggressive', label: t('header.aggressive') },
  ];

  return (
    <header className="app-header">
      <div>
        <div className="header-title">{title}</div>
        <div className="header-subtitle">{subtitle}</div>
      </div>

      <div className="header-actions">
        <div className="mode-switcher">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={`mode-btn ${mode === m.value ? 'active' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {searchOpen ? (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              autoFocus
              placeholder={t('header.search')}
              className="header-search-input pl-9"
            />
            {searchQuery && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-4)]">
                {searchResultCount}
              </span>
            )}
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="header-search-btn">
            <Search size={16} />
          </button>
        )}

        <div className="flex items-center gap-1 text-[10px] text-[var(--text-4)]">
          <Clock size={10} />
          <span>{elapsed}</span>
        </div>

        <select
          value={refreshInterval}
          onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
          className="h-8 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-2)] px-2 text-[10px] text-[var(--text-3)] outline-none"
        >
          <option value={0}>{t('header.norefresh')}</option>
          <option value={30}>30s</option>
          <option value={60}>1m</option>
          <option value={300}>5m</option>
        </select>
      </div>
    </header>
  );
}
