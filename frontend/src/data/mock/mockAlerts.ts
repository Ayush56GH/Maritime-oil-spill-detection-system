export interface AlertItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  coordinates?: string;
  actionLabel?: string;
  matchConfidence?: number;
  imo?: string;
  speed?: string;
}

export const mockAlerts: AlertItem[] = [
  {
    id: 'SPL-992-BCB',
    title: 'Oil spill detected in Bay of Bengal',
    subtitle: 'Est. Extent: 4.2 km²',
    coordinates: "15°23'N 87°12'E",
    timestamp: 'T-0:02:14 (Just now)',
    severity: 'critical',
    actionLabel: 'Investigate Spill',
  },
  {
    id: 'SPL-084',
    title: 'Candidate identified for Spill-084',
    subtitle: 'Evidence Strength: Medium',
    timestamp: 'T-1:45:00 (12m ago)',
    severity: 'warning',
    actionLabel: 'View Evidence',
    matchConfidence: 78,
    imo: '9876543',
    speed: '14.2 kn',
  },
  {
    id: 'SYS-994',
    title: 'SAR Satellite Pass Completed',
    subtitle: 'New Synthetic Aperture Radar Imagery available for sector Alpha-Niner. Processing complete.',
    timestamp: 'T-4:12:30',
    severity: 'info',
    actionLabel: 'Load Layer',
  },
  {
    id: 'AIS-44321',
    title: 'Vessel IMO-44321 signal lost',
    subtitle: 'Zone 4B Anomaly detected',
    coordinates: '24.5°N, 89.2°W',
    timestamp: '12m ago',
    severity: 'warning',
  },
];
