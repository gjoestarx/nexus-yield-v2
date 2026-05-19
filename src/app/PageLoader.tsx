'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#070b14',
      color: '#8b9dc3',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48,
          height: 48,
          border: '2px solid rgba(6, 182, 212, 0.25)',
          borderTopColor: '#06b6d4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px'
        }} />
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.02em' }}>NexusYield</div>
        <div style={{ fontSize: 11, color: '#4a5f82', marginTop: 6 }}>Loading yield intelligence...</div>
      </div>
    </div>
  ),
});

export default function PageLoader() {
  return <Dashboard />;
}
