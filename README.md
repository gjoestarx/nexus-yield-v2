# NexusYield — DeFi Yield Intelligence Platform

Advanced DeFi yield analytics, risk modeling, and portfolio optimization platform powered by real-time data from DefiLlama.

**Live:** [https://nexus-yield-v2.vercel.app](https://nexus-yield-v2.vercel.app)

## Features

- **Market Overview** — Real-time snapshot of the DeFi yield landscape with key metrics
- **Analytics** — APY vs Risk scatter plots, heatmaps, radar charts, and risk distribution histograms
- **Strategy Recommendations** — AI-ranked pools based on Conservative, Balanced, or Aggressive risk profiles
- **Pool Explorer** — Search, filter, and sort all available pools across 29+ chains
- **Monte Carlo Simulator** — Model returns with 100-path simulation including IL and gas estimates
- **Portfolio Builder** — Multi-pool allocation with growth projection and diversification scoring
- **Pool Comparison** — Side-by-side comparison with historical APY data
- **Watchlist** — Track favorite pools with wallet-aware persistence (MetaMask)
- **Alerts** — Configure APY threshold alerts with real-time trigger detection

## Risk Engine

Multi-factor weighted risk model assessing:
- TVL Risk
- APY Anomaly Detection
- Volatility Analysis
- Protocol Maturity
- Liquidity Depth

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Data:** DefiLlama Yields API
- **Wallet:** MetaMask (window.ethereum)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

```bash
npm run build
vercel deploy --prod
```

## License

MIT
