export interface NearbyTrack {
  imo: string;
  type: string;
  matchScore: number;
  lastPosTime: string;
  isPrimary?: boolean;
}

export interface SpillDetail {
  id: string;
  coordinates: string;
  lat: number;
  lng: number;
  status: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  detectionTime: string;
  estArea: string;
  sensorSource: string;
  confidence: string;
  evidenceLevel: number;
  evidenceDescription: string;
  areaSqNm: string;
  nearbyTracks: NearbyTrack[];
  estimatedOriginStatus: string;
}

export const mockSpillDetail: SpillDetail = {
  id: 'Spill-084',
  coordinates: 'LAT 28.5383 N, LON -89.5632 W',
  lat: 28.5383,
  lng: -89.5632,
  status: 'CRITICAL',
  detectionTime: '2023-10-24 14:32Z',
  estArea: '14.2 sq nmi',
  sensorSource: 'Sentinel-1 SAR',
  confidence: '98% High',
  evidenceLevel: 5,
  evidenceDescription:
    'Strong synthetic aperture radar signature corroborated with multispectral anomaly. Clear trajectory established.',
  areaSqNm: '41.2 SQ NM',
  nearbyTracks: [
    {
      imo: 'IMO-9384756',
      type: 'Crude Oil Tanker',
      matchScore: 84,
      lastPosTime: 'Last pos: -1.2h from spill time',
      isPrimary: true,
    },
    {
      imo: 'IMO-1192837',
      type: 'Bulk Carrier',
      matchScore: 12,
      lastPosTime: 'Last pos: -4.5h from spill time',
      isPrimary: false,
    },
  ],
  estimatedOriginStatus:
    'Modeling Complete. Waiting for backtrack execution to visualize trajectory.',
};
