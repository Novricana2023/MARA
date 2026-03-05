import React, { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
import { attractionZones, zoneStatusToColor, PARK_CENTER } from '../../simulation/zones';

const vehicleIcon = new L.DivIcon({
  className: '',
  html:
    '<div class="w-4 h-4 bg-safari-accent rounded-full border border-safari-cream shadow-md shadow-black/50"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const vehicleOverstayIcon = new L.DivIcon({
  className: '',
  html:
    '<div class="w-4 h-4 bg-safari-danger rounded-full border border-safari-cream shadow-md shadow-black/50 animate-ping"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const animalIcons = {
  lion: '🦁',
  elephant: '🐘',
  leopard: '🐆',
  rhino: '🦏'
};

const ParkMap = ({
  vehicles,
  zonesState,
  sightings,
  overcrowdedZoneId,
  biasZoneId,
  myVehicleId
}) => {
  const center = useMemo(() => PARK_CENTER, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {attractionZones.map((zone) => {
          const zoneState = zonesState[zone.id] || { count: 0, status: 'normal' };
          const color = zoneStatusToColor(zoneState.status);
          const isOvercrowded = zone.id === overcrowdedZoneId;

          return (
            <Circle
              key={zone.id}
              center={[zone.center.lat, zone.center.lng]}
              radius={zone.radiusMeters}
              pathOptions={{
                color:
                  color === 'red'
                    ? '#F25C54'
                    : color === 'yellow'
                    ? '#FFB703'
                    : '#38b000',
                fillColor:
                  color === 'red'
                    ? '#F25C54'
                    : color === 'yellow'
                    ? '#FFB703'
                    : '#38b000',
                fillOpacity: isOvercrowded ? 0.3 : 0.16,
                weight: isOvercrowded ? 3 : 1.5,
                dashArray: isOvercrowded ? '4 6' : ''
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{zone.name}</div>
                  <div className="text-xs text-safari-olive">
                    Vehicles inside: <strong>{zoneState.count}</strong>
                  </div>
                  <div className="text-xs">
                    Status:{' '}
                    <span
                      className={
                        zoneState.status === 'overcrowded'
                          ? 'zone-pill-red'
                          : zoneState.status === 'busy'
                          ? 'zone-pill-yellow'
                          : 'zone-pill-green'
                      }
                    >
                      {zoneState.status.toUpperCase()}
                    </span>
                  </div>
                  {biasZoneId === zone.id && (
                    <div className="text-[11px] text-safari-danger mt-1">
                      Vehicles are currently being guided towards this hotspot.
                    </div>
                  )}
                </div>
              </Popup>
            </Circle>
          );
        })}

        {vehicles.map((veh) => {
          const isMyVehicle = veh.id === myVehicleId;
          const minutesInside =
            veh.zoneEnterAt && veh.currentZoneId
              ? Math.floor((Date.now() - veh.zoneEnterAt) / (1000 * 60))
              : null;

          return (
            <Marker
              key={veh.id}
              position={[veh.position.lat, veh.position.lng]}
              icon={
                veh.status === 'overstaying'
                  ? vehicleOverstayIcon
                  : vehicleIcon
              }
            >
              <Popup>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm">
                      {veh.name}
                      {isMyVehicle && (
                        <span className="ml-1 text-[11px] text-safari-olive font-medium">
                          (You)
                        </span>
                      )}
                    </div>
                    {isMyVehicle && (
                      <span className="pill-badge bg-emerald-500/10 text-emerald-700 border border-emerald-500/40 text-[10px]">
                        My vehicle
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-safari-olive">
                    ID: <span className="font-mono">{veh.id}</span>
                  </div>
                  <div className="text-xs">
                    Status:{' '}
                    <span
                      className={
                        veh.status === 'overstaying'
                          ? 'zone-pill-red'
                          : veh.status === 'redirected'
                          ? 'zone-pill-yellow'
                          : 'zone-pill-green'
                      }
                    >
                      {veh.status.toUpperCase()}
                    </span>
                  </div>
                  {veh.passengers != null && (
                    <div className="text-xs text-safari-olive">
                      Passengers: <span className="font-medium">{veh.passengers}</span>
                    </div>
                  )}
                  {veh.currentZoneId && (
                    <div className="text-xs">
                      In zone:{' '}
                      <span className="font-medium">{veh.currentZoneId}</span>
                    </div>
                  )}
                  {minutesInside != null && (
                    <div className="text-xs text-safari-olive">
                      Time in current zone:{' '}
                      <span className="font-medium">{minutesInside} min</span>
                    </div>
                  )}
                  {veh.status === 'overstaying' && isMyVehicle && (
                    <div className="text-xs text-safari-danger mt-1">
                      Penalty accruing:{' '}
                      <strong>${veh.penalty.toFixed(2)}</strong>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {sightings.map((sighting) => {
          const icon = animalIcons[sighting.type] || '🐾';
          return (
            <Marker
              key={sighting.id}
              position={[sighting.position.lat, sighting.position.lng]}
              icon={
                new L.DivIcon({
                  className: '',
                  html: `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-safari-olive border border-safari-accent text-xl">${icon}</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14]
                })
              }
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold capitalize text-sm">
                    {sighting.type} sighting
                  </div>
                  <div className="text-xs text-safari-olive">
                    Group size: <strong>{sighting.count}</strong>
                  </div>
                  {sighting.note && (
                    <div className="text-xs italic">&quot;{sighting.note}&quot;</div>
                  )}
                  <div className="text-[11px] text-safari-sand mt-1">
                    Auto-expiring demo marker · ideal for live pitches.
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParkMap;

