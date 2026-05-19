'use client';

import { useMemo } from 'react';
import type { DeFiPool, RiskAssessment, StrategyRanking } from '@/types';
import { formatUsd, formatPct, CHAIN_LABELS, CHAIN_COLORS, RISK_COLORS } from '@/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface OverviewPageProps {
 pools: DeFiPool[];
 risks: RiskAssessment[];
 rankings: StrategyRanking[];
 stats: { totalPools: number; avgApy: number; avgRisk: number; trapPools: number; chains: string[] };
 onSelectPool: (pool: DeFiPool) => void;
}

export function OverviewPage({ pools, risks, rankings, stats, onSelectPool }: OverviewPageProps) {
 const riskMap = useMemo(() => new Map(risks.map((r) => [r.poolId, r])), [risks]);
 const rankMap = useMemo(() => new Map(rankings.map((r) => [r.poolId, r])), [rankings]);

 const topPools = useMemo(() => [...pools].sort((a, b) => (rankMap.get(b.id)?.score ?? 0) - (rankMap.get(a.id)?.score ?? 0)).slice(0, 10), [pools, rankMap]);

 const chainDistribution = useMemo(() => {
  const counts: Record<string, number> = {};
  pools.forEach((p) => { counts[p.chain] = (counts[p.chain] || 0) + 1; });
  return Object.entries(counts)
 .map(([chain, count]) => ({ chain: CHAIN_LABELS[chain as keyof typeof CHAIN_LABELS] ?? chain, count, color: CHAIN_COLORS[chain as keyof typeof CHAIN_COLORS] ?? '#666' }))
 .sort((a, b) => b.count - a.count)
 .slice(0, 8);
 }, [pools]);

 const riskDistribution = useMemo(() => {
  const buckets = { 'Very Low': 0, 'Low': 0, 'Medium': 0, 'High': 0, 'Very High': 0 };
  risks.forEach((r) => { if (r.category in buckets) buckets[r.category as keyof typeof buckets]++; });
  return Object.entries(buckets).map(([name, value]) => ({ name, value, color: RISK_COLORS[name as keyof typeof RISK_COLORS] }));
 }, [risks]);

 const topApyPools = useMemo(() => [...pools].sort((a, b) => b.apy - a.apy).slice(0, 8), [pools]);

 const metrics = [
  { label: 'Total Pools', value: stats.totalPools.toLocaleString(), color: 'var(--accent)' },
  { label: 'Avg APY', value: formatPct(stats.avgApy), color: 'var(--positive)' },
  { label: 'Avg Risk', value: `${stats.avgRisk.toFixed(1)}/100`, color: 'var(--warning)' },
  { label: 'Trap Pools', value: String(stats.trapPools), color: 'var(--negative)' },
 ];

 return (
  <div className="space-y-6 animate-in">
 <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
  {metrics.map((m) => (
   <div key={m.label} className="metric">
  <div className="metric-label">{m.label}</div>
  <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
   </div>
  ))}
 </div>

 <div className="grid gap-4 lg:grid-cols-3">
  <div className="surface lg:col-span-2">
   <div className="surface-header">
  <span className="text-[13px] font-semibold">Top Pools by Score</span>
  <span className="text-[10px] text-[var(--text-4)]">{topPools.length} shown</span>
   </div>
   <div className="overflow-x-auto">
  <table className="data-table">
   <thead>
    <tr>
   <th>#</th>
   <th>Pool</th>
   <th>Chain</th>
   <th className="text-right">TVL</th>
   <th className="text-right">APY</th>
   <th className="text-center">Risk</th>
   <th className="text-center">Score</th>
    </tr>
   </thead>
   <tbody>
    {topPools.map((pool, i) => {
   const risk = riskMap.get(pool.id);
   const rank = rankMap.get(pool.id);
   return (
    <tr key={pool.id} onClick={() => onSelectPool(pool)}>
     <td className="text-[var(--text-4)]">{i + 1}</td>
     <td>
    <div className="font-medium">{pool.symbol}</div>
    <div className="text-[10px] text-[var(--text-4)]">{pool.protocol}</div>
     </td>
     <td>
    <span className="tag" style={{ background: `${CHAIN_COLORS[pool.chain]}18`, color: CHAIN_COLORS[pool.chain] }}>
     {CHAIN_LABELS[pool.chain]}
    </span>
     </td>
     <td className="text-right font-mono text-xs">{formatUsd(pool.tvlUsd)}</td>
     <td className="text-right font-mono text-xs font-semibold text-[var(--positive)]">{formatPct(pool.apy)}</td>
     <td className="text-center">
    {risk && <span className={`tag ${risk.score < 30 ? 'tag-positive' : risk.score < 60 ? 'tag-warning' : 'tag-negative'}`}>{risk.score}</span>}
     </td>
     <td className="text-center font-mono text-xs font-semibold">{rank?.score.toFixed(3) ?? '—'}</td>
    </tr>
   );
    })}
   </tbody>
  </table>
   </div>
  </div>

  <div className="space-y-4">
   <div className="surface">
  <div className="surface-header">
   <span className="text-[13px] font-semibold">Chain Distribution</span>
  </div>
  <div className="surface-padded">
   <div className="h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
   <PieChart>
    <Pie data={chainDistribution} dataKey="count" nameKey="chain" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
     {chainDistribution.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
    </Pie>
    <Tooltip contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 11 }} formatter={(v, name) => [`${v} pools`, name]} />
   </PieChart>
    </ResponsiveContainer>
   </div>
   <div className="mt-2 flex flex-wrap justify-center gap-2">
    {chainDistribution.slice(0, 5).map((d) => (
   <div key={d.chain} className="flex items-center gap-1 text-[9px] text-[var(--text-3)]">
    <div className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />{d.chain}
   </div>
    ))}
   </div>
  </div>
   </div>

   <div className="surface">
  <div className="surface-header">
   <span className="text-[13px] font-semibold">Risk Profile</span>
  </div>
  <div className="surface-padded">
   {riskDistribution.map((d) => (
    <div key={d.name} className="flex items-center gap-3 py-1.5">
   <div className="w-16 text-[10px] text-[var(--text-3)]">{d.name}</div>
   <div className="flex-1">
    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-3)]">
     <div className="h-full rounded-full transition-all" style={{ width: `${(d.value / Math.max(...riskDistribution.map(r => r.value), 1)) * 100}%`, background: d.color }} />
    </div>
   </div>
   <div className="w-8 text-right text-[10px] font-mono text-[var(--text-2)]">{d.value}</div>
    </div>
   ))}
  </div>
   </div>
  </div>
 </div>

 <div className="surface">
  <div className="surface-header">
   <span className="text-[13px] font-semibold">Highest APY Pools</span>
   <span className="text-[10px] text-[var(--text-4)]">Top 8 by current APY</span>
  </div>
  <div className="h-[260px] px-4 py-3">
   <ResponsiveContainer width="100%" height="100%">
  <BarChart data={topApyPools} layout="vertical" margin={{ left: 80 }}>
   <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
   <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
   <YAxis type="category" dataKey="symbol" tick={{ fontSize: 11 }} width={75} />
   <Tooltip contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 11 }} formatter={(v) => [`${Number(v).toFixed(2)}%`, 'APY']} />
   <Bar dataKey="apy" radius={[0, 4, 4, 0]} barSize={16}>
    {topApyPools.map((_, i) => <Cell key={i} fill={i < 3 ? 'var(--accent)' : 'var(--text-4)'} fillOpacity={0.7} />)}
   </Bar>
  </BarChart>
   </ResponsiveContainer>
  </div>
 </div>
  </div>
 );
}
