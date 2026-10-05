import React, { useState } from 'react';
import { Send, MessageSquare, Mic, MicOff, Sparkles, ChevronDown, ChevronUp, CheckCircle2, BookOpen, AlertTriangle, Check, X } from 'lucide-react';
import { playSfx } from '../../audioFx';
import TurnTimer from './TurnTimer';

export default function ClueRoundStage({
  room,
  myPlayerId,
  onSubmitClue,
  loading
}) {
  const [clueText, setClueText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [cluesBoardOpen, setCluesBoardOpen] = useState(true);

  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const players = room?.players || [];
  const speakingOrder = room?.speakingOrder || [];

  // Filter alive players in speaking order
  const orderedAlive = speakingOrder
    .map((id) => players.find((p) => p.id === id))
    .filter((p) => p && !p.eliminated);

  const currentSpeaker = orderedAlive[room?.currentSpeakerIndex || 0] || orderedAlive[0];
  const isMyTurn = currentSpeaker?.id === myPlayerId || (!currentSpeaker?.isAi && room?.gameMode === 'LOCAL_PASS');

  // Web Speech API for voice clue
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your clue.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setClueText(transcript);
        playSfx('click');
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!clueText.trim()) return;
    playSfx('matchstick');
    onSubmitClue(currentSpeaker?.id || myPlayerId, clueText.trim());
    setClueText('');
  };

  const handleTimerExpire = () => {
    if (isMyTurn && !loading) {
      const clue = clueText.trim() || "Time expired (No clue)";
      playSfx('bass_drop');
      onSubmitClue(currentSpeaker?.id || myPlayerId, clue);
      setClueText('');
    }
  };

  const cluesSubmittedCount = orderedAlive.filter(p => Boolean(p.currentClue)).length;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Friendly Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold neu-card-sm text-blue-700">
          <span>🎬 CineSpy Indian Cinema</span>
          <span className="text-slate-300">•</span>
          <span>Deck: {room?.movieLanguage || 'PAN_INDIA'} ({room?.movieDifficulty || 'ALL'})</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Round {room?.roundNumber || 1}: Clue Phase 💬
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Describe your movie indirectly. Normal players must prove knowledge without giving it away; Spies must blend in!
        </p>
      </div>

      {/* Main Speaker Card */}
      <div className="neu-card p-6 sm:p-7 space-y-4">
        {/* Real-time Turn Timer with Heartbeat Audio */}
        <TurnTimer
          duration={room?.clueTimerSeconds || 30}
          speakerName={currentSpeaker?.name || 'Current Player'}
          active={Boolean(currentSpeaker && !loading)}
          onExpire={handleTimerExpire}
        />

        <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl p-2 sm:p-2.5 rounded-2xl neu-card-sm shrink-0">
              {currentSpeaker?.avatar || '🕵️'}
            </span>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wide block">
                Current Speaker
              </span>
              <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">
                {currentSpeaker?.name}
                {currentSpeaker?.persona && (
                  <span className="text-[11px] sm:text-xs font-normal text-slate-400 ml-1 sm:ml-1.5">
                    ({currentSpeaker.persona})
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 block">
              Player {((room?.currentSpeakerIndex || 0) + 1)} of {orderedAlive.length}
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1 justify-end">
              {orderedAlive.map((p, idx) => (
                <div
                  key={p.id}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    idx === (room?.currentSpeakerIndex || 0)
                      ? 'bg-blue-600 ring-2 ring-blue-300'
                      : idx < (room?.currentSpeakerIndex || 0)
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Input Form if it's Human Turn */}
        {isMyTurn ? (
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={clueText}
                onChange={(e) => setClueText(e.target.value)}
                placeholder="Type a short clue (e.g. Spiced rice, Apple logo)..."
                autoFocus
                className="flex-1 neu-inset rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium"
              />

              <button
                type="button"
                onClick={toggleVoice}
                className={`p-3 rounded-2xl neu-btn shrink-0 text-slate-600 hover:text-blue-600 ${
                  isListening ? 'neu-btn-pressed text-rose-600 animate-pulse' : ''
                }`}
                title="Speak clue"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="submit"
                disabled={!clueText.trim() || loading}
                className="px-4 sm:px-5 py-3 neu-btn-primary shrink-0 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
              >
                <span>Submit</span>
                <Send size={13} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Sparkles size={12} className="text-blue-600 shrink-0" />
              <span>Keep it short! Spies will use your clue to guess the word.</span>
            </div>
          </form>
        ) : (
          <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
            <span>Waiting for {currentSpeaker?.name} to give a clue...</span>
          </div>
        )}
      </div>

      {/* Section 13 & 14: Collapsible Clue Guidelines & Restrictions */}
      <div className="neu-card p-4 space-y-2.5">
        <button
          type="button"
          onClick={() => { setGuidelinesOpen(!guidelinesOpen); playSfx('click'); }}
          className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 select-none"
        >
          <div className="flex items-center gap-2 font-bold">
            <BookOpen size={15} className="text-blue-600" />
            <span>Clue Rules: What makes a good clue?</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
            <span>{guidelinesOpen ? 'Hide' : 'View Guidelines'}</span>
            {guidelinesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {guidelinesOpen && (
          <div className="pt-2 border-t border-slate-200/80 space-y-2.5 text-xs animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <Check size={13} className="text-emerald-600" /> Good Clues (Indirect & Conceptual)
              </span>
              <p className="text-emerald-800 text-[11px]">
                • "Power and succession are major parts of the story."<br />
                • "The protagonist's identity is not what it first appears to be."<br />
                • "A single night mission with high adrenaline."
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
              <span className="font-extrabold text-rose-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <X size={13} className="text-rose-600" /> Forbidden Clues (Instant Spoilers)
              </span>
              <p className="text-rose-800 text-[11px]">
                Do NOT mention actor/actress names, director, character names, release year, first letter of title, word counts, or iconic dialogues!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progressive Disclosure: Collapsible Clues Board */}
      <div className="neu-card p-5 space-y-3">
        <button
          type="button"
          onClick={() => { setCluesBoardOpen(!cluesBoardOpen); playSfx('click'); }}
          className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 select-none"
        >
          <div className="flex items-center gap-2 font-bold">
            <span>Clues given so far</span>
            <span className="text-[11px] font-mono text-slate-400 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200">
              {cluesSubmittedCount} of {orderedAlive.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
            <span>{cluesBoardOpen ? 'Hide' : 'Show'}</span>
            {cluesBoardOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {cluesBoardOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/80 animate-in fade-in duration-200">
            {orderedAlive.map((player) => {
              const hasClue = Boolean(player.currentClue);
              const isSpeaker = player.id === currentSpeaker?.id;

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-2xl transition-all ${
                    isSpeaker
                      ? 'neu-inset'
                      : 'bg-white/50 border border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{player.avatar || '🕵️'}</span>
                      <span className="font-bold text-xs text-slate-800 truncate max-w-[120px]">
                        {player.name}
                        {player.score > 0 && (
                          <span className="ml-1 text-[10px] text-amber-600 font-bold">
                            ⭐{player.score}
                          </span>
                        )}
                      </span>
                    </div>

                    {hasClue ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Clue in
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        Thinking...
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/50 min-h-[36px] flex items-center">
                    {player.currentClue ? (
                      <p className="text-xs font-bold text-slate-800 italic">
                        "{player.currentClue}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        No clue yet...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
