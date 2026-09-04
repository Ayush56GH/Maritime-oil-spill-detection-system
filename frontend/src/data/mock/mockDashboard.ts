export interface OperationalStats {
  activeVessels: number;
  trackedRoutes: number;
  detectedSpills: number;
}

export interface CandidateVessel {
  id: string;
  name: string;
  type: string;
  mmsi: string;
  imo: string;
  speed: string;
  heading: string;
  draft: string;
  status: string;
  evidenceStrength: number;
  lastFix: string;
  coordinates: string;
}

export const mockOperationalStats: OperationalStats = {
  activeVessels: 124,
  trackedRoutes: 89,
  detectedSpills: 2,
};

export const mockCandidateVessel: CandidateVessel = {
  id: 'V-889',
  name: 'MT ARCTIC STAR',
  type: 'Chemical/Oil Products Tanker',
  mmsi: '312010010',
  imo: '9123456',
  speed: '14.2 kts',
  heading: '085° E',
  draft: '11.4 m',
  status: 'Underway',
  evidenceStrength: 78,
  lastFix: '2m ago',
  coordinates: "45°23'11\"N 12°14'45\"E",
};
