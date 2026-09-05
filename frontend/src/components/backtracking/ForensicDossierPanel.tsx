'use client';

import React from 'react';
import { Compass, Clock, GitCommit, ArrowLeft } from 'lucide-react';
import EvidenceBar from '@/components/shared/EvidenceBar';
import { mockForensicEvidence } from '@/data/mock/mockBacktracking';

interface ForensicDossierPanelProps {
  onBackToRankings: () => void;
}

export default function ForensicDossierPanel({
  onBackToRankings,
}: ForensicDossierPanelProps) {
  const ev = mockForensicEvidence;

  return (
    <aside className="spill-left-column" style={{ width: '480px', minWidth: '480px' }}>
      <div className="spill-left-content" style={{ padding: '1.25rem' }}>
        {/* Back navigation */}
        <button
          onClick={onBackToRankings}
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
            marginBottom: '0.5rem',
          }}
        >
          <ArrowLeft size={14} />
          <span>Candidate Rankings</span>
        </button>

        {/* Card 1: Proximity Correlation */}
        <div className="evidence-correlation-card">
          <div className="correlation-watermark">01</div>
          <div className="correlation-header">
            <Compass size={18} color="#00d7b2" />
            <span className="correlation-title">Proximity Correlation</span>
          </div>
          <p className="correlation-desc">
            Spatial analysis of vessel AIS track relative to the detected anomaly contour.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="data-cell">
              <div className="data-cell-label">CLOSEST POINT (CPA)</div>
              <div className="data-cell-value">{ev.cpa}</div>
            </div>
            <div className="data-cell">
              <div className="data-cell-label">INTERSECTION AREA</div>
              <div className="data-cell-value">{ev.intersectionArea}</div>
            </div>
          </div>

          <EvidenceBar percentage={90} label="EVIDENCE STRENGTH" variant="cyan" />
        </div>

        {/* Card 2: Time Correlation */}
        <div className="evidence-correlation-card">
          <div className="correlation-watermark">02</div>
          <div className="correlation-header">
            <Clock size={18} color="#00d7b2" />
            <span className="correlation-title">Time Correlation</span>
          </div>
          <p className="correlation-desc">
            Temporal alignment between satellite pass detection and vessel AIS broadcast.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="data-cell">
              <div className="data-cell-label">ANOMALY TIMESTAMP</div>
              <div className="data-cell-value" style={{ fontSize: '0.8rem' }}>{ev.anomalyTimestamp}</div>
            </div>
            <div className="data-cell">
              <div className="data-cell-label">DELTA (ΔT)</div>
              <div className="data-cell-value" style={{ color: 'var(--accent-cyan)' }}>{ev.deltaT}</div>
            </div>
          </div>

          <EvidenceBar percentage={95} label="EVIDENCE STRENGTH" variant="cyan" />
        </div>

        {/* Card 3: Trajectory Match */}
        <div className="evidence-correlation-card">
          <div className="correlation-watermark">03</div>
          <div className="correlation-header">
            <GitCommit size={18} color="#fbbf24" />
            <span className="correlation-title">Trajectory Match</span>
          </div>
          <p className="correlation-desc">
            Comparison of slick drift model (oceanographic currents) vs vessel heading.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="data-cell">
              <div className="data-cell-label">HEADING VARIANCE</div>
              <div className="data-cell-value">{ev.headingVariance}</div>
            </div>
            <div className="data-cell">
              <div className="data-cell-label">SPEED PROFILE</div>
              <div className="data-cell-value" style={{ color: '#fbbf24' }}>{ev.speedProfile}</div>
            </div>
          </div>

          <EvidenceBar percentage={60} label="EVIDENCE STRENGTH" variant="amber" />
        </div>
      </div>
    </aside>
  );
}
