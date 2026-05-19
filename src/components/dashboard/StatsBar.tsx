'use client';

import { Card } from '@/components/ui';
import { formatPct } from '@/utils';

interface StatsBarProps {
  stats: { totalPools: number; avgApy: number; avgRisk: number; trapPools: number; chains: string[] } | null;
  loading: boolean;
}

export function StatsBar({ stats, loading }: StatsBarProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (<Card key={i} className="card-glass animate-pulse"><div className="h-4 w-24 rounded bg-white/5" /><div className="mt-2 h-8 w-16 rounded bg-white/5" /></Card>))}
      </div>
    );
  }

  const items = [
    { label: 'Total Pools', value: stats.totalPools.toLocaleString(), color: 'var(--accent)' },
    { label: 'Avg APY', value: formatPct(stats.avgApy), color: 'var(--green)' },
    { label: 'Avg Risk Score', value: `${stats.avgRisk.toFixed(1)}/100`, color: 'var(--gold)' },
    { label: 'Trap Pools', value: String(stats.trapPools), color: 'var(--red)' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="card-glass" style={{ borderLeft: `3px solid ${item.color}` }}>
          <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">{item.label}</div>
          <div className="mt-1 text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
        </Card>
      ))}
    </div>
  );
}
