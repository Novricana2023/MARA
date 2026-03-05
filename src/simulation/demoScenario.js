// Guided scenario timeline for Ifadhi.
// Each step is intentionally commented so you can tweak timings and behavior easily.

export const DEMO_STEPS = {
  CALM: 'calm',
  LION_SIGHTING: 'lion_sighting',
  OVERCROWDING: 'overcrowding',
  INTERVENTION: 'intervention',
  PENALTY: 'penalty',
  RESOLUTION: 'resolution'
};

// Central place to tweak the guided demo timings (ms).
// Adjust these numbers to speed up or slow down the story.
export const DEMO_TIMELINE_MS = {
  [DEMO_STEPS.CALM]: 0, // Step 1: Calm park
  [DEMO_STEPS.LION_SIGHTING]: 10000, // Step 2: New lion sighting
  [DEMO_STEPS.OVERCROWDING]: 20000, // Step 3: Overcrowding detected
  [DEMO_STEPS.INTERVENTION]: 25000, // Step 4: AI intervention
  [DEMO_STEPS.PENALTY]: 30000, // Step 5: Penalty applied
  [DEMO_STEPS.RESOLUTION]: 38000 // Step 6: Resolution
};

export function runDemoScenario(actions) {
  const timeouts = [];

  // Step 1 (0s): Calm Park – vehicles moving, zones green, no alerts.
  timeouts.push(
    setTimeout(() => {
      actions.toCalmState();
    }, DEMO_TIMELINE_MS[DEMO_STEPS.CALM])
  );

  // Step 2 (10s): New wildlife sighting at Lion Rock, vehicles bias movement towards it.
  timeouts.push(
    setTimeout(() => {
      actions.triggerLionSighting();
    }, DEMO_TIMELINE_MS[DEMO_STEPS.LION_SIGHTING])
  );

  // Step 3 (20s): Overcrowding at Lion Rock – zone goes red, alerts flash.
  timeouts.push(
    setTimeout(() => {
      actions.triggerOvercrowding();
    }, DEMO_TIMELINE_MS[DEMO_STEPS.OVERCROWDING])
  );

  // Step 4 (25s): System intervenes – redirect vehicles and surface guidance messages.
  timeouts.push(
    setTimeout(() => {
      actions.triggerIntervention();
    }, DEMO_TIMELINE_MS[DEMO_STEPS.INTERVENTION])
  );

  // Step 5 (30s): One vehicle overstays and begins accruing penalties.
  timeouts.push(
    setTimeout(() => {
      actions.triggerPenalty();
    }, DEMO_TIMELINE_MS[DEMO_STEPS.PENALTY])
  );

  // Step 6 (35–40s): Resolution – congestion clears, zone returns to green, alerts calm down.
  timeouts.push(
    setTimeout(() => {
      actions.triggerResolution();
    }, DEMO_TIMELINE_MS[DEMO_STEPS.RESOLUTION])
  );

  return () => {
    timeouts.forEach(clearTimeout);
  };
}

