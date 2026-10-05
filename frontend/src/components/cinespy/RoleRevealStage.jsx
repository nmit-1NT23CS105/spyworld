import React, { useState } from 'react';
import { Eye, EyeOff, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function RoleRevealStage({ room, onProceedToClues, loading }) {
  const isSolo = room?.gameMode === 'SOLO_AI';
  const players = room?.players || [];

  // For Local Pass mode, cycle through each player
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // In Solo AI mode, player 0 is the human host
  const targetPlayer = isSolo ? players[0] : players[currentPlayerIdx];

  const handleToggleReveal = () => {
    setIsRevealed(!isRevealed);
    if (!isRevealed) {
      playSfx('spy_reveal');
    } else {
      playSfx('click');
    }
  };

  const handleNextPlayer = () => {
    playSfx('click');
    setIsRevealed(false);
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      onProceedToClues();
    }
  };

  const hasWord = Boolean(targetPlayer?.secretWord && targetPlayer.secretWord.trim().length > 0);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Friendly Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold neu-card-sm text-blue-700">
          <span>🔄 Match #{room?.matchesPlayedInRoom || 1}</span>
          <span className="text-slate-300">•</span>
          <span>Deck: {room?.packCategory?.replaceAll('_', ' ') || 'All'} (Non-Repeating)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isSolo ? (
            <>Here is your secret assignment, <span className="text-blue-600">{targetPlayer?.name}</span>!</>
          ) : (
            <>Pass the device to <span className="text-blue-600">{targetPlayer?.name}</span></>
          )}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {isSolo
            ? 'Only you can see this. Your AI opponents have received their secret assignments.'
            : `Player ${currentPlayerIdx + 1} of ${players.length}. Make sure nobody else is peeking at your screen!`}
        </p>
      </div>

      {/* Secret Neumorphic Card */}
      <div className="neu-card p-5 sm:p-7 space-y-4 sm:space-y-5 text-center">
        {/* Avatar & Player Tag */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-3xl p-2.5 sm:p-3 rounded-2xl neu-card-sm inline-block">
            {targetPlayer?.avatar || '🕵️'}
          </span>
          <span className="text-sm font-bold text-slate-800">
            {targetPlayer?.name}
          </span>
        </div>

        {/* Reveal / Hide Interactive Area */}
        <div className="py-1">
          {!isRevealed ? (
            <div
              onClick={handleToggleReveal}
              className="py-8 sm:py-12 px-4 sm:px-6 rounded-2xl neu-btn flex flex-col items-center gap-2.5 sm:gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full neu-inset flex items-center justify-center text-blue-600">
                <Eye size={22} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-extrabold text-slate-800 block">
                  Tap to see your secret word
                </span>
                <p className="text-xs text-slate-400">
                  Keep your screen private
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 py-2 animate-in fade-in duration-200">
              {/* Neutral Secret Badge - No role revelation */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm bg-blue-50 text-blue-700 border border-blue-200">
                <span>🎯</span>
                <span>Secret Mission</span>
              </div>

              {/* Secret Word Display */}
              <div className="p-6 rounded-2xl neu-inset space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Your Secret Word
                </span>
                {!hasWord ? (
                  <div className="space-y-1">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">
                      ??? (No Word)
                    </span>
                    <p className="text-xs text-slate-500 font-medium">
                      You were not given a word this round!
                    </p>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-blue-700 tracking-wide block">
                    {targetPlayer?.secretWord}
                  </span>
                )}
              </div>

              {/* Secret Clue Instructions - Fair & Paranoia-inducing without disclosing role */}
              <div className="p-3.5 rounded-2xl bg-white/60 border border-slate-200/80 text-left text-xs text-slate-700 flex items-start gap-2.5">
                <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {!hasWord
                    ? "Listen carefully to everyone's clues and try to blend in with general hints. Can you figure out the secret word everyone is describing?"
                    : "Remember this word! Give a subtle 1-to-3 word clue when it's your turn. Listen closely to others to figure out if they share your word or have a decoy!"}
                </p>
              </div>

              {/* Hide Button */}
              <button
                type="button"
                onClick={handleToggleReveal}
                className="inline-flex items-center gap-1.5 px-4 py-2 neu-btn text-slate-600 text-xs font-bold hover:text-slate-900"
              >
                <EyeOff size={14} />
                <span>Hide word</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        {isRevealed && (
          <div className="pt-2">
            {isSolo ? (
              <button
                onClick={onProceedToClues}
                disabled={loading}
                className="w-full py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Start Clue Round</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleNextPlayer}
                className="w-full py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {currentPlayerIdx < players.length - 1 ? (
                  <>
                    <span>Next Player ({players[currentPlayerIdx + 1]?.name})</span>
                    <ArrowRight size={15} />
                  </>
                ) : (
                  <>
                    <span>Everyone is ready! Start Clues</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
