'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/services/i18n';
import { formatUsd } from '@/utils';
import { Calculator, TrendingUp, DollarSign, Calendar, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function YieldCalculatorPage() {
  const { t } = useI18n();
  const [amount, setAmount] = useState(10000);
  const [apy, setApy] = useState(12);
  const [period, setPeriod] = useState(365);
  const [periodUnit, setPeriodUnit] = useState<'days' | 'months' | 'years'>('days');
  const [compound, setCompound] = useState(true);

  const days = periodUnit === 'days' ? period : periodUnit === 'months' ? period * 30 : period * 365;

  const result = useMemo(() => {
    const dailyRate = apy / 100 / 365;
    const curve: { day: number; value: number }[] = [];
    let value = amount;

    for (let d = 0; d <= days; d++) {
      curve.push({ day: d, value: Math.round(value * 100) / 100 });
      if (compound) {
        value *= (1 + dailyRate);
      } else {
        value = amount * (1 + (apy / 100) * (d / 365));
      }
    }

    const finalValue = curve[curve.length - 1].value;
    const earnings = finalValue - amount;
    const dailyYield = amount * dailyRate;
    const monthlyYield = amount * (apy / 100 / 12);
    const yearlyYield = amount * (apy / 100);

    return { finalValue, earnings, dailyYield, monthlyYield, yearlyYield, curve };
  }, [amount, apy, days, compound]);

  const presets = [1000, 5000, 10000, 50000, 100000, 500000];
  const apyPresets = [5, 10, 15, 20, 50, 100];

  return (
    <div className="space-y-5 animate-in">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface">
          <div className="surface-header">
            <div className="flex items-center gap-2">
              <Calculator size={14} className="text-[var(--accent-bright)]" />
              <span className="text-[13px] font-semibold">{t('yieldCalc.title')}</span>
            </div>
          </div>
          <div className="surface-padded space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">{t('yieldCalc.amount')} (USD)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                className="input text-[16px] font-semibold h-11" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {presets.map((v) => (
                  <button key={v} onClick={() => setAmount(v)}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${amount === v ? 'bg-[var(--accent-muted)] text-[var(--accent-bright)]' : 'bg-white/[0.03] text-[var(--text-3)] hover:bg-white/[0.06]'}`}>
                    ${v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">{t('yieldCalc.apy')} (%)</label>
              <input type="number" value={apy} onChange={(e) => setApy(Number(e.target.value))} step={0.5}
                className="input text-[16px] font-semibold h-11" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {apyPresets.map((v) => (
                  <button key={v} onClick={() => setApy(v)}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${apy === v ? 'bg-[var(--accent-muted)] text-[var(--accent-bright)]' : 'bg-white/[0.03] text-[var(--text-3)] hover:bg-white/[0.06]'}`}>
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">{t('yieldCalc.period')}</label>
              <div className="flex gap-2">
                <input type="number" value={period} onChange={(e) => setPeriod(Number(e.target.value))}
                  className="input flex-1" />
                <div className="flex gap-1">
                  {(['days', 'months', 'years'] as const).map((u) => (
                    <button key={u} onClick={() => setPeriodUnit(u)}
                      className={`rounded-md px-3 py-2 text-[11px] font-semibold transition-all ${periodUnit === u ? 'bg-[var(--accent-muted)] text-[var(--accent-bright)]' : 'bg-white/[0.03] text-[var(--text-3)] hover:bg-white/[0.06]'}`}>
                      {t(`yieldCalc.${u}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-3)]">Compound Interest</span>
              <button onClick={() => setCompound(!compound)}
                className={`relative w-10 h-5 rounded-full transition-colors ${compound ? 'bg-[var(--accent)]' : 'bg-[var(--bg-3)]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${compound ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="metric">
              <div className="metric-label flex items-center gap-1"><DollarSign size={10} />{t('yieldCalc.earnings')}</div>
              <div className="metric-value text-[var(--positive)]">{formatUsd(result.earnings)}</div>
            </div>
            <div className="metric">
              <div className="metric-label flex items-center gap-1"><TrendingUp size={10} />{t('yieldCalc.finalValue')}</div>
              <div className="metric-value">{formatUsd(result.finalValue)}</div>
            </div>
            <div className="metric">
              <div className="metric-label flex items-center gap-1"><Zap size={10} />{t('yieldCalc.dailyYield')}</div>
              <div className="metric-value text-[14px] text-[var(--accent-bright)]">{formatUsd(result.dailyYield)}</div>
            </div>
            <div className="metric">
              <div className="metric-label flex items-center gap-1"><Calendar size={10} />{t('yieldCalc.monthlyYield')}</div>
              <div className="metric-value text-[14px] text-[var(--info)]">{formatUsd(result.monthlyYield)}</div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-label">{t('yieldCalc.yearlyYield')}</div>
            <div className="metric-value text-[var(--warning)]">{formatUsd(result.yearlyYield)}</div>
          </div>
        </div>
      </div>

      <div className="surface">
        <div className="surface-header">
          <span className="text-[13px] font-semibold">{t('sim.growth')}</span>
          <span className="text-[10px] text-[var(--text-4)]">{formatUsd(amount)} → {formatUsd(result.finalValue)} in {days} {t('common.days')}</span>
        </div>
        <div className="h-[300px] px-2 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.curve}>
              <defs>
                <linearGradient id="calcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4a5a78' }} />
              <YAxis tick={{ fontSize: 10, fill: '#4a5a78' }} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} />
              <Tooltip contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11 }} formatter={(v) => [formatUsd(Number(v)), 'Value']} labelFormatter={(l) => `Day ${l}`} />
              <ReferenceLine y={amount} stroke="#4a5a78" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#calcGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
