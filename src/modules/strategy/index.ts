import type { DeFiPool, RiskAssessment, StrategyMode, StrategyWeights, StrategyRanking } from '@/types';
import { clamp } from '@/utils';

const MODE_WEIGHTS: Record<StrategyMode, StrategyWeights> = {
  conservative: { alpha: 0.2, beta: 0.6, gamma: 0.2 },
  balanced:     { alpha: 0.4, beta: 0.3, gamma: 0.3 },
  aggressive:   { alpha: 0.7, beta: 0.15, gamma: 0.15 },
};

const TRAP_APY_THRESHOLD = 100;
const TRAP_RISK_THRESHOLD = 70;
const TRAP_TVL_THRESHOLD = 50_000;

function detectTrap(pool: DeFiPool, risk: RiskAssessment): { isTrap: boolean; reason?: string } {
  if (pool.apy > TRAP_APY_THRESHOLD && risk.score > TRAP_RISK_THRESHOLD) {
    if (pool.tvlUsd < TRAP_TVL_THRESHOLD) return { isTrap: true, reason: 'Extremely high APY with low TVL and high risk' };
    return { isTrap: true, reason: 'High APY paired with high risk score' };
  }
  if (pool.apy > 200 && risk.factors.protocolMaturity > 0.6) return { isTrap: true, reason: 'Extreme APY from unknown protocol' };
  if (pool.volatilityProxy > 0.7 && pool.apy > 50) return { isTrap: true, reason: 'High APY volatility' };
  return { isTrap: false };
}

function normalizeReturn(pool: DeFiPool, maxApy: number): number {
  if (maxApy === 0) return 0;
  return clamp(pool.apy / maxApy, 0, 1);
}

function rankPool(pool: DeFiPool, risk: RiskAssessment, mode: StrategyMode, maxApy: number): StrategyRanking {
  const weights = MODE_WEIGHTS[mode];
  const returnScore = normalizeReturn(pool, maxApy);
  const riskScore = risk.score / 100;
  const stabilityScore = pool.stabilityIndicator;
  const score = weights.alpha * returnScore - weights.beta * riskScore + weights.gamma * stabilityScore;
  const trap = detectTrap(pool, risk);
  return { poolId: pool.id, score: Math.round(clamp(score, 0, 1) * 1000) / 1000, mode, isTrapPool: trap.isTrap, trapReason: trap.reason };
}

export function rankPools(pools: DeFiPool[], risks: RiskAssessment[], mode: StrategyMode): StrategyRanking[] {
  const riskMap = new Map(risks.map((r) => [r.poolId, r]));
  const maxApy = Math.max(...pools.map((p) => p.apy), 1);
  const rankings = pools
    .map((pool) => { const risk = riskMap.get(pool.id); if (!risk) return null; return rankPool(pool, risk, mode, maxApy); })
    .filter(Boolean) as StrategyRanking[];
  rankings.sort((a, b) => b.score - a.score);
  return rankings;
}

export function getTopPools(rankings: StrategyRanking[], n: number = 10): StrategyRanking[] {
  return rankings.filter((r) => !r.isTrapPool).slice(0, n);
}
