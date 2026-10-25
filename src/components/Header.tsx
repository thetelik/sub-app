import React from 'react';
import { Volume2, VolumeX, Shield, RotateCcw } from 'lucide-react';
import { GameStage } from '../types';
import { TEAM_NAME } from '../config/teamConfig';

interface HeaderProps {
  stage: GameStage;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetMatch: () => void;
  teamName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  soundEnabled,
  onToggleSound,
  onResetMatch,
  teamName,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-950/40 text-white font-black text-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
            {teamName ? teamName : TEAM_NAME}
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Subs app
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Youth Match & Equal Subs</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute whistle/beeps' : 'Enable whistle/beeps'}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
              : 'bg-slate-800/60 text-slate-500 border-slate-800 hover:bg-slate-800'
          }`}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {stage !== 'attendance' && (
          <button
            onClick={onResetMatch}
            title="Reset match / New game"
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Match</span>
          </button>
        )}
      </div>
    </header>
  );
};
