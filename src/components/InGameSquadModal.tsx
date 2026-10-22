import React, { useState } from 'react';
import { Player } from '../types';
import { X, UserPlus, UserMinus, Plus, AlertTriangle, ArrowRightLeft, ShieldAlert } from 'lucide-react';

interface InGameSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddLatePlayer: (name: string, number: number, existingPlayerId?: string) => void;
  onRemovePlayerMidGame: (playerId: string, replacementPlayerId?: string) => void;
  onManualSwap: (onPitchPlayerId: string, benchPlayerId: string) => void;
  onReactivatePlayer: (playerId: string) => void;
}

export const InGameSquadModal: React.FC<InGameSquadModalProps> = ({
  isOpen,
  onClose,
  players,
  onAddLatePlayer,
  onRemovePlayerMidGame,
  onManualSwap,
  onReactivatePlayer,
}) => {
  const [tab, setTab] = useState<'roster' | 'late' | 'swap'>('roster');
  const [lateName, setLateName] = useState('');
  const [lateNumber, setLateNumber] = useState('');
  
  // Selection state for removing an on-pitch player
  const [selectedInjuredPlayer, setSelectedInjuredPlayer] = useState<Player | null>(null);
  const [selectedReplacementId, setSelectedReplacementId] = useState<string>('');

  // Selection state for manual swap
  const [swapPitchPlayerId, setSwapPitchPlayerId] = useState<string>('');
  const [swapBenchPlayerId, setSwapBenchPlayerId] = useState<string>('');

  if (!isOpen) return null;

  const playing = players.filter((p) => p.status === 'playing');
  const bench = players.filter((p) => p.status === 'bench');
  const absentOrInjured = players.filter((p) => p.status === 'absent' || p.status === 'injured');

  const handleAddNewLatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lateName.trim()) return;
    const num = parseInt(lateNumber, 10) || Math.max(...players.map((p) => p.number), 0) + 1;
    onAddLatePlayer(lateName.trim(), num);
    setLateName('');
    setLateNumber('');
  };

  const handleConfirmRemoval = () => {
    if (!selectedInjuredPlayer) return;
    onRemovePlayerMidGame(selectedInjuredPlayer.id, selectedReplacementId || undefined);
    setSelectedInjuredPlayer(null);
    setSelectedReplacementId('');
  };

  const handleExecuteManualSwap = () => {
    if (swapPitchPlayerId && swapBenchPlayerId) {
      onManualSwap(swapPitchPlayerId, swapBenchPlayerId);
      setSwapPitchPlayerId('');
      setSwapBenchPlayerId('');
      setTab('roster');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span>In-Game Squad Manager</span>
            </h2>
            <p className="text-xs text-slate-400">
              Handle late arrivals, injuries, or mid-game lineup changes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-3 border-b border-slate-800 p-1.5 bg-slate-950/60 text-xs font-semibold gap-1">
          <button
            onClick={() => setTab('roster')}
            className={`py-2 rounded-xl transition-colors ${
              tab === 'roster'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Current Squad
          </button>
          <button
            onClick={() => setTab('late')}
            className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'late'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Late Arrival</span>
          </button>
          <button
            onClick={() => setTab('swap')}
            className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'swap'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Quick Swap</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: CURRENT SQUAD & REMOVE / INJURY */}
          {tab === 'roster' && (
            <div className="space-y-4">
              {/* Pitch Players */}
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  On Pitch ({playing.length})
                </h3>
                <div className="space-y-2">
                  {playing.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-600 font-bold font-mono text-white text-xs flex items-center justify-center">
                          #{player.number}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-white">{player.name}</div>
                          <div className="text-[10px] text-slate-400">Playing on pitch</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedInjuredPlayer(player);
                          // Default replacement to first in bench queue
                          if (bench.length > 0) {
                            setSelectedReplacementId(bench[0].id);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <UserMinus className="w-3.5 h-3.5 text-red-400" />
                        <span>Cannot Continue</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bench Players */}
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  On Bench / Subs Queue ({bench.length})
                </h3>
                <div className="space-y-2">
                  {bench.map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-amber-600 font-bold font-mono text-white text-xs flex items-center justify-center">
                          #{player.number}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-white">{player.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Queue Position: #{idx + 1}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemovePlayerMidGame(player.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <UserMinus className="w-3.5 h-3.5 text-red-400" />
                        <span>Cannot Continue</span>
                      </button>
                    </div>
                  ))}
                  {bench.length === 0 && (
                    <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded-xl">
                      Bench is currently empty.
                    </div>
                  )}
                </div>
              </div>

              {/* Inactive / Injured / Left */}
              {absentOrInjured.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Inactive / Injured / Out ({absentOrInjured.length})
                  </h3>
                  <div className="space-y-2">
                    {absentOrInjured.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl opacity-75"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-slate-800 font-bold font-mono text-slate-400 text-xs flex items-center justify-center">
                            #{player.number}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-slate-400 line-through">
                              {player.name}
                            </div>
                            <div className="text-[10px] text-red-400">
                              {player.status === 'injured' ? 'Injured / Removed' : 'Absent'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onReactivatePlayer(player.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                        >
                          Put Back in Game
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LATE ARRIVAL */}
          {tab === 'late' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
                A late arriving player will be placed at the <strong>end of the round-robin bench queue</strong> so the current field players finish their shift normally.
              </div>

              {/* Absent kids available to activate */}
              {absentOrInjured.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">
                    Kids from squad who were absent:
                  </h4>
                  <div className="space-y-2">
                    {absentOrInjured.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-slate-800 font-bold font-mono text-white text-xs flex items-center justify-center">
                            #{player.number}
                          </span>
                          <span className="font-bold text-sm text-white">{player.name}</span>
                        </div>
                        <button
                          onClick={() => onAddLatePlayer(player.name, player.number, player.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bench Queue</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add someone completely new */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">
                  Or add a new kid to roster:
                </h4>
                <form onSubmit={handleAddNewLatePlayer} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kid's Name"
                      value={lateName}
                      onChange={(e) => setLateName(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="No. #"
                      value={lateNumber}
                      onChange={(e) => setLateNumber(e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono text-center placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!lateName.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add to End of Bench Rotation</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: QUICK EMERGENCY SWAP */}
          {tab === 'swap' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs text-blue-200">
                Immediately swap an on-pitch player with a bench player right now (e.g., shoe untied or quick rest) without waiting for the timer.
              </div>

              {/* Select Pitch Player */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1.5">
                  1. WHO COMES OFF PITCH?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {playing.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSwapPitchPlayerId(p.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        swapPitchPlayerId === p.id
                          ? 'bg-emerald-600 border-white text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-6 h-6 rounded bg-black/30 font-mono font-bold text-xs flex items-center justify-center">
                        #{p.number}
                      </span>
                      <span className="text-xs font-bold truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Bench Player */}
              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1.5">
                  2. WHO GOES ON FROM BENCH?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bench.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSwapBenchPlayerId(p.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        swapBenchPlayerId === p.id
                          ? 'bg-amber-600 border-white text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-6 h-6 rounded bg-black/30 font-mono font-bold text-xs flex items-center justify-center">
                        #{p.number}
                      </span>
                      <span className="text-xs font-bold truncate">{p.name}</span>
                    </button>
                  ))}
                  {bench.length === 0 && (
                    <div className="col-span-2 text-xs text-slate-500 italic p-2 text-center">
                      No bench players available to swap with.
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={!swapPitchPlayerId || !swapBenchPlayerId}
                onClick={handleExecuteManualSwap}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Execute Quick Swap Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close Squad Manager
          </button>
        </div>
      </div>

      {/* Nested Modal: Who replaces injured on-pitch player? */}
      {selectedInjuredPlayer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Remove {selectedInjuredPlayer.name} (#{selectedInjuredPlayer.number})</span>
            </div>
            <p className="text-xs text-slate-300">
              {selectedInjuredPlayer.name} will be removed from play. Select who from the bench takes their place on the pitch:
            </p>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {bench.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedReplacementId(b.id)}
                  className={`w-full p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    selectedReplacementId === b.id
                      ? 'bg-emerald-600 border-white text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-black/20 font-mono font-bold flex items-center justify-center">
                      #{b.number}
                    </span>
                    <span>{b.name}</span>
                  </div>
                  {selectedReplacementId === b.id && <span>Selected</span>}
                </button>
              ))}
              {bench.length === 0 && (
                <div className="text-xs text-amber-400 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
                  No bench players available. Field will play down 1 player.
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedInjuredPlayer(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
