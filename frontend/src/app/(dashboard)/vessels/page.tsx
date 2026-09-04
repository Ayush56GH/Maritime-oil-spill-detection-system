'use client';

import React, { useState } from 'react';
import VesselMapCanvas from '@/components/vessels/VesselMapCanvas';
import VesselListPanel from '@/components/vessels/VesselListPanel';
import VesselDetailPanel from '@/components/vessels/VesselDetailPanel';
import { mockTrackedVessels, TrackedVessel } from '@/data/mock/mockVessels';

export default function VesselsPage() {
  const [selectedVessel, setSelectedVessel] = useState<TrackedVessel | null>(
    mockTrackedVessels[0]
  );
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('detail');

  const handleSelectVessel = (vessel: TrackedVessel) => {
    setSelectedVessel(vessel);
    setViewMode('detail');
  };

  return (
    <>
      {/* Interactive Map with Vessel Trajectory */}
      <VesselMapCanvas />

      {/* Right Context Panel (List or Detail) */}
      {viewMode === 'detail' && selectedVessel ? (
        <VesselDetailPanel
          vessel={selectedVessel}
          onBackToList={() => setViewMode('list')}
        />
      ) : (
        <VesselListPanel
          vessels={mockTrackedVessels}
          selectedVesselId={selectedVessel?.id || ''}
          onSelectVessel={handleSelectVessel}
        />
      )}
    </>
  );
}
