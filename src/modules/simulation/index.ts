import type { DeFiPool, SimulationInput, SimulationResult } from '@/types';
import { clamp, randomNormal } from '@/utils';

const SIMULATION_PATHS = 100;
const GAS_COST_USD = 5;
const REINVEST_FREQUENCY_DAYS = 7;

function estimateImpermanentLoss(volatility: number, timeDays: number): number {
  const annualizedVol = volatility * 0.5;
  const timeFraction = timeDays / 365;
  const il = 0.5 * annualizedVol ** 2 * timeFraction;
  return clamp(il, 0, 0.3);
}

function gasImpact(capital: number, reinvestFreqDays: number, timeDays: number): number {
  const interactions = Math.floor(timeDays / reinvestFreqDays);
  return (interactions * GAS_COST_USD) / capital;
}

function simulatePath(capital: number, baseApy: number, volatility: number, days: number, ilEstimate: number, gasCost: number): number {
  let value = capital;
  for (let d = 1; d <= days; d++) {
    const dailyNoise = randomNormal(0, volatility * 0.01);
    const effectiveApy = Math.max(0, baseApy + dailyNoise * baseApy);
    value *= (1 + effectiveApy / 365);
    if (d % REINVEST_FREQUENCY_DAYS === 0) value -= GAS_COST_USD;
  }
  value *= (1 - ilEstimate);
  value -= gasCost * capital;
  return Math.max(0, value);
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const { capital, timeHorizonDays, apy, pool } = input;
  const volatility = pool.volatilityProxy;
  const ilEstimate = pool.ilRisk === 'yes'
    ? estimateImpermanentLoss(volatility, timeHorizonDays)
    : pool.ilRisk === 'uncertain'
    ? estimateImpermanentLoss(volatility, timeHorizonDays) * 0.3
    : 0;
  const gasCost = gasImpact(capital, REINVEST_FREQUENCY_DAYS, timeHorizonDays);
  const paths: number[] = [];
  for (let i = 0; i < SIMULATION_PATHS; i++) {
    paths.push(simulatePath(capital, apy, volatility, timeHorizonDays, ilEstimate, gasCost));
  }
  paths.sort((a, b) => a - b);
  const worstCase = paths[Math.floor(SIMULATION_PATHS * 0.05)];
  const bestCase = paths[Math.floor(SIMULATION_PATHS * 0.95)];
  const expectedReturn = paths.reduce((a, b) => a + b, 0) / SIMULATION_PATHS;
  const growthCurve: { day: number; value: number }[] = [];
  let curveValue = capital;
  for (let d = 0; d <= timeHorizonDays; d += Math.max(1, Math.floor(timeHorizonDays / 50))) {
    growthCurve.push({ day: d, value: Math.round(curveValue * 100) / 100 });
    curveValue *= (1 + apy / 365);
  }
  growthCurve.push({ day: timeHorizonDays, value: Math.round(curveValue * 100) / 100 });
  const netReturn = expectedReturn - capital;
  const returns = paths.map((p) => (p - capital) / capital);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const returnStd = Math.sqrt(returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length);
  const sharpeLikeRatio = returnStd > 0 ? avgReturn / returnStd : 0;
  return {
    expectedReturn: Math.round(expectedReturn * 100) / 100,
    worstCase: Math.round(worstCase * 100) / 100,
    bestCase: Math.round(bestCase * 100) / 100,
    sharpeLikeRatio: Math.round(sharpeLikeRatio * 1000) / 1000,
    growthCurve,
    impermanentLossEstimate: Math.round(ilEstimate * 10000) / 100,
    gasImpact: Math.round(gasCost * 10000) / 100,
    netReturn: Math.round(netReturn * 100) / 100,
  };
}
