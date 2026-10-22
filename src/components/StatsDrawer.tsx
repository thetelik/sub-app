import React from 'react';
import { Player } from '../types';
import { X, Award, Clock } from 'lucide-react';
import { formatFullTime } from '../utils/rotation';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  totalMatchSeconds: number;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  players,
  totalMatchSeconds,
}) => {
  if (!isOpen) return null;

  const activeSquad = players.filter((p) => p.status !== 'absent');
  const maxPlayTime = Math.max(...activeSquad.map((p) => p.totalPlayTime), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Equal Play Time Tracker</h2>
              <p className="text-xs text-slate-400">Match time: {formatFullTime(totalMatchSeconds)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {activeSquad
            .sort((a, b) => b.totalPlayTime - a.totalPlayTime)
            .map((player) => {
              const playPercent = Math.round((player.totalPlayTime / maxPlayTime) * 100);
              const isPlaying = player.status === 'playing';

              return (
                <div
                  key={player.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
                          isPlaying
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        #{player.number}
                      </span>
                      <span className="font-bold text-sm text-white">{player.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPlaying
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isPlaying ? 'On Pitch' : 'On Bench'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {formatFullTime(player.totalPlayTime)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${playPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Shifts completed: {player.shiftsPlayed}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Rested on bench: {formatFullTime(player.totalBenchTime)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
