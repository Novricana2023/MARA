import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './components/layout/TopBar';
import SideNav from './components/layout/SideNav';
import HeroBanner from './components/layout/HeroBanner';
import ParkMap from './components/map/ParkMap';
import AlertsPanel from './components/panels/AlertsPanel';
import ManagerStatsPanel from './components/panels/ManagerStatsPanel';
import SightingForm from './components/panels/SightingForm';
import DemoController from './components/demo/DemoController';
import { createInitialVehicles, moveVehiclesSmoothly } from './simulation/vehicles';
import {
  attractionZones,
  distanceInMeters,
  getZoneStatus,
  ZONE_STATUS
} from './simulation/zones';

const DEMO_MAX_MINUTES_IN_ZONE = 15;
const DEMO_PENALTY_RATE_PER_TICK = 7.5;
const SIGHTING_EXPIRY_MS = 1000 * 60 * 4;

function computeZonesState(vehicles) {
  const state = {};
  attractionZones.forEach((z) => {
    state[z.id] = { count: 0, status: ZONE_STATUS.NORMAL };
  });

  vehicles.forEach((veh) => {
    const zone = veh.currentZoneId && state[veh.currentZoneId];
    if (zone) {
      zone.count += 1;
    }
  });

  Object.keys(state).forEach((id) => {
    const z = state[id];
    z.status = getZoneStatus(z.count);
  });

  return state;
}

function attachZonesToVehicles(vehicles) {
  return vehicles.map((veh) => {
    let inZoneId = null;
    for (const zone of attractionZones) {
      const d = distanceInMeters(veh.position, zone.center);
      if (d <= zone.radiusMeters) {
        inZoneId = zone.id;
        break;
      }
    }

    if (inZoneId && veh.currentZoneId !== inZoneId) {
      return {
        ...veh,
        currentZoneId: inZoneId,
        zoneEnterAt: Date.now()
      };
    }
    if (!inZoneId && veh.currentZoneId) {
      return {
        ...veh,
        currentZoneId: null,
        zoneEnterAt: null
      };
    }

    return veh;
  });
}

const Footer = () => {
  return (
    <footer className="mt-4 px-4 md:px-10 py-4 border-t border-safari-sand/40 text-[11px] text-safari-olive/80 bg-safari-cream/95">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <span>Ifadhi · Smart Safari Park Management</span>
        <span>Live overview of vehicles, guests, and alerts across your park.</span>
      </div>
    </footer>
  );
};

