import React from 'react';
import { CandidateVessel } from '@/data/mock/mockDashboard';
import EvidenceBar from '@/components/shared/EvidenceBar';
import Link from 'next/link';

interface CandidateVesselCardProps {
  vessel: CandidateVessel;
}

export default function CandidateVesselCard({ vessel }: CandidateVesselCardProps) {
  return (
    <section>
      <div className="glass-card" style={{ background: 'rgba(16, 27, 42, 0.85)', padding: '1.25rem' }}>
        <div className="kpi-title" style={{ marginBottom: '0.85rem' }}>
          Candidate Vessel Analysis
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
            IMO-{vessel.imo}
          </span>
          <span className="status-badge muted" style={{ fontSize: '0.65rem' }}>
            Tanker
          </span>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <EvidenceBar percentage={75} label="Evidence Strength" />
        </div>

        <Link href="/vessels" style={{ textDecoration: 'none' }}>
          <button className="btn-primary-cyan">
            View Details
          </button>
        </Link>
      </div>
    </section>
  );
}
