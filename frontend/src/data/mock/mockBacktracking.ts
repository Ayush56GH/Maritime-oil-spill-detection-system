export interface CandidateRanking {
  rank: number;
  name: string;
  mmsi: string;
  imo: string;
  associationScore: number;
  evidenceLevel: number;
  variant: 'cyan' | 'amber' | 'muted';
}

export interface ForensicCorrelationData {
  cpa: string;
  intersectionArea: string;
  proximityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  anomalyTimestamp: string;
  deltaT: string;
  timeCorrelationLevel: 'CONFIRMED' | 'UNCONFIRMED';
  headingVariance: string;
  speedProfile: string;
  trajectoryMatchLevel: 'MEDIUM' | 'HIGH' | 'LOW';
}

export const mockCandidateRankings: CandidateRanking[] = [
  {
    rank: 1,
    name: 'MT ARCTIC STAR',
    mmsi: '235311000',
    imo: '9123456',
    associationScore: 87,
    evidenceLevel: 5,
    variant: 'cyan',
  },
  {
    rank: 2,
    name: 'SS MARLIN',
    mmsi: '312994000',
    imo: '9345678',
    associationScore: 64,
    evidenceLevel: 3,
    variant: 'amber',
  },
  {
    rank: 3,
    name: 'OCEAN VOYAGER',
    mmsi: '477123990',
    imo: '9432810',
    associationScore: 41,
    evidenceLevel: 2,
    variant: 'muted',
  },
];

export const mockForensicEvidence: ForensicCorrelationData = {
  cpa: '0.42 NM',
  intersectionArea: '84% Overlap',
  proximityLevel: 'HIGH',
  anomalyTimestamp: '2023-10-24 08:42Z',
  deltaT: '-12 Minutes',
  timeCorrelationLevel: 'CONFIRMED',
  headingVariance: '±4.2°',
  speedProfile: 'Anomalous Drop',
  trajectoryMatchLevel: 'MEDIUM',
};
