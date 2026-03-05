export const PARK_CENTER = {
  lat: -1.3733,
  lng: 36.858
};

export const attractionZones = [
  {
    id: 'lion-rock',
    name: 'Lion Rock',
    type: 'predator',
    center: { lat: -1.3725, lng: 36.854 },
    radiusMeters: 550
  },
  {
    id: 'elephant-river',
    name: 'Elephant River',
    type: 'herbivore',
    center: { lat: -1.375, lng: 36.8615 },
    radiusMeters: 650
  },
  {
    id: 'leopard-hill',
    name: 'Leopard Hill',
    type: 'predator',
    center: { lat: -1.3695, lng: 36.859 },
    radiusMeters: 500
  }
];

export const ZONE_STATUS = {
  NORMAL: 'normal',
  BUSY: 'busy',
  OVERCROWDED: 'overcrowded'
};

export const VEHICLE_MAX_IN_ZONE = {
  normal: 3,
  busy: 6
};

export function getZoneStatus(vehicleCount) {
  if (vehicleCount === 0) return ZONE_STATUS.NORMAL;
  if (vehicleCount <= VEHICLE_MAX_IN_ZONE.normal) return ZONE_STATUS.NORMAL;
  if (vehicleCount <= VEHICLE_MAX_IN_ZONE.busy) return ZONE_STATUS.BUSY;
  return ZONE_STATUS.OVERCROWDED;
}

export function zoneStatusToColor(status) {
  if (status === ZONE_STATUS.BUSY) return 'yellow';
  if (status === ZONE_STATUS.OVERCROWDED) return 'red';
  return 'green';
}

// Simple distance approximation good enough for the small park area
export function distanceInMeters(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * R * Math.asin(Math.sqrt(h));
}

