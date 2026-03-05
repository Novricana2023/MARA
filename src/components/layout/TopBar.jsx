import React from 'react';
import AfadhiLogo from './AfadhiLogo';

const TopBar = ({
  currentStepLabel,
  scenarioRunning,
  onRestartScenario,
  onToggleScenario
}) => {
  return (
    <header className="flex flex-col gap-4 px-6 md:px-10 pt-4 pb-6 border-b border-safari-sand/40 bg-gradient-to-b from-safari-cream via-white to-safari-cream sticky top-0 z-30">
      <div className="flex items-center justify-between gap-6">
        <AfadhiLogo />
        <div className="hidden md:flex flex-col max-w-md">
          <span className="text-sm font-semibold text-safari-deep">
            Live Safari Operations
          </span>
          <span className="text-xs text-safari-olive/90">
            Ifadhi keeps track of vehicles, guests, and compliance in real time so you
            can focus on guiding an unforgettable drive.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between flex-wrap">
        <div className="glass-panel px-4 py-2 flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              scenarioRunning
                ? 'bg-emerald-500 animate-pulse shadow-[0_0_0_6px_rgba(16,185,129,0.25)]'
                : 'bg-safari-warning shadow-[0_0_0_4px_rgba(251,191,36,0.25)]'
            }`}
          />
          <span className="text-xs font-semibold text-safari-deep">
            {scenarioRunning ? 'Ifadhi is live' : 'Updates paused'}
          </span>
          <button
            type="button"
            onClick={onToggleScenario}
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-safari-cream text-[11px] text-safari-deep hover:bg-white transition border border-safari-sand/60"
          >
            {scenarioRunning ? 'Pause updates' : 'Resume updates'}
          </button>
          <button
            type="button"
            onClick={onRestartScenario}
            className="inline-flex items-center px-2.5 py-1 rounded-full bg-safari-accent text-[11px] text-safari-deep font-semibold hover:bg-safari-accent-soft transition shadow-sm"
          >
            Reset today&apos;s view
          </button>
        </div>
        {currentStepLabel && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-safari-sand/40 shadow-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-safari-olive/90">
              Live focus
            </span>
            <span className="text-xs font-semibold text-safari-deep">
              {currentStepLabel}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;

