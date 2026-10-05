import React, { useEffect, useState } from 'react';
import { MessageSquare, Users, ArrowRight, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function DiscussionStage({ room, onProceedToVoting, loading }) {
  const players = room?.players || [];
  const alivePlayers = players.filter(p => !p.eliminated);
  const initialTime = room?.discussionTimerSeconds || 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    playSfx('matchstick');
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 6) {
          playSfx('heartbeat');
        }
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleProceed = () => {
    playSfx('bass_drop');
    onProceedToVoting();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold neu-card-sm text-blue-700">
          <Clock size={13} />
          <span>Discussion Timer: {timeLeft}s remaining</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          DISCUSSION PHASE 🗣️
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Who seems suspicious? Discuss verbally, compare clues, and look for anyone bluffing before voting!
        </p>
      </div>

      {/* Clue Comparison Board */}
      <div className="neu-card p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-blue-600" />
            <span>Round {room?.roundNumber || 1} Clues Board</span>
          </span>
          <span className="text-xs font-bold text-slate-400">
            {alivePlayers.length} Active Players
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
          {alivePlayers.map((player) => {
            const latestClue = player.currentClue || (player.clueHistory && player.clueHistory[player.clueHistory.length - 1]) || 'No clue given';
            return (
              <div
                key={player.id}
                className="neu-card-sm p-3.5 rounded-2xl space-y-2 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl p-1.5 rounded-xl neu-card-sm shrink-0">
                      {player.avatar || '🕵️'}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {player.name}
                      </span>
                      {player.persona && (
                        <span className="text-[10px] text-slate-400 block truncate">
                          {player.persona.split('(')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  {player.score > 0 && (
                    <span className="text-[11px] font-bold text-amber-600">
                      ⭐ {player.score}
                    </span>
                  )}
                </div>

                <div className="neu-inset p-2.5 rounded-xl">
                  <p className="text-xs font-semibold text-slate-800 italic">
                    "{latestClue}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real World Discussion Prompt */}
        <div className="p-3 rounded-xl neu-inset text-center space-y-1">
          <p className="text-xs font-bold text-slate-700">
            💡 Deduce Together:
          </p>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Did someone give a vague clue that fits any Indian movie? Or did someone's clue contradict the majority theme?
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleProceed}
            disabled={loading}
            className="w-full neu-btn py-3.5 px-4 text-xs font-extrabold text-blue-700 flex items-center justify-center gap-2 hover:text-blue-800 disabled:opacity-50"
          >
            <span>PROCEED TO SECRET VOTING</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
