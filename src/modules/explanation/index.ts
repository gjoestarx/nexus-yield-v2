import type { DeFiPool, RiskAssessment, SimulationResult, PoolExplanation } from '@/types';
import { formatUsd, formatPct } from '@/utils';

function tvlInsight(pool: DeFiPool): string {
  if (pool.tvlUsd < 10_000) return `Very low TVL (${formatUsd(pool.tvlUsd)}) — high slippage and rug risk`;
  if (pool.tvlUsd < 100_000) return `Low TVL (${formatUsd(pool.tvlUsd)}) — limited liquidity`;
  if (pool.tvlUsd > 100_000_000) return `Deep liquidity with ${formatUsd(pool.tvlUsd)} TVL`;
  if (pool.tvlUsd > 10_000_000) return `Healthy TVL of ${formatUsd(pool.tvlUsd)}`;
  return `Moderate TVL of ${formatUsd(pool.tvlUsd)}`;
}

function apyInsight(pool: DeFiPool, risk: RiskAssessment): string {
  if (risk.factors.apyAnomaly > 0.6) return `APY of ${formatPct(pool.apy)} is statistically anomalous — likely unsustainable`;
  if (pool.apy > pool.apyMean30d * 1.5) return `Current APY (${formatPct(pool.apy)}) significantly above 30d mean (${formatPct(pool.apyMean30d)})`;
  if (pool.apy < 1) return `Very low yield at ${formatPct(pool.apy)} APY`;
  return `APY of ${formatPct(pool.apy)} with 30d average of ${formatPct(pool.apyMean30d)}`;
}

function volatilityInsight(pool: DeFiPool): string {
  if (pool.volatilityProxy > 0.5) return `High yield volatility — expect significant APY swings`;
  if (pool.volatilityProxy > 0.2) return `Moderate APY fluctuation observed`;
  return `Stable yield with low APY variance`;
}

function ilInsight(pool: DeFiPool): string {
  if (pool.ilRisk === 'yes') return `Impermanent loss risk present — multi-asset exposure`;
  if (pool.ilRisk === 'uncertain') return `IL risk unclear — verify pool composition`;
  return `No significant impermanent loss expected`;
}

function generateRecommendation(pool: DeFiPool, risk: RiskAssessment, sim?: SimulationResult): string {
  if (risk.score > 70) return 'Not recommended for risk-averse investors. Only allocate funds you can afford to lose.';
  if (risk.score > 50) return 'Moderate risk — suitable for balanced portfolios with proper position sizing (5-15% allocation).';
  if (pool.stablecoin && risk.score < 30) return 'Excellent stablecoin yield with low risk — suitable for conservative capital preservation.';
  if (sim && sim.sharpeLikeRatio > 1) return `Favorable risk-adjusted return (Sharpe-like ratio: ${sim.sharpeLikeRatio.toFixed(2)}) — consider as core position.`;
  return 'Acceptable risk profile — monitor regularly and adjust position based on market conditions.';
}

function generateRiskNote(risk: RiskAssessment): string {
  const topFactors = Object.entries(risk.factors).sort(([, a], [, b]) => b - a).slice(0, 2);
  const factorLabels: Record<string, string> = {
    tvlRisk: 'TVL risk', apyAnomaly: 'APY anomaly', volatility: 'volatility',
    protocolMaturity: 'protocol maturity', liquidityRisk: 'liquidity risk',
  };
  const [top1, top2] = topFactors;
  return `Primary risk drivers: ${factorLabels[top1[0]]} (${(top1[1] * 100).toFixed(0)}%) and ${factorLabels[top2[0]]} (${(top2[1] * 100).toFixed(0)}%). Confidence: ${(risk.confidence * 100).toFixed(0)}%.`;
}

export function explainPool(pool: DeFiPool, risk: RiskAssessment, sim?: SimulationResult): PoolExplanation {
  const insights: string[] = [];
  let headline: string;
  if (risk.factors.apyAnomaly > 0.6 && pool.tvlUsd < 100_000) {
    headline = `${formatPct(pool.apy)} APY pool with only ${formatUsd(pool.tvlUsd)} TVL — potential yield trap`;
  } else if (risk.factors.apyAnomaly > 0.5) {
    headline = `High APY of ${formatPct(pool.apy)} detected but flagged due to elevated risk factors`;
  } else if (risk.factors.protocolMaturity > 0.6) {
    headline = `Unverified protocol "${pool.protocol}" offering ${formatPct(pool.apy)} APY — proceed with caution`;
  } else if (risk.score < 30) {
    headline = `Stable pool offering ${formatPct(pool.apy)} APY — suitable for conservative allocation`;
  } else {
    headline = `${formatPct(pool.apy)} APY with ${risk.category.toLowerCase()} risk — balanced opportunity`;
  }
  insights.push(tvlInsight(pool));
  insights.push(apyInsight(pool, risk));
  insights.push(volatilityInsight(pool));
  insights.push(ilInsight(pool));
  if (sim) insights.push(`Projected return: ${formatUsd(sim.expectedReturn)} (worst: ${formatUsd(sim.worstCase)}, best: ${formatUsd(sim.bestCase)})`);
  return { poolId: pool.id, headline, insights, recommendation: generateRecommendation(pool, risk, sim), riskNote: generateRiskNote(risk) };
}
