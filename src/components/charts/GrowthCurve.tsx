'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { SimulationResult } from '@/types';
import { Card } from '@/components/ui';
import { formatUsd } from '@/utils';

interface GrowthCurveProps { simulation: SimulationResult; capital: number; }

export function GrowthCurve({ simulation, capital }: GrowthCurveProps) {
  const data = simulation.growthCurve.map((p) => ({
    day: p.day, value: p.value,
    worst: capital + (p.value - capital) * 0.3,
    best: capital + (p.value - capital) * 1.7,
  }));

  return (
    <Card className="panel-glass">
      <div className="mb-3 text-sm font-semibold">Portfolio Growth Simulation</div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} /><stop offset="95%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient>
              <linearGradient id="worstGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
              <linearGradient id="bestGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5a5a6e' }} label={{ value: 'Days', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#5a5a6e' } }} />
            <YAxis tick={{ fontSize: 11, fill: '#5a5a6e' }} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} />
            <Tooltip content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="panel-glass rounded-xl px-4 py-3 shadow-xl">
                  <div className="text-sm font-medium">Day {d.day}</div>
                  <div className="text-sm text-[var(--green)]">Best: {formatUsd(d.best)}</div>
                  <div className="text-sm text-[var(--accent)]">Expected: {formatUsd(d.value)}</div>
                  <div className="text-sm text-[var(--red)]">Worst: {formatUsd(d.worst)}</div>
                </div>
              );
            }} />
            <ReferenceLine y={capital} stroke="#4a5f82" strokeDasharray="5 5" label={{ value: 'Initial Capital', position: 'right', style: { fontSize: 11, fill: '#5a5a6e' } }} />
            <Area type="monotone" dataKey="best" stroke="#22c55e" strokeWidth={1} fill="url(#bestGrad)" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} fill="url(#growthGrad)" />
            <Area type="monotone" dataKey="worst" stroke="#ef4444" strokeWidth={1} fill="url(#worstGrad)" strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex justify-center gap-6 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--green)]" /> Best case</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Expected</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--red)]" /> Worst case</span>
      </div>
    </Card>
  );
}
