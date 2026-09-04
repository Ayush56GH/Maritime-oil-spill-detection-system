'use client';

import React from 'react';
import SpillDetailPanel from '@/components/spills/SpillDetailPanel';
import SpillMapCanvas from '@/components/spills/SpillMapCanvas';

export default function SpillsPage() {
  return (
    <>
      {/* Left Inspection & Attribution Panel */}
      <SpillDetailPanel />

      {/* Right Interactive SAR & Satellite Radar Map */}
      <SpillMapCanvas />
    </>
  );
}
