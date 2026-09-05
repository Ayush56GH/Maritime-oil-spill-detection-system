'use client';

import React from 'react';
import { TrackedVessel } from '@/data/mock/mockVessels';
import EvidenceBar from '@/components/shared/EvidenceBar';

interface VesselListPanelProps {
  vessels: TrackedVessel[];
  selectedVesselId: string;
  onSelectVessel: (vessel: TrackedVessel) => void;
}

export default function VesselListPanel({
  vessels,
  selectedVesselId,
  onSelectVessel,
}: VesselListPanelProps) {
  return (
    <aside className="dashboard-side-panel">
      <div className="dashboard-panel-inner">
        <div className="panel-section-title">
          <span>Monitored Vessels</span>
          <span className="panel-section-badge">43 Active</span>
        </div>

        <div>
          {vessels.map((v) => {
            const isSelected = v.id === selectedVesselId;
            const isCandidate = v.category === 'CANDIDATE VESSEL';

            return (
              <div
                key={v.id}
                onClick={() => onSelectVessel(v)}
                className={`vessel-list-card ${isSelected ? 'active' : ''}`}
              >
                <div className="vessel-card-top">
                  <span
                    className={`vessel-card-category ${
                      isCandidate ? 'candidate' : ''
                    }`}
                  >
                    {v.category}
                  </span>
                  <span className="vessel-card-mmsi">MMSI: {v.mmsi}</span>
                </div>

                <div
                  className={`vessel-card-name ${
                    isCandidate ? 'candidate' : ''
                  }`}
                >
                  {v.name}
                </div>

                <div className="vessel-card-metrics">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>SPEED: </span>
                    <span>{v.speed}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>HEADING: </span>
                    <span>{v.heading}</span>
                  </div>
                </div>

                {/* Evidence Bar for Candidate Vessel */}
                {isCandidate && (
                  <div style={{ marginTop: '0.85rem' }}>
                    <EvidenceBar
                      percentage={v.evidenceStrength}
                      label="EVIDENCE STRENGTH"
                      showLabel={true}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
