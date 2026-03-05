import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MapIcon,
  ChartBarIcon,
  BellAlertIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  {
    path: '/',
    label: 'Live operations',
    icon: MapIcon
  },
  {
    path: '/analytics',
    label: 'Park analytics',
    icon: ChartBarIcon
  },
  {
    path: '/alerts',
    label: 'Alert center',
    icon: BellAlertIcon
  },
  {
    path: '/about',
    label: 'About Ifadhi',
    icon: InformationCircleIcon
  }
];

const SideNav = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-safari-sand/40 bg-safari-cream/90 backdrop-blur-xl">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all',
                  isActive
                    ? 'bg-safari-accent text-safari-deep border border-safari-accent/70 shadow-safari-soft'
                    : 'text-safari-olive/90 hover:bg-safari-cream/60 border border-transparent'
                ].join(' ')
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-4 pb-6 text-[11px] text-safari-olive/80">
        <div className="glass-panel px-3 py-2.5 space-y-1">
          <div className="font-semibold text-safari-deep text-xs">
            Live park view
          </div>
          <p>
            Monitor vehicles, guests, and alerts in real time with Ifadhi&apos;s
            operations dashboard.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;

