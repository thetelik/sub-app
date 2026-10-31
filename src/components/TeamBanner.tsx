import React from 'react';
import { ACTIVE_TEAM } from '../config/teamConfig';

interface TeamBannerProps {
  compact?: boolean;
}

export const TeamBanner: React.FC<TeamBannerProps> = ({ compact }) => (
  <div className="w-full max-w-xl mx-auto px-4">
    <div
      className={`w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 ${
        compact ? 'h-24' : 'h-40'
      }`}
    >
      <img
        src={ACTIVE_TEAM.headerImage}
        alt={`${ACTIVE_TEAM.name} Banner`}
        className="block h-full w-full object-cover object-center"
      />
    </div>
  </div>
);
