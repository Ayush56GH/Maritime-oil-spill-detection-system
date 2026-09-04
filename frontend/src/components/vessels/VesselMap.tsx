'use client';

import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, ShieldCheck } from 'lucide-react';

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

// Custom vessel marker icon
const createVesselIcon = (title: string, subtitle: string) => {
  return L.divIcon({
    className: 'custom-vessel-map-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #00d7b2; box-shadow: 0 0 16px #00d7b2; border: 2px solid #ffffff;"></div>
        <div style="margin-top: 5px; background: rgba(11, 23, 35, 0.95); border: 1.5px solid #00d7b2; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-family: 'Roboto Mono', monospace; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.6); backdrop-filter: blur(8px);">
          <div style="font-weight: 700; color: #00d7b2;">${title}</div>
          <div style="font-size: 10px; color: #94a3b8;">${subtitle}</div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Waypoint dot icon with timestamp label
const createWaypointIcon = (label: string) => {
  return L.divIcon({
    className: 'custom-waypoint-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #00d7b2; border: 2px solid #070e17; box-shadow: 0 0 8px #00d7b2;"></div>
        <div style="margin-top: 4px; background: rgba(7, 14, 23, 0.88); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; padding: 2px 6px; border-radius: 3px; font-family: 'Roboto Mono', monospace; font-size: 10px; white-space: nowrap; backdrop-filter: blur(4px);">
          ${label}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function VesselMap() {
  const [mounted, setMounted] = useState(false);
  const [activeTileKey, setActiveTileKey] = useState<'osm' | 'dark' | 'satellite'>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Atlantic / North Sea Maritime Corridor Coordinates
  const center: [number, number] = [58.5, -10.0];
  const zoom = 5;

  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }} />
    );
  }

  // Waypoints along vessel historical track
  const waypoints: { pos: [number, number]; label: string }[] = [
    { pos: [54.2, -28.0], label: 'Oct 14, 16:00' },
    { pos: [57.8, -12.5], label: 'Oct 16, 01:00' },
    { pos: [63.5, -16.0], label: 'Oct 12, 16:00' },
  ];

  const trackCoordinates: [number, number][] = [
    [50.0, -38.0],
    [54.2, -28.0],
    [56.8, -18.2],
    [57.8, -12.5],
    [60.2, -14.2],
    [63.5, -16.0],
    [65.2, -22.0],
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Floating HUD Telemetry Box (Top-Left) */}
      <div className="hud-telemetry-box">
        <div className="hud-telemetry-coord">LOC: 45°23'11"N 12°14'45"E</div>
        <div className="hud-telemetry-fix">LAST FIX: 2m ago</div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', backgroundColor: '#070e17' }}
        zoomControl={true}
      >
        <MapViewController center={center} zoom={zoom} />

        {/* Tile Layer */}
        <TileLayer
          url={TILE_PROVIDERS[activeTileKey].url}
          attribution={TILE_PROVIDERS[activeTileKey].attribution}
          maxZoom={18}
        />

        {/* Historical Route Trajectory Polyline */}
        <Polyline
          positions={trackCoordinates}
          pathOptions={{
            color: '#00d7b2',
            weight: 3,
            opacity: 0.9,
          }}
        />

        {/* Waypoint Markers */}
        {waypoints.map((wp, idx) => (
          <Marker key={idx} position={wp.pos} icon={createWaypointIcon(wp.label)} />
        ))}

        {/* Current Active Vessel Location Marker */}
        <Marker
          position={[58.2, -15.5]}
          icon={createVesselIcon('MT ARCTIC STAR', '192° · 14.6 knots')}
        >
          <Popup>
            <div style={{ padding: '4px', color: '#070e17' }}>
              <strong>MT ARCTIC STAR</strong>
              <div style={{ fontSize: '11px', color: '#475569' }}>
                Status: Underway | Speed: 14.2 kts
              </div>
            </div>
          </Popup>
        </Marker>
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
