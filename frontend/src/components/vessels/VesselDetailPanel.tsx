'use client';

import React from 'react';
import { MoreVertical, Search, ArrowLeft } from 'lucide-react';
import { TrackedVessel } from '@/data/mock/mockVessels';
import EvidenceBar from '@/components/shared/EvidenceBar';
import DataGrid, { DataCellItem } from '@/components/shared/DataGrid';

interface VesselDetailPanelProps {
  vessel: TrackedVessel;
  onBackToList: () => void;
}

export default function VesselDetailPanel({
  vessel,
  onBackToList,
}: VesselDetailPanelProps) {
  const telemetryData: DataCellItem[] = [
    { label: 'SPEED', value: '14.2 kts' },
    { label: 'HEADING', value: '085° E' },
    { label: 'DRAFT', value: '11.4 m' },
    { label: 'STATUS', value: 'Underway', highlight: true },
  ];

  return (
    <aside className="dashboard-side-panel">
      <div className="dashboard-panel-inner">
        {/* Back navigation button */}
        <button
          onClick={onBackToList}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '0.25rem',
          }}
        >
          <ArrowLeft size={14} />
          <span>All Monitored Vessels</span>
        </button>

        <div className="glass-card" style={{ background: 'rgba(16, 27, 42, 0.95)', padding: '1.5rem' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.8px' }}>
              CANDIDATE VESSEL
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ID: {vessel.imo || '9876543'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
            {vessel.name}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Chemical/Oil Products Tanker
          </p>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button className="btn-primary-cyan" style={{ flex: 1 }}>
              View Historical Track
            </button>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                padding: '0 0.6rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MoreVertical size={16} />
            </button>
          </div>

          {/* 2x2 Telemetry Data Grid */}
          <div style={{ marginBottom: '1.25rem' }}>
            <DataGrid items={telemetryData} columns={2} />
          </div>

          {/* Evidence Strength Meter */}
          <div style={{ marginBottom: '1.25rem' }}>
            <EvidenceBar percentage={78} label="EVIDENCE STRENGTH" />
          </div>

          {/* Analyze Association CTA */}
          <button
            className="btn-outline-action"
            onClick={() => alert('Initiating hydrodynamic association analysis...')}
          >
            <Search size={14} />
            <span>Analyze Association</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
