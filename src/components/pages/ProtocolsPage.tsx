'use client';

import { useMemo, useState } from 'react';
import type { DeFiPool, RiskAssessment } from '@/types';
import { useI18n } from '@/services/i18n';
import { formatUsd, formatPct } from '@/utils';
import { Layers, Search, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProtocolsPageProps {
  pools: DeFiPool[];
  risks: RiskAssessment[];
}

export function ProtocolsPage({ pools, risks }: ProtocolsPageProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'tvl' | 'apy' | 'pools'>('tvl');

  const riskMap = useMemo(() => new Map(risks.map((r) => [r.poolId, r])), [risks]);

  const protocols = useMemo(() => {
    const map: Record<string, { name: string; pools: DeFiPool[]; totalTvl: number; avgApy: number; avgRisk: number; topPool: DeFiPool | null }> = {};

    pools.forEach((pool) => {
      const key = pool.protocol.toLowerCase();
      if (!map[key]) map[key] = { name: pool.protocol, pools: [], totalTvl: 0, avgApy: 0, avgRisk: 0, topPool: null };
      map[key].pools.push(pool);
      map[key].totalTvl += pool.tvlUsd;
    });

    Object.values(map).forEach((proto) => {
      proto.avgApy = proto.pools.reduce((s, p) => s + p.apy, 0) / proto.pools.length;
      proto.avgRisk = proto.pools.reduce((s, p) => s + (riskMap.get(p.id)?.score ?? 0), 0) / proto.pools.length;
      proto.topPool = proto.pools.reduce((best, p) => p.apy > (best?.apy ?? 0) ? p : best, proto.pools[0]);
    });

    let result = Object.values(map);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'tvl': return b.totalTvl - a.totalTvl;
        case 'apy': return b.avgApy - a.avgApy;
        case 'pools': return b.pools.length - a.pools.length;
        default: return 0;
      }
    });

    return result.slice(0, 50);
  }, [pools, riskMap, search, sortBy]);

  const top10Chart = useMemo(() => protocols.slice(0, 10).map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
    tvl: p.totalTvl,
    apy: Math.round(p.avgApy * 100) / 100,
  })), [protocols]);

  return (
    <div className="space-y-5 animate-in">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="metric">
          <div className="metric-label">{t('protocols.tvl')}</div>
          <div className="metric-value">{formatUsd(pools.reduce((s, p) => s + p.tvlUsd, 0))}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Total Protocols</div>
          <div className="metric-value">{new Set(pools.map(p => p.protocol.toLowerCase())).size}</div>
        </div>
        <div className="metric">
          <div className="metric-label">{t('protocols.avgApy')}</div>
          <div className="metric-value text-[var(--positive)]">{formatPct(pools.reduce((s, p) => s + p.apy, 0) / pools.length)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">{t('protocols.pools')}</div>
          <div className="metric-value">{pools.length}</div>
        </div>
      </div>

      <div className="surface">
        <div className="surface-header">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-[var(--accent-bright)]" />
            <span className="text-[13px] font-semibold">Top 10 Protocols by TVL</span>
          </div>
        </div>
        <div className="h-[260px] px-4 py-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top10Chart} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#4a5a78' }} tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#7a8baa' }} width={75} />
              <Tooltip contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11 }} formatter={(v) => [formatUsd(Number(v)), 'TVL']} />
              <Bar dataKey="tvl" radius={[0, 4, 4, 0]} barSize={14}>
                {top10Chart.map((_, i) => <Cell key={i} fill={i < 3 ? '#6366f1' : '#2d3a52'} fillOpacity={0.7} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface">
        <div className="surface-header">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[var(--accent-bright)]" />
            <span className="text-[13px] font-semibold">All Protocols ({protocols.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t('protocols.search')}
                className="h-7 w-40 rounded-md border border-[var(--border-default)] bg-[var(--bg-1)] pl-7 pr-2 text-[11px] text-[var(--text-0)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex gap-1">
              {(['tvl', 'apy', 'pools'] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-all ${sortBy === s ? 'bg-[var(--accent-muted)] text-[var(--accent-bright)]' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'}`}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Protocol</th>
                <th className="text-right">{t('protocols.tvl')}</th>
                <th className="text-center">{t('protocols.pools')}</th>
                <th className="text-right">{t('protocols.avgApy')}</th>
                <th className="text-center">Avg Risk</th>
                <th>{t('protocols.topPool')}</th>
                <th className="text-right">Top APY</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((proto, i) => (
                <tr key={proto.name}>
                  <td className="text-[var(--text-4)]">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent-muted)] text-[10px] font-bold text-[var(--accent-bright)]">
                        {proto.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{proto.name}</span>
                    </div>
                  </td>
                  <td className="text-right font-mono text-xs">{formatUsd(proto.totalTvl)}</td>
                  <td className="text-center font-mono text-xs">{proto.pools.length}</td>
                  <td className="text-right font-mono text-xs font-semibold text-[var(--positive)]">{formatPct(proto.avgApy)}</td>
                  <td className="text-center">
                    <span className={`tag ${proto.avgRisk < 30 ? 'tag-positive' : proto.avgRisk < 60 ? 'tag-warning' : 'tag-negative'}`}>
                      {proto.avgRisk.toFixed(0)}
                    </span>
                  </td>
                  <td className="text-[11px] text-[var(--text-2)]">{proto.topPool?.symbol ?? '—'}</td>
                  <td className="text-right font-mono text-xs font-semibold text-[var(--positive)]">{proto.topPool ? formatPct(proto.topPool.apy) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
