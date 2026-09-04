import React from 'react';

interface EvidenceBarProps {
  percentage: number; // 0 to 100
  totalSegments?: number;
  label?: string;
  variant?: 'cyan' | 'amber' | 'rose' | 'muted';
  showLabel?: boolean;
}

export default function EvidenceBar({
  percentage,
  totalSegments = 4,
  label = 'Evidence Strength',
  variant = 'cyan',
  showLabel = true,
}: EvidenceBarProps) {
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  const getVariantClass = (isActive: boolean) => {
    if (!isActive) return '';
    if (variant === 'amber') return 'active-amber';
    if (variant === 'rose') return 'active-rose';
    if (variant === 'muted') return '';
    return 'active-cyan';
  };

  return (
    <div className="evidence-bar-container">
      {showLabel && (
        <div className="evidence-bar-header">
          <span className="evidence-bar-label">{label}</span>
          <span className="evidence-bar-score">{percentage}%</span>
        </div>
      )}
      <div className="evidence-bar-segments">
        {Array.from({ length: totalSegments }).map((_, index) => {
          const isActive = index < activeSegments;
          return (
            <div
              key={index}
              className={`evidence-segment ${getVariantClass(isActive)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
