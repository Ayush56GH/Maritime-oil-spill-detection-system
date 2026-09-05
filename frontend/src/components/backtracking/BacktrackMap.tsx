'use client';

import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, ShieldCheck, Maximize2 } from 'lucide-react';

const TILE_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap (Free / No Key)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  dark: {
    name: 'Dark CartoDB (Free / No Key)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  satellite: {
    name: 'Esri Satellite (Free / No Key)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Open GIS Community',
  },
};

const createDriftNodeIcon = (label: string) => {
  return L.divIcon({
    className: 'custom-drift-node-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #fb923c; border: 2px solid #ffffff; box-shadow: 0 0 10px #f97316;"></div>
        <div style="margin-top: 3px; background: rgba(7, 14, 23, 0.9); border: 1px solid #fb923c; color: #fb923c; padding: 2px 5px; border-radius: 3px; font-family: 'Roboto Mono', monospace; font-size: 10px; font-weight: 700; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function BacktrackMapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface BacktrackMapProps {
  onViewEvidenceDetails?: () => void;
  showFloatingCandidateCard?: boolean;
}

export default function BacktrackMap({
  onViewEvidenceDetails,
  showFloatingCandidateCard = false,
}: BacktrackMapProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTileKey, setActiveTileKey] = useState<'osm' | 'dark' | 'satellite'>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus location: North Atlantic / North Sea offshore sector
  const center: [number, number] = [61.0, -5.0];
  const zoom = 5;

  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }} />
    );
  }

  // Drift Vector path (Red/Orange hydrodynamic model)
  const driftVector: [number, number][] = [
    [64.5, -12.0],
    [62.2, -6.0],
    [60.0, -1.5],
    [58.0, 3.0],
  ];

  // AIS Vessel path (Cyan dashed track)
  const vesselTrack: [number, number][] = [
    [56.0, -16.0],
    [58.5, -10.0],
    [61.5, -4.5],
    [63.8, 1.0],
  ];

  // Spill Origin Polygon
  const spillOriginPolygon: [number, number][] = [
    [65.2, -14.0],
    [65.8, -10.5],
    [63.8, -9.0],
    [63.2, -13.0],
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }}
        zoomControl={true}
      >
        <BacktrackMapController center={center} zoom={zoom} />

        <TileLayer
          url={TILE_PROVIDERS[activeTileKey].url}
          attribution={TILE_PROVIDERS[activeTileKey].attribution}
          maxZoom={18}
        />

        {/* Spill Origin Polygon */}
        <Polygon
          positions={spillOriginPolygon}
          pathOptions={{
            color: '#c026d3',
            fillColor: '#c026d3',
            fillOpacity: 0.25,
            weight: 2,
          }}
        >
          <Tooltip permanent direction="center">
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#f43f5e' }}>
              ORIGIN SECTOR (T-0)
            </div>
          </Tooltip>
        </Polygon>

        {/* Candidate Vessel AIS Track */}
        <Polyline
          positions={vesselTrack}
          pathOptions={{
            color: '#00d7b2',
            weight: 2.5,
            dashArray: '5, 8',
            opacity: 0.9,
          }}
        />

        {/* Hydrodynamic Backtrack Drift Arrow / Vector */}
        <Polyline
          positions={driftVector}
          pathOptions={{
            color: '#f97316',
            weight: 4,
            opacity: 0.95,
          }}
        />

        {/* Drift Timeline Nodes */}
        <Marker position={[64.5, -12.0]} icon={createDriftNodeIcon('T+24h')} />
        <Marker position={[62.2, -6.0]} icon={createDriftNodeIcon('T+48h')} />
        <Marker position={[60.0, -1.5]} icon={createDriftNodeIcon('T+72h')} />
        <Marker position={[58.0, 3.0]} icon={createDriftNodeIcon('T+96h')} />
      </MapContainer>

      {/* Floating Card over Map in Simulation Mode */}
      {showFloatingCandidateCard && (
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            width: '320px',
            background: 'rgba(11, 23, 35, 0.95)',
            border: '1.5px solid var(--accent-cyan)',
            borderRadius: '6px',
            padding: '1.25rem',
            backdropFilter: 'blur(16px)',
            zIndex: 1000,
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem', fontWeight: 700 }}>
              CANDIDATE VESSEL
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ID: V-889
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
            MT ARCTIC STAR
          </h3>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            IMO: 9123456 | MMSI: 312000100
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Proximity match</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Time correlation</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>High</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Trajectory match</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>Med-High</span>
            </div>
          </div>

          <button
            className="btn-primary-cyan"
            onClick={onViewEvidenceDetails}
            style={{ padding: '0.65rem 1rem', fontSize: '0.78rem' }}
          >
            View Evidence Details
          </button>
        </div>
      )}

      {/* Forensic Layer Legend (Top-Right) */}
      <div className="forensic-legend-box">
        <div className="legend-title">LAYER LEGEND</div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#c026d3' }} />
          <span>Detected Spill Contour</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#00d7b2' }} />
          <span>Candidate Vessel AIS</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#f97316' }} />
          <span>Backtrack Drift Model</span>
        </div>
      </div>

      {/* Forensic Bottom Status HUD */}
      <div className="forensic-bottom-bar">
        <div>
          MODEL: <span style={{ color: '#ffffff' }}>GNOME v1.3</span> &nbsp;|&nbsp;
          CONFIDENCE INTERVAL: <span style={{ color: 'var(--accent-cyan)' }}>92%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Maximize2 size={13} />
          <span>Expand View</span>
        </div>
      </div>
    </div>
  );
}
