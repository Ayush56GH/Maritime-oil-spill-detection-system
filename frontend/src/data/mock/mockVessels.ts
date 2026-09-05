export interface TrackedVessel {
  id: string;
  name: string;
  category: 'CANDIDATE VESSEL' | 'PRODUCT TANKER' | 'CRUDE CARRIER' | 'BULK CARRIER';
  mmsi: string;
  imo: string;
  speed: string;
  heading: string;
  status: 'Underway' | 'Moored' | 'Anchored';
  evidenceStrength: number;
  risk: 'High' | 'Medium' | 'Low';
  lastCoords: string;
}

export const mockTrackedVessels: TrackedVessel[] = [
  {
    id: 'v-1',
    name: 'MT ARCTIC STAR',
    category: 'CANDIDATE VESSEL',
    mmsi: '477123900',
    imo: '9123456',
    speed: '12.4 kts',
    heading: '045° NE',
    status: 'Underway',
    evidenceStrength: 87,
    risk: 'High',
    lastCoords: "45°23'11\"N 12°14'45\"E",
  },
  {
    id: 'v-2',
    name: 'OCEAN VOYAGER',
    category: 'PRODUCT TANKER',
    mmsi: '211456000',
    imo: '9432810',
    speed: '14.1 kts',
    heading: '112° ESE',
    status: 'Underway',
    evidenceStrength: 64,
    risk: 'Medium',
    lastCoords: "42°15'00\"N 18°30'22\"E",
  },
  {
    id: 'v-3',
    name: 'GULF TRADER',
    category: 'CRUDE CARRIER',
    mmsi: '354789000',
    imo: '9876543',
    speed: '0.0 kts (Moored)',
    heading: '---',
    status: 'Moored',
    evidenceStrength: 41,
    risk: 'Low',
    lastCoords: "36°40'12\"N 24°10'00\"E",
  },
];
