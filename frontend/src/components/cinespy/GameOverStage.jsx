import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function GameOverStage({ room, onPlayAgain, onBackToLobby, onOpenLeaderboard }) {
  const winner = room?.winner || 'CIVILIANS';
  const players = room?.players || [];
  const [dossierOpen, setDossierOpen] = useState(false);

  // Determine MVP top player
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topPlayer = sortedPlayers[0];

  useEffect(() => {
    if (winner === 'CIVILIANS' || winner === 'UNDERCOVER' || winner === 'MR_WHITE') {
      playSfx('victory');
    }
  }, [winner]);

  const getWinnerData = () => {
    switch (winner?.toUpperCase()) {
      case 'UNDERCOVER':
        return {
          title: 'Undercover Victory!',
          headline: 'The Spies Outsmarted Everyone! 🕵️',
          badge: 'bg-rose-100 text-rose-700 border border-rose-200',
          icon: '🕵️',
          subtext: 'The undercovers blended in unnoticed and survived until the end!'
        };
      case 'MR_WHITE':
        return {
          title: 'Mr. White Victory!',
          headline: 'Mr. White Guessed the Word! 🎩',
          badge: 'bg-amber-100 text-amber-800 border border-amber-200',
          icon: '🎩',
          subtext: room?.whiteGuess
            ? `Mr. White correctly named the secret word: "${room?.whiteGuess}"!`
            : 'Mr. White went completely undetected the entire game!'
        };
      case 'CIVILIANS':
      default:
        return {
          title: 'Civilians Triumph!',
          headline: 'The Spies Were Caught! 🎉',
          badge: 'bg-blue-100 text-blue-700 border border-blue-200',
          icon: '👑',
          subtext: 'All undercovers and Mr. White were found and voted out.'
        };
    }
  };

  const winData = getWinnerData();

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
      {/* Victory Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
          <span>{winData.icon}</span>
          <span className={winData.badge}>{winData.title}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {winData.headline}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
          {room?.winReason || winData.subtext}
        </p>
      </div>

      {/* Match MVP Banner */}
      {topPlayer && (topPlayer.score || 0) > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 rounded-xl bg-white shadow-sm">👑</span>
            <div className="text-left">
              <span className="font-extrabold text-amber-950 block text-xs">
                Match MVP: {topPlayer.name}
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                Leading with <strong className="text-amber-900">⭐ {topPlayer.score} pts</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="px-3 py-1.5 rounded-xl neu-btn text-amber-800 font-bold text-xs shrink-0 hover:text-amber-950 flex items-center gap-1"
          >
            <Trophy size={13} className="text-amber-600" />
            <span>Ranks</span>
          </button>
        </div>
      )}

      {/* Secret Real-World Words Revealed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="neu-card p-5 space-y-1 text-center">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide block">
            👑 Secret Word
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            {room?.civilianWord || 'Target Word'}
          </h3>
          <p className="text-[11px] text-slate-400">
            Held by the Civilians
          </p>
        </div>

        <div className="neu-card p-5 space-y-1 text-center">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide block">
            🕵️ Decoy Word
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            {room?.undercoverWord || 'Decoy Word'}
          </h3>
          <p className="text-[11px] text-slate-400">
            Given to the Undercover Spy
          </p>
        </div>
      </div>

      {/* Collapsible Dropdown: Full Player Roles Breakdown */}
      <div className="neu-card p-5 space-y-3">
        <button
          type="button"
          onClick={() => { setDossierOpen(!dossierOpen); playSfx('click'); }}
          className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 select-none"
        >
          <div className="flex items-center gap-2 font-bold">
            <span>See who was who</span>
            <span className="text-[11px] text-slate-400">({players.length} players)</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
            <span>{dossierOpen ? 'Hide' : 'Expand'}</span>
            {dossierOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {dossierOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/80 animate-in fade-in duration-200">
            {players.map((player) => {
              const isEliminated = player.eliminated;
              const role = player.role?.toUpperCase();

              let roleBadge = 'bg-blue-50 text-blue-700 border border-blue-200';
              if (role === 'UNDERCOVER') roleBadge = 'bg-rose-50 text-rose-700 border border-rose-200';
              if (role === 'MR_WHITE') roleBadge = 'bg-amber-50 text-amber-700 border border-amber-200';

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-2xl border text-left ${
                    isEliminated
                      ? 'bg-slate-200/50 border-slate-200 opacity-70'
                      : 'bg-white/70 border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{player.avatar || '🕵️'}</span>
                      <h4 className="font-bold text-xs text-slate-800 truncate max-w-[100px]">
                        {player.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {player.roundPointsEarned > 0 && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          +{player.roundPointsEarned}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ⭐ {player.score || 0}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadge}`}>
                        {role === 'MR_WHITE' ? 'Mr. White' : role === 'UNDERCOVER' ? 'Undercover' : 'Civilian'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{isEliminated ? '💥 Voted out' : '🛡️ Survived'}</span>
                    {player.clueHistory && player.clueHistory.length > 0 && (
                      <span className="text-blue-700 truncate max-w-[120px] font-semibold italic">
                        "{player.clueHistory[player.clueHistory.length - 1]}"
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-7 py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <RefreshCw size={15} />
          <span>Play Another Round</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="w-full sm:w-auto px-5 py-4 neu-btn text-amber-800 hover:text-amber-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Trophy size={15} className="text-amber-600" />
          <span>Scoreboard</span>
        </button>

        <button
          onClick={onBackToLobby}
          className="w-full sm:w-auto px-5 py-4 neu-btn text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>Change Topic</span>
        </button>
      </div>
    </div>
  );
}
