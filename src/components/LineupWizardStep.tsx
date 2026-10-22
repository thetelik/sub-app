import React, { useState } from 'react';
import { Player, GameSettings } from '../types';
import { ArrowLeft, Play, Timer, Users, Info } from 'lucide-react';
import { formatTime } from '../utils/rotation';

interface LineupWizardStepProps {
  players: Player[];
  settings: GameSettings;
  onUpdatePlayerStatus: (playerId: string, status: 'playing' | 'bench') => void;
  onSetSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onBackToAttendance: () => void;
  onStartGame: () => void;
}

export const LineupWizardStep: React.FC<LineupWizardStepProps> = ({
  players,
  settings,
  onUpdatePlayerStatus,
  onSetSettings,
  onBackToAttendance,
  onStartGame,
}) => {
  const activePlayers = players.filter((p) => p.status !== 'absent' && p.status !== 'injured');
  const playingPlayers = activePlayers.filter((p) => p.status === 'playing');
  const benchPlayers = activePlayers.filter((p) => p.status === 'bench');

  const [customMins, setCustomMins] = useState(
    Math.floor(settings.subIntervalSeconds / 60).toString()
  );
  const [customSecs, setCustomSecs] = useState(
    (settings.subIntervalSeconds % 60).toString()
  );
  const [showCustomTime, setShowCustomTime] = useState(false);

  // Time presets in seconds
  const TIME_PRESETS = [
    { label: '30s (Test)', seconds: 30, tag: 'Quick Demo' },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300, tag: 'Standard' },
    { label: '7 min', seconds: 420 },
    { label: '10 min', seconds: 600 },
  ];

  const handleSelectPreset = (seconds: number) => {
    onSetSettings((prev) => ({ ...prev, subIntervalSeconds: seconds }));
    setShowCustomTime(false);
  };

  const handleApplyCustomTime = () => {
    const mins = Math.max(0, parseInt(customMins, 10) || 0);
    const secs = Math.min(59, Math.max(0, parseInt(customSecs, 10) || 0));
    const total = mins * 60 + secs;
    if (total > 5) {
      onSetSettings((prev) => ({ ...prev, subIntervalSeconds: total }));
    }
  };

  const handleAutoBalance = (starterCount: number) => {
    const clampedCount = Math.min(starterCount, activePlayers.length - 1);
    activePlayers.forEach((p, idx) => {
      onUpdatePlayerStatus(p.id, idx < clampedCount ? 'playing' : 'bench');
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)] max-w-xl mx-auto w-full px-4 pt-3 pb-24">
      {/* Wizard Step 2 Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
          <button
            onClick={onBackToAttendance}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Attendance</span>
          </button>
          <span className="text-emerald-400 font-bold">Step 2 of 2: Lineup & Subs Time</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full w-full rounded-full transition-all duration-300"></div>
        </div>
      </div>

      {/* 1. Lineup Selection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Select Initial Lineup</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap a kid to toggle between <span className="text-emerald-400 font-semibold">Pitch</span> and <span className="text-amber-400 font-semibold">Subs Bench</span>.
            </p>
          </div>
        </div>

        {/* Quick balance presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0">Quick presets:</span>
          {activePlayers.length >= 8 && (
            <button
              onClick={() => handleAutoBalance(7)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              7 on Pitch + {activePlayers.length - 7} Subs
            </button>
          )}
          {activePlayers.length >= 6 && (
            <button
              onClick={() => handleAutoBalance(5)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              5 on Pitch + {activePlayers.length - 5} Subs
            </button>
          )}
          <button
            onClick={() => handleAutoBalance(Math.ceil(activePlayers.length / 2))}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
          >
            Equal Split
          </button>
        </div>

        {/* Players Grid: Pitch Starters & Bench */}
        <div className="space-y-3">
          {/* Pitch Starters */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                STARTING ON PITCH ({playingPlayers.length})
              </span>
              <span className="text-[11px] font-normal text-slate-400">Tap to bench</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {playingPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => onUpdatePlayerStatus(player.id, 'bench')}
                  className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-between text-left transition-all active:scale-95 group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 font-black font-mono text-white text-xs flex items-center justify-center shrink-0">
                      #{player.number}
                    </span>
                    <span className="font-bold text-xs text-white truncate">{player.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">
                    Pitch
                  </span>
                </button>
              ))}
              {playingPlayers.length === 0 && (
                <div className="col-span-2 p-3 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No starters selected yet. Tap players below to start them.
                </div>
              )}
            </div>
          </div>

          {/* Bench Subs */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                INITIAL SUBS / BENCH ({benchPlayers.length})
              </span>
              <span className="text-[11px] font-normal text-slate-400">Tap to start</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {benchPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => onUpdatePlayerStatus(player.id, 'playing')}
                  className="p-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/40 flex items-center justify-between text-left transition-all active:scale-95 group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-amber-600 font-black font-mono text-white text-xs flex items-center justify-center shrink-0">
                      #{player.number}
                    </span>
                    <span className="font-bold text-xs text-white truncate">{player.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded shrink-0">
                    Sub
                  </span>
                </button>
              ))}
              {benchPlayers.length === 0 && (
                <div className="col-span-2 p-3 text-center text-xs text-amber-400/80 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                  Notice: With 0 subs, there will be no one on the bench to rotate. Tap at least 1 player to put them on the bench.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subs Interval Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-400" />
              <span>Rotation Shift Duration</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How long before the app notifies you to sub players?
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black font-mono text-emerald-400">
              {formatTime(settings.subIntervalSeconds)}
            </span>
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Per Shift</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
          {TIME_PRESETS.map((preset) => {
            const isSelected = settings.subIntervalSeconds === preset.seconds && !showCustomTime;
            return (
              <button
                key={preset.seconds}
                onClick={() => handleSelectPreset(preset.seconds)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold">{preset.label}</span>
                {preset.tag && (
                  <span
                    className={`text-[9px] font-semibold mt-1 px-1.5 py-0.2 rounded ${
                      isSelected
                        ? 'bg-emerald-900/70 text-emerald-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {preset.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom time toggle */}
        <div className="pt-2 border-t border-slate-800">
          {!showCustomTime ? (
            <button
              onClick={() => setShowCustomTime(true)}
              className="text-xs text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>+ Enter Custom Time</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="45"
                  value={customMins}
                  onChange={(e) => setCustomMins(e.target.value)}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-sm font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400 font-medium">min</span>
              </div>
              <span className="text-slate-600">:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customSecs}
                  onChange={(e) => setCustomSecs(e.target.value)}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-sm font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400 font-medium">sec</span>
              </div>
              <button
                onClick={handleApplyCustomTime}
                className="ml-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Round-robin explanation badge */}
      <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400 mb-4">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">Continuous Round-Robin:</strong> Bench players rotate in order, ensuring equal minutes on the pitch for every kid across the match.
        </p>
      </div>

      {/* Floating Bottom Bar: Start Game */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 z-20">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onBackToAttendance}
            className="px-4 py-3.5 rounded-2xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Back
          </button>

          <button
            onClick={onStartGame}
            disabled={playingPlayers.length === 0}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition-all active:scale-[0.98] disabled:opacity-40"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
