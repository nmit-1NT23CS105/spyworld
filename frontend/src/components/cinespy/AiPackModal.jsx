import React, { useState } from 'react';
import { Sparkles, X, Loader2, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSfx } from '../../audioFx';
import { getApiBase } from '../../apiConfig';

const REAL_WORLD_PRESET_IDEAS = [
  "Indian Street Food (Pani Puri vs Chaat, Biryani vs Pulao)",
  "Supercars & Motorbikes (Ferrari vs Lambo, Royal Enfield vs KTM)",
  "College Life (Backlog vs Placement, Mess vs Canteen)",
  "PC & Mobile Gaming (Valorant vs CS:GO, GTA vs Cyberpunk)",
  "Space Exploration (ISRO vs NASA, Moon vs Mars)",
  "Anime Culture (Naruto vs One Piece, Attack on Titan)",
  "Fitness & Gym (Whey Protein vs Creatine, Cardio vs Weights)"
];

export default function AiPackModal({ isOpen, onClose, onPackGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPairs, setGeneratedPairs] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (themeToUse) => {
    const finalTheme = (themeToUse || prompt).trim();
    if (!finalTheme) return;

    setLoading(true);
    setError(null);
    playSfx('click');

    try {
      const resp = await fetch(`${getApiBase()}/packs/generate-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themePrompt: finalTheme })
      });

      if (!resp.ok) {
        throw new Error('Failed to generate pack. Please check backend connection.');
      }

      const pairs = await resp.json();
      setGeneratedPairs(pairs);
      playSfx('relic_equip');
      if (onPackGenerated) {
        onPackGenerated(finalTheme, pairs);
      }
    } catch (err) {
      console.error('AI Pack generation error:', err);
      setError(err.message || 'Error generating AI word pack.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="neu-card bg-[#e6ecf5] max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-5 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-card-sm flex items-center justify-center text-blue-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Create a Custom Topic
              </h3>
              <p className="text-xs text-slate-500">
                Type any topic and Gemini AI will create deceptive word pairs for you!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 neu-btn text-slate-500 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        {/* Input Box */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              What topic do you want to play?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate(prompt)}
                placeholder="e.g. Street foods, Superheroes, Space missions, Cars..."
                className="flex-1 neu-inset rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => handleGenerate(prompt)}
                disabled={loading || !prompt.trim()}
                className="px-4 py-2.5 neu-btn-primary font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                <span>Create</span>
              </button>
            </div>
          </div>

          {/* Quick Ideas */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
              Or pick an idea:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REAL_WORLD_PRESET_IDEAS.map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(idea);
                    handleGenerate(idea);
                  }}
                  disabled={loading}
                  className="px-3 py-1.5 neu-btn text-[11px] text-slate-700 hover:text-blue-700 text-left flex items-center gap-1.5"
                >
                  <Globe size={11} className="text-blue-600 shrink-0" />
                  <span className="truncate max-w-[240px]">{idea}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs font-medium">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Display */}
          {generatedPairs && (
            <div className="mt-3 pt-3 border-t border-slate-300/60 space-y-2.5">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {generatedPairs.length} pairs ready for this round!
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {generatedPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-800 font-bold truncate">{pair.wordA}</span>
                    <span className="text-slate-400 text-[10px] mx-1">vs</span>
                    <span className="text-slate-600 font-medium truncate">{pair.wordB}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 neu-btn text-slate-700 font-bold text-xs"
          >
            {generatedPairs ? 'Done & Use Topic' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
