import React from 'react';
import { X, HelpCircle } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="neu-card bg-[#e6ecf5] max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-5 text-left">
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-card-sm flex items-center justify-center text-blue-600">
              <HelpCircle size={18} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">How to Play</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 neu-btn text-slate-500 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Roles Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-sm space-y-1">
              <span className="font-extrabold text-blue-700 block">👑 Civilians</span>
              <p className="text-[11px] text-slate-600">
                You get the real word (e.g. <em>"Biryani"</em>). Give subtle clues to signal fellow civilians without giving the word away.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-sm space-y-1">
              <span className="font-extrabold text-rose-600 block">🕵️ Undercover</span>
              <p className="text-[11px] text-slate-600">
                You get a decoy word (e.g. <em>"Pulao"</em>). You don't know you're the spy until other clues sound slightly different!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-sm space-y-1">
              <span className="font-extrabold text-amber-700 block">🎩 Mr. White</span>
              <p className="text-[11px] text-slate-600">
                You get NO word at all! Listen carefully, bluff to blend in, and guess the civilian word if you are voted out.
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">How a round works</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
              <li><strong>See your word:</strong> Everyone privately peeks their secret word.</li>
              <li><strong>Give clues:</strong> In turn order, each player says a short 1-to-3 word hint.</li>
              <li><strong>Debate & Vote:</strong> Discuss who sounded suspicious and vote them out.</li>
              <li><strong>Mr. White's last chance:</strong> If Mr. White is voted out, they get 1 guess to name the civilian word and win!</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-3.5 neu-btn-primary font-bold text-xs uppercase tracking-wider"
        >
          Got it, let's play!
        </button>
      </div>
    </div>
  );
}
