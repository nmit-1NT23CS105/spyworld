import React from 'react';
import { Eye, HelpCircle, Volume2, VolumeX, Copy, Check, QrCode, Trophy, BookOpen } from 'lucide-react';

export default function CineSpyNav({
  room,
  onResetToLobby,
  audioMuted,
  setAudioMuted,
  onOpenRules,
  onOpenQr,
  onOpenLeaderboard,
  onOpenNotebook
}) {
  const [copied, setCopied] = React.useState(false);

  const copyRoomCode = () => {
    if (!room?.roomCode) return;
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#e6ecf5]/90 backdrop-blur-md border-b border-white/60 px-3 sm:px-4 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Home Link */}
        <div
          onClick={onResetToLobby}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl neu-card flex items-center justify-center text-blue-600 transition-transform group-hover:scale-105 shrink-0">
            <Eye size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-800">
                SpyWorld
              </span>
              <span className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-200">
                PARTY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Find the Undercover spy among friends
            </p>
          </div>
        </div>

        {/* Center Room Code Pill (if in room) */}
        {room?.roomCode && (
          <div
            onClick={copyRoomCode}
            className="hidden sm:flex items-center gap-2.5 neu-btn px-4 py-2 text-xs font-mono font-bold text-slate-700 hover:text-blue-600"
            title="Click to copy Room Code"
          >
            <span className="text-blue-600 font-extrabold">{room.roomCode}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase">
              {room.gameMode === 'SOLO_AI' ? 'SOLO' : room.gameMode === 'LOCAL_PASS' ? 'PASS & PLAY' : 'ONLINE'}
            </span>
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} className="text-slate-400" />}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Detective Notebook (active during investigation rounds) */}
          {(room?.status === 'CLUE_ROUND' || room?.status === 'VOTING') && (
            <button
              onClick={onOpenNotebook}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 neu-btn text-blue-700 text-xs font-bold transition-all hover:text-blue-900"
              title="Open Detective Clue Notebook"
            >
              <BookOpen size={14} className="text-blue-600" />
              <span className="hidden sm:inline">Notebook</span>
            </button>
          )}

          {/* QR Code Quick Button */}
          {room?.roomCode && (
            <button
              onClick={onOpenQr}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 neu-btn text-slate-700 text-xs font-bold transition-all hover:text-blue-600"
              title="Show QR Code to invite mobile players"
            >
              <QrCode size={14} className="text-blue-600" />
              <span className="hidden sm:inline">QR</span>
            </button>
          )}

          {/* Leaderboard / Scores Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 neu-btn text-slate-700 text-xs font-bold transition-all hover:text-amber-600"
            title="View Scoreboard & Career Hall of Fame"
          >
            <Trophy size={14} className="text-amber-600" />
            <span className="hidden sm:inline">Scores</span>
          </button>

          {/* Rules Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 neu-btn text-slate-700 text-xs font-bold transition-all hover:text-blue-600"
          >
            <HelpCircle size={14} className="text-blue-600" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-1.5 sm:p-2 neu-btn text-slate-600 hover:text-blue-600"
            title={audioMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {audioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
