'use client';

import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Compass, AlertTriangle, ShieldCheck } from 'lucide-react';

// Tile Layer configurations (100% Free - No API Key Required)
const TILE_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap (Free / No Key)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    name: 'Dark CartoDB (Free / No Key)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  satellite: {
    name: 'Esri Satellite (Free / No Key)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Open GIS Community',
  },
};

// Custom vessel marker icon
const createVesselIcon = (label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-vessel-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #00d7b2; box-shadow: 0 0 12px #00d7b2, 0 0 24px rgba(0, 215, 178, 0.4); border: 2px solid #ffffff;"></div>
        <div style="margin-top: 4px; background: rgba(11, 23, 35, 0.92); border: 1px solid #00d7b2; color: #00d7b2; padding: 2px 7px; border-radius: 3px; font-family: 'Roboto Mono', monospace; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(4px);">
          ${label}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Map controller for programmatic pan/zoom
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface LeafletMapProps {
  showCandidateOverlay?: boolean;
  showSpillOverlay?: boolean;
}

export default function LeafletMap({
  showCandidateOverlay = true,
  showSpillOverlay = true,
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTileKey, setActiveTileKey] = useState<'osm' | 'dark' | 'satellite'>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus location: Gulf of Mexico / Surveillance Sector 4B
  const defaultCenter: [number, number] = [24.5, -89.2];
  const [zoom] = useState(7);

  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }} />
    );
  }

  // Spill coordinates polygon (Zone 4B anomaly)
  const spillPolygon: [number, number][] = [
    [24.85, -89.55],
    [24.95, -88.95],
    [24.35, -88.75],
    [24.25, -89.35],
  ];

  // AIS Track history polyline
  const trajectoryTrack: [number, number][] = [
    [26.1, -91.2],
    [25.6, -90.3],
    [25.1, -89.6],
    [24.65, -89.4],
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }}
        zoomControl={true}
      >
        <MapController center={defaultCenter} zoom={zoom} />

        {/* Tile Layer */}
        <TileLayer
          url={TILE_PROVIDERS[activeTileKey].url}
          attribution={TILE_PROVIDERS[activeTileKey].attribution}
          maxZoom={18}
        />

        {/* AIS Vessel Trajectory Polyline */}
        <Polyline
          positions={trajectoryTrack}
          pathOptions={{
            color: '#00d7b2',
            weight: 2,
            dashArray: '5, 8',
            opacity: 0.85,
          }}
        />

        {/* Candidate Vessel Marker */}
        <Marker position={[25.1, -89.6]} icon={createVesselIcon('IMO-889922')}>
          <Popup className="custom-leaflet-popup">
            <div style={{ padding: '4px 6px', color: '#070e17' }}>
              <strong style={{ display: 'block', fontSize: '13px' }}>MT ARCTIC STAR</strong>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                IMO: 889922 | Speed: 12.4 kts | Heading: 045° NE
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 600, color: '#00876c' }}>
                Evidence Strength: 75% Association
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Detected Oil Spill Polygon */}
        <Polygon
          positions={spillPolygon}
          pathOptions={{
            color: '#ec4899',
            fillColor: '#ec4899',
            fillOpacity: 0.25,
            weight: 2.5,
          }}
        >
          <Tooltip permanent direction="center" className="spill-leaflet-tooltip">
            <div
              style={{
                background: '#881337',
                border: '1px solid #f43f5e',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }}
            >
              <AlertTriangle size={12} />
              <span>SPILL DETECTED (Zone 4B)</span>
            </div>
          </Tooltip>
        </Polygon>
      </MapContainer>

      {/* Layer Switcher HUD on top right */}
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
