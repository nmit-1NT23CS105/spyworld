import React, { useEffect } from 'react';
import { Skull, ShieldAlert, Award, ArrowRight, UserX, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function VoteResultStage({
  room,
  onProceedAfterVote,
  loading
}) {
  const eliminatedPlayer = room?.players?.find((p) => p.id === room?.eliminatedPlayerId);
  const voteTally = room?.voteTally || {};
  const isWhite = room?.eliminatedPlayerRole?.toUpperCase() === 'MR_WHITE';
  const isUndercover = room?.eliminatedPlayerRole?.toUpperCase() === 'UNDERCOVER';
  const isNormal = room?.eliminatedPlayerRole?.toUpperCase() === 'NORMAL' || room?.eliminatedPlayerRole?.toUpperCase() === 'CIVILIAN';

  useEffect(() => {
    if (isUndercover) {
      playSfx('victory');
    } else if (isNormal || isWhite) {
      playSfx('bass_drop');
    } else {
      playSfx('reveal');
    }
  }, [isUndercover, isNormal, isWhite]);

  // Convert tally to sorted array
  const sortedTally = Object.entries(voteTally)
    .map(([targetId, count]) => {
      const p = room?.players?.find(pl => pl.id === targetId);
      return {
        id: targetId,
        name: p?.name || 'Unknown',
        avatar: p?.avatar || '🕵️',
        count: count,
        isEliminated: targetId === room?.eliminatedPlayerId
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest block">
          Voting Phase Concluded
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          The Verdict is In ⚖️
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The secret votes have been counted and recorded. Here is how the players voted:
        </p>
      </div>

      {/* Main Verdict Card */}
      <div className="neu-card p-5 sm:p-7 space-y-5">
        {/* Vote Results Tally List (Section 19) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
            Vote Count Breakdown
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {sortedTally.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 italic bg-white/50 rounded-xl">
                No votes registered.
              </div>
            ) : (
              sortedTally.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                    item.isEliminated
                      ? 'bg-rose-50/90 border-rose-300 text-rose-950 neu-inset'
                      : 'bg-white/70 border-slate-200/80 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-lg p-1 rounded-lg bg-white/60 shrink-0">
                      {item.avatar}
                    </span>
                    <span className="font-extrabold text-xs truncate">
                      {item.name}
                    </span>
                    {item.isEliminated && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                        Eliminated
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 shrink-0">
                    {item.count} {item.count === 1 ? 'vote' : 'votes'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dramatic Role Reveal (Section 20 & 42) */}
        {eliminatedPlayer ? (
          <div
            className={`p-5 rounded-3xl border-2 text-center space-y-3 animate-in zoom-in-95 duration-300 ${
              isUndercover
                ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/60 border-emerald-300 text-emerald-950'
                : isWhite
                ? 'bg-gradient-to-b from-amber-50 to-amber-100/60 border-amber-300 text-amber-950'
                : 'bg-gradient-to-b from-rose-50 to-rose-100/60 border-rose-300 text-rose-950'
            }`}
          >
            <div className="inline-flex p-3 rounded-2xl bg-white shadow-md mx-auto">
              {isUndercover ? (
                <Award size={36} className="text-emerald-600" />
              ) : isWhite ? (
                <ShieldAlert size={36} className="text-amber-600" />
              ) : (
                <UserX size={36} className="text-rose-600" />
              )}
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">
                Player Elimination Verdict
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {eliminatedPlayer.name} HAS BEEN ELIMINATED
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-500 block uppercase mb-1">
                True Role Revealed:
              </span>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border shadow-sm">
                {isUndercover && (
                  <span className="text-emerald-700 bg-emerald-50">
                    🕵️ UNDERCOVER SPY
                  </span>
                )}
                {isWhite && (
                  <span className="text-amber-700 bg-amber-50">
                    🎩 MR. WHITE
                  </span>
                )}
                {isNormal && (
                  <span className="text-rose-700 bg-rose-50">
                    🎬 NORMAL PLAYER
                  </span>
                )}
              </div>

              <p className="text-xs font-bold text-slate-700">
                {room?.eliminationMessage || (
                  isUndercover
                    ? `${eliminatedPlayer.name} WAS THE UNDERCOVER. THE SPY HAS BEEN FOUND!`
                    : isWhite
                    ? `${eliminatedPlayer.name} WAS MR. WHITE.`
                    : `${eliminatedPlayer.name} WAS NORMAL. You eliminated an innocent player!`
                )}
              </p>
            </div>

            {isWhite && (
              <div className="p-2.5 rounded-xl bg-amber-200/60 text-amber-900 text-[11px] font-bold">
                🎩 Mr. White now gets ONE FINAL GUESS to deduce the majority movie!
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600">
            No player was eliminated this round.
          </div>
        )}

        {/* Continue Action Button */}
        <button
          onClick={onProceedAfterVote}
          disabled={loading}
          className="w-full py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>
            {isWhite
              ? "Proceed to Mr. White's Guess"
              : 'Continue Game'}
          </span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
