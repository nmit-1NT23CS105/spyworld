import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Star, Flame, Award, RefreshCw } from 'lucide-react';
import { getApiBase } from '../../apiConfig';
import { playSfx } from '../../audioFx';

const API_BASE = getApiBase();

export default function LeaderboardModal({ isOpen, onClose, currentRoom }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.warn('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Active room player scores
  const roomPlayers = currentRoom?.players || [];
  const sortedRoomPlayers = [...roomPlayers].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="neu-card bg-[#e6ecf5] max-w-md w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-5 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-3">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl neu-card-sm flex items-center justify-center text-amber-600">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Hall of Fame & Scores
              </h3>
              <p className="text-[11px] text-slate-500">
                Player rankings & points
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl neu-btn text-slate-500 hover:text-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current Match Standing (if active game with scores) */}
        {sortedRoomPlayers.length > 0 && sortedRoomPlayers.some(p => (p.score || 0) > 0) && (
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-800 uppercase tracking-wide text-[10px]">
                Current Match Points
              </span>
              <span className="text-[11px] text-slate-400">
                Room {currentRoom.roomCode}
              </span>
            </div>

            <div className="space-y-1.5">
              {sortedRoomPlayers.map((player, idx) => (
                <div
                  key={player.id}
                  className="p-2.5 rounded-xl bg-white/70 border border-slate-200/90 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-4 text-center">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <span className="text-base">{player.avatar || '🕵️'}</span>
                    <span className="font-bold text-slate-900">{player.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {player.roundPointsEarned > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        +{player.roundPointsEarned}
                      </span>
                    )}
                    <span className="font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      ⭐ {player.score || 0} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Persistent Career Leaderboard */}
        <div className="space-y-2 text-left pt-2 border-t border-slate-300/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800">
              All-Time Career Ranks:
            </span>
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {leaderboard.length === 0 ? (
              <div className="p-4 rounded-xl neu-inset text-center text-xs text-slate-400 italic">
                {loading ? 'Loading scores...' : 'No career matches recorded yet. Complete your first match to rank up!'}
              </div>
            ) : (
              leaderboard.map((user, idx) => (
                <div
                  key={user.playerName}
                  className="p-2.5 rounded-xl bg-white/60 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-500 w-5 text-center">
                      {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <span className="text-base">{user.favoriteAvatar || '🕵️'}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {user.playerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {user.wins} wins &bull; {user.gamesPlayed} games
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs">
                    ⭐ {user.totalScore}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rules for Points badge */}
        <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-slate-600 text-left space-y-1">
          <span className="font-bold text-blue-900 block">Scoring System:</span>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <span>👑 Civilian Win: <strong>+3 pts</strong></span>
            <span>🕵️ Undercover Win: <strong>+4 pts</strong></span>
            <span>🎩 Mr. White Win: <strong>+5 pts</strong></span>
            <span>🔍 Correct Spy Vote: <strong>+1 bonus</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
