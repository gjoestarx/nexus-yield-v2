import type { DeFiPool } from '@/types';
import { logNormalize, clamp } from '@/utils';

const TVL_MIN = 1_000;
const TVL_MAX = 1_000_000_000;

function computeVolatility(pool: DeFiPool): number {
  const deviation = Math.abs(pool.apy - pool.apyMean30d);
  const base = Math.max(pool.apyMean30d, 1);
  return clamp(deviation / base, 0, 1);
}

function computeLiquidityDepth(pool: DeFiPool): number {
  return 1 - logNormalize(pool.tvlUsd, TVL_MIN, TVL_MAX);
}

function computeStability(pool: DeFiPool): number {
  let score = 0.5;
  if (pool.stablecoin) score += 0.2;
  if (pool.ilRisk === 'no') score += 0.15;
  else if (pool.ilRisk === 'yes') score -= 0.15;
  if (pool.exposure === 'single') score += 0.1;
  const vol = computeVolatility(pool);
  score += (1 - vol) * 0.15;
  const liq = computeLiquidityDepth(pool);
  score += (1 - liq) * 0.1;
  return clamp(score, 0, 1);
}

export function enrichPools(pools: DeFiPool[]): DeFiPool[] {
  return pools.map((pool) => ({
    ...pool,
    volatilityProxy: computeVolatility(pool),
    liquidityDepthScore: computeLiquidityDepth(pool),
    stabilityIndicator: computeStability(pool),
  }));
}
