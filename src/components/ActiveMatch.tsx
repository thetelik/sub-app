import React from 'react';
import { Player, GameSettings } from '../types';
import { Play, Pause, Plus, Minus, Users, Award, BellRing, ArrowDown } from 'lucide-react';
import { formatTime, formatFullTime } from '../utils/rotation';

interface ActiveMatchProps {
  players: Player[];
  settings: GameSettings;
  subCountdownSeconds: number;
  totalMatchSeconds: number;
  shiftNumber: number;
  isPaused: boolean;
  nextIn: Player[];
  nextOut: Player[];
  onTogglePause: () => void;
  onAdjustCountdown: (deltaSeconds: number) => void;
  onTriggerSubNow: () => void;
  onOpenInGameEditor: () => void;
  onOpenStats: () => void;
}

export const ActiveMatch: React.FC<ActiveMatchProps> = ({
  players,
  settings,
  subCountdownSeconds,
  totalMatchSeconds,
  shiftNumber,
  isPaused,
  nextIn,
  nextOut,
  onTogglePause,
  onAdjustCountdown,
  onTriggerSubNow,
  onOpenInGameEditor,
  onOpenStats,
}) => {
  const playing = players.filter((p) => p.status === 'playing');
  const bench = players
    .filter((p) => p.status === 'bench')
    .sort((a, b) => {
      if (a.totalPlayTime !== b.totalPlayTime) {
        return a.totalPlayTime - b.totalPlayTime;
      }
      return a.queueOrder - b.queueOrder;
    });

  // Calculate percentage for countdown progress bar
  const progressPercent = Math.max(
    0,
    Math.min(100, ((settings.subIntervalSeconds - subCountdownSeconds) / settings.subIntervalSeconds) * 100)
  );

  const isLowTime = subCountdownSeconds <= 30 && subCountdownSeconds > 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)] max-w-xl mx-auto w-full px-3.5 pt-2 pb-28">
      {/* Top Match Bar: Total Match Time & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 mb-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Match Time
            </div>
            <div className="font-mono font-bold text-sm text-white">
              {formatTime(totalMatchSeconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenStats}
            title="View play time distribution"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]"></span>
          </button>

          <button
            onClick={onOpenInGameEditor}
            title="Late arrival / Player injury / Change squad"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Edit Squad</span>
          </button>
        </div>
      </div>

      {/* Hero Subs Countdown Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 p-5 mb-4 shadow-2xl transition-all ${
          isLowTime
            ? 'bg-gradient-to-b from-red-950/80 to-slate-900 border-red-500 shadow-red-950/40'
            : isPaused
            ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/40'
            : 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-950/30'
        }`}
      >
        {/* Header badges */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold">
              Shift {shiftNumber}
            </span>
            {isPaused && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                PAUSED
              </span>
            )}
            {isLowTime && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold animate-pulse">
                SUBS INCOMING
              </span>
            )}
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            {playing.length} on pitch • {bench.length} on bench
          </span>
        </div>

        {/* Huge Monospace Timer Display */}
        <div className="text-center py-2">
          <div className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mb-1">
            Time Until Next Subs
          </div>
          <div
            className={`font-mono font-black text-6xl tracking-tight select-none transition-colors ${
              isLowTime
                ? 'text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : isPaused
                ? 'text-amber-300'
                : 'text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {formatTime(subCountdownSeconds)}
          </div>
        </div>

        {/* Shift Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1 mb-4 flex">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isLowTime
                ? 'bg-red-500'
                : isPaused
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Primary In-Timer Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* -30s */}
          <button
            onClick={() => onAdjustCountdown(-30)}
            title="Subtract 30s"
            className="flex-1 py-2 px-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700/60 transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>30s</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`flex-[2] py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* +30s */}
          <button
            onClick={() => onAdjustCountdown(30)}
            title="Add 30s"
            className="flex-1 py-2 px-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700/60 transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>30s</span>
          </button>
        </div>
      </div>

      {/* Upcoming Rotation Preview Banner */}
      {nextIn.length > 0 && nextOut.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next Up to Rotate (Round-Robin)</span>
            </span>
            <button
              onClick={onTriggerSubNow}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              Sub Now Early
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            {/* Next OUT */}
            <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/20">
              <span className="text-[10px] font-bold text-red-400 flex items-center gap-1 mb-1">
                <ArrowDown className="w-3 h-3" />
                NEXT TO BENCH:
              </span>
              <div className="font-bold text-white truncate">
                {nextOut.map((p) => `${p.name} (#${p.number})`).join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Lists: Active on Pitch vs Subs Bench */}
      <div className="space-y-4">
        {/* On Pitch */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 px-1 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PLAYING ON PITCH ({playing.length})
            </span>
            <span className="text-[11px] font-normal text-slate-400">Current Shift</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {playing.map((player) => (
              <div
                key={player.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 font-black font-mono text-white text-xs flex items-center justify-center shadow">
                    #{player.number}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white truncate">{player.name}</div>
                    <div className="text-[10px] text-slate-400">
                      Total: {formatFullTime(player.totalPlayTime)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formatTime(player.currentShiftTime)}
                  </span>
                  <span className="block text-[9px] text-slate-500">this shift</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subs Bench Queue */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 px-1 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              SUBS BENCH QUEUE ({bench.length})
            </span>
            <span className="text-[11px] font-normal text-slate-400">Round-Robin Order</span>
          </div>

          <div className="space-y-2">
            {bench.map((player, idx) => (
              <div
                key={player.id}
                className={`rounded-2xl p-2.5 flex items-center justify-between border transition-all ${
                  idx < nextIn.length
                    ? 'bg-amber-950/25 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-500 w-4 text-center">
                    {idx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-600 font-black font-mono text-white text-xs flex items-center justify-center shadow">
                    #{player.number}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {idx < nextIn.length && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Next Up
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Played: {formatFullTime(player.totalPlayTime)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {formatTime(player.totalBenchTime)}
                  </span>
                  <span className="block text-[9px] text-slate-500">resting</span>
                </div>
              </div>
            ))}
            {bench.length === 0 && (
              <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Bench is currently empty. Add late players or move someone to bench via "Edit Squad".
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar for Quick Sub or Edit */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-20">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <button
            onClick={onOpenInGameEditor}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Squad / Late Arrival</span>
          </button>

          <button
            onClick={onTriggerSubNow}
            disabled={bench.length === 0}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-colors"
          >
            <BellRing className="w-4 h-4" />
            <span>Sub Now (Whistle)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
