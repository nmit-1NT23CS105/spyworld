import React, { useState } from 'react';
import { Key, Sparkles, Film, ChevronDown, ChevronUp } from 'lucide-react';
import { playSfx } from '../../audioFx';

const POPULAR_INDIAN_MOVIES = [
  'Pokiri', 'Baahubali', 'Pushpa', 'RRR', 'Jersey', 'Mahanati', 'Vikram',
  'Kaithi', 'Jailer', 'Master', 'Sholay', '3 Idiots', 'Dangal', 'Drishyam',
  'Lucifer', 'KGF', 'Kantara', 'Charlie 777', 'Kantara'
];

export default function MrWhiteGuessStage({
  room,
  myPlayerId,
  onSubmitWhiteGuess,
  loading
}) {
  const [guessWord, setGuessWord] = useState('');
  const [cluesOpen, setCluesOpen] = useState(false);

  const eliminatedPlayer = room?.players?.find((p) => p.id === room?.eliminatedPlayerId);
  const isMrWhiteHuman = eliminatedPlayer && !eliminatedPlayer.isAi;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!guessWord.trim()) return;
    playSfx('bass_drop');
    onSubmitWhiteGuess(guessWord.trim());
  };

  const handleSelectMovieChip = (movie) => {
    setGuessWord(movie);
    playSfx('click');
  };

  const handleAiGuess = () => {
    playSfx('bass_drop');
    // Plausible Indian movie guess
    const movieCandidates = [
      room?.civilianWord,
      room?.undercoverWord,
      'Baahubali',
      'Vikram',
      'Pokiri',
      'KGF'
    ].filter(Boolean);
    const chosen = movieCandidates[Math.floor(Math.random() * movieCandidates.length)] || 'Baahubali';
    onSubmitWhiteGuess(chosen);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Friendly Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 block">
          Section 21 • Mr. White Final Opportunity
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Mr. White Was Caught! 🎩
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {eliminatedPlayer?.name} was uncovered as Mr. White. But they get <strong>one final chance</strong> to deduce the majority movie and steal victory!
        </p>
      </div>

      {/* Main Card */}
      <div className="neu-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 rounded-2xl neu-card-sm shrink-0">
            🎩
          </span>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {eliminatedPlayer?.name}
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Mr. White (Received No Movie)
            </span>
          </div>
        </div>

        {/* Collapsible Dropdown: Clues Heard */}
        <div className="rounded-2xl neu-inset p-3.5 space-y-2">
          <button
            type="button"
            onClick={() => { setCluesOpen(!cluesOpen); playSfx('click'); }}
            className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-slate-900"
          >
            <span className="font-bold">
              Review all clues heard this game
            </span>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
              <span>{cluesOpen ? 'Hide' : 'Show clues'}</span>
              {cluesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {cluesOpen && (
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
              {(room?.players || []).map((p) => (
                p.currentClue && (
                  <span
                    key={p.id}
                    className="px-2.5 py-1 rounded-xl bg-white/70 border border-slate-200 text-slate-800 text-xs font-medium"
                  >
                    {p.name}: <strong className="text-blue-700">"{p.currentClue}"</strong>
                  </span>
                )
              ))}
            </div>
          )}
        </div>

        {/* Guess Input or AI Trigger */}
        {isMrWhiteHuman ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                What Indian movie were the other players talking about?
              </label>
              <input
                type="text"
                value={guessWord}
                onChange={(e) => setGuessWord(e.target.value)}
                placeholder="Enter exact movie name (e.g. Pokiri, Vikram, Sholay)..."
                autoFocus
                className="w-full neu-inset rounded-2xl px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 font-bold text-center"
              />
            </div>

            {/* Quick suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Quick Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {POPULAR_INDIAN_MOVIES.slice(0, 10).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectMovieChip(m)}
                    className="px-2.5 py-1 rounded-xl neu-btn text-[11px] font-bold text-slate-700 hover:text-blue-700"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!guessWord.trim() || loading}
              className="w-full py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Key size={16} />
              <span>Submit My Final Movie Guess</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              The AI persona is analyzing all clues to make its final Indian cinema deduction!
            </p>
            <button
              onClick={handleAiGuess}
              disabled={loading}
              className="w-full py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Reveal AI Mr. White's Guess</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
