'use client';

import { useMemo } from 'react';
import type { DeFiPool, RiskAssessment, StrategyRanking } from '@/types';
import { formatUsd, formatPct, CHAIN_LABELS, CHAIN_COLORS, RISK_COLORS } from '@/utils';
import { BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface OverviewPageProps {
  pools: DeFiPool[];
  risks: RiskAssessment[];
  rankings: StrategyRanking[];
  stats: { totalPools: number; avgApy: number; avgRisk: number; trapPools: number; chains: string[]; chainBreakdown?: Record<string, number>; };
  onSelectPool?: (pool: DeFiPool) => void;
}

export function OverviewPage({ pools, risks, rankings, stats, onSelectPool }: OverviewPageProps) {
  const riskMap = useMemo(() => new Map(risks.map((r) => [r.poolId, r])), [risks]);

  const chainData = useMemo(() => {
    const breakdown = stats.chainBreakdown || {};
    return Object.entries(breakdown)
      .map(([chain, count]) => ({ chain: CHAIN_LABELS[chain] || chain, count, color: CHAIN_COLORS[chain] || '#64748b', key: chain }))
      .sort((a, b) => b.count - a.count);
  }, [stats.chainBreakdown]);

  const topPerChain = useMemo(() => {
    const best: Record<string, DeFiPool> = {};
    pools.forEach((p) => { if (!best[p.chain] || p.apy > best[p.chain].apy) best[p.chain] = p; });
    return Object.entries(best).map(([chain, pool]) => ({
      chain: CHAIN_LABELS[chain], color: CHAIN_COLORS[chain], symbol: pool.symbol,
      protocol: pool.protocol, apy: pool.apy, tvl: pool.tvlUsd, pool,
    }));
  }, [pools]);

  const safest = useMemo(() => {
    return [...pools].filter((p) => riskMap.has(p.id)).sort((a, b) => (riskMap.get(a.id)!.score) - (riskMap.get(b.id)!.score)).slice(0, 5);
  }, [pools, riskMap]);

  const topApy = useMemo(() => [...pools].sort((a, b) => b.apy - a.apy).slice(0, 5), [pools]);

  const riskDist = useMemo(() => {
    const cats: Record<string, number> = { 'Very Low': 0, 'Low': 0, 'Medium': 0, 'High': 0, 'Very High': 0 };
    risks.forEach((r) => { cats[r.category]++; });
    return Object.entries(cats).map(([name, value]) => ({ name, value, color: RISK_COLORS[name] })).filter((d) => d.value > 0);
  }, [risks]);

  const tvlByChain = useMemo(() => {
    const tvls: Record<string, number> = {};
    pools.forEach((p) => { tvls[p.chain] = (tvls[p.chain] || 0) + p.tvlUsd; });
    return Object.entries(tvls)
      .map(([chain, tvl]) => ({ chain: CHAIN_LABELS[chain] || chain, tvl: Math.round(tvl / 1e9 * 100) / 100, color: CHAIN_COLORS[chain] || '#64748b' }))
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, 8);
  }, [pools]);

  const tip = { background: '#101018', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 11 };

  return (
    <div className="space-y-6 animate-in">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <HeroStat label="Total Pools" value={stats.totalPools.toLocaleString()} color="var(--accent)" />
        <HeroStat label="Avg APY" value={formatPct(stats.avgApy)} color="var(--green)" />
        <HeroStat label="Risk Score" value={`${stats.avgRisk.toFixed(1)}`} color="var(--gold)" />
        <HeroStat label="Trap Pools" value={String(stats.trapPools)} color="var(--red)" />
        <HeroStat label="Chains" value={String(stats.chains.length)} color="var(--blue)" />
      </div>

      {/* Chain Distribution - Full Width */}
      <div className="card-flat overflow-hidden">
        <div className="section-header px-5">
          <div>
            <div className="section-title">Chain Distribution</div>
            <div className="section-subtitle">Pool count across all supported chains</div>
          </div>
          <div className="stat-pill">{stats.totalPools.toLocaleString()} total</div>
        </div>
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {chainData.slice(0, 8).map((c) => (
              <div key={c.key} className="card-flat flex items-center gap-3 p-3">
                <div className="h-10 w-1 rounded-full" style={{ background: c.color }} />
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: c.color }}>{c.chain}</div>
                  <div className="text-[18px] font-bold">{c.count.toLocaleString()}</div>
                  <div className="text-[9px] text-[var(--text-muted)]">{((c.count / stats.totalPools) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Risk Distribution */}
        <div className="card-flat p-4">
          <div className="mb-3 text-[12px] font-semibold text-[var(--text-secondary)]">Risk Distribution</div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDist} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#48485a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#48485a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} formatter={(v) => [`${v} pools`, 'Count']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {riskDist.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TVL by Chain */}
        <div className="card-flat p-4">
          <div className="mb-3 text-[12px] font-semibold text-[var(--text-secondary)]">TVL by Chain</div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tvlByChain} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#48485a' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} />
                <YAxis type="category" dataKey="chain" tick={{ fontSize: 10, fill: '#8e8ea0' }} axisLine={false} tickLine={false} width={72} />
                <Tooltip contentStyle={tip} formatter={(v) => [`$${v}B`, 'TVL']} />
                <Bar dataKey="tvl" radius={[0, 6, 6, 0]}>
                  {tvlByChain.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.6} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pool Share Pie */}
        <div className="card-flat p-4">
          <div className="mb-3 text-[12px] font-semibold text-[var(--text-secondary)]">Pool Share</div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chainData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="count">
                  {chainData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tip} formatter={(v, name) => [`${v} pools`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {chainData.slice(0, 6).map((c) => (
              <div key={c.key} className="flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />{c.chain}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lists Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Best APY per Chain */}
        <div className="card-flat overflow-hidden">
          <div className="section-header px-4">
            <div className="section-title">Best APY per Chain</div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {topPerChain.slice(0, 8).map((item) => (
              <div key={item.chain} onClick={() => onSelectPool?.(item.pool)} className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                  <div>
                    <div className="text-[12px] font-medium">{item.symbol}</div>
                    <div className="text-[9px] text-[var(--text-muted)]">{item.protocol} · {item.chain}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-[var(--green)]">{formatPct(item.apy)}</div>
                  <div className="text-[9px] text-[var(--text-muted)]">{formatUsd(item.tvl)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest APY */}
        <div className="card-flat overflow-hidden">
          <div className="section-header px-4">
            <div className="section-title">Highest APY</div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {topApy.map((pool, i) => (
              <div key={pool.id} onClick={() => onSelectPool?.(pool)} className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-[6px] text-[9px] font-bold bg-[var(--green-dim)] text-[var(--green)]">{i + 1}</span>
                  <div>
                    <div className="text-[12px] font-medium">{pool.symbol}</div>
                    <div className="text-[9px] text-[var(--text-muted)]">{pool.protocol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-[var(--green)]">{formatPct(pool.apy)}</div>
                  <div className="text-[9px] text-[var(--text-muted)]">{formatUsd(pool.tvlUsd)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safest Pools */}
        <div className="card-flat overflow-hidden">
          <div className="section-header px-4">
            <div className="section-title">Safest Pools</div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {safest.map((pool, i) => {
              const risk = riskMap.get(pool.id);
              return (
                <div key={pool.id} onClick={() => onSelectPool?.(pool)} className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-[6px] text-[9px] font-bold bg-[var(--accent-dim)] text-[var(--accent)]">{i + 1}</span>
                    <div>
                      <div className="text-[12px] font-medium">{pool.symbol}</div>
                      <div className="text-[9px] text-[var(--text-muted)]">{pool.protocol} · {CHAIN_LABELS[pool.chain]}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-[var(--accent)]">Risk: {risk?.score}</div>
                    <div className="text-[9px] text-[var(--text-muted)]">{formatPct(pool.apy)} APY</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="stat-card" style={{ '--accent': color } as React.CSSProperties}>
      <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 text-[22px] font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
