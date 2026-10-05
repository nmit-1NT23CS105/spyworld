import React, { useState, useEffect, useRef } from 'react';
import { Smile, ChevronUp, ChevronDown } from 'lucide-react';
import { playSfx } from '../../audioFx';
import { getApiBase } from '../../apiConfig';

const REACTION_EMOJIS = [
  { emoji: '🕵️', label: 'Suspicious' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '🤫', label: 'Keep quiet' },
  { emoji: '🔥', label: 'Spot on!' },
  { emoji: '😱', label: 'Shocked' },
  { emoji: '👑', label: 'Civilian' },
  { emoji: '🍿', label: 'Popcorn' }
];

export default function EmojiReactionDock({ room, myPlayerName = 'You' }) {
  const [particles, setParticles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const seenReactionsRef = useRef(new Set());

  // Listen to remote reactions from the backend room state
  useEffect(() => {
    if (!room?.recentReactions || !Array.isArray(room.recentReactions)) return;

    room.recentReactions.forEach((r) => {
      if (r?.id && !seenReactionsRef.current.has(r.id)) {
        seenReactionsRef.current.add(r.id);
        // Only spawn if not sent by myself in the last 500ms
        spawnParticle(r.emoji, r.senderName || 'Player');
      }
    });
  }, [room?.recentReactions]);

  const spawnParticle = (emoji, sender) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = Math.floor(Math.random() * 70) + 15; // 15% to 85%
    const rot = Math.floor(Math.random() * 30) - 15; // -15deg to +15deg

    const newParticle = { id, emoji, sender, x, rot };
    setParticles((prev) => [...prev.slice(-15), newParticle]);

    // Clean up particle after 2.8s
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 2800);
  };

  const handleReact = async (emojiObj) => {
    playSfx('emoji_pop');
    spawnParticle(emojiObj.emoji, myPlayerName);

    // Send to backend if room exists
    if (room?.roomCode) {
      try {
        await fetch(`${getApiBase()}/room/react`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomCode: room.roomCode,
            emoji: emojiObj.emoji,
            senderName: myPlayerName
          })
        });
      } catch (err) {
        console.warn('Reaction broadcast failed (harmless):', err);
      }
    }
  };

  return (
    <>
      {/* 1. Full-screen Floating Emojis Canvas */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bottom-16 flex flex-col items-center animate-float-up pointer-events-none"
            style={{
              left: `${p.x}%`,
              '--rot': `${p.rot}deg`
            }}
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-md select-none transform transition-transform">
              {p.emoji}
            </span>
            {p.sender && (
              <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs border border-slate-200 mt-1 whitespace-nowrap">
                {p.sender}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 2. Floating Neumorphic Reaction Dock */}
      <div
        className="fixed right-2.5 sm:right-6 z-40 flex flex-col items-end gap-1.5 animate-in fade-in slide-in-from-bottom-2"
        style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
      >
        {isExpanded ? (
          <div className="neu-card p-1 sm:p-2 rounded-2xl flex items-center gap-0.5 sm:gap-1.5 shadow-lg bg-[#e6ecf5]/95 backdrop-blur-md border border-white/80">
            {REACTION_EMOJIS.map((item) => (
              <button
                key={item.emoji}
                type="button"
                onClick={() => handleReact(item)}
                title={item.label}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl neu-btn flex items-center justify-center text-base sm:text-xl hover:scale-115 active:scale-95 transition-transform"
              >
                {item.emoji}
              </button>
            ))}

            <button
              type="button"
              onClick={() => { setIsExpanded(false); playSfx('click'); }}
              className="w-7 h-7 rounded-xl neu-btn text-slate-400 hover:text-slate-700 flex items-center justify-center ml-0.5"
              title="Minimize reaction bar"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setIsExpanded(true); playSfx('click'); }}
            className="neu-btn px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 shadow-md bg-[#e6ecf5]"
            title="Open reaction emojis"
          >
            <Smile size={15} className="text-blue-600" />
            <span className="hidden sm:inline">Reactions</span>
            <ChevronUp size={13} className="text-slate-400" />
          </button>
        )}
      </div>
    </>
  );
}
