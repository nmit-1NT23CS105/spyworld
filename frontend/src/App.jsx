import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { playSfx } from './audioFx';
import CineSpyNav from './components/cinespy/CineSpyNav';
import RulesModal from './components/cinespy/RulesModal';
import AiPackModal from './components/cinespy/AiPackModal';
import QrJoinModal from './components/cinespy/QrJoinModal';
import CustomVsModal from './components/cinespy/CustomVsModal';
import LeaderboardModal from './components/cinespy/LeaderboardModal';
import DetectiveNotebookModal from './components/cinespy/DetectiveNotebookModal';
import EmojiReactionDock from './components/cinespy/EmojiReactionDock';
import LobbyStage from './components/cinespy/LobbyStage';
import RoleRevealStage from './components/cinespy/RoleRevealStage';
import ClueRoundStage from './components/cinespy/ClueRoundStage';
import DiscussionStage from './components/cinespy/DiscussionStage';
import VotingStage from './components/cinespy/VotingStage';
import VoteResultStage from './components/cinespy/VoteResultStage';
import MrWhiteGuessStage from './components/cinespy/MrWhiteGuessStage';
import GameOverStage from './components/cinespy/GameOverStage';
import { AlertCircle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getApiBase, fetchLanIp } from './apiConfig';

const API_BASE = getApiBase();

