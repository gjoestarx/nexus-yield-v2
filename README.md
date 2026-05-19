# NexusYield v3 — DeFi Yield Intelligence Platform

A comprehensive DeFi yield analytics, risk modeling, and portfolio optimization platform. Built with Next.js 16, TypeScript 5, and Tailwind CSS 4. Powered by real-time data from the DefiLlama Yields API.

**Live:** [https://nexus-yield-v2.vercel.app](https://nexus-yield-v2.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Pages](#pages)
- [Design System](#design-system)
- [Internationalization](#internationalization)
- [Risk Engine](#risk-engine)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Core Analytics
- Real-time DeFi pool data from DefiLlama (2,000+ pools across 29+ chains)
- Multi-factor weighted risk scoring engine (5 risk dimensions)
- Monte Carlo simulation with 100-path modeling
- AI-ranked strategy recommendations (Conservative / Balanced / Aggressive)
- Protocol-level TVL and APY aggregation

### Visualization
- APY vs Risk scatter plots with interactive tooltips
- Pool heatmaps by chain and protocol
- Risk distribution histograms
- Radar charts for multi-dimensional pool analysis
- Growth projection area charts with gradient fills
- Chain distribution pie charts
- Top protocol horizontal bar charts

### Portfolio Tools
- Multi-pool portfolio builder with allocation percentages
- Portfolio growth simulation with diversification scoring
- Side-by-side pool comparison with historical APY data
- Yield calculator with compound interest modeling
- Gas price tracker across 16 EVM chains

### Personal Features
- Watchlist with wallet-aware persistence (MetaMask integration)
- Configurable APY threshold alerts with real-time trigger detection
- Dark and light theme support with system preference detection
- Collapsible sidebar navigation

### Internationalization
- 6 languages: English, Bahasa Indonesia, Chinese (Simplified), Japanese, Korean, Spanish
- Full translation coverage across all pages and components
- Language preference persisted to localStorage
- Dropdown language selector with flag indicators

---

## Pages

### 1. Market Overview
Dashboard landing page with key metrics: total pools, average APY, average risk score, trap pool count. Includes top pools table ranked by composite score, chain distribution pie chart, risk profile bar chart, and highest APY pools chart.

### 2. Analytics
Deep-dive visualizations including APY vs Risk scatter plot, pool heatmap, radar chart for selected pools, and risk distribution histogram. Interactive charts with hover tooltips and click-to-select.

### 3. Strategy Recommendations
AI-ranked pool suggestions based on selected risk profile. Conservative mode prioritizes low-risk, stable pools. Balanced mode optimizes risk-adjusted returns. Aggressive mode maximizes APY with higher risk tolerance. Each pool shows composite score, estimated returns, and risk breakdown.

### 4. Pool Explorer
Full pool database with search, multi-chain filter, risk level filter, and sortable columns. Supports search by pool name, protocol, or chain. Click any pool to open the detailed Pool Analyzer.

### 5. Monte Carlo Simulator
Select a pool and run a 100-path Monte Carlo simulation. Configurable parameters: capital amount, time horizon (days). Outputs: expected return, best/worst case (95th/5th percentile), Sharpe-like ratio, IL estimate, gas impact, and portfolio growth projection chart.

### 6. Portfolio Builder
Allocate capital across multiple pools with percentage-based allocation. Shows total expected return, weighted risk score, diversification index, and projected growth curve. Supports adding/removing pools and adjusting allocations.

### 7. Pool Comparison
Select 2-3 pools for side-by-side comparison. Displays TVL, APY, risk score, chain, protocol, and historical APY trends. Useful for choosing between similar yield opportunities.

### 8. Gas Tracker
Real-time gas prices across 16 EVM-compatible chains: Ethereum, Arbitrum, Optimism, Base, Polygon, BSC, Avalanche, Fantom, Gnosis, zkSync, Linea, Scroll, Mantle, Celo, Sonic. Auto-refreshes every 15 seconds. Shows gas level (Cheap / Moderate / Expensive), base fee, priority fee, and latest block number.

### 9. Yield Calculator
Compound interest calculator for DeFi yields. Inputs: principal amount (with quick presets from $1K to $500K), APY percentage (with presets from 5% to 100%), time period (days/months/years), compound toggle. Outputs: total earnings, final value, daily/monthly/yearly yield, and growth projection chart.

### 10. Protocol Analytics
Aggregates pool data by protocol. Shows total TVL, protocol count, average APY, and total pools. Top 10 protocols bar chart by TVL. Full protocol table with search and sort by TVL, APY, or pool count. Each protocol displays: TVL, pool count, average APY, average risk score, top pool, and top pool APY.

### 11. Watchlist
Track favorite pools with persistent storage. Wallet-aware: watchlist is tied to connected MetaMask address. Quick add/remove from any pool table. Shows real-time APY and risk updates for watched pools.

### 12. Alerts
Configure APY threshold alerts. Set minimum and maximum APY triggers. Real-time detection when pool APY crosses thresholds. Alert count displayed in sidebar navigation badge.

---

## Design System

NexusYield v3 uses a custom CSS design system built on CSS custom properties for consistent theming.

### Color Palette (Dark Theme)
| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#06080d` | Page background |
| `--bg-1` | `#0c1018` | Sidebar, elevated surfaces |
| `--bg-2` | `#111622` | Cards, panels |
| `--bg-3` | `#171d2e` | Tooltips, dropdowns |
| `--accent` | `#6366f1` | Primary accent (indigo) |
| `--accent-bright` | `#818cf8` | Hover states, active text |
| `--positive` | `#34d399` | Gains, success states |
| `--negative` | `#f87171` | Losses, danger states |
| `--warning` | `#fbbf24` | Warnings, moderate risk |
| `--info` | `#38bdf8` | Informational elements |

### Light Theme
Full light theme support via `[data-theme="light"]` CSS selector. Overrides all color tokens with appropriate light-mode equivalents. Sidebar, header, tables, charts, and all components adapt automatically.

### Component Classes
- `.surface` — Card container with subtle border and hover effect
- `.metric` — Metric card with gradient accent line at top
- `.data-table` — Spacious table with hover row highlighting
- `.tag` / `.pill` — Status badges and labels
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger` — Button variants
- `.tabs` — Tab switcher component
- `.input` — Text/number input with focus ring

### Typography
- Font: Inter (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- Anti-aliased rendering on all platforms
- Tight letter-spacing for headings (-0.04em)
- Uppercase labels with wide tracking (0.1em)

### Animations
- Page transitions: 0.25s fade-in with 6px translateY
- Live indicator: 2s infinite pulse with green glow
- Shimmer loading: 200% background-position sweep
- Hover transforms: 1px translateY lift on metric cards

---

## Internationalization

### Supported Languages
| Code | Language | Flag |
|---|---|---|
| `en` | English | US |
| `id` | Bahasa Indonesia | ID |
| `zh` | Chinese (Simplified) | CN |
| `ja` | Japanese | JP |
| `ko` | Korean | KR |
| `es` | Spanish | ES |

### Implementation
- React Context-based i18n system (`I18nProvider`)
- `useI18n()` hook provides `t(key)` translation function and `lang`/`setLang` state
- All UI strings translated: navigation, page titles, metric labels, button text, tooltips, placeholders
- Language persisted to `localStorage` key `nexus-lang`
- Dropdown selector in sidebar footer with flag indicators and active checkmark

### Adding a New Language
1. Add language entry to `LANGUAGES` array in `src/services/i18n.tsx`
2. Add new key to `Lang` type
3. Add full translation object to `T` record following the English template
4. Build and verify all keys are present

---

## Risk Engine

Multi-factor weighted risk model with 5 dimensions:

| Factor | Weight | Description |
|---|---|---|
| TVL Risk | 25% | Lower TVL = higher risk. Thresholds based on protocol category |
| APY Anomaly | 25% | APY significantly above category average signals potential risk |
| Volatility | 20% | Historical APY variance and standard deviation |
| Protocol Maturity | 15% | Time since protocol launch, audit status, track record |
| Liquidity Depth | 15% | Available liquidity relative to typical withdrawal sizes |

### Risk Score
- 0-30: Low risk (green tag)
- 31-60: Medium risk (yellow tag)
- 61-100: High risk (red tag)

### Trap Pool Detection
Pools with suspiciously high APY relative to TVL and protocol maturity are flagged as "trap pools" with a warning indicator.

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Providers
│   ├── page.tsx            # Entry point → DashboardClient
│   ├── globals.css         # Design system (CSS custom properties)
│   ├── DashboardClient.tsx # Main SPA shell with routing
│   └── api/                # API routes
│       ├── pools/          # DefiLlama proxy with caching
│       ├── history/        # Historical APY data
│       ├── protocol/       # Protocol metadata
│       └── simulate/       # Monte Carlo simulation endpoint
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # Navigation sidebar (collapsible)
│   │   └── Header.tsx      # Top bar with mode switcher, search, refresh
│   ├── pages/
│   │   ├── OverviewPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── StrategiesPage.tsx
│   │   ├── ExplorerPage.tsx
│   │   ├── SimulatorPage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── WatchlistPage.tsx
│   │   ├── AlertsPage.tsx
│   │   ├── GasTrackerPage.tsx
│   │   ├── YieldCalculatorPage.tsx
│   │   └── ProtocolsPage.tsx
│   ├── charts/             # Recharts visualization components
│   ├── dashboard/          # Shared dashboard components
│   ├── pool/               # Pool-specific components (Analyzer)
│   └── ui/                 # Primitive UI components
├── hooks/
│   └── useData.ts          # Data fetching, caching, and refresh logic
├── services/
│   ├── i18n.tsx            # Internationalization (6 languages)
│   ├── theme.tsx           # Dark/light theme management
│   └── wallet.tsx          # MetaMask wallet integration
├── types/                  # TypeScript type definitions
└── utils/                  # Formatting, constants, helpers
```

### Data Flow
1. `usePools` hook fetches from `/api/pools` (DefiLlama proxy)
2. API route fetches, deduplicates, and caches pool data (60s TTL)
3. Risk engine scores each pool using multi-factor model
4. Rankings engine computes composite scores per strategy mode
5. Components receive typed data via props (no client-side fetching)

### State Management
- React Context for global state (theme, language, wallet)
- Local component state for UI interactions (filters, selections)
- `useAutoRefresh` hook for configurable polling intervals
- localStorage for persistence (watchlist, alerts, preferences)

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Charts | Recharts | 3.8.1 |
| Icons | Lucide React | latest |
| Data Source | DefiLlama Yields API | v1 |
| Wallet | MetaMask (window.ethereum) | — |
| Runtime | Node.js | 18+ |
| Deployment | Vercel | — |

---

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/gjoestarx/nexus-yield-v2.git
cd nexus-yield-v2
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000). Hot reload is enabled.

### Environment Variables

No environment variables required. The app uses:
- DefiLlama's public API (no API key needed)
- MetaMask via `window.ethereum` (user's browser wallet)
- localStorage for client-side persistence

---

## Project Structure

```
nexus-yield-v2/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router (pages + API)
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Context providers (i18n, theme, wallet)
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Helpers and constants
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy --prod
```

Or connect the GitHub repository to Vercel for automatic deployments on push.

### Self-Hosted

```bash
npm run build
npm start
```

The app runs as a standard Node.js server on port 3000.

---

## License

MIT
