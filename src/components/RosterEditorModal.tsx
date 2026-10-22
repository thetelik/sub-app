import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Check, FileText } from 'lucide-react';
import { Player } from '../types';
import { DEFAULT_ROSTER } from '../utils/rosterData';

interface RosterEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onSaveRoster: (newPlayers: Player[]) => void;
}

export const RosterEditorModal: React.FC<RosterEditorModalProps> = ({
  isOpen,
  onClose,
  players,
  onSaveRoster,
}) => {
  const [list, setList] = useState<Player[]>(players);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [showBatch, setShowBatch] = useState(false);
  const [batchText, setBatchText] = useState('');

  if (!isOpen) return null;

  const handleUpdate = (id: string, field: 'name' | 'number', value: string) => {
    setList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (field === 'number') {
            const num = parseInt(value, 10);
            return { ...p, number: isNaN(num) ? 0 : num };
          }
          return { ...p, name: value };
        }
        return p;
      })
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const num = parseInt(newNumber, 10) || (list.length > 0 ? Math.max(...list.map((p) => p.number)) + 1 : 1);
    const newP: Player = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newName.trim(),
      number: num,
      status: 'playing',
      totalPlayTime: 0,
      totalBenchTime: 0,
      currentShiftTime: 0,
      shiftsPlayed: 0,
      queueOrder: list.length + 1,
    };
    setList([...list, newP]);
    setNewName('');
    setNewNumber('');
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetToDefault = () => {
    if (confirm('Reset squad back to standard 12 player sample list (John - 1, Aaron - 2...)?')) {
      setList(DEFAULT_ROSTER);
    }
  };

  const handleApplyBatch = () => {
    // Parse formats like:
    // John - 1
    // Aaron, 2
    // Leo #3
    const lines = batchText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: Player[] = [];
    let order = 1;

    for (const line of lines) {
      // match "Name - Number" or "Name #Number" or "Name, Number" or "Number Name"
      const match = line.match(/^([^,#\-\d]+)[,\s\-#]+(\d+)/i) || line.match(/^(\d+)[\s,\-#]+([^,#\-\d]+)/i);
      if (match) {
        let name = '';
        let num = 0;
        if (isNaN(parseInt(match[1], 10))) {
          name = match[1].trim();
          num = parseInt(match[2], 10);
        } else {
          num = parseInt(match[1], 10);
          name = match[2].trim();
        }
        parsed.push({
          id: `p-${Date.now()}-${order}`,
          name,
          number: num,
          status: 'playing',
          totalPlayTime: 0,
          totalBenchTime: 0,
          currentShiftTime: 0,
          shiftsPlayed: 0,
          queueOrder: order++,
        });
      } else {
        // Just a name
        parsed.push({
          id: `p-${Date.now()}-${order}`,
          name: line.trim(),
          number: order,
          status: 'playing',
          totalPlayTime: 0,
          totalBenchTime: 0,
          currentShiftTime: 0,
          shiftsPlayed: 0,
          queueOrder: order++,
        });
      }
    }

    if (parsed.length > 0) {
      setList(parsed);
      setShowBatch(false);
      setBatchText('');
    }
  };

  const handleSave = () => {
    onSaveRoster(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Master Squad List</h2>
            <p className="text-xs text-slate-400">Manage names & jersey numbers for your team</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Actions */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowBatch(!showBatch)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{showBatch ? 'Hide Quick Paste' : 'Quick Paste List'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 12 Sample Kids</span>
            </button>
          </div>

          {/* Quick Paste box */}
          {showBatch && (
            <div className="p-3 bg-slate-950 rounded-xl border border-blue-500/30 space-y-2">
              <label className="block text-xs font-semibold text-blue-300">
                Paste lines of: "Name - Number" (e.g. John - 1)
              </label>
              <textarea
                rows={5}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="John - 1&#10;Aaron - 2&#10;Leo - 3&#10;Maya - 4"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleApplyBatch}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Import Pasted Squad
              </button>
            </div>
          )}

          {/* Add new player inline */}
          <form onSubmit={handleAdd} className="flex gap-2 p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <input
              type="text"
              placeholder="Player Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="No. #"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono text-center placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Players Table / List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
              <span>PLAYER LIST ({list.length} TOTAL)</span>
              <span>T-SHIRT #</span>
            </div>

            {list.map((player, idx) => (
              <div
                key={player.id}
                className="flex items-center gap-2 p-2 bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800/80 rounded-xl transition-colors"
              >
                <span className="text-xs font-mono text-slate-500 w-5 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleUpdate(player.id, 'name', e.target.value)}
                  className="flex-1 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:bg-slate-900/80 rounded px-2 py-1 text-sm text-white font-medium focus:outline-none transition-colors"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-semibold">#</span>
                  <input
                    type="number"
                    value={player.number}
                    onChange={(e) => handleUpdate(player.id, 'number', e.target.value)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded-md py-1 px-1.5 text-center text-sm font-bold text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(player.id)}
                  title="Remove player"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
          >
            <Check className="w-4 h-4" />
            Save Squad List
          </button>
        </div>
      </div>
    </div>
  );
};
