'use client';

import { useState, useCallback, useMemo } from 'react';
import type { DeFiPool, StrategyMode } from '@/types';
import { usePools, useAutoRefresh } from '@/hooks/useData';
import { useI18n } from '@/services/i18n';
import { Sidebar, type Page } from '@/components/layout/Sidebar';
import { HeaderBar } from '@/components/layout/Header';

import dynamic from 'next/dynamic';

const OverviewPage = dynamic(() => import('@/components/pages/OverviewPage').then(m => ({ default: m.OverviewPage })), { ssr: false });
const AnalyticsPage = dynamic(() => import('@/components/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })), { ssr: false });
const StrategiesPage = dynamic(() => import('@/components/pages/StrategiesPage').then(m => ({ default: m.StrategiesPage })), { ssr: false });
const ExplorerPage = dynamic(() => import('@/components/pages/ExplorerPage').then(m => ({ default: m.ExplorerPage })), { ssr: false });
const SimulatorPage = dynamic(() => import('@/components/pages/SimulatorPage').then(m => ({ default: m.SimulatorPage })), { ssr: false });
const PortfolioBuilder = dynamic(() => import('@/components/pages/PortfolioPage').then(m => ({ default: m.PortfolioBuilder })), { ssr: false });
const ComparePage = dynamic(() => import('@/components/pages/ComparePage').then(m => ({ default: m.ComparePage })), { ssr: false });
const WatchlistPage = dynamic(() => import('@/components/pages/WatchlistPage').then(m => ({ default: m.WatchlistPage })), { ssr: false });
const PoolAnalyzer = dynamic(() => import('@/components/pool/PoolAnalyzer').then(m => ({ default: m.PoolAnalyzer })), { ssr: false });
const AlertsPage = dynamic(() => import('@/components/pages/AlertsPage').then(m => ({ default: m.AlertsPage })), { ssr: false });
const GasTrackerPage = dynamic(() => import('@/components/pages/GasTrackerPage').then(m => ({ default: m.GasTrackerPage })), { ssr: false });
const YieldCalculatorPage = dynamic(() => import('@/components/pages/YieldCalculatorPage').then(m => ({ default: m.YieldCalculatorPage })), { ssr: false });
const ProtocolsPage = dynamic(() => import('@/components/pages/ProtocolsPage').then(m => ({ default: m.ProtocolsPage })), { ssr: false });

export default function Dashboard() {
  const { t } = useI18n();
  const [activePage, setActivePage] = useState<Page>('overview');
  const [mode, setMode] = useState<StrategyMode>('balanced');
  const [selectedPool, setSelectedPool] = useState<DeFiPool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data, loading, error, refresh, lastRefreshTime } = usePools({ mode });
  const autoRefresh = useAutoRefresh(refresh, refreshInterval);

  const handleModeChange = useCallback((m: StrategyMode) => { setMode(m); }, []);
  const handleRefreshIntervalChange = useCallback((seconds: number) => { setRefreshInterval(seconds); }, []);
  const toggleSidebar = useCallback(() => { setSidebarCollapsed(prev => !prev); }, []);

  const PAGE_TITLES: Record<Page, { title: string; subtitle: string }> = {
    overview: { title: t('page.overview.title'), subtitle: t('page.overview.subtitle') },
    analytics: { title: t('page.analytics.title'), subtitle: t('page.analytics.subtitle') },
    strategies: { title: t('page.strategies.title'), subtitle: t('page.strategies.subtitle') },
    explorer: { title: t('page.explorer.title'), subtitle: t('page.explorer.subtitle') },
    simulator: { title: t('page.simulator.title'), subtitle: t('page.simulator.subtitle') },
    portfolio: { title: t('page.portfolio.title'), subtitle: t('page.portfolio.subtitle') },
    compare: { title: t('page.compare.title'), subtitle: t('page.compare.subtitle') },
    watchlist: { title: t('page.watchlist.title'), subtitle: t('page.watchlist.subtitle') },
    alerts: { title: t('page.alerts.title'), subtitle: t('page.alerts.subtitle') },
    gas: { title: t('page.gas.title'), subtitle: t('page.gas.subtitle') },
    yieldCalc: { title: t('page.yieldCalc.title'), subtitle: t('page.yieldCalc.subtitle') },
    protocols: { title: t('page.protocols.title'), subtitle: t('page.protocols.subtitle') },
  };

  const pageInfo = PAGE_TITLES[activePage];
  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  const searchFilteredPools = useMemo(() => {
    if (!data || !searchQuery.trim()) return data?.pools ?? [];
    const q = searchQuery.toLowerCase().trim();
    return data.pools.filter((p) =>
      p.symbol.toLowerCase().includes(q) || p.protocol.toLowerCase().includes(q) || p.chain.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const searchFilteredRisks = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data.risks;
    const poolIds = new Set(searchFilteredPools.map(p => p.id));
    return data.risks.filter(r => poolIds.has(r.poolId));
  }, [data, searchQuery, searchFilteredPools]);

  const searchFilteredRankings = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data.rankings;
    const poolIds = new Set(searchFilteredPools.map(p => p.id));
    return data.rankings.filter(r => poolIds.has(r.poolId));
  }, [data, searchQuery, searchFilteredPools]);

  if (loading && !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
          <div className="text-[13px] text-[var(--text-1)]">{t('common.loading')}</div>
          <div className="mt-1 text-[10px] text-[var(--text-3)]">{t('common.fetching')}</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="surface p-8 text-center">
          <div className="text-2xl">⚠</div>
          <div className="mt-2 text-[13px]">{error}</div>
          <button onClick={refresh} className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-[12px] text-white hover:bg-[var(--accent)]/80">
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const pools = searchQuery.trim() ? searchFilteredPools : data.pools;
  const risks = searchQuery.trim() ? searchFilteredRisks : data.risks;
  const rankings = searchQuery.trim() ? searchFilteredRankings : data.rankings;
  const selectedRisk = selectedPool ? data.risks.find((r) => r.poolId === selectedPool.id) : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        poolCount={data.stats.totalPools}
        alertCount={alertCount}
        chainCount={data.stats.chains.length}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="flex-1" style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.2s ease' }}>
        <HeaderBar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          mode={mode}
          onModeChange={handleModeChange}
          timestamp={data.timestamp}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResultCount={pools.length}
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={handleRefreshIntervalChange}
          lastRefreshTime={lastRefreshTime}
        />
        <main className="p-5">
          {activePage === 'overview' && <OverviewPage pools={pools} risks={risks} rankings={rankings} stats={data.stats} onSelectPool={setSelectedPool} />}
          {activePage === 'analytics' && <AnalyticsPage pools={pools} risks={risks} />}
          {activePage === 'strategies' && <StrategiesPage pools={pools} risks={risks} rankings={rankings} mode={mode} onSelectPool={setSelectedPool} />}
          {activePage === 'explorer' && <ExplorerPage pools={pools} risks={risks} rankings={rankings} onSelectPool={setSelectedPool} />}
          {activePage === 'simulator' && <SimulatorPage pools={pools} risks={risks} mode={mode} />}
          {activePage === 'portfolio' && <PortfolioBuilder pools={pools} risks={risks} />}
          {activePage === 'compare' && <ComparePage pools={pools} risks={risks} />}
          {activePage === 'watchlist' && <WatchlistPage pools={pools} risks={risks} />}
          {activePage === 'alerts' && <AlertsPage pools={pools} risks={risks} onAlertCountChange={setAlertCount} />}
          {activePage === 'gas' && <GasTrackerPage />}
          {activePage === 'yieldCalc' && <YieldCalculatorPage />}
          {activePage === 'protocols' && <ProtocolsPage pools={pools} risks={risks} />}
        </main>
      </div>
      {selectedPool && selectedRisk && (
        <PoolAnalyzer pool={selectedPool} risk={selectedRisk} mode={mode} onClose={() => setSelectedPool(null)} />
      )}
    </div>
  );
}
