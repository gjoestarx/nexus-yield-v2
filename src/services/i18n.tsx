'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'en' | 'id';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Sidebar
    'nav.discover': 'Discover',
    'nav.tools': 'Tools',
    'nav.personal': 'Personal',
    'nav.overview': 'Overview',
    'nav.analytics': 'Analytics',
    'nav.strategies': 'Strategies',
    'nav.explorer': 'Explorer',
    'nav.simulator': 'Simulator',
    'nav.portfolio': 'Portfolio',
    'nav.compare': 'Compare',
    'nav.watchlist': 'Watchlist',
    'nav.alerts': 'Alerts',
    'sidebar.pools': 'pools',
    'sidebar.chains': 'chains',
    'sidebar.live': 'Live data',
    'sidebar.collapse': 'Collapse',
    'sidebar.expand': 'Expand',

    // Header
    'header.conservative': 'Conservative',
    'header.balanced': 'Balanced',
    'header.aggressive': 'Aggressive',
    'header.search': 'Search pools...',
    'header.norefresh': 'No refresh',
    'header.language': 'Language',

    // Pages
    'page.overview.title': 'Market Overview',
    'page.overview.subtitle': 'Real-time snapshot of the DeFi yield landscape',
    'page.analytics.title': 'Analytics',
    'page.analytics.subtitle': 'Deep-dive charts and visualizations',
    'page.strategies.title': 'Strategy Recommendations',
    'page.strategies.subtitle': 'AI-ranked pools based on your risk profile',
    'page.explorer.title': 'Pool Explorer',
    'page.explorer.subtitle': 'Search, filter, and sort all available pools',
    'page.simulator.title': 'Monte Carlo Simulator',
    'page.simulator.subtitle': 'Model returns with realistic DeFi scenarios',
    'page.portfolio.title': 'Portfolio Builder',
    'page.portfolio.subtitle': 'Multi-pool allocation with growth simulation',
    'page.compare.title': 'Pool Comparison',
    'page.compare.subtitle': 'Side-by-side comparison with historical APY',
    'page.watchlist.title': 'Watchlist',
    'page.watchlist.subtitle': 'Track your favorite pools',
    'page.alerts.title': 'Alerts',
    'page.alerts.subtitle': 'Configure price and APY alerts',

    // Overview
    'overview.totalPools': 'Total Pools',
    'overview.avgApy': 'Avg APY',
    'overview.avgRisk': 'Avg Risk',
    'overview.trapPools': 'Trap Pools',
    'overview.topPools': 'Top Pools by Score',
    'overview.shown': 'shown',
    'overview.chainDist': 'Chain Distribution',
    'overview.riskProfile': 'Risk Profile',
    'overview.highestApy': 'Highest APY Pools',
    'overview.top8': 'Top 8 by current APY',

    // Explorer
    'explorer.search': 'Search pools, protocols, chains...',
    'explorer.allChains': 'All Chains',
    'explorer.allRisk': 'All Risk Levels',
    'explorer.pools': 'pools',

    // Simulator
    'sim.selectPool': 'Select Pool',
    'sim.searchPool': 'Search pools...',
    'sim.params': 'Simulation Parameters',
    'sim.capital': 'Capital (USD)',
    'sim.horizon': 'Time Horizon (Days)',
    'sim.run': 'Run Simulation',
    'sim.running': 'Running Monte Carlo...',
    'sim.expected': 'Expected Return',
    'sim.best': 'Best Case (95th)',
    'sim.worst': 'Worst Case (5th)',
    'sim.sharpe': 'Sharpe-like Ratio',
    'sim.netReturn': 'Net Return',
    'sim.il': 'IL Estimate',
    'sim.gas': 'Gas Impact',
    'sim.growth': 'Portfolio Growth Projection',
    'sim.save': 'Save Simulation',
    'sim.saved': 'Saved',
    'sim.selectMsg': 'Select a pool and run simulation to see results',

    // Portfolio
    'port.addPool': 'Add Pool to Portfolio',
    'port.searchPool': 'Search pools...',
    'port.allocations': 'Allocations',
    'port.noAlloc': 'Search and add pools above',
    'port.allocation': 'Allocation',
    'port.noPie': 'Add pools to see allocation',
    'port.weightedApy': 'Weighted APY',
    'port.weightedRisk': 'Weighted Risk',
    'port.expected': 'Expected Return',
    'port.netProfit': 'Net Profit',
    'port.diversification': 'Diversification',
    'port.growth': 'Portfolio Growth Projection',

    // Compare
    'compare.title': 'Compare Pools (up to 4)',
    'compare.selected': 'selected',
    'compare.search': 'Search pools to compare...',
    'compare.comparison': 'Side-by-Side Comparison',
    'compare.history': 'Historical APY Comparison',
    'compare.datapoints': 'data points',
    'compare.selectMsg': 'Select at least 2 pools to compare',

    // Watchlist
    'watch.walletConnected': 'Wallet connected',
    'watch.walletSaved': 'watchlist saved to your wallet address',
    'watch.noWallet': 'No wallet connected',
    'watch.localSaved': 'watchlist saved locally. Connect wallet to persist across devices.',
    'watch.watching': 'Watching',
    'watch.avgApy': 'Avg APY',
    'watch.avgRisk': 'Avg Risk',
    'watch.totalTvl': 'Total TVL',
    'watch.add': 'Add to Watchlist',
    'watch.search': 'Search pools to watch...',
    'watch.yourList': 'Your Watchlist',
    'watch.noPools': 'No pools in watchlist. Search above to add.',

    // Alerts
    'alert.total': 'Total Alerts',
    'alert.active': 'Active',
    'alert.triggered': 'Triggered',
    'alert.dismissed': 'Dismissed',
    'alert.create': 'Create New Alert',
    'alert.search': 'Search pools...',
    'alert.direction': 'Direction',
    'alert.above': 'Above',
    'alert.below': 'Below',
    'alert.threshold': 'APY Threshold (%)',
    'alert.add': 'Add Alert',
    'alert.yourAlerts': 'Your Alerts',
    'alert.noAlerts': 'No alerts set. Create one above to get notified when APY crosses your target.',

    // Pool Analyzer
    'analyzer.openDl': 'Open on DefiLlama',
    'analyzer.riskBreakdown': 'Risk Factor Breakdown',
    'analyzer.confidence': 'Confidence',
    'analyzer.category': 'Category',
    'analyzer.yieldDetails': 'Yield Details',
    'analyzer.currentApy': 'Current APY',
    'analyzer.avg30d': '30d Avg APY',
    'analyzer.baseApy': 'Base APY',
    'analyzer.rewardApy': 'Reward APY',
    'analyzer.poolProps': 'Pool Properties',
    'analyzer.tvl': 'TVL',
    'analyzer.ilRisk': 'IL Risk',
    'analyzer.exposure': 'Exposure',
    'analyzer.volatility': 'Volatility',
    'analyzer.liquidity': 'Liquidity Score',
    'analyzer.viewDl': 'View on DefiLlama',
    'analyzer.fullDetails': 'Full pool details, historical data, and protocol info',
    'analyzer.overview': 'Overview',
    'analyzer.history': 'History',
    'analyzer.simulate': 'Simulate',
    'analyzer.apyHistory': 'APY History',
    'analyzer.tvlHistory': 'TVL History',
    'analyzer.growthProj': 'Growth Projection',
    'analyzer.recommendation': 'Recommendation',
    'analyzer.stablecoin': 'Stablecoin',

    // Common
    'common.loading': 'Loading DeFi data...',
    'common.fetching': 'Fetching from DefiLlama API',
    'common.retry': 'Retry',
    'common.days': 'days',
    'common.na': 'N/A',
  },
  id: {
    // Sidebar
    'nav.discover': 'Jelajahi',
    'nav.tools': 'Alat',
    'nav.personal': 'Pribadi',
    'nav.overview': 'Ringkasan',
    'nav.analytics': 'Analitik',
    'nav.strategies': 'Strategi',
    'nav.explorer': 'Penjelajah',
    'nav.simulator': 'Simulator',
    'nav.portfolio': 'Portofolio',
    'nav.compare': 'Perbandingan',
    'nav.watchlist': 'Pantauan',
    'nav.alerts': 'Peringatan',
    'sidebar.pools': 'pool',
    'sidebar.chains': 'chain',
    'sidebar.live': 'Data live',
    'sidebar.collapse': 'Tutup',
    'sidebar.expand': 'Buka',

    // Header
    'header.conservative': 'Konservatif',
    'header.balanced': 'Seimbang',
    'header.agresif': 'Agresif',
    'header.search': 'Cari pool...',
    'header.norefresh': 'Tanpa refresh',
    'header.language': 'Bahasa',

    // Pages
    'page.overview.title': 'Ringkasan Pasar',
    'page.overview.subtitle': 'Snapshot real-time lanskap yield DeFi',
    'page.analytics.title': 'Analitik',
    'page.analytics.subtitle': 'Grafik dan visualisasi mendalam',
    'page.strategies.title': 'Rekomendasi Strategi',
    'page.strategies.subtitle': 'Pool peringkat AI berdasarkan profil risiko Anda',
    'page.explorer.title': 'Penjelajah Pool',
    'page.explorer.subtitle': 'Cari, filter, dan urutkan semua pool yang tersedia',
    'page.simulator.title': 'Simulator Monte Carlo',
    'page.simulator.subtitle': 'Modelkan return dengan skenario DeFi realistis',
    'page.portfolio.title': 'Pembuat Portofolio',
    'page.portfolio.subtitle': 'Alokasi multi-pool dengan simulasi pertumbuhan',
    'page.compare.title': 'Perbandingan Pool',
    'page.compare.subtitle': 'Perbandingan berdampingan dengan APY historis',
    'page.watchlist.title': 'Daftar Pantauan',
    'page.watchlist.subtitle': 'Pantau pool favorit Anda',
    'page.alerts.title': 'Peringatan',
    'page.alerts.subtitle': 'Atur peringatan harga dan APY',

    // Overview
    'overview.totalPools': 'Total Pool',
    'overview.avgApy': 'Rata-rata APY',
    'overview.avgRisk': 'Rata-rata Risiko',
    'overview.trapPools': 'Pool Jebakan',
    'overview.topPools': 'Pool Terbaik berdasarkan Skor',
    'overview.shown': 'ditampilkan',
    'overview.chainDist': 'Distribusi Chain',
    'overview.riskProfile': 'Profil Risiko',
    'overview.highestApy': 'Pool APY Tertinggi',
    'overview.top8': '8 Teratas berdasarkan APY saat ini',

    // Explorer
    'explorer.search': 'Cari pool, protokol, chain...',
    'explorer.allChains': 'Semua Chain',
    'explorer.allRisk': 'Semua Level Risiko',
    'explorer.pools': 'pool',

    // Simulator
    'sim.selectPool': 'Pilih Pool',
    'sim.searchPool': 'Cari pool...',
    'sim.params': 'Parameter Simulasi',
    'sim.capital': 'Modal (USD)',
    'sim.horizon': 'Horizon Waktu (Hari)',
    'sim.run': 'Jalankan Simulasi',
    'sim.running': 'Menjalankan Monte Carlo...',
    'sim.expected': 'Return yang Diharapkan',
    'sim.best': 'Kasus Terbaik (95th)',
    'sim.worst': 'Kasus Terburuk (5th)',
    'sim.sharpe': 'Rasio Sharpe',
    'sim.netReturn': 'Return Bersih',
    'sim.il': 'Estimasi IL',
    'sim.gas': 'Dampak Gas',
    'sim.growth': 'Proyeksi Pertumbuhan Portofolio',
    'sim.save': 'Simpan Simulasi',
    'sim.saved': 'Tersimpan',
    'sim.selectMsg': 'Pilih pool dan jalankan simulasi untuk melihat hasil',

    // Portfolio
    'port.addPool': 'Tambahkan Pool ke Portofolio',
    'port.searchPool': 'Cari pool...',
    'port.allocations': 'Alokasi',
    'port.noAlloc': 'Cari dan tambahkan pool di atas',
    'port.allocation': 'Alokasi',
    'port.noPie': 'Tambahkan pool untuk melihat alokasi',
    'port.weightedApy': 'APY Tertimbang',
    'port.weightedRisk': 'Risiko Tertimbang',
    'port.expected': 'Return yang Diharapkan',
    'port.netProfit': 'Laba Bersih',
    'port.diversifikasi': 'Diversifikasi',
    'port.growth': 'Proyeksi Pertumbuhan Portofolio',

    // Compare
    'compare.title': 'Bandingkan Pool (hingga 4)',
    'compare.selected': 'dipilih',
    'compare.search': 'Cari pool untuk dibandingkan...',
    'compare.comparison': 'Perbandingan Berdampingan',
    'compare.history': 'Perbandingan APY Historis',
    'compare.datapoints': 'titik data',
    'compare.selectMsg': 'Pilih minimal 2 pool untuk dibandingkan',

    // Watchlist
    'watch.walletConnected': 'Wallet terhubung',
    'watch.walletSaved': 'daftar pantauan disimpan ke alamat wallet Anda',
    'watch.noWallet': 'Wallet tidak terhubung',
    'watch.localSaved': 'daftar pantauan disimpan lokal. Hubungkan wallet untuk menyimpan antar perangkat.',
    'watch.watching': 'Memantau',
    'watch.avgApy': 'Rata-rata APY',
    'watch.avgRisk': 'Rata-rata Risiko',
    'watch.totalTvl': 'Total TVL',
    'watch.add': 'Tambahkan ke Pantauan',
    'watch.search': 'Cari pool untuk dipantau...',
    'watch.yourList': 'Daftar Pantauan Anda',
    'watch.noPools': 'Tidak ada pool dalam daftar pantauan. Cari di atas untuk menambahkan.',

    // Alerts
    'alert.total': 'Total Peringatan',
    'alert.active': 'Aktif',
    'alert.triggered': 'Tercetus',
    'alert.dismissed': 'Dihapus',
    'alert.create': 'Buat Peringatan Baru',
    'alert.search': 'Cari pool...',
    'alert.direction': 'Arah',
    'alert.above': 'Di Atas',
    'alert.below': 'Di Bawah',
    'alert.threshold': 'Batas APY (%)',
    'alert.add': 'Tambahkan Peringatan',
    'alert.yourAlerts': 'Peringatan Anda',
    'alert.noAlerts': 'Belum ada peringatan. Buat di atas untuk mendapat notifikasi saat APY melewati target Anda.',

    // Pool Analyzer
    'analyzer.openDl': 'Buka di DefiLlama',
    'analyzer.riskBreakdown': 'Faktor Risiko',
    'analyzer.confidence': 'Kepercayaan',
    'analyzer.category': 'Kategori',
    'analyzer.yieldDetails': 'Detail Yield',
    'analyzer.currentApy': 'APY Saat Ini',
    'analyzer.avg30d': 'Rata-rata 30h APY',
    'analyzer.baseApy': 'APY Dasar',
    'analyzer.rewardApy': 'APY Reward',
    'analyzer.poolProps': 'Properti Pool',
    'analyzer.tvl': 'TVL',
    'analyzer.ilRisk': 'Risiko IL',
    'analyzer.exposure': 'Eksposur',
    'analyzer.volatility': 'Volatilitas',
    'analyzer.liquidity': 'Skor Likuiditas',
    'analyzer.viewDl': 'Lihat di DefiLlama',
    'analyzer.fullDetails': 'Detail pool lengkap, data historis, dan info protokol',
    'analyzer.overview': 'Ringkasan',
    'analyzer.history': 'Riwayat',
    'analyzer.simulate': 'Simulasi',
    'analyzer.apyHistory': 'Riwayat APY',
    'analyzer.tvlHistory': 'Riwayat TVL',
    'analyzer.growthProj': 'Proyeksi Pertumbuhan',
    'analyzer.recommendation': 'Rekomendasi',
    'analyzer.stablecoin': 'Stablecoin',

    // Common
    'common.loading': 'Memuat data DeFi...',
    'common.fetching': 'Mengambil dari DefiLlama API',
    'common.retry': 'Coba Lagi',
    'common.days': 'hari',
    'common.na': 'N/A',
  },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('nexus-lang') as Lang) || 'en';
  });

  const handleSetLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('nexus-lang', newLang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
