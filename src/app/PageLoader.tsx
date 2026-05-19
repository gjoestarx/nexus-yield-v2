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
      background: '#08080c',
      color: '#9898a8',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          border: '2px solid rgba(167, 139, 250, 0.15)',
          borderTopColor: '#a78bfa',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }} />
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #a78bfa, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexusYield</div>
        <div style={{ fontSize: 10, color: '#5a5a6e', marginTop: 6, letterSpacing: '0.05em' }}>Loading intelligence...</div>
      </div>
    </div>
  ),
});

export default function PageLoader() {
  return <Dashboard />;
}