export default function App() {
  const [room, setRoom] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState('player-host');
  const [audioMuted, setAudioMuted] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [aiPackOpen, setAiPackOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [customVsOpen, setCustomVsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [customVsCount, setCustomVsCount] = useState(0);
  const [customPackActive, setCustomPackActive] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState('');
  const [lanHost, setLanHost] = useState(window.location.host);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-resolve Wi-Fi LAN IP for seamless mobile phone connections
  useEffect(() => {
    fetchLanIp().then((ip) => {
      if (ip && ip !== 'localhost') {
        const port = window.location.port ? `:${window.location.port}` : '';
        setLanHost(`${ip}${port}`);
      }
    });
  }, []);

  // Check URL query parameters for ?join=ROOMCODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const joinParam = params.get('join');
      if (joinParam) {
        setInitialJoinCode(joinParam.toUpperCase().trim());
      }
    } catch (e) {
      console.warn('URL search parse error:', e);
    }
  }, []);

  const pollIntervalRef = useRef(null);

  // Poll room updates if online mode
  useEffect(() => {
    if (room?.gameMode === 'ONLINE_ROOM' && room?.roomCode && room.status !== 'GAME_OVER') {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const resp = await fetch(`${API_BASE}/room/${room.roomCode}`);
          if (resp.ok) {
            const data = await resp.json();
            setRoom(data);
          }
        } catch (err) {
          console.warn('Poll error:', err);
        }
      }, 2500);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [room?.gameMode, room?.roomCode, room?.status]);

  // Handle Create Room
  const handleCreateRoom = async (config) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/room/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!resp.ok) throw new Error('Failed to create game room.');
      const newRoom = await resp.json();
      setMyPlayerId('player-host');

      // For Solo AI or Local Pass, instantly launch the game!
      if (config.gameMode === 'SOLO_AI' || config.gameMode === 'LOCAL_PASS') {
        const startResp = await fetch(`${API_BASE}/room/${newRoom.roomCode}/start`, {
          method: 'POST'
        });
        if (startResp.ok) {
          const startedRoom = await startResp.json();
          setRoom(startedRoom);
          return;
        }
      }

      setRoom(newRoom);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error creating game room');
    } finally {
      setLoading(false);
    }
  };

  // Handle Join Room
  const handleJoinRoom = async (roomCode, playerName) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/room/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, playerName })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || 'Failed to join room. Verify the room code.');
      }

      const joinedRoom = await resp.json();
      const me = joinedRoom.players[joinedRoom.players.length - 1];
      setMyPlayerId(me?.id || 'player-guest');
      setRoom(joinedRoom);
      playSfx('relic_equip');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error joining room');
    } finally {
      setLoading(false);
    }
  };

  // Handle Start Online Room Game
  const handleStartOnlineGame = async () => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/${room.roomCode}/start`, {
        method: 'POST'
      });
      if (resp.ok) {
        const started = await resp.json();
        setRoom(started);
        playSfx('bass_drop');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Proceed from Role Reveal to Clues
  const handleProceedToClues = async () => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/${room.roomCode}/proceed-clues`, {
        method: 'POST'
      });
      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
        playSfx('qte_tick');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Clue
  const handleSubmitClue = async (playerId, clueText) => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/clue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.roomCode,
          playerId,
          clueText
        })
      });

      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cast Vote
  const handleCastVote = async (voterId, suspectId) => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.roomCode,
          voterId,
          suspectId
        })
      });

      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Proceed from Discussion to Voting (Section 18)
  const handleProceedToVoting = async () => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/${room.roomCode}/proceed-voting`, {
        method: 'POST'
      });
      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
        playSfx('spy_vote');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Proceed after Vote Result (Section 20/21)
  const handleProceedAfterVote = async () => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/${room.roomCode}/proceed-after-vote`, {
        method: 'POST'
      });
      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
        playSfx('click');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Mr. White Guess
  const handleSubmitWhiteGuess = async (guessWord) => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/white-guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: room.roomCode,
          guessWord
        })
      });

      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Play Again
  const handlePlayAgain = async () => {
    if (!room?.roomCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/room/${room.roomCode}/start`, {
        method: 'POST'
      });
      if (resp.ok) {
        const updated = await resp.json();
        setRoom(updated);
        playSfx('relic_equip');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to Lobby
  const handleResetToLobby = () => {
    playSfx('click');
    setRoom(null);
    setError(null);
  };

  // Custom AI Pack Generated Callback
  const handleAiPackGenerated = (theme, pairs) => {
    setCustomPackActive(true);
    playSfx('relic_equip');
  };

  return (
    <div className="min-h-screen bg-[#e6ecf5] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Minimalist Header */}
      <CineSpyNav
        room={room}
        onResetToLobby={handleResetToLobby}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        onOpenRules={() => setRulesOpen(true)}
        onOpenQr={() => setQrModalOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenNotebook={() => setNotebookOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col">
        {/* Error notification banner if any */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 text-xs font-medium animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-3 py-1 rounded-xl neu-btn text-slate-700 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Loading Spinner */}
        {loading && (
          <div className="fixed top-4 right-4 z-50 neu-card px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-blue-700 animate-in fade-in">
            <Loader2 size={15} className="animate-spin text-blue-600" />
            <span>Connecting...</span>
          </div>
        )}

        {/* Dynamic Game Stages */}
        {(!room || room.status === 'LOBBY') && (
          <>
            {room?.gameMode === 'ONLINE_ROOM' ? (
              // Online Room Waiting Lobby
              <div className="max-w-md mx-auto space-y-6 text-center animate-in fade-in">
                <div className="neu-card p-5 sm:p-8 space-y-4 sm:space-y-6">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide block">
                    Online Room Lobby
                  </span>
                  <div className="p-4 rounded-2xl neu-inset inline-block">
                    <span className="text-3xl font-black font-mono tracking-widest text-blue-700">
                      {room.roomCode}
                    </span>
                  </div>

                  {/* Neumorphic QR Code for Instant Mobile Camera Connect */}
                  <div className="flex flex-col items-center justify-center space-y-2 py-1">
                    <div className="p-3.5 rounded-3xl neu-card bg-white inline-block shadow-md border-2 border-white">
                      <QRCodeSVG
                        value={`${window.location.protocol}//${lanHost}/?join=${room.roomCode}`}
                        size={150}
                        bgColor="#ffffff"
                        fgColor="#1e293b"
                        level="M"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-500">
                      Scan with phone camera to join instantly
                    </p>
                  </div>

                  <div className="space-y-2 text-left">
                    <span className="text-xs font-bold text-slate-600">
                      Players in room ({room.players.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {room.players.map((p) => (
                        <span
                          key={p.id}
                          className="px-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 text-xs font-medium text-slate-800 shadow-sm"
                        >
                          {p.avatar} {p.name} {p.isHost && '👑'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {myPlayerId === 'player-host' && (
                    <button
                      onClick={handleStartOnlineGame}
                      disabled={loading || room.players.length < 3}
                      className="w-full py-4 neu-btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-40"
                    >
                      {room.players.length < 3 ? 'Need at least 3 players to start' : 'Start Online Game'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Standard Lobby Stage
              <LobbyStage
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                loading={loading}
                onOpenAiPackModal={() => setAiPackOpen(true)}
                onOpenCustomVsModal={() => setCustomVsOpen(true)}
                customVsCount={customVsCount}
                customPackActive={customPackActive}
                initialJoinCode={initialJoinCode}
                onOpenQr={() => setQrModalOpen(true)}
              />
            )}
          </>
        )}

        {room?.status === 'ROLE_REVEAL' && (
          <RoleRevealStage
            room={room}
            onProceedToClues={handleProceedToClues}
            loading={loading}
          />
        )}

        {room?.status === 'CLUE_ROUND' && (
          <ClueRoundStage
            room={room}
            myPlayerId={myPlayerId}
            onSubmitClue={handleSubmitClue}
            loading={loading}
          />
        )}

        {room?.status === 'DISCUSSION' && (
          <DiscussionStage
            room={room}
            onProceedToVoting={handleProceedToVoting}
            loading={loading}
          />
        )}

        {room?.status === 'VOTING' && (
          <VotingStage
            room={room}
            myPlayerId={myPlayerId}
            onCastVote={handleCastVote}
            loading={loading}
          />
        )}

        {room?.status === 'VOTE_RESULT' && (
          <VoteResultStage
            room={room}
            onProceedAfterVote={handleProceedAfterVote}
            loading={loading}
          />
        )}

        {room?.status === 'WHITE_GUESS' && (
          <MrWhiteGuessStage
            room={room}
            myPlayerId={myPlayerId}
            onSubmitWhiteGuess={handleSubmitWhiteGuess}
            loading={loading}
          />
        )}

        {room?.status === 'GAME_OVER' && (
          <GameOverStage
            room={room}
            onPlayAgain={handlePlayAgain}
            onBackToLobby={handleResetToLobby}
            onOpenLeaderboard={() => setLeaderboardOpen(true)}
          />
        )}
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="border-t border-slate-300/60 py-5 text-center text-xs text-slate-500">
        <p className="font-medium">
          CineSpy &bull; Indian Cinema Social Deduction Party Game &bull; Powered by Google Gemini AI
        </p>
      </footer>

      {/* Rules Modal */}
      <RulesModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
      />

      {/* AI Pack Generation Modal */}
      <AiPackModal
        isOpen={aiPackOpen}
        onClose={() => setAiPackOpen(false)}
        onPackGenerated={handleAiPackGenerated}
      />

      {/* Custom VS Word Pairs Modal */}
      <CustomVsModal
        isOpen={customVsOpen}
        onClose={() => setCustomVsOpen(false)}
        onSelectVsPack={(count) => {
          setCustomVsCount(count);
          setCustomPackActive(false);
        }}
      />

      {/* Hall of Fame & Leaderboard Modal */}
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        currentRoom={room}
      />

      {/* Detective Clue Notebook Modal */}
      <DetectiveNotebookModal
        isOpen={notebookOpen}
        onClose={() => setNotebookOpen(false)}
        room={room}
      />

      {/* QR Code Quick Join Modal */}
      <QrJoinModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        roomCode={room?.roomCode}
      />

      {/* Live Floating Reaction Dock */}
      <EmojiReactionDock
        room={room}
        myPlayerName={room?.players?.find(p => p.id === myPlayerId)?.name || 'Player'}
      />
    </div>
  );
}
