'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { DeFiPool, RiskAssessment, StrategyMode, SavedSimulation } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { formatUsd, formatPct, CHAIN_LABELS } from '@/utils';
import { useSimulation } from '@/hooks/useData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const SAVED_SIMS_KEY = 'nexus_saved_sims';
const MAX_SAVED_SIMS = 20;

function loadSavedSims(): SavedSimulation[] {
 if (typeof window === 'undefined') return [];
 try { return JSON.parse(localStorage.getItem(SAVED_SIMS_KEY) || '[]'); } catch { return []; }
}
function saveSimsToStorage(sims: SavedSimulation[]) { localStorage.setItem(SAVED_SIMS_KEY, JSON.stringify(sims)); }
function generateId(): string { return `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }

interface SimulatorPageProps { pools: DeFiPool[]; risks: RiskAssessment[]; mode: StrategyMode; }

export function SimulatorPage({ pools, risks, mode }: SimulatorPageProps) {
 const { result, loading, error, simulate } = useSimulation();
 const [selectedPoolId, setSelectedPoolId] = useState('');
 const [capital, setCapital] = useState(10000);
 const [days, setDays] = useState(365);
 const [searchQuery, setSearchQuery] = useState('');
 const [savedSims, setSavedSims] = useState<SavedSimulation[]>([]);
 const [showSaved, setShowSaved] = useState(false);
 const [saveMessage, setSaveMessage] = useState<string | null>(null);

 useEffect(() => { setSavedSims(loadSavedSims()); }, []);

 const selectedPool = pools.find((p) => p.id === selectedPoolId);

 const handleSave = useCallback(() => {
  if (!result || !selectedPool) return;
  const sim: SavedSimulation = {
 id: generateId(), poolSymbol: selectedPool.symbol, poolId: selectedPool.id,
 capital, days, riskMode: mode,
 results: { expectedReturn: result.simulation.expectedReturn, worstCase: result.simulation.worstCase, bestCase: result.simulation.bestCase, sharpeRatio: result.simulation.sharpeLikeRatio, netReturn: result.simulation.netReturn },
 timestamp: new Date().toISOString(),
  };
  setSavedSims((prev) => { const next = [sim, ...prev].slice(0, MAX_SAVED_SIMS); saveSimsToStorage(next); return next; });
  setSaveMessage('Simulation saved!'); setTimeout(() => setSaveMessage(null), 2000);
 }, [result, selectedPool, capital, days, mode]);

 const handleLoad = useCallback((sim: SavedSimulation) => { setCapital(sim.capital); setDays(sim.days); setSelectedPoolId(sim.poolId); setShowSaved(false); }, []);
 const handleDeleteSaved = useCallback((id: string) => { setSavedSims((prev) => { const next = prev.filter((s) => s.id !== id); saveSimsToStorage(next); return next; }); }, []);

 const riskMap = useMemo(() => new Map(risks.map((r) => [r.poolId, r])), [risks]);

 const searchResults = useMemo(() => {
  if (!searchQuery) return pools.slice(0, 20);
  const q = searchQuery.toLowerCase();
  return pools.filter((p) => p.symbol.toLowerCase().includes(q) || p.protocol.toLowerCase().includes(q)).slice(0, 20);
 }, [pools, searchQuery]);

 const handleSimulate = () => { if (!selectedPool) return; simulate(selectedPool, capital, days, mode); };
 const presets = [1000, 5000, 10000, 50000, 100000];

 return (
  <div className="space-y-6 animate-in">
 <div className="grid gap-4 lg:grid-cols-2">
  <Card className="surface ">
   <div className="mb-3 text-sm font-semibold">Select Pool</div>
   <div className="relative mb-3">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]">⌕</span>
  <input type="text" placeholder="Search pools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
   className="w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-black/30 py-2 pl-9 pr-4 text-sm text-white placeholder-[var(--text-3)] outline-none focus:border-[var(--accent)]/30" />
   </div>
   <div className="max-h-[240px] space-y-1 overflow-y-auto">
  {searchResults.map((pool) => {
   const risk = riskMap.get(pool.id);
   const isSelected = pool.id === selectedPoolId;
   return (
    <div key={pool.id} onClick={() => setSelectedPoolId(pool.id)}
   className={`flex cursor-pointer items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-xs transition-all ${isSelected ? 'bg-[var(--accent)]/20 ring-1 ring-[var(--accent)]/30' : 'hover:bg-white/5'}`}>
   <div><span className="font-medium">{pool.symbol}</span><span className="ml-2 text-[var(--text-3)]">{pool.protocol}</span></div>
   <div className="flex items-center gap-3">
    <span className="text-[var(--positive)]">{formatPct(pool.apy)}</span>
    {risk && <span className="text-[var(--text-3)]">R:{risk.score}</span>}
   </div>
    </div>
   );
  })}
   </div>
   {selectedPool && (
  <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--accent)]/10 p-3 text-xs">
   <div className="font-semibold text-[var(--accent)]">{selectedPool.symbol}</div>
   <div className="text-[var(--text-3)]">{selectedPool.protocol} · {CHAIN_LABELS[selectedPool.chain]} · TVL {formatUsd(selectedPool.tvlUsd)}</div>
  </div>
   )}
  </Card>

  <Card className="surface ">
   <div className="mb-3 text-sm font-semibold">Simulation Parameters</div>
   <div className="space-y-4">
  <div>
   <label className="mb-1.5 block text-xs text-[var(--text-3)]">Capital (USD)</label>
   <input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))}
    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)]/30" />
   <div className="mt-2 flex gap-2">
    {presets.map((v) => (
   <button key={v} onClick={() => setCapital(v)}
    className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-all ${capital === v ? 'bg-[var(--accent)]/30 text-[var(--accent)]' : 'bg-white/5 text-[var(--text-3)] hover:bg-white/10'}`}>
    ${v >= 1000 ? `${v / 1000}K` : v}
   </button>
    ))}
   </div>
  </div>
  <div>
   <label className="mb-1.5 block text-xs text-[var(--text-3)]">Time Horizon (Days)</label>
   <input type="range" min={7} max={730} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
   <div className="flex justify-between text-[10px] text-[var(--text-3)]">
    <span>7d</span><span className="font-medium text-white">{days} days ({(days / 30).toFixed(1)} months)</span><span>2yr</span>
   </div>
  </div>
  <Button onClick={handleSimulate} disabled={!selectedPool || loading} className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--negative)]">
   {loading ? '⏳ Running Monte Carlo...' : '▶ Run Simulation'}
  </Button>
   </div>
  </Card>
 </div>

 {error && <div className="surface border-[var(--negative)]/30 bg-[var(--negative-muted)] p-4 text-sm text-[var(--negative)]">⚠ {error}</div>}

 {result && selectedPool && (
  <div className="space-y-4 animate-in">
   <div className="flex items-center gap-3">
  <button onClick={handleSave} className="rounded-[var(--radius-sm)] bg-[var(--positive)]/20 px-4 py-2 text-[12px] font-medium text-[var(--positive)] transition-all hover:bg-[var(--positive)]/30">💾 Save Simulation</button>
  {saveMessage && <span className="text-[11px] text-[var(--positive)] animate-in">{saveMessage}</span>}
  <button onClick={() => setShowSaved(!showSaved)} className="rounded-[var(--radius-sm)] bg-white/[0.05] px-4 py-2 text-[12px] font-medium text-[var(--text-3)] transition-all hover:bg-white/[0.10]">📂 Saved ({savedSims.length})</button>
   </div>

   <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
  <ResultStat label="Expected Return" value={formatUsd(result.simulation.expectedReturn)} color="text-[var(--accent)]" />
  <ResultStat label="Best Case (95th)" value={formatUsd(result.simulation.bestCase)} color="text-[var(--positive)]" />
  <ResultStat label="Worst Case (5th)" value={formatUsd(result.simulation.worstCase)} color="text-[var(--negative)]" />
  <ResultStat label="Sharpe-like Ratio" value={result.simulation.sharpeLikeRatio.toFixed(3)} color="text-[var(--warning)]" />
   </div>

   <div className="grid grid-cols-3 gap-3">
  <ResultStat label="Net Return" value={formatUsd(result.simulation.netReturn)} color="text-[var(--positive)]" />
  <ResultStat label="IL Estimate" value={`${result.simulation.impermanentLossEstimate.toFixed(2)}%`} color="text-[var(--warning)]" />
  <ResultStat label="Gas Impact" value={`${result.simulation.gasImpact.toFixed(2)}%`} color="text-[var(--text-3)]" />
   </div>

   <Card className="surface p-0 overflow-hidden">
  <div className="border-b border-[var(--border-subtle)] px-5 py-3">
   <div className="text-sm font-semibold">Portfolio Growth Projection</div>
   <div className="text-[10px] text-[var(--text-3)]">{formatUsd(capital)} → {formatUsd(result.simulation.expectedReturn)} in {days} days</div>
  </div>
  <div className="h-[300px] px-2 py-2">
   <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={result.simulation.growthCurve}>
   <defs>
    <linearGradient id="gradExpected" x1="0" y1="0" x2="0" y2="1">
     <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
     <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
    </linearGradient>
   </defs>
   <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
   <XAxis dataKey="day" tick={{ fontSize: 10 }} />
   <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} />
   <Tooltip content={({ payload }) => {
    if (!payload?.length) return null;
    const d = payload[0].payload;
    return <div className="surface rounded-[var(--radius-sm)] px-3 py-2 text-xs"><div>Day {d.day}</div><div className="font-mono text-[var(--accent)]">{formatUsd(d.value)}</div></div>;
   }} />
   <ReferenceLine y={capital} stroke="#4a5f82" strokeDasharray="5 5" />
   <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} fill="url(#gradExpected)" />
    </AreaChart>
   </ResponsiveContainer>
  </div>
   </Card>

   <Card className="surface">
  <div className="mb-2 text-sm font-semibold">{result.explanation.headline}</div>
  <ul className="space-y-1 text-xs text-[var(--text-3)]">
   {result.explanation.insights.map((insight, i) => (
    <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">▸</span>{insight}</li>
   ))}
  </ul>
  <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--accent)]/10 p-3 text-xs">
   <div className="font-semibold text-[var(--accent)]">Recommendation</div>
   <div className="mt-1 text-[var(--text-3)]">{result.explanation.recommendation}</div>
  </div>
  <div className="mt-2 text-[10px] text-[var(--text-3)]">{result.explanation.riskNote}</div>
   </Card>
  </div>
 )}

 {showSaved && (
  <Card className="surface p-0 overflow-hidden animate-in">
   <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
  <div className="text-sm font-semibold">📂 Saved Simulations ({savedSims.length}/{MAX_SAVED_SIMS})</div>
  <button onClick={() => setShowSaved(false)} className="text-[var(--text-3)] hover:text-white text-sm">✕</button>
   </div>
   {savedSims.length === 0 ? (
  <div className="flex h-[120px] items-center justify-center text-xs text-[var(--text-3)]">No saved simulations yet.</div>
   ) : (
  <div className="divide-y divide-[var(--border-subtle)] max-h-[400px] overflow-y-auto">
   {savedSims.map((sim) => (
    <div key={sim.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
   <div>
    <div className="text-xs font-medium">{sim.poolSymbol}</div>
    <div className="text-[10px] text-[var(--text-3)]">${sim.capital.toLocaleString()} · {sim.days}d · {sim.riskMode}</div>
   </div>
   <div className="flex items-center gap-4">
    <div className="text-right">
     <div className="text-xs font-mono text-[var(--positive)]">{formatUsd(sim.results.expectedReturn)}</div>
     <div className="text-[9px] text-[var(--text-3)]">Sharpe: {sim.results.sharpeRatio.toFixed(3)}</div>
    </div>
    <div className="flex gap-1">
     <button onClick={() => handleLoad(sim)} className="rounded-md bg-[var(--accent)]/20 px-2 py-1 text-[10px] text-[var(--accent)] hover:bg-[var(--accent)]/30">Load</button>
     <button onClick={() => handleDeleteSaved(sim.id)} className="rounded-md bg-[var(--negative)]/20 px-2 py-1 text-[10px] text-[var(--negative)] hover:bg-[var(--negative)]/30">✕</button>
    </div>
   </div>
    </div>
   ))}
  </div>
   )}
  </Card>
 )}

 {!result && !loading && (
  <div className="surface flex h-[300px] items-center justify-center">
   <div className="text-center">
  <div className="text-4xl opacity-30">▷</div>
  <div className="mt-2 text-sm text-[var(--text-3)]">Select a pool and run simulation to see results</div>
   </div>
  </div>
 )}
  </div>
 );
}

function ResultStat({ label, value, color }: { label: string; value: string; color: string }) {
 return (
  <div className="surface p-4">
 <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-3)]">{label}</div>
 <div className={`mt-1 text-xl font-bold ${color}`}>{value}</div>
  </div>
 );
}
