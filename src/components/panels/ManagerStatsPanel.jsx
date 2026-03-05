import React from 'react';

const ManagerStatsPanel = ({
  totalVehicles,
  activeSightings,
  overcrowdedZones,
  myPenalty,
  totalPassengers,
  lawAbidingDrivers
}) => {
  const cards = [
    {
      label: 'Tour vehicles in park',
      value: totalVehicles,
      tone: 'neutral',
      hint: 'Currently tracked vehicles in the park'
    },
    {
      label: 'Guests on board',
      value: totalPassengers,
      tone: 'neutral',
      hint: 'Estimated passengers across all live vehicles'
    },
    {
      label: 'Law-abiding drivers',
      value: lawAbidingDrivers,
      tone: lawAbidingDrivers === totalVehicles ? 'positive' : 'alert',
      hint:
        lawAbidingDrivers === totalVehicles
          ? 'All drivers within current park rules'
          : 'Some vehicles need attention on timing or routes'
    },
    {
      label: 'My active penalties',
      value: `$${myPenalty.toFixed(2)}`,
      tone: myPenalty > 0 ? 'alert' : 'neutral',
      hint: 'Fees currently accruing on your vehicle only'
    }
  ];

  return (
    <div className="glass-panel p-4 grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl px-3.5 py-3 border flex flex-col gap-1.5 ${
            card.tone === 'alert'
              ? 'border-safari-danger/60 bg-safari-danger/5'
              : card.tone === 'positive'
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-safari-sand/40 bg-white'
          }`}
        >
          <div className="text-[11px] uppercase tracking-[0.16em] text-safari-olive/90">
            {card.label}
          </div>
          <div className="text-xl font-semibold text-safari-deep">
            {card.value}
          </div>
          <div className="text-[11px] text-safari-olive/80">{card.hint}</div>
        </div>
      ))}
    </div>
  );
};

export default ManagerStatsPanel;

