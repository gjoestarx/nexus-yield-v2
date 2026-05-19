'use client';

import type { DeFiPool, RiskAssessment, StrategyRanking } from '@/types';
import { Badge, Card } from '@/components/ui';
import { formatUsd, formatPct, CHAIN_LABELS, CHAIN_COLORS } from '@/utils';

interface PoolTableProps {
 pools: DeFiPool[];
 risks: RiskAssessment[];
 rankings: StrategyRanking[];
 onSelect: (pool: DeFiPool) => void;
 loading: boolean;
}

export function PoolTable({ pools, risks, rankings, onSelect, loading }: PoolTableProps) {
 const riskMap = new Map(risks.map((r) => [r.poolId, r]));
 const rankMap = new Map(rankings.map((r) => [r.poolId, r]));

 if (loading) {
  return (
 <Card className="surface">
  <div className="space-y-3">{[...Array(8)].map((_, i) => (<div key={i} className="flex gap-4 animate-pulse"><div className="h-5 w-32 rounded bg-white/5" /><div className="h-5 w-20 rounded bg-white/5" /><div className="h-5 w-16 rounded bg-white/5" /><div className="h-5 w-16 rounded bg-white/5" /></div>))}</div>
 </Card>
  );
 }

 return (
  <div className="space-y-2">
 <div className="flex items-center justify-between">
  <div className="text-[11px] text-[var(--text-3)]">{pools.length} pools</div>
 </div>
 <Card className="surface overflow-hidden p-0">
  <div className="overflow-x-auto">
   <table className="w-full text-sm">
  <thead>
   <tr className="border-b border-[var(--border-subtle)] bg-black/20">
    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">Pool</th>
    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">Chain</th>
    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">TVL</th>
    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">APY</th>
    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">30d Avg</th>
    <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">Risk</th>
    <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">Stability</th>
    <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">Score</th>
    <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--text-3)]">Status</th>
   </tr>
  </thead>
  <tbody>
   {pools.map((pool) => {
    const risk = riskMap.get(pool.id); const rank = rankMap.get(pool.id);
    return (
   <tr key={pool.id} onClick={() => onSelect(pool)} className="cursor-pointer border-b border-[var(--border-subtle)]/30 transition-colors hover:bg-white/5">
    <td className="px-4 py-2.5"><div className="font-medium">{pool.symbol}</div><div className="text-[10px] text-[var(--text-3)]">{pool.protocol}</div></td>
    <td className="px-4 py-2.5"><span className="rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ background: `${CHAIN_COLORS[pool.chain]}20`, color: CHAIN_COLORS[pool.chain] }}>{CHAIN_LABELS[pool.chain]}</span></td>
    <td className="px-4 py-2.5 text-right font-mono text-xs">{formatUsd(pool.tvlUsd)}</td>
    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-[var(--positive)]">{formatPct(pool.apy)}</td>
    <td className="px-4 py-2.5 text-right font-mono text-xs text-[var(--text-3)]">{formatPct(pool.apyMean30d)}</td>
    <td className="px-4 py-2.5 text-center">{risk && <Badge variant={risk.score < 30 ? 'success' : risk.score < 60 ? 'warning' : 'danger'}>{risk.score}</Badge>}</td>
    <td className="px-4 py-2.5 text-center"><div className="mx-auto h-1.5 w-14 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pool.stabilityIndicator * 100}%` }} /></div></td>
    <td className="px-4 py-2.5 text-center font-mono text-xs font-semibold">{rank?.score.toFixed(3) ?? '—'}</td>
    <td className="px-4 py-2.5 text-center">{rank?.isTrapPool ? <span className="text-xs">🪤</span> : pool.stablecoin ? <span className="text-xs">🟢</span> : <span className="text-xs">🔵</span>}</td>
   </tr>
    );
   })}
  </tbody>
   </table>
  </div>
  {pools.length === 0 && <div className="p-8 text-center text-[var(--text-3)]">No pools match your filters.</div>}
 </Card>
  </div>
 );
}
