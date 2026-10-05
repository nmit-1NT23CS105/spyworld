import React, { useState } from 'react';
import { ShieldAlert, Check, AlertOctagon, ChevronDown, ChevronUp, Vote } from 'lucide-react';
import { playSfx } from '../../audioFx';
import TurnTimer from './TurnTimer';

export default function VotingStage({
  room,
  myPlayerId,
  onCastVote,
  loading
}) {
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [cluesReviewOpen, setCluesReviewOpen] = useState(false);

  const players = room?.players || [];
  const alivePlayers = players.filter((p) => !p.eliminated);
  const votes = room?.votes || {};

  // For Local Pass, track which local player is currently casting their vote
  const unvotedHumans = alivePlayers.filter((p) => !p.isAi && !votes[p.id]);
  const activeVoter = room?.gameMode === 'LOCAL_PASS' 
    ? (unvotedHumans[0] || alivePlayers[0]) 
    : alivePlayers.find(p => p.id === myPlayerId);

  const handleSelectSuspect = (suspectId) => {
    if (activeVoter && suspectId === activeVoter.id) return; // Cannot vote for yourself
    playSfx('click');
    setSelectedSuspectId(suspectId);
  };

  const handleConfirmVote = () => {
    if (!selectedSuspectId || !activeVoter) return;
    playSfx('spy_vote');
    onCastVote(activeVoter.id, selectedSuspectId);
    setSelectedSuspectId(null);
  };

  const handleTimerExpire = () => {
    if (!activeVoter || loading) return;
    const targetSuspect = selectedSuspectId || alivePlayers.find(p => p.id !== activeVoter.id)?.id;
    if (targetSuspect) {
      playSfx('spy_vote');
      onCastVote(activeVoter.id, targetSuspect);
      setSelectedSuspectId(null);
    }
  };

  // Calculate vote counts per suspect
  const voteCounts = {};
  Object.values(votes).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  const selectedSuspectObj = alivePlayers.find(p => p.id === selectedSuspectId);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Friendly Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Time to Vote! 🗳️
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Talk it over with your group! Whose clue sounded off or contradictory? Tap a suspect to vote them out.
        </p>
      </div>

      {/* Main Neumorphic Card */}
      <div className="neu-card p-4 sm:p-7 space-y-4 sm:space-y-5">
        {/* Deliberation Countdown Timer with Heartbeat Audio */}
        <TurnTimer
          duration={30}
          speakerName="Group Discussion"
          active={!loading}
          allowExtend={true}
          onExpire={handleTimerExpire}
        />

        {/* Active Voter Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl neu-card-sm text-blue-600 text-sm">
              🗳️
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Voting as
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {activeVoter?.name || 'You'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              Votes Cast
            </span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {Object.keys(votes).length} / {alivePlayers.length}
            </span>
          </div>
        </div>

        {/* Suspects List: Neumorphic buttons that press down on select */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Who do you suspect?
          </label>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {alivePlayers.map((player) => {
              const isSelected = selectedSuspectId === player.id;
              const isSelf = player.id === activeVoter?.id;
              const receivedVotes = voteCounts[player.id] || 0;

              return (
                <div
                  key={player.id}
                  onClick={() => !isSelf && handleSelectSuspect(player.id)}
                  className={`p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer ${
                    isSelf
                      ? 'opacity-40 cursor-not-allowed bg-slate-200/40 border border-slate-200'
                      : isSelected
                      ? 'neu-inset text-blue-900'
                      : 'neu-btn hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-xl p-1.5 rounded-xl bg-white/60 shrink-0">
                      {player.avatar || '🕵️'}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {player.name}
                          {player.score > 0 && (
                            <span className="ml-1 text-[10px] text-amber-600 font-bold">
                              ⭐{player.score}
                            </span>
                          )}
                        </span>
                        {player.isAi && (
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            AI
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 italic truncate block">
                        Clue: "{player.currentClue || 'No clue'}"
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {receivedVotes > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        {receivedVotes} {receivedVotes === 1 ? 'Vote' : 'Votes'}
                      </span>
                    )}
                    {isSelf ? (
                      <span className="text-[10px] text-slate-400 font-medium">You</span>
                    ) : isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Check size={12} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Suspect Info */}
        {selectedSuspectObj && (
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs animate-in fade-in">
            <span className="text-slate-700">
              You chose to vote against <strong className="text-blue-700">{selectedSuspectObj.name}</strong>
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase shrink-0 ml-2">
              Selected
            </span>
          </div>
        )}

        {/* Collapsible Dropdown: Review All Clues */}
        <div className="pt-2 border-t border-slate-200/80">
          <button
            type="button"
            onClick={() => { setCluesReviewOpen(!cluesReviewOpen); playSfx('click'); }}
            className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 py-1"
          >
            <span className="font-medium">Review all clues from this round</span>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
              <span>{cluesReviewOpen ? 'Hide' : 'Expand'}</span>
              {cluesReviewOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {cluesReviewOpen && (
            <div className="mt-2.5 p-3.5 rounded-2xl neu-inset space-y-1.5 animate-in fade-in duration-150">
              {alivePlayers.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-2 text-xs py-1 border-b border-slate-200/50 last:border-0">
                  <span className="text-slate-700 font-semibold shrink-0">{p.name}:</span>
                  <span className="text-blue-700 font-bold italic text-right break-words">"{p.currentClue || 'None'}"</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Vote CTA */}
        <button
          onClick={handleConfirmVote}
          disabled={!selectedSuspectId || loading}
          className="w-full py-4 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <AlertOctagon size={16} />
          <span>
            {selectedSuspectObj ? `Vote Out ${selectedSuspectObj.name}` : 'Select a player to vote'}
          </span>
        </button>
      </div>
    </div>
  );
}
