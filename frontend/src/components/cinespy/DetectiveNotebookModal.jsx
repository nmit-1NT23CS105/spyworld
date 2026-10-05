import React, { useState } from 'react';
import { X, BookOpen, Search, UserCheck, ShieldAlert, HelpCircle } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function DetectiveNotebookModal({ isOpen, onClose, room }) {
  const [suspectTags, setSuspectTags] = useState({}); // playerId -> tag ('SUSPECT' | 'INNOCENT' | 'UNSURE')

  if (!isOpen) return null;

  const players = room?.players || [];
  const logs = room?.gameLogs || [];

  const handleSetTag = (playerId, tag) => {
    playSfx('click');
    setSuspectTags((prev) => ({
      ...prev,
      [playerId]: prev[playerId] === tag ? null : tag
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="neu-card bg-[#e6ecf5] max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-5 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-card-sm flex items-center justify-center text-blue-600">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Detective's Notebook 📓
              </h3>
              <p className="text-[11px] text-slate-500">
                Review round clues & tag suspects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl neu-btn text-slate-500 hover:text-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Players & Clues Summary */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Suspect Profiles & Clue History
          </span>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {players.map((p) => {
              const currentTag = suspectTags[p.id];
              const clues = p.clueHistory || (p.currentClue ? [p.currentClue] : []);

              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    p.eliminated
                      ? 'bg-slate-200/50 border-slate-200 opacity-60'
                      : 'bg-white/70 border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.avatar || '🕵️'}</span>
                      <span className="font-bold text-xs text-slate-900">
                        {p.name}
                        {p.isAi && <span className="ml-1 text-[9px] text-blue-600 bg-blue-50 px-1 rounded">AI</span>}
                        {p.score > 0 && <span className="ml-1 text-[10px] text-amber-600 font-normal">⭐{p.score}</span>}
                      </span>
                    </div>

                    {/* Quick Tagging Buttons */}
                    {!p.eliminated && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSetTag(p.id, 'SUSPECT')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                            currentTag === 'SUSPECT'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          🕵️ Suspect
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetTag(p.id, 'INNOCENT')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                            currentTag === 'INNOCENT'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          👑 Clean
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Clues */}
                  <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1.5 text-xs">
                    {clues.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">No clues given yet</span>
                    ) : (
                      clues.map((clue, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-medium border border-blue-100"
                        >
                          R{idx + 1}: "{clue}"
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Game Logs Timeline */}
        <div className="space-y-1.5 pt-2 border-t border-slate-300/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Investigation Timeline
          </span>
          <div className="max-h-28 overflow-y-auto p-2.5 rounded-xl neu-inset text-[11px] font-mono text-slate-600 space-y-1">
            {logs.slice(-10).map((log, idx) => (
              <p key={idx} className="leading-tight">&bull; {log}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
