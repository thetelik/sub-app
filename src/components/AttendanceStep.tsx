import React from 'react';
import { Player } from '../types';
import { X, Check, UserCheck, UserX, ArrowRight, Edit3, ShieldAlert } from 'lucide-react';

interface AttendanceStepProps {
  players: Player[];
  onTogglePlayerAbsent: (playerId: string) => void;
  onProceedToWizard: () => void;
  onOpenRosterEditor: () => void;
}

export const AttendanceStep: React.FC<AttendanceStepProps> = ({
  players,
  onTogglePlayerAbsent,
  onProceedToWizard,
  onOpenRosterEditor,
}) => {
  const activeCount = players.filter((p) => p.status !== 'absent').length;
  const absentCount = players.filter((p) => p.status === 'absent').length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)] max-w-xl mx-auto w-full px-4 pt-3 pb-8">
      {/* Wizard Progress Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
          <span className="text-emerald-400">Step 1 of 2: Game Day Attendance</span>
          <span>Next: Lineup & Rotation</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full w-1/2 rounded-full transition-all duration-300"></div>
          <div className="bg-slate-700 h-full w-1/2"></div>
        </div>
      </div>

      {/* Hero / Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
        {/* Attendance Summary Counters */}
        <div className="grid grid-cols-2 gap-1 mt-0 pt-0.5  border-slate-800/80">
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">Playing Today</span>
            </div>
            <span className="text-base font-bold text-emerald-400 font-mono">{activeCount}</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-400">Absent / Out</span>
            </div>
            <span className="text-base font-bold text-slate-400 font-mono">{absentCount}</span>
          </div>
        </div>
      </div>

      {/* Players List with X */}
      <div className="flex-1 space-y-2 mb-20">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1 mb-1">
          <span>KID & T-SHIRT NUMBER</span>
          <span>ATTENDANCE STATUS</span>
        </div>

        {players.map((player) => {
          const isAbsent = player.status === 'absent';

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isAbsent
                  ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                  : 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
              }`}
            >
              {/* Player Info */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl font-black font-mono flex items-center justify-center text-sm shadow-inner transition-colors ${
                    isAbsent
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-950/40'
                  }`}
                >
                  #{player.number}
                </div>
                <div>
                  <div
                    className={`font-bold text-sm tracking-tight ${
                      isAbsent ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {player.name}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    {isAbsent ? (
                      <span className="text-red-400/90 flex items-center gap-1">
                        Out of today's squad
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                        Available to play
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button: X or Put Back */}
              <div className="flex items-center gap-2">
                {isAbsent ? (
                  <button
                    onClick={() => onTogglePlayerAbsent(player.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Put Back In</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onTogglePlayerAbsent(player.id)}
                    title="Take out of today's squad"
                    aria-label={`Take ${player.name} out of squad`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold transition-all active:scale-95 group"
                  >
                    <X className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>Out</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Who is Playing Today?</h2>
              <p className="text-xs text-slate-400 mt-1">
                You can edit the squad for today - if we have guest player etc. You can manually edit who is playing.
              </p>
            </div>
            <button
                onClick={onOpenRosterEditor}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Squad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 z-20">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span className="font-bold text-white text-sm">{activeCount}</span> kids ready
          </div>

          <button
            onClick={onProceedToWizard}
            disabled={activeCount < 2}
            className="flex-1 max-w-xs py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98]"
          >
            <span>Next: Lineup & Subs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {activeCount < 2 && (
          <p className="text-[11px] text-amber-400 text-center mt-2 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Please keep at least 2 kids available to play today.
          </p>
        )}
      </div>

    </div>
  );
};
