import React, { useState } from 'react';

const SightingForm = ({ onReport }) => {
  const [type, setType] = useState('lion');
  const [count, setCount] = useState(2);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReport({
      type,
      count: Number(count) || 1,
      note: note.trim()
    });
    setNote('');
  };

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-safari-sand/70">
            Report wildlife sighting
          </div>
          <div className="text-sm text-safari-cream/90">
            Instantly pins a marker on the map
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[11px] text-safari-sand/80">
              Animal type
            </label>
            <select
              className="w-full rounded-xl bg-safari-deep-alt/80 border border-white/10 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-safari-accent/70"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="lion">Lion</option>
              <option value="elephant">Elephant</option>
              <option value="leopard">Leopard</option>
              <option value="rhino">Rhino</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-safari-sand/80">
              Number seen
            </label>
            <input
              type="number"
              min="1"
              max="40"
              className="w-full rounded-xl bg-safari-deep-alt/80 border border-white/10 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-safari-accent/70"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] text-safari-sand/80">
            Optional ranger note
          </label>
          <textarea
            rows={2}
            className="w-full rounded-xl bg-safari-deep-alt/80 border border-white/10 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-safari-accent/70 resize-none"
            placeholder="e.g. Lions on the move towards the river..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-safari-accent to-safari-accent-soft text-safari-deep text-xs font-semibold py-2 shadow-safari-soft hover:brightness-105 active:scale-[0.99] transition"
        >
          <span>Report sighting</span>
        </button>
      </form>
    </div>
  );
};

export default SightingForm;

