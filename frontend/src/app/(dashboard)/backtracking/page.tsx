'use client';

import React, { useState } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import CandidateRankingPanel from '@/components/backtracking/CandidateRankingPanel';
import ForensicDossierPanel from '@/components/backtracking/ForensicDossierPanel';
import BacktrackMapCanvas from '@/components/backtracking/BacktrackMapCanvas';
import { CandidateRanking, mockCandidateRankings } from '@/data/mock/mockBacktracking';

export default function BacktrackingPage() {
  const [activeCandidate, setActiveCandidate] = useState<CandidateRanking>(
    mockCandidateRankings[0]
  );
  const [viewMode, setViewMode] = useState<'ranking' | 'dossier'>('dossier');

  const handleExportDossier = () => {
    alert(
      `Forensic Investigation Dossier for ${activeCandidate.name} (IMO: ${activeCandidate.imo}) exported successfully.`
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Top Breadcrumb & Status Bar */}
      <div className="backtrack-top-bar">
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: '2px' }}>
            BACKTRACKING ANALYSIS &gt; <span style={{ color: 'var(--accent-cyan)' }}>INCIDENT EV-8892</span>
          </div>
          <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800 }}>
            Evidence Details: Vessel IMO {activeCandidate.imo} ({activeCandidate.name})
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="backtrack-warning-banner">
            <AlertTriangle size={14} />
            <span>STATUS: RECOMMENDED FOR FURTHER INVESTIGATION</span>
          </div>

          <button
            className="btn-primary-cyan"
            onClick={handleExportDossier}
            style={{ padding: '0.45rem 1rem', fontSize: '0.75rem', width: 'auto' }}
          >
            <Download size={14} />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Backtracking View Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left / Side Context Panel */}
        {viewMode === 'dossier' ? (
          <ForensicDossierPanel
            onBackToRankings={() => setViewMode('ranking')}
          />
        ) : (
          <CandidateRankingPanel
            onSelectCandidate={(c) => setActiveCandidate(c)}
            onViewEvidenceDetails={(c) => {
              setActiveCandidate(c);
              setViewMode('dossier');
            }}
          />
        )}

        {/* Center Forensic Overlay Map */}
        <BacktrackMapCanvas
          onViewEvidenceDetails={() => setViewMode('dossier')}
          showFloatingCandidateCard={viewMode === 'ranking'}
        />
      </div>
    </div>
  );
}
