import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// ─── Vite-compatible icon fix ─────────────────────────────────────────────────
// Leaflet's default icon URLs break under Vite's asset pipeline.
// We point them at the CDN instead so they always resolve.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Severity → colour mapping for circle markers
const SEVERITY_COLOR = {
    high:   '#ef4444',   // red
    medium: '#8b5cf6',   // purple
    low:    '#10b981',   // green
};

// Demo fallback markers shown when threats have no geo-data
const DEMO_THREATS = [
    { _id: 'd1', type: 'DDoS',        severity: 'high',   source_ip: '103.21.244.0', country: 'China',        lat: 35.86, lon: 104.19 },
    { _id: 'd2', type: 'Phishing',    severity: 'medium', source_ip: '185.220.101.1',country: 'Russia',       lat: 55.75, lon:  37.61 },
    { _id: 'd3', type: 'Malware',     severity: 'high',   source_ip: '5.188.10.10',  country: 'Germany',      lat: 51.16, lon:  10.45 },
    { _id: 'd4', type: 'Brute Force', severity: 'low',    source_ip: '192.168.0.10', country: 'India',        lat: 20.59, lon:  78.96 },
    { _id: 'd5', type: 'SQL Inject',  severity: 'medium', source_ip: '45.33.32.156', country: 'USA',          lat: 37.09, lon: -95.71 },
    { _id: 'd6', type: 'Ransomware',  severity: 'high',   source_ip: '41.57.1.1',    country: 'South Africa', lat:-28.46, lon:  24.69 },
    { _id: 'd7', type: 'Scan',        severity: 'low',    source_ip: '220.181.0.1',  country: 'Brazil',       lat:-14.23, lon: -51.93 },
];

const ThreatMap = ({ threats = [] }) => {
    // Use real threat data if it has coordinates; fall back to demo markers
    const geoThreats = threats.filter(t => t.lat && t.lon);
    const markers    = geoThreats.length > 0 ? geoThreats : DEMO_THREATS;

    return (
        <MapContainer
            center={[20, 10]}
            zoom={2}
            minZoom={1}
            scrollWheelZoom={false}
            style={{ height: '500px', width: '100%', borderRadius: '2.2rem', background: '#0a0a0b' }}
            // Prevent the parent's overflow:hidden from clipping tiles
            className="leaflet-map-override"
        >
            {/* ── Primary: Stadia Maps dark tile (no API key needed) ─────── */}
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stamen.com" target="_blank">Stamen</a> / <a href="https://stadiamaps.com" target="_blank">Stadia Maps</a>, &copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                maxZoom={20}
            />

            {/* ── Threat markers ─────────────────────────────────────────── */}
            {markers.map((t) => {
                const color  = SEVERITY_COLOR[t.severity] || '#3b82f6';
                const radius = t.severity === 'high' ? 12 : t.severity === 'medium' ? 9 : 7;

                return (
                    <CircleMarker
                        key={t._id}
                        center={[t.lat, t.lon]}
                        radius={radius}
                        pathOptions={{
                            color,
                            fillColor: color,
                            fillOpacity: 0.85,
                            weight: 2,
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: 160 }}>
                                <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>
                                    {t.type}
                                </div>
                                <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace', lineHeight: 1.7 }}>
                                    <span style={{
                                        background: color,
                                        color: '#fff',
                                        borderRadius: 4,
                                        padding: '1px 6px',
                                        fontSize: 9,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        marginRight: 6,
                                    }}>
                                        {t.severity}
                                    </span>
                                    {t.country}<br />
                                    IP: {t.source_ip}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
};

export default ThreatMap;
