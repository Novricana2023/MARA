import React from 'react';

const HERO_IMAGE_URL =
  'https://images.pexels.com/photos/259376/pexels-photo-259376.jpeg?auto=compress&cs=tinysrgb&w=1600';

const HeroBanner = () => {
  return (
    <section className="w-full mb-4">
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-safari-soft">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-safari-deep/70 via-safari-deep/40 to-transparent" />
        <div className="relative h-full flex items-end md:items-center px-5 md:px-10 pb-4 md:pb-0">
          <div className="max-w-xl space-y-1">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.26em] text-safari-cream/80">
              Ifadhi live park view
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-safari-cream drop-shadow-md">
              Keep every vehicle and pride in balance.
            </h1>
            <p className="hidden md:block text-sm text-safari-cream/90">
              Real-time overview of guests, vehicles, and wildlife activity across your
              safari park.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

