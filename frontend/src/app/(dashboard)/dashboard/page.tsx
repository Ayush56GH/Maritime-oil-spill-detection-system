'use client';
import React from 'react';
import MapCanvas from '@/components/map/MapCanvas';
import OperationalOverview from '@/components/dashboard/OperationalOverview';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import CandidateVesselCard from '@/components/dashboard/CandidateVesselCard';
import { mockOperationalStats, mockCandidateVessel } from '@/data/mock/mockDashboard';
import { mockAlerts } from '@/data/mock/mockAlerts';

export default function DashboardPage() {
  return (
    <>
      {/* Center Interactive Map Canvas */}
      <MapCanvas showCandidateOverlay={true} showSpillOverlay={true} />

      {/* Right Context Panel */}
      <aside className="dashboard-side-panel">
        <div className="dashboard-panel-inner">
          <OperationalOverview stats={mockOperationalStats} />
          <RecentAlerts alerts={mockAlerts.slice(0, 2)} />
          <CandidateVesselCard vessel={mockCandidateVessel} />
        </div>
      </aside>
    </>
  );
}
