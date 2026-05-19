import type { DeFiPool, RiskFactors, RiskAssessment } from '@/types';
import { clamp, normalize, logNormalize, mean, stdDev } from '@/utils';

const WEIGHTS = {
  tvlRisk: 0.25,
  apyAnomaly: 0.20,
  volatility: 0.20,
  protocolMaturity: 0.15,
  liquidityRisk: 0.20,
};

const TVL_MIN = 1_000;
const TVL_MAX = 1_000_000_000;

const MATURE_PROTOCOLS = new Set([
  'aave', 'compound', 'lido', 'uniswap', 'curve', 'convex',
  'makerdao', 'yearn-finance', 'sushiswap', 'balancer',
  'pancakeswap', 'quickswap', 'gmx', 'radiant',
]);

const SEMI_MATURE_PROTOCOLS = new Set([
  'stargate', 'morpho', 'rocket-pool', 'pendle', 'ethena',
  'eigenlayer', 'renzo', 'ether.fi', 'kamino', 'marinade',
]);

function calcTvlRisk(pool: DeFiPool): number {
  return 1 - logNormalize(pool.tvlUsd, TVL_MIN, TVL_MAX);
}

let cachedApyStats: { mean: number; std: number } | null = null;

function getApyStats(pools: DeFiPool[]): { mean: number; std: number } {
  if (cachedApyStats) return cachedApyStats;
  const apyValues = pools.map((p) => p.apy);
  cachedApyStats = { mean: mean(apyValues), std: stdDev(apyValues) };
  return cachedApyStats;
}

function calcApyAnomaly(pool: DeFiPool, allPools: DeFiPool[]): number {
  const { mean: m, std: sd } = getApyStats(allPools);
  if (sd === 0) return 0;
  const zScore = (pool.apy - m) / sd;
  if (pool.apy > m + 2 * sd) return clamp(Math.abs(zScore) / 5, 0, 1);
  if (pool.apy < 0.1) return 0.3;
  return clamp(Math.abs(zScore) / 5, 0, 0.5);
}

function calcVolatility(pool: DeFiPool): number {
  return pool.volatilityProxy;
}

function calcProtocolMaturity(pool: DeFiPool): number {
  const slug = pool.protocolSlug.toLowerCase();
  const name = pool.protocol.toLowerCase();
  if (MATURE_PROTOCOLS.has(slug) || MATURE_PROTOCOLS.has(name)) return 0.1;
  if (SEMI_MATURE_PROTOCOLS.has(slug) || SEMI_MATURE_PROTOCOLS.has(name)) return 0.4;
  if (pool.tvlUsd > 100_000_000) return 0.3;
  if (pool.tvlUsd > 10_000_000) return 0.5;
  if (pool.tvlUsd > 1_000_000) return 0.7;
  return 0.85;
}

function calcLiquidityRisk(pool: DeFiPool): number {
  let risk = pool.liquidityDepthScore;
  if (pool.ilRisk === 'yes') risk += 0.15;
  else if (pool.ilRisk === 'uncertain') risk += 0.08;
  if (pool.exposure === 'multi') risk += 0.05;
  return clamp(risk, 0, 1);
}

function categorize(score: number): RiskAssessment['category'] {
  if (score < 20) return 'Very Low';
  if (score < 40) return 'Low';
  if (score < 60) return 'Medium';
  if (score < 80) return 'High';
  return 'Very High';
}

export function assessRisk(pool: DeFiPool, allPools: DeFiPool[]): RiskAssessment {
  const factors: RiskFactors = {
    tvlRisk: calcTvlRisk(pool),
    apyAnomaly: calcApyAnomaly(pool, allPools),
    volatility: calcVolatility(pool),
    protocolMaturity: calcProtocolMaturity(pool),
    liquidityRisk: calcLiquidityRisk(pool),
  };
  const rawScore =
    WEIGHTS.tvlRisk * factors.tvlRisk +
    WEIGHTS.apyAnomaly * factors.apyAnomaly +
    WEIGHTS.volatility * factors.volatility +
    WEIGHTS.protocolMaturity * factors.protocolMaturity +
    WEIGHTS.liquidityRisk * factors.liquidityRisk;
  const score = clamp(Math.round(rawScore * 100), 0, 100);
  let confidence = 0.8;
  if (pool.tvlUsd < 10_000) confidence -= 0.2;
  if (pool.apyMean30d === 0) confidence -= 0.1;
  if (pool.ilRisk === 'uncertain') confidence -= 0.1;
  return { poolId: pool.id, score, category: categorize(score), confidence: clamp(confidence, 0.3, 1), factors };
}

export function assessAllRisks(pools: DeFiPool[]): RiskAssessment[] {
  cachedApyStats = null;
  getApyStats(pools);
  return pools.map((pool) => assessRisk(pool, pools));
}
