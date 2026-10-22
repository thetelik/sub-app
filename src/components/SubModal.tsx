import React from 'react';
import { Player } from '../types';
import { ArrowDown, ArrowUp, CheckCircle, ShieldAlert, Users } from 'lucide-react';
import { formatFullTime } from '../utils/rotation';

interface SubModalProps {
  isOpen: boolean;
  shiftNumber: number;
  nextIn: Player[];
  nextOut: Player[];
  onConfirmSubs: () => void;
  onOpenInGameEditor: () => void;
}

export const SubModal: React.FC<SubModalProps> = ({
  isOpen,
  shiftNumber,
  nextIn,
  nextOut,
  onConfirmSubs,
  onOpenInGameEditor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-sub-glow">
        {/* Header Alert Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-center text-white relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-xs font-black uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>Shift {shiftNumber} Complete</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">TIME FOR SUBS!</h2>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            Blow the whistle and rotate the kids according to the list below.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* 1. GOING OFF TO BENCH */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-400 mb-2.5">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <ArrowDown className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span>GOING OFF (To Subs Bench) — {nextOut.length} Player{nextOut.length > 1 ? 's' : ''}</span>
            </div>

            <div className="space-y-2">
              {nextOut.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/90 border border-red-500/30 rounded-xl p-2.5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-600 font-black font-mono text-white text-base flex items-center justify-center shadow">
                      #{p.number}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Shift played: {formatFullTime(p.currentShiftTime)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                    Resting on Bench
                  </span>
                </div>
              ))}
              {nextOut.length === 0 && (
                <div className="text-xs text-slate-400 italic text-center py-2">
                  No active players available to substitute off.
                </div>
              )}
            </div>
          </div>

          {/* 2. COMING ON TO PITCH */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 mb-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span>COMING ON (To Pitch) — {nextIn.length} Player{nextIn.length > 1 ? 's' : ''}</span>
            </div>

            <div className="space-y-2">
              {nextIn.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 font-black font-mono text-white text-base flex items-center justify-center shadow">
                      #{p.number}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Total played so far: {formatFullTime(p.totalPlayTime)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    Entering Pitch
                  </span>
                </div>
              ))}
              {nextIn.length === 0 && (
                <div className="text-xs text-slate-400 italic text-center py-2">
                  No bench players available to substitute in.
                </div>
              )}
            </div>
          </div>

          {/* Emergency / Squad edit link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onOpenInGameEditor}
              className="text-xs text-slate-400 hover:text-emerald-400 underline decoration-slate-600 inline-flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Need to adjust players or someone got hurt? Edit Squad</span>
            </button>
          </div>
        </div>

        {/* Action Button: "Subs Done" */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={onConfirmSubs}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/70 transition-all active:scale-[0.98]"
          >
            <CheckCircle className="w-6 h-6 fill-white text-emerald-700" />
            <span>Subs Done (Resume Countdown)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
