'use client';

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DeFiPool, RiskAssessment } from '@/types';
import { Card } from '@/components/ui';
import { RISK_COLORS, CHAIN_LABELS } from '@/utils';

interface ApyVsRiskScatterProps { pools: DeFiPool[]; risks: RiskAssessment[]; onSelect: (pool: DeFiPool) => void; }

export function ApyVsRiskScatter({ pools, risks, onSelect }: ApyVsRiskScatterProps) {
  const riskMap = useMemo(() => new Map(risks.map((r) => [r.poolId, r])), [risks]);

  const data = useMemo(() =>
    pools.filter((p) => riskMap.has(p.id)).map((p) => ({
      risk: riskMap.get(p.id)!.score, apy: Math.min(p.apy, 200), tvl: p.tvlUsd,
      name: p.symbol, protocol: p.protocol, chain: p.chain, pool: p,
    })), [pools, riskMap]);

  const getColor = (risk: number): string => {
    if (risk < 20) return RISK_COLORS['Very Low'];
    if (risk < 40) return RISK_COLORS['Low'];
    if (risk < 60) return RISK_COLORS['Medium'];
    if (risk < 80) return RISK_COLORS['High'];
    return RISK_COLORS['Very High'];
  };

  return (
    <Card className="panel-glass">
      <div className="mb-3 text-sm font-semibold">APY vs Risk Score</div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="risk" name="Risk Score" domain={[0, 100]} tick={{ fontSize: 11, fill: '#5a5a6e' }} label={{ value: 'Risk Score', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#5a5a6e' } }} />
            <YAxis dataKey="apy" name="APY %" tick={{ fontSize: 11, fill: '#5a5a6e' }} label={{ value: 'APY %', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#5a5a6e' } }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="panel-glass rounded-xl px-4 py-3 shadow-xl">
                  <div className="text-sm font-bold">{d.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{d.protocol} · {CHAIN_LABELS[d.chain]}</div>
                  <div className="mt-2 space-y-0.5 text-xs">
                    <div>APY: <span className="font-mono text-[var(--green)]">{d.apy.toFixed(2)}%</span></div>
                    <div>Risk: <span className="font-mono">{d.risk}</span></div>
                    <div>TVL: <span className="font-mono">${(d.tvl / 1e6).toFixed(2)}M</span></div>
                  </div>
                </div>
              );
            }} />
            <Scatter data={data} onClick={(entry) => { const p = (entry as unknown as { pool: DeFiPool })?.pool; if (p) onSelect(p); }} style={{ cursor: 'pointer' }}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.risk)} fillOpacity={0.7} r={Math.max(3, Math.min(10, Math.log10(entry.tvl + 1) * 1.5))} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
