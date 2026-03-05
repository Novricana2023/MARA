import React from 'react';

const AlertsPanel = ({ alerts }) => {
  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="px-5 pt-4 pb-3 border-b border-safari-sand/40 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-safari-olive/90">
            Live alerts
          </div>
          <div className="text-sm text-safari-olive/90">
            Real-time notifications from Ifadhi
          </div>
        </div>
        <div className="pill-badge bg-safari-danger/15 text-safari-danger border border-safari-danger/40">
          {alerts.length} active
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {alerts.length === 0 && (
          <div className="text-xs text-safari-olive/80 mt-2">
            The park is calm. Ifadhi is monitoring vehicles, guests, and routes in the
            background.
          </div>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl px-3.5 py-2.5 text-xs border flex flex-col gap-1 ${
              alert.severity === 'critical'
                ? 'bg-safari-danger/10 border-safari-danger/60'
                : alert.severity === 'warning'
                ? 'bg-safari-warning/10 border-safari-warning/60'
                : 'bg-emerald-50 border-emerald-400/70'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-safari-deep text-[11px] uppercase tracking-[0.16em]">
                {alert.type}
              </div>
              <span className="text-[10px] text-safari-olive/80">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-safari-deep">{alert.message}</div>
            {alert.context && (
              <div className="text-[11px] text-safari-olive/80">
                {alert.context}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;

