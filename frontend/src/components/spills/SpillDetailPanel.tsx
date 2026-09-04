'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Search, Compass } from 'lucide-react';
import { mockSpillDetail } from '@/data/mock/mockSpills';
import EvidenceBar from '@/components/shared/EvidenceBar';
import StatusBadge from '@/components/shared/StatusBadge';
import DataGrid, { DataCellItem } from '@/components/shared/DataGrid';

export default function SpillDetailPanel() {
  const router = useRouter();
  const [tracksExpanded, setTracksExpanded] = useState(true);
  const spill = mockSpillDetail;

  const telemetryItems: DataCellItem[] = [
    { label: 'DETECTION TIME', value: spill.detectionTime },
    { label: 'EST. AREA', value: spill.estArea },
    { label: 'SENSOR SOURCE', value: spill.sensorSource },
    { label: 'CONFIDENCE', value: spill.confidence, highlight: true },
  ];

  return (
    <aside className="spill-left-column">
      <div className="spill-left-content">
        {/* Header with Back button and Status */}
        <div>
          <div className="spill-header-row">
            <div className="spill-title-wrap">
              <Link
                href="/dashboard"
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="spill-title-text">{spill.id}</h1>
            </div>
            <StatusBadge variant="critical">CRITICAL</StatusBadge>
          </div>
          <div className="spill-coord-text">{spill.coordinates}</div>
        </div>

        {/* 2x2 Telemetry Grid */}
        <DataGrid items={telemetryItems} columns={2} />

        {/* Evidence Strength Card */}
        <div className="glass-card" style={{ background: 'rgba(16, 27, 42, 0.9)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Evidence Strength
            </span>
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
              Level {spill.evidenceLevel}
            </span>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <EvidenceBar
              percentage={100}
              totalSegments={5}
              showLabel={false}
            />
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {spill.evidenceDescription}
          </p>
        </div>

        {/* Nearby Historical Tracks Section */}
        <div>
          <div
            onClick={() => setTracksExpanded(!tracksExpanded)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Nearby Historical Tracks
            </span>
            {tracksExpanded ? <ChevronUp size={16} color="#8896a6" /> : <ChevronDown size={16} color="#8896a6" />}
          </div>

          {tracksExpanded && (
            <div>
              {spill.nearbyTracks.map((track) => (
                <div
                  key={track.imo}
                  className={`spill-matched-track-card ${track.isPrimary ? 'primary' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div>
                      <div style={{ color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
                        {track.imo}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        {track.type}
                      </div>
                    </div>

                    <span
                      style={{
                        background: track.isPrimary ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${track.isPrimary ? 'rgba(251, 191, 36, 0.4)' : 'var(--border-light)'}`,
                        color: track.isPrimary ? '#fbbf24' : '#94a3b8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '3px',
                      }}
                    >
                      MATCH: {track.matchScore}%
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {track.lastPosTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Backtrack Action */}
      <div className="spill-bottom-sticky-bar">
        <button
          className="btn-primary-cyan"
          onClick={() => router.push('/backtracking')}
          style={{ padding: '0.9rem 1.5rem', fontSize: '0.85rem' }}
        >
          <Search size={16} />
          <span>BACKTRACK SPILL</span>
        </button>
        <div className="spill-bottom-subtitle">
          Initiates hydrodynamic modeling to estimate origin point.
        </div>
      </div>
    </aside>
  );
}
