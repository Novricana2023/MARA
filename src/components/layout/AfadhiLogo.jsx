import React from 'react';

const AfadhiLogo = ({ withTitle = true, size = 'lg' }) => {
  const circleSize =
    size === 'lg' ? 'w-11 h-11' : size === 'md' ? 'w-9 h-9' : 'w-7 h-7';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${circleSize} rounded-2xl bg-gradient-to-br from-safari-accent via-safari-accent-soft to-safari-danger flex items-center justify-center shadow-safari-soft relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/25 mix-blend-multiply" />
        <div className="relative flex items-center justify-center">
          <div className="w-7 h-7 border-[2.5px] border-safari-cream/90 rounded-full border-b-transparent border-r-transparent rotate-[-25deg]" />
          <div className="absolute bottom-[6px] inset-x-1 h-[6px] bg-safari-deep/85 rounded-full blur-[1px]" />
        </div>
      </div>
      {withTitle && (
        <div className="flex flex-col">
          <span className="text-safari-deep font-semibold tracking-[0.18em] text-xs uppercase">
            Ifadhi
          </span>
          <span className="text-safari-olive text-[11px] leading-tight">
            Smart Safari Park Management
          </span>
        </div>
      )}
    </div>
  );
};

export default AfadhiLogo;

