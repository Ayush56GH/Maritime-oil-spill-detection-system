'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldAlert,
  Radio,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Search,
  Layers,
  MapPin,
  Ship,
  Zap,
} from 'lucide-react';
import EvidenceBar from '@/components/shared/EvidenceBar';

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="alerts-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(11, 23, 35, 0.95)',
            border: '1.5px solid var(--accent-cyan)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Alerts Header */}
      <div className="alerts-header">
        <div>
          <h1 className="alerts-title">Operational Alerts</h1>
          <p className="alerts-subtitle">
            Real-time anomalies and critical environmental incidents.
          </p>
        </div>

        <div className="alerts-header-actions">
          <button
            className="alerts-filter-btn"
            onClick={() => {
              const nextFilter =
                filterType === 'all'
                  ? 'critical'
                  : filterType === 'critical'
                  ? 'warning'
                  : filterType === 'warning'
                  ? 'info'
                  : 'all';
              setFilterType(nextFilter);
            }}
          >
            <Filter size={14} />
            <span>Filter: {filterType.toUpperCase()}</span>
          </button>

          <button
            className="alerts-filter-btn"
            onClick={() => triggerToast('Sorted by latest timestamp (T-0 descending)')}
          >
            <ArrowUpDown size={14} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Alerts Feed Cards */}
      <div>
        {/* Alert 1: High Priority */}
        {(filterType === 'all' || filterType === 'critical') && (
          <div className="alert-feed-card critical">
            <div className="alert-feed-left">
              <div className="alert-feed-icon-box critical">
                <AlertTriangle size={22} />
              </div>

              <div className="alert-feed-body">
                <div className="alert-feed-meta-row">
                  <span
                    style={{
                      background: 'rgba(244, 63, 94, 0.2)',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      color: '#ff6b81',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      padding: '2px 7px',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    HIGH PRIORITY
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    T-0:02:14
                  </span>
                </div>

                <h2 className="alert-feed-title">
                  Oil spill detected in Bay of Bengal
                </h2>

                <div className="alert-feed-details">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#8896a6" />
                    <span>15°23'N 87°12'E</span>
                  </div>
                  <div>Est. Extent: 4.2 km²</div>
                </div>
              </div>
            </div>

            <div className="alert-feed-right">
              <Link href="/spills" className="btn-investigate-critical">
                <span>Investigate Spill</span>
                <ArrowRight size={14} />
              </Link>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                ID: SPL-992-BCB
              </div>
            </div>
          </div>
        )}

        {/* Alert 2: Investigation Required */}
        {(filterType === 'all' || filterType === 'warning') && (
          <div className="alert-feed-card warning">
            <div className="alert-feed-left">
              <div className="alert-feed-icon-box warning">
                <ShieldAlert size={22} />
              </div>

              <div className="alert-feed-body">
                <div className="alert-feed-meta-row">
                  <span
                    style={{
                      background: 'rgba(251, 191, 36, 0.15)',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      color: '#fbbf24',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      padding: '2px 7px',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    INVESTIGATION REQUIRED
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    T-1:45:00
                  </span>
                </div>

                <h2 className="alert-feed-title">
                  Candidate identified for Spill-084
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      EVIDENCE STRENGTH:
                    </span>
                    <div style={{ width: '90px' }}>
                      <EvidenceBar percentage={65} variant="amber" showLabel={false} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                      Medium
                    </span>
                  </div>
                </div>

                <div className="alert-feed-details">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Ship size={13} color="#8896a6" />
                    <span>IMO: 9876543</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={13} color="#8896a6" />
                    <span>Current Speed: 14.2 kn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert-feed-right">
              <Link href="/backtracking" className="btn-view-evidence">
                <span>View Evidence</span>
                <Search size={13} />
              </Link>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                Match Confidence: 78%
              </div>
            </div>
          </div>
        )}

        {/* Alert 3: System Update */}
        {(filterType === 'all' || filterType === 'info') && (
          <div className="alert-feed-card info">
            <div className="alert-feed-left">
              <div className="alert-feed-icon-box info">
                <Radio size={22} />
              </div>

              <div className="alert-feed-body">
                <div className="alert-feed-meta-row">
                  <span
                    style={{
                      background: 'rgba(0, 215, 178, 0.12)',
                      border: '1px solid rgba(0, 215, 178, 0.35)',
                      color: 'var(--accent-cyan)',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      padding: '2px 7px',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    SYSTEM UPDATE
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    T-4:12:30
                  </span>
                </div>

                <h2 className="alert-feed-title">
                  SAR Satellite Pass Completed
                </h2>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: '0.2rem' }}>
                  New Synthetic Aperture Radar imagery available for sector Alpha-Niner. Processing complete.
                </p>
              </div>
            </div>

            <div className="alert-feed-right">
              <button
                className="btn-load-layer"
                onClick={() => triggerToast('Sentinel-1 SAR Radar Layer Loaded onto Map')}
              >
                <Layers size={14} />
                <span>Load Layer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
