'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const VesselMap = dynamic(() => import('@/components/vessels/VesselMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c1a29',
        color: '#00d7b2',
        gap: '12px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(0, 215, 178, 0.2)',
          borderTopColor: '#00d7b2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <div style={{ fontSize: '12px', letterSpacing: '1px' }}>
        LOADING VESSEL AIS TRAJECTORY & TELEMETRY...
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  ),
});

export default function VesselMapCanvas() {
  return (
    <div className="map-canvas-container">
      <VesselMap />
    </div>
  );
}
