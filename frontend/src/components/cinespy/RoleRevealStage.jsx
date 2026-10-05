import React, { useState } from 'react';
import { Eye, EyeOff, Shield, ArrowRight, Sparkles, Lock, Film, CheckCircle } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function RoleRevealStage({ room, onProceedToClues, loading }) {
  const isSolo = room?.gameMode === 'SOLO_AI';
  const players = room?.players || [];

  // For Local Pass mode, cycle through each player
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [allDone, setAllDone] = useState(false);

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

  const handleHideAndPass = () => {
    playSfx('click');
    setIsRevealed(false);
    if (isSolo) {
      setAllDone(true);
    } else {
      if (currentPlayerIdx < players.length - 1) {
        setCurrentPlayerIdx(currentPlayerIdx + 1);
      } else {
        setAllDone(true);
      }
    }
  };

  const role = targetPlayer?.role || 'NORMAL';
  const isMrWhite = 'MR_WHITE'.equalsIgnoreCase(role);
  const isUndercover = 'UNDERCOVER'.equalsIgnoreCase(role);
  const isNormal = !isMrWhite && !isUndercover;

  // Section 11: Everyone Ready Transition Screen
  if (allDone) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="neu-card p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl neu-card-sm flex items-center justify-center text-3xl">
            🎬
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              EVERYONE READY?
            </h2>
            <p className="text-sm font-semibold text-blue-700">
              The game is about to begin.
            </p>
          </div>

          <div className="p-4 rounded-xl neu-card-sm text-xs font-medium text-slate-600 space-y-2 text-left max-w-sm mx-auto">
            <p className="font-bold text-slate-800 text-center mb-1">CineSpy Mission Briefing:</p>
            <p className="flex items-center gap-2">
              <span>🎯</span>
              <span><strong>Give clues carefully:</strong> Demonstrate knowledge without being obvious.</span>
            </p>
            <p className="flex items-center gap-2">
              <span>👂</span>
              <span><strong>Listen carefully:</strong> Catch contradictory or evasive clues.</span>
            </p>
            <p className="flex items-center gap-2">
              <span>🕵️</span>
              <span><strong>Trust nobody:</strong> Anyone could be the Undercover or Mr. White!</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => { playSfx('bass_drop'); onProceedToClues(); }}
            disabled={loading}
            className="w-full neu-btn py-3.5 px-4 text-sm font-extrabold text-blue-700 flex items-center justify-center gap-2 hover:text-blue-800"
          >
            <span>START ROUND 1</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Friendly Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold neu-card-sm text-blue-700">
          <span>🔄 Match #{room?.matchesPlayedInRoom || 1}</span>
          <span className="text-slate-300">•</span>
          <span>Deck: {room?.packCategory?.replaceAll('_', ' ') || 'Indian Cinema'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isSolo ? (
            <>Private Role Reveal: <span className="text-blue-600">{targetPlayer?.name}</span></>
          ) : (
            <>Pass the device to <span className="text-blue-600">{targetPlayer?.name}</span></>
          )}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {isSolo
            ? 'Only you can see this. Your AI opponents have received their secret assignments.'
            : `Player ${currentPlayerIdx + 1} of ${players.length}. Ensure nobody else can see the screen!`}
        </p>
      </div>

      {/* Secret Neumorphic Card */}
      <div className="neu-card p-6 sm:p-8 space-y-6 text-center">
        {/* Pass-the-phone Hidden State */}
        {!isRevealed ? (
          <div className="py-8 space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl neu-card-sm flex items-center justify-center text-slate-500">
              <Lock size={36} className="text-slate-400" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isSolo ? 'Ready to peek?' : `Hand device to ${targetPlayer?.name}`}
              </p>
              <h3 className="text-xl font-extrabold text-slate-800">
                Private Assignment Sealed
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap below to view your secret movie and role assignment in private.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleReveal}
              className="neu-btn px-6 py-3 text-xs font-extrabold text-blue-700 inline-flex items-center gap-2 hover:text-blue-800"
            >
              <Eye size={16} />
              <span>REVEAL MY ROLE</span>
            </button>
          </div>
        ) : (
          /* Secret Mission Revealed: Section 3, 4, 5 */
          <div className="py-4 space-y-5 animate-in fade-in duration-200">
            {/* Role Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold neu-card-sm">
              <span>{isMrWhite ? '🎩' : isUndercover ? '🕵️' : '🎬'}</span>
              <span className={isMrWhite ? 'text-amber-700' : isUndercover ? 'text-rose-700' : 'text-blue-700'}>
                ROLE: {isMrWhite ? 'MR. WHITE' : isUndercover ? 'UNDERCOVER' : 'NORMAL'}
              </span>
            </div>

            {/* Secret Movie Card */}
            <div className="neu-card-sm p-6 sm:p-7 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
                {isMrWhite ? 'ASSIGNED MOVIE STATUS' : 'YOUR ASSIGNED MOVIE'}
              </span>
              
              {isMrWhite ? (
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-wide">
                    YOU HAVE NO MOVIE.
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Listen carefully. Use the clues to figure out the movie.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide">
                    {targetPlayer?.secretWord || 'POKIRI'}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isUndercover ? 'A related Indian cinema movie.' : 'The majority Indian cinema movie.'}
                  </p>
                </div>
              )}
            </div>

            {/* Objective Instructions */}
            <div className="p-3.5 rounded-xl neu-card-sm text-left max-w-sm mx-auto text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Your Secret Mission:</span>
              {isNormal && (
                <p>All Normal players have this same movie. Identify and vote out the Undercover and Mr. White without giving the movie away!</p>
              )}
              {isUndercover && (
                <p>You have a different movie! Listen to clues, deduce what the majority has, blend in, and survive elimination!</p>
              )}
              {isMrWhite && (
                <p>You know nothing! Bluff your clues based on what others say. If you are eliminated, you get ONE FINAL GUESS to steal the win!</p>
              )}
            </div>

            {/* Hide & Pass Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleHideAndPass}
                className="w-full neu-btn py-3 px-4 text-xs font-extrabold text-slate-800 flex items-center justify-center gap-2 hover:text-slate-900"
              >
                <EyeOff size={15} />
                <span>
                  {isSolo
                    ? 'HIDE & READY TO PLAY'
                    : currentPlayerIdx < players.length - 1
                    ? 'HIDE & PASS PHONE'
                    : 'HIDE & COMPLETE REVEAL'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
