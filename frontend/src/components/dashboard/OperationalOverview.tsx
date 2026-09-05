import React from 'react';
import { Target } from 'lucide-react';
import { OperationalStats } from '@/data/mock/mockDashboard';

interface OperationalOverviewProps {
  stats: OperationalStats;
}

export default function OperationalOverview({ stats }: OperationalOverviewProps) {
  return (
    <section>
      <div className="panel-section-title">
        <span>Operational Overview</span>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Active Vessels</div>
          <div className="kpi-value">{stats.activeVessels}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Tracked Routes</div>
          <div className="kpi-value">{stats.trackedRoutes}</div>
        </div>
      </div>
      <div className="kpi-card-full">
        <div>
          <div className="kpi-title">Detected Spills</div>
          <div className="kpi-value" style={{ color: '#c084fc' }}>
            {stats.detectedSpills}
          </div>
        </div>
        <Target size={30} style={{ color: '#c084fc', opacity: 0.85 }} />
      </div>
    </section>
  );
}
