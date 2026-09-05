/**
 * EcoNavigators Backend API Client
 * Connects Next.js Frontend to FastAPI Backend (:8000).
 * Gracefully falls back to mock data if backend is offline.
 */

import { OperationalStats, CandidateVessel, mockOperationalStats, mockCandidateVessel } from '@/data/mock/mockDashboard';
import { SpillDetail, mockSpillDetail } from '@/data/mock/mockSpills';
import { TrackedVessel, mockTrackedVessels } from '@/data/mock/mockVessels';
import { AlertItem, mockAlerts } from '@/data/mock/mockAlerts';
import {
  CandidateRanking,
  ForensicCorrelationData,
  mockCandidateRankings,
  mockForensicEvidence,
} from '@/data/mock/mockBacktracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

async function apiFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallback !== undefined) {
      console.warn(`[EcoNavigators API] Fallback to mock for ${endpoint}:`, err);
      return fallback;
    }
    throw err;
  }
}

// 1. Dashboard Operations
export async function getOperationalStats(): Promise<OperationalStats> {
  return apiFetch<OperationalStats>('/dashboard/stats', undefined, mockOperationalStats);
}

export async function getCandidateVessel(): Promise<CandidateVessel> {
  return apiFetch<CandidateVessel>('/dashboard/candidate', undefined, mockCandidateVessel);
}

// 2. Oil Spills
export async function getSpillsList(): Promise<any[]> {
  return apiFetch<any[]>('/spills', undefined, [mockSpillDetail]);
}

export async function getSpillDetail(spillId: string): Promise<SpillDetail> {
  return apiFetch<SpillDetail>(`/spills/${spillId}`, undefined, mockSpillDetail);
}

export async function executeBacktrack(spillId: string, hours = 24, windFactor = 0.03): Promise<any> {
  return apiFetch(
    `/spills/${spillId}/backtrack`,
    {
      method: 'POST',
      body: JSON.stringify({ simulationHours: hours, windDriftFactor: windFactor }),
    },
    {
      spillId,
      estimatedOriginPoint: [28.45, -89.72],
      estimatedOriginTimestamp: '2023-10-24 08:42Z',
      confidenceScore: 92,
      status: 'COMPLETED',
    }
  );
}

// 3. Monitored Vessels
export async function getTrackedVessels(filters?: { category?: string; risk?: string; search?: string }): Promise<TrackedVessel[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.risk) params.append('risk', filters.risk);
  if (filters?.search) params.append('search', filters.search);
  const qs = params.toString() ? `?${params.toString()}` : '';

  return apiFetch<TrackedVessel[]>(`/vessels${qs}`, undefined, mockTrackedVessels);
}

export async function getVesselDetail(vesselId: string): Promise<any> {
  return apiFetch<any>(`/vessels/${vesselId}`, undefined, mockTrackedVessels[0]);
}

// 4. Backtracking & Forensic Analysis
export async function getBacktrackingAnalysis(spillId = 'Spill-084'): Promise<{
  spillId: string;
  rankings: CandidateRanking[];
  forensicEvidence: ForensicCorrelationData;
  estimatedOriginPoint: [number, number];
  estimatedDischargeTime: string;
}> {
  return apiFetch(
    `/backtracking/analysis?spill_id=${spillId}`,
    undefined,
    {
      spillId,
      rankings: mockCandidateRankings,
      forensicEvidence: mockForensicEvidence,
      estimatedOriginPoint: [28.45, -89.72],
      estimatedDischargeTime: '2023-10-24 08:42Z',
    }
  );
}

// 5. Alerts
export async function getAlerts(): Promise<AlertItem[]> {
  return apiFetch<AlertItem[]>('/alerts', undefined, mockAlerts);
}

export async function acknowledgeAlert(alertId: string): Promise<boolean> {
  const res = await apiFetch<{ success: boolean }>(
    `/alerts/${alertId}/acknowledge`,
    { method: 'POST' },
    { success: true }
  );
  return res.success;
}

// 6. Manual Incident Reporting
export async function reportSpillIncident(reportData: {
  reporterName: string;
  contactEmail?: string;
  lat: number;
  lng: number;
  estimatedSizeSqKm?: number;
  spillAppearance?: string;
  notes?: string;
}): Promise<any> {
  return apiFetch('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}

// 7. System Health
export async function getSystemHealth(): Promise<any> {
  return apiFetch('/health', undefined, { status: 'OPERATIONAL' });
}
