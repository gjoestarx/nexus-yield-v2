import type { DeFiPool, Chain } from '@/types';
import { fetchDefiLlamaPools } from './ingestion';
import { normalizePools } from './normalization';
import { enrichPools } from './enrichment';
import { cache } from '@/services/cache';

export interface PipelineOptions {
  chains?: Chain[];
  minTvl?: number;
  stablecoinOnly?: boolean;
}

let globalEnrichedPools: DeFiPool[] | null = null;
let globalCacheTime = 0;
const GLOBAL_CACHE_TTL = 10 * 60 * 1000;

async function getGlobalPools(): Promise<DeFiPool[]> {
  const now = Date.now();
  if (globalEnrichedPools && (now - globalCacheTime) < GLOBAL_CACHE_TTL) {
    return globalEnrichedPools;
  }
  const rawPools = await fetchDefiLlamaPools();
  const normalized = normalizePools(rawPools);
  const enriched = enrichPools(normalized);
  globalEnrichedPools = enriched;
  globalCacheTime = now;
  return enriched;
}

export async function runPipeline(options: PipelineOptions = {}): Promise<DeFiPool[]> {
  const { chains, minTvl = 0, stablecoinOnly = false } = options;
  let pools = await getGlobalPools();
  if (chains && chains.length > 0) pools = pools.filter((p) => chains.includes(p.chain));
  if (minTvl > 0) pools = pools.filter((p) => p.tvlUsd >= minTvl);
  if (stablecoinOnly) pools = pools.filter((p) => p.stablecoin);
  return pools;
}

export { fetchDefiLlamaPools, fetchTokenPrices } from './ingestion';
export { normalizePools } from './normalization';
export { enrichPools } from './enrichment';