const App = () => {
  const [vehicles, setVehicles] = useState(() => createInitialVehicles());
  const [sightings, setSightings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [biasZoneId, setBiasZoneId] = useState(null);
  const [overcrowdedZoneId, setOvercrowdedZoneId] = useState(null);
  const [totalPenalty, setTotalPenalty] = useState(0);
  const [currentStepLabel, setCurrentStepLabel] = useState('');
  const [scenarioRunning, setScenarioRunning] = useState(true);
  const [scenarioVersion, setScenarioVersion] = useState(0);

  const zonesState = useMemo(
    () => computeZonesState(vehicles),
    [vehicles]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newlyOverstayingIds = [];

      setVehicles((prev) => {
        let moved = moveVehiclesSmoothly(prev, biasZoneId);
        moved = attachZonesToVehicles(moved);

        const now = Date.now();
        moved = moved.map((veh) => {
          if (!veh.currentZoneId || !veh.zoneEnterAt) return veh;

          const minutesInside = (now - veh.zoneEnterAt) / (1000 * 60);
          if (minutesInside > DEMO_MAX_MINUTES_IN_ZONE && veh.status !== 'overstaying') {
            newlyOverstayingIds.push(veh.id);
            return {
              ...veh,
              status: 'overstaying'
            };
          }

          if (veh.status === 'overstaying') {
            return {
              ...veh,
              penalty: veh.penalty + DEMO_PENALTY_RATE_PER_TICK
            };
          }

          return veh;
        });

        const penalties = moved.reduce(
          (acc, v) => acc + (v.penalty || 0),
          0
        );
        setTotalPenalty(penalties);

        return moved;
      });

      if (newlyOverstayingIds.length > 0) {
        const now = Date.now();
        setAlerts((prev) => [
          ...newlyOverstayingIds.map((id) => ({
            id: `pre-overstay-${id}-${now}`,
            type: 'OVERSTAY WARNING',
            severity: 'warning',
            message:
              'You have reached the maximum viewing time in this zone. Please start moving to avoid penalties.',
            timestamp: now,
            context:
              'Ifadhi has detected a vehicle that has stayed beyond the recommended limit for this attraction.'
          })),
          ...prev
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [biasZoneId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSightings((prev) =>
        prev.filter((s) => s.expiresAt > now)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const demoActions = useMemo(
    () => ({
      toCalmState: () => {
        setAlerts([]);
        setBiasZoneId(null);
        setOvercrowdedZoneId(null);
      },
      triggerLionSighting: () => {
        const lionRock = attractionZones.find((z) => z.id === 'lion-rock');
        if (!lionRock) return;

        setBiasZoneId('lion-rock');
        setSightings((prev) => [
          ...prev,
          {
            id: `sighting-${Date.now()}`,
            type: 'lion',
            count: 5,
            note: 'Pride resting on the rock outcrop · excellent photography opportunity.',
            position: {
              lat: lionRock.center.lat + (Math.random() - 0.5) * 0.001,
              lng: lionRock.center.lng + (Math.random() - 0.5) * 0.001
            },
            createdAt: Date.now(),
            expiresAt: Date.now() + SIGHTING_EXPIRY_MS
          }
        ]);

        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            type: 'WILDLIFE SIGHTING',
            severity: 'info',
              message:
                'Fresh lion sighting at Lion Rock. Ifadhi is guiding nearby vehicles toward the vantage point.',
            timestamp: Date.now(),
            context:
              'Rangers can choose to amplify or dampen this recommendation based on guest mix.'
          },
          ...prev
        ]);
      },
      triggerOvercrowding: () => {
        setOvercrowdedZoneId('lion-rock');
        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            type: 'CAPACITY BREACH',
            severity: 'critical',
            message:
              'Lion Rock has exceeded its safe vehicle threshold. Immediate redistribution recommended.',
            timestamp: Date.now(),
              context:
                'Ifadhi is forecasting increased pressure on predators and guest experience within minutes.'
          },
          ...prev
        ]);
      },
      triggerIntervention: () => {
        const elephantRiver = attractionZones.find(
          (z) => z.id === 'elephant-river'
        );
        if (!elephantRiver) return;

        setBiasZoneId('elephant-river');
        setVehicles((prev) =>
          prev.map((v, idx) =>
            idx < 7
              ? {
                  ...v,
                  status: 'redirected'
                }
              : v
          )
        );
        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            type: 'AI ROUTING UPDATE',
            severity: 'warning',
            message:
              'Ifadhi is redirecting selected vehicles towards Elephant River to relieve congestion.',
            timestamp: Date.now(),
            context:
              'Drivers see updated guidance and guests are taken to a quieter stretch of the river.'
          },
          ...prev
        ]);
      },
      triggerPenalty: () => {
        setVehicles((prev) => {
          if (!prev.length) return prev;
          const targetIdx = 0;
          return prev.map((v, idx) =>
            idx === targetIdx
              ? {
                  ...v,
                  status: 'overstaying',
                  penalty: v.penalty + 25,
                  zoneEnterAt: Date.now() - DEMO_MAX_MINUTES_IN_ZONE * 60 * 1000
                }
              : v
          );
        });
        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            type: 'COMPLIANCE PENALTY',
            severity: 'warning',
            message:
              'Vehicle Kifaru 1 has exceeded the 15-minute viewing window. A compliance fee has been applied.',
            timestamp: Date.now(),
            context:
              'Ifadhi can sync these penalties with your billing, ticketing, or guide scorecards.'
          },
          ...prev
        ]);
      },
      triggerResolution: () => {
        setBiasZoneId(null);
        setOvercrowdedZoneId(null);
        setVehicles((prev) =>
          prev.map((v) => ({
            ...v,
            status: v.status === 'overstaying' ? 'overstaying' : 'normal'
          }))
        );
        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            type: 'STABILISATION',
            severity: 'info',
            message:
              'Congestion at Lion Rock resolved. Vehicle density across attractions is back within target bands.',
            timestamp: Date.now(),
            context:
              'Ifadhi continuously projects future hot spots to keep guest experience high and wildlife stress low.'
          },
          ...prev
        ]);
      }
    }),
    []
  );

  const handleManualSightingReport = (payload) => {
    const fallbackZone = attractionZones[0];
    const base = fallbackZone.center;
    const jitterLat = (Math.random() - 0.5) * 0.004;
    const jitterLng = (Math.random() - 0.5) * 0.004;

    const now = Date.now();
    const sighting = {
      id: `manual-${now}`,
      type: payload.type,
      count: payload.count,
      note: payload.note,
      position: {
        lat: base.lat + jitterLat,
        lng: base.lng + jitterLng
      },
      createdAt: now,
      expiresAt: now + SIGHTING_EXPIRY_MS
    };

    setSightings((prev) => [sighting, ...prev]);
    setAlerts((prev) => [
      {
        id: `alert-${now}`,
        type: 'RANGER SIGHTING',
        severity: 'info',
        message: `New ${payload.type} sighting logged by ranger.`,
        timestamp: now,
          context:
            'Ifadhi treats ranger inputs as high-confidence signals to refine traffic guidance.'
      },
      ...prev
    ]);
  };

  const totalVehicles = vehicles.length;
  const activeSightings = sightings.length;
  const overcrowdedZones = Object.values(zonesState).filter(
    (z) => z.status === ZONE_STATUS.OVERCROWDED
  ).length;
  const totalPassengers = vehicles.reduce(
    (sum, v) => sum + (v.passengers || 0),
    0
  );
  const lawAbidingDrivers = vehicles.filter(
    (v) => (v.penalty || 0) === 0
  ).length;
  const myVehicle = vehicles[0] || null;
  const myVehicleId = myVehicle?.id || null;
  const myPenalty = myVehicle?.penalty || 0;

  return (
    <div className="h-full flex flex-col">
      <DemoController
        actions={demoActions}
        onStepChange={setCurrentStepLabel}
        scenarioRunning={scenarioRunning}
        scenarioVersion={scenarioVersion}
      />
      <TopBar
        currentStepLabel={currentStepLabel}
        scenarioRunning={scenarioRunning}
        onRestartScenario={() => {
          setScenarioVersion((v) => v + 1);
          setScenarioRunning(true);
        }}
        onToggleScenario={() => {
          setScenarioRunning((running) => {
            if (running) {
              setCurrentStepLabel(
                'Scenario paused · you can explore freely'
              );
              return false;
            }
            setScenarioVersion((v) => v + 1);
            return true;
          });
        }}
      />
      <div className="flex flex-1 min-h-0">
        <SideNav />
        <main className="flex-1 min-h-0 px-4 md:px-6 py-4 space-y-4">
          <HeroBanner />
          <ManagerStatsPanel
            totalVehicles={totalVehicles}
            activeSightings={activeSightings}
            overcrowdedZones={overcrowdedZones}
            myPenalty={myPenalty}
            totalPassengers={totalPassengers}
            lawAbidingDrivers={lawAbidingDrivers}
          />
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="glass-panel p-3 h-[340px] sm:h-[380px] md:h-[460px]">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-xs uppercase tracking-[0.16em] text-safari-sand/70">
                            Live vehicle map
                          </div>
                          <div className="text-sm text-safari-cream/90">
                            Real-time GPS view of every tracked vehicle
                          </div>
                        </div>
                      </div>
                      <ParkMap
                        vehicles={vehicles}
                        zonesState={zonesState}
                        sightings={sightings}
                        overcrowdedZoneId={overcrowdedZoneId}
                        biasZoneId={biasZoneId}
                        myVehicleId={myVehicleId}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 h-full flex flex-col">
                    <SightingForm onReport={handleManualSightingReport} />
                    <div className="flex-1">
                      <AlertsPanel alerts={alerts} />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/analytics"
              element={
                <div className="glass-panel p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-safari-olive/90">
                        Analytics overview
                      </div>
                      <div className="text-sm text-safari-olive/90">
                        Understand how vehicles, guests, and zones behave across your
                        park in a typical day.
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-safari-sand/40 bg-white p-4 space-y-2">
                      <div className="text-xs text-safari-olive/90">
                        Vehicle density
                      </div>
                      <p className="text-sm text-safari-olive/90">
                        Track how many vehicles cluster around each attraction and
                        spot congestion before guests feel it.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-safari-sand/40 bg-white p-4 space-y-2">
                      <div className="text-xs text-safari-olive/90">
                        Guest experience & route discipline
                      </div>
                      <p className="text-sm text-safari-olive/90">
                        Use timers, penalties, and driver behaviour to balance
                        memorable sightings with respect for wildlife and park rules.
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/alerts"
              element={
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
                  <div className="glass-panel p-5 space-y-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-safari-olive/90">
                        Alert timeline
                      </div>
                      <div className="text-sm text-safari-olive/90">
                        Follow how Ifadhi responds before human operators need to
                        step in.
                      </div>
                    </div>
                    <ol className="list-decimal list-inside text-sm space-y-2 text-safari-olive/90">
                      <li>Calm state while vehicles disperse across the park.</li>
                      <li>
                        A new sighting draws vehicles in while Ifadhi keeps the
                        load balanced.
                      </li>
                      <li>Overcrowding is detected and surfaced as a capacity breach.</li>
                      <li>
                        Routing suggestions move guests towards quieter attractions.
                      </li>
                      <li>
                        Overstays trigger timed penalties and notifications to the
                        relevant driver.
                      </li>
                      <li>
                        The system guides the park back into a calm, sustainable
                        operating state.
                      </li>
                    </ol>
                  </div>
                  <AlertsPanel alerts={alerts} />
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="glass-panel p-6 space-y-4">
                  <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-safari-olive/90">
                      About Ifadhi
                    </div>
                    <div className="text-sm text-safari-olive/90">
                      A live-style dashboard for high-end African safari operators
                    </div>
                  </div>
                  <p className="text-sm text-safari-olive/90">
                    Ifadhi brings together your park map, vehicles, guests, and alerts
                    into one place so you can see what is happening right now and react
                    quickly.
                  </p>
                  <p className="text-sm text-safari-olive/90">
                    Combine a live map, attraction zones, and rich alerts to keep guest
                    experience high while protecting wildlife. Swap in your own park
                    tiles, branding, and business rules to turn this into your
                    operations nerve centre.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;

