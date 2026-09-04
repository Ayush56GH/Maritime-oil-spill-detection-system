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
import { Layers, ShieldCheck, LineChart } from 'lucide-react';

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

// Custom Asset Icon
const createAssetIcon = (label: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-asset-icon',
    html: `
      <div style="display: flex; align-items: center; gap: 6px; background: rgba(7, 14, 23, 0.88); border: 1px solid rgba(0, 215, 178, 0.4); color: #00d7b2; padding: 2px 7px; border-radius: 3px; font-family: 'Roboto Mono', monospace; font-size: 10px; font-weight: 700; white-space: nowrap; backdrop-filter: blur(4px);">
        <span>${symbol}</span>
        <span>${label}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function SpillMapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function SpillMap() {
  const [mounted, setMounted] = useState(false);
  const [activeTileKey, setActiveTileKey] = useState<'osm' | 'dark' | 'satellite'>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gulf of Mexico sector 4B Center
  const center: [number, number] = [28.53, -89.56];
  const zoom = 9;

  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }} />
    );
  }

  // Iridescent Oil Slick Polygon
  const oilSlickPolygon: [number, number][] = [
    [28.72, -89.85],
    [28.85, -89.48],
    [28.78, -89.15],
    [28.42, -89.12],
    [28.25, -89.45],
    [28.32, -89.78],
    [28.55, -89.89],
  ];

  // Nearby Trajectory lines
  const tankerTrack: [number, number][] = [
    [29.2, -90.2],
    [28.9, -89.8],
    [28.65, -89.4],
    [28.3, -88.9],
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }}
        zoomControl={true}
      >
        <SpillMapController center={center} zoom={zoom} />

        {/* Tile Layer */}
        <TileLayer
          url={TILE_PROVIDERS[activeTileKey].url}
          attribution={TILE_PROVIDERS[activeTileKey].attribution}
          maxZoom={18}
        />

        {/* Matched AIS Vessel Track */}
        <Polyline
          positions={tankerTrack}
          pathOptions={{
            color: '#fbbf24',
            weight: 2.5,
            dashArray: '6, 6',
            opacity: 0.9,
          }}
        />

        {/* Oil Spill Polygon Overlay */}
        <Polygon
          positions={oilSlickPolygon}
          pathOptions={{
            color: '#00d7b2',
            fillColor: '#00d7b2',
            fillOpacity: 0.35,
            weight: 2,
          }}
        >
          {/* Slick Info HUD */}
          <Tooltip permanent direction="center" className="spill-hud-tooltip">
            <div
              style={{
                background: 'rgba(11, 23, 35, 0.95)',
                border: '1.5px solid #00d7b2',
                borderRadius: '4px',
                padding: '6px 10px',
                fontFamily: 'var(--font-mono)',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                SPILL ID: <span style={{ color: '#ffffff' }}>SPILL-084</span>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>
                STATUS: <span style={{ color: '#f43f5e' }}>CRITICAL</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                AREA: <span style={{ color: '#ffffff' }}>41.2 SQ NM</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                CONFIDENCE: <span style={{ color: '#00d7b2' }}>HIGH</span>
              </div>
            </div>
          </Tooltip>
        </Polygon>

        {/* Tactical Response Assets */}
        <Marker position={[28.35, -89.3]} icon={createAssetIcon('SKIMMER VESSEL 01', '⚓')} />
        <Marker position={[28.45, -89.2]} icon={createAssetIcon('BOOM DEPLOYMENT', '⚓')} />
        <Marker position={[28.55, -89.15]} icon={createAssetIcon('AERIAL SURVEILLANCE A-3', '✈')} />
      </MapContainer>

      {/* Floating Estimated Origin Point Card at Bottom-Right */}
      <div className="origin-preview-box">
        <div className="origin-preview-title">Estimated Origin Point</div>
        <div className="origin-preview-desc">
          Modeling Complete. Waiting for backtrack execution to visualize trajectory.
        </div>
        <div className="origin-preview-icon-row">
          <LineChart size={22} />
        </div>
      </div>

      {/* Layer Switcher HUD */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
        }}
      >
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          style={{
            background: 'rgba(11, 23, 35, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}
        >
          <Layers size={14} color="#00d7b2" />
          <span>Layer: {TILE_PROVIDERS[activeTileKey].name}</span>
        </button>

        {showLayerMenu && (
          <div
            style={{
              background: 'rgba(11, 23, 35, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              minWidth: '180px',
            }}
          >
            {(Object.keys(TILE_PROVIDERS) as Array<keyof typeof TILE_PROVIDERS>).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTileKey(key);
                  setShowLayerMenu(false);
                }}
                style={{
                  background: activeTileKey === key ? 'rgba(0, 215, 178, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTileKey === key ? '#00d7b2' : '#94a3b8',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: activeTileKey === key ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{TILE_PROVIDERS[key].name}</span>
                {activeTileKey === key && <ShieldCheck size={13} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
