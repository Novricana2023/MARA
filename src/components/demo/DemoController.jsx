import React, { useEffect } from 'react';
import { runDemoScenario } from '../../simulation/demoScenario';

const DemoController = ({
  actions,
  onStepChange,
  scenarioRunning,
  scenarioVersion
}) => {
  useEffect(() => {
    if (!scenarioRunning) {
      return;
    }

    const wrappedActions = {
      toCalmState: () => {
        onStepChange('Calm park · vehicles exploring safely');
        actions.toCalmState();
      },
      triggerLionSighting: () => {
        onStepChange('New lion sighting · vehicles respond');
        actions.triggerLionSighting();
      },
      triggerOvercrowding: () => {
        onStepChange('Overcrowding at Lion Rock detected');
        actions.triggerOvercrowding();
      },
      triggerIntervention: () => {
        onStepChange('Ifadhi redirects guests to Elephant River');
        actions.triggerIntervention();
      },
      triggerPenalty: () => {
        onStepChange('One vehicle overstays · penalty starts');
        actions.triggerPenalty();
      },
      triggerResolution: () => {
        onStepChange('Resolution · congestion clears and park stabilises');
        actions.triggerResolution();
      }
    };

    // Kick off the full scripted timeline when (re)started.
    const cleanupScenario = runDemoScenario(wrappedActions);

    return () => {
      cleanupScenario();
    };
  }, [actions, onStepChange, scenarioRunning, scenarioVersion]);

  return null;
};

export default DemoController;

