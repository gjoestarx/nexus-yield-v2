export type Chain =
  | 'ethereum'
  | 'bsc'
  | 'arbitrum'
  | 'polygon'
  | 'solana'
  | 'base'
  | 'optimism'
  | 'avalanche'
  | 'fantom'
  | 'gnosis'
  | 'celo'
  | 'linea'
  | 'scroll'
  | 'mantle'
  | 'zksync'
  | 'starknet'
  | 'ton'
  | 'sui'
  | 'aptos'
  | 'osmosis'
  | 'cardano'
  | 'berachain'
  | 'sonic'
  | 'hyperliquid'
  | 'katana'
  | 'fraxtal'
  | 'flare'
  | 'megaeth'
  | 'ink';

export interface DeFiPool {
  id: string;
  chain: Chain;
  protocol: string;
  protocolSlug: string;
  symbol: string;
  pool: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number | null;
  apyMean30d: number;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  poolMeta: string | null;
  url?: string;
  volatilityProxy: number;
  liquidityDepthScore: number;
  stabilityIndicator: number;
}

export interface RiskFactors {
  tvlRisk: number;
  apyAnomaly: number;
  volatility: number;
  protocolMaturity: number;
  liquidityRisk: number;
}

export interface RiskAssessment {
  poolId: string;
  score: number;
  category: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  confidence: number;
  factors: RiskFactors;
}

export interface SimulationInput {
  capital: number;
  timeHorizonDays: number;
  apy: number;
  riskPreference: 'conservative' | 'balanced' | 'aggressive';
  pool: DeFiPool;
}

export interface SimulationResult {
  expectedReturn: number;
  worstCase: number;
  bestCase: number;
  sharpeLikeRatio: number;
  growthCurve: { day: number; value: number }[];
  impermanentLossEstimate: number;
  gasImpact: number;
  netReturn: number;
}

export type StrategyMode = 'conservative' | 'balanced' | 'aggressive';

export interface StrategyWeights {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface StrategyRanking {
  poolId: string;
  score: number;
  mode: StrategyMode;
  isTrapPool: boolean;
  trapReason?: string;
}

export interface PoolExplanation {
  poolId: string;
  headline: string;
  insights: string[];
  recommendation: string;
  riskNote: string;
}

export interface YieldAlert {
  id: string;
  poolSymbol: string;
  poolId: string;
  threshold: number;
  direction: 'above' | 'below';
  enabled: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface SavedSimulation {
  id: string;
  poolSymbol: string;
  poolId: string;
  capital: number;
  days: number;
  riskMode: StrategyMode;
  results: {
    expectedReturn: number;
    worstCase: number;
    bestCase: number;
    sharpeRatio: number;
    netReturn: number;
  };
  timestamp: string;
}

export interface DefiLlamaPoolResponse {
  chain: string;
  project: string;
  symbol: string;
  pool: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number | null;
  apyMean30d: number;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  poolMeta: string | null;
  mu?: number;
  sigma?: number;
  count?: number;
}

export interface CoinGeckoPriceResponse {
  [coinId: string]: { usd: number };
}
