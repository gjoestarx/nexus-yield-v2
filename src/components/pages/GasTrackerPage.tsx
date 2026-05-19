'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/services/i18n';
import { CHAIN_LABELS, CHAIN_COLORS } from '@/utils';
import { Fuel, ArrowDown, ArrowUp, Minus, RefreshCw } from 'lucide-react';

interface GasPrice {
  chain: string;
  gwei: number;
  trend: 'up' | 'down' | 'stable';
  lastBlock: number;
  baseFee: number;
  priority: number;
}

const CHAIN_GAS: Record<string, { base: number; icon: string }> = {
  ethereum: { base: 18, icon: 'Ξ' },
  arbitrum: { base: 0.1, icon: '◈' },
  optimism: { base: 0.01, icon: '●' },
  base: { base: 0.005, icon: '◆' },
  polygon: { base: 30, icon: '⬡' },
  bsc: { base: 3, icon: '◆' },
  avalanche: { base: 25, icon: '▲' },
  fantom: { base: 20, icon: '👻' },
  gnosis: { base: 2, icon: '◎' },
  zksync: { base: 0.25, icon: '◇' },
  linea: { base: 0.1, icon: '═' },
  scroll: { base: 0.15, icon: '≋' },
  mantle: { base: 0.02, icon: '▣' },
  celo: { base: 0.5, icon: '◈' },
  sonic: { base: 1, icon: '◈' },
};

function generateGasData(): GasPrice[] {
  return Object.entries(CHAIN_GAS).map(([chain, cfg]) => {
    const variance = (Math.random() - 0.5) * cfg.base * 0.4;
    const gwei = Math.max(0.001, cfg.base + variance);
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    return {
      chain,
      gwei: Math.round(gwei * 1000) / 1000,
      trend: trends[Math.floor(Math.random() * 3)],
      lastBlock: Math.floor(Math.random() * 1000000) + 18000000,
      baseFee: Math.round(gwei * 0.85 * 1000) / 1000,
      priority: Math.round(gwei * 0.15 * 1000) / 1000,
    };
  }).sort((a, b) => a.gwei - b.gwei);
}

function getGasLevel(gwei: number): { label: string; color: string; class: string } {
  if (gwei < 5) return { label: 'Cheap', color: 'var(--positive)', class: 'tag-positive' };
  if (gwei < 20) return { label: 'Moderate', color: 'var(--warning)', class: 'tag-warning' };
  return { label: 'Expensive', color: 'var(--negative)', class: 'tag-negative' };
}

export function GasTrackerPage() {
  const { t } = useI18n();
  const [gasData, setGasData] = useState<GasPrice[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setGasData(generateGasData()); setLoading(false); }, 500);
    const id = setInterval(() => { setGasData(generateGasData()); setLastUpdate(new Date()); }, 15000);
    return () => clearInterval(id);
  }, []);

  const cheapest = gasData.length > 0 ? gasData[0] : null;

  return (
    <div className="space-y-5 animate-in">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="metric">
          <div className="metric-label">{t('gas.cheapest')}</div>
          <div className="metric-value text-[var(--positive)]">{cheapest ? `${cheapest.gwei} Gwei` : '—'}</div>
          <div className="metric-change text-[var(--text-3)]">{cheapest ? CHAIN_LABELS[cheapest.chain as keyof typeof CHAIN_LABELS] : ''}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Chains Monitored</div>
          <div className="metric-value">{gasData.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Last Update</div>
          <div className="metric-value text-[14px] text-[var(--text-1)]">{lastUpdate.toLocaleTimeString()}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Auto-refresh</div>
          <div className="metric-value text-[14px] text-[var(--positive)]">15s</div>
        </div>
      </div>

      <div className="surface">
        <div className="surface-header">
          <div className="flex items-center gap-2">
            <Fuel size={14} className="text-[var(--accent-bright)]" />
            <span className="text-[13px] font-semibold">{t('gas.title')}</span>
          </div>
          <button onClick={() => { setGasData(generateGasData()); setLastUpdate(new Date()); }} className="flex items-center gap-1 text-[10px] text-[var(--text-3)] hover:text-[var(--accent-bright)] transition-colors">
            <RefreshCw size={10} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Chain</th>
                <th className="text-right">Gas (Gwei)</th>
                <th className="text-center">Trend</th>
                <th className="text-center">Level</th>
                <th className="text-right">{t('gas.baseFee')}</th>
                <th className="text-right">Priority</th>
                <th className="text-right">{t('gas.lastBlock')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td><div className="h-4 w-24 rounded bg-white/5 animate-pulse" /></td>
                    <td><div className="h-4 w-16 rounded bg-white/5 animate-pulse ml-auto" /></td>
                    <td><div className="h-4 w-8 rounded bg-white/5 animate-pulse mx-auto" /></td>
                    <td><div className="h-4 w-16 rounded bg-white/5 animate-pulse mx-auto" /></td>
                    <td><div className="h-4 w-14 rounded bg-white/5 animate-pulse ml-auto" /></td>
                    <td><div className="h-4 w-14 rounded bg-white/5 animate-pulse ml-auto" /></td>
                    <td><div className="h-4 w-20 rounded bg-white/5 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : gasData.map((gas) => {
                const level = getGasLevel(gas.gwei);
                const chainLabel = CHAIN_LABELS[gas.chain as keyof typeof CHAIN_LABELS] ?? gas.chain;
                const chainColor = CHAIN_COLORS[gas.chain as keyof typeof CHAIN_COLORS] ?? '#666';
                return (
                  <tr key={gas.chain}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px]" style={{ color: chainColor }}>{CHAIN_GAS[gas.chain]?.icon ?? '●'}</span>
                        <span className="font-medium">{chainLabel}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono text-xs font-semibold" style={{ color: level.color }}>{gas.gwei}</td>
                    <td className="text-center">
                      {gas.trend === 'up' && <ArrowUp size={12} className="text-[var(--negative)] mx-auto" />}
                      {gas.trend === 'down' && <ArrowDown size={12} className="text-[var(--positive)] mx-auto" />}
                      {gas.trend === 'stable' && <Minus size={12} className="text-[var(--text-4)] mx-auto" />}
                    </td>
                    <td className="text-center"><span className={`tag ${level.class}`}>{level.label}</span></td>
                    <td className="text-right font-mono text-xs text-[var(--text-2)]">{gas.baseFee}</td>
                    <td className="text-right font-mono text-xs text-[var(--text-3)]">{gas.priority}</td>
                    <td className="text-right font-mono text-xs text-[var(--text-4)]">{gas.lastBlock.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
