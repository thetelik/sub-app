import React from 'react';
import teamHeaderImg from '../assets/team-header.png';

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
                src={teamHeaderImg}
                alt="Team Gecko Oztag"
                className="block h-full w-full object-cover object-center"
            />
        </div>
    </div>
);