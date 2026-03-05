import { attractionZones, PARK_CENTER } from './zones';

const VEHICLE_NAMES = [
  'Kifaru 1',
  'Simba 2',
  'Twiga 3',
  'Ndovu 4',
  'Chui 5',
  'Tembo 6',
  'Nyati 7',
  'Pundamilia 8',
  'Kifaru 9',
  'Simba 10'
];

export function createInitialVehicles() {
  return Array.from({ length: 10 }).map((_, idx) => {
    const jitterLat = (Math.random() - 0.5) * 0.01;
    const jitterLng = (Math.random() - 0.5) * 0.01;
    const passengers = 2 + Math.floor(Math.random() * 5);

    return {
      id: `veh-${idx + 1}`,
      name: VEHICLE_NAMES[idx] || `Vehicle ${idx + 1}`,
      position: {
        lat: PARK_CENTER.lat + jitterLat,
        lng: PARK_CENTER.lng + jitterLng
      },
      status: 'normal',
      currentZoneId: null,
      zoneEnterAt: null,
      penalty: 0,
      passengers,
      lastUpdated: Date.now()
    };
  });
}

export function getRandomZone() {
  const idx = Math.floor(Math.random() * attractionZones.length);
  return attractionZones[idx];
}

export function moveVehiclesSmoothly(vehicles, biasTowardsZoneId = null) {
  const now = Date.now();
  return vehicles.map((veh) => {
    let targetZone =
      biasTowardsZoneId &&
      attractionZones.find((z) => z.id === biasTowardsZoneId);

    if (!targetZone && Math.random() < 0.3) {
      targetZone = getRandomZone();
    }

    const speedMetersPerSecond = 9 + Math.random() * 6;
    const dtSeconds = Math.min((now - veh.lastUpdated) / 1000, 5);
    const moveFactor = (speedMetersPerSecond * dtSeconds) / 3000;

    let target =
      targetZone?.center || {
        lat: PARK_CENTER.lat + (Math.random() - 0.5) * 0.004,
        lng: PARK_CENTER.lng + (Math.random() - 0.5) * 0.004
      };

    const lat = veh.position.lat + (target.lat - veh.position.lat) * moveFactor;
    const lng = veh.position.lng + (target.lng - veh.position.lng) * moveFactor;

    return {
      ...veh,
      position: { lat, lng },
      lastUpdated: now
    };
  });
}

