import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Smartphone, Globe, Sparkles, ChevronDown, ChevronUp, 
  Play, Plus, Trash2, ArrowRight, Sliders, Users, Check, Swords
} from 'lucide-react';
import { playSfx } from '../../audioFx';

const REAL_WORLD_CATEGORIES = [
  { id: 'ALL_REAL_WORLD', name: 'Surprise Mix (550+ Pairs)', desc: 'Massive non-repeating deck across all topics', icon: '🎲' },
  { id: 'CUSTOM_VS', name: 'Custom VS Pairs (User Created)', desc: 'Play with your own Word A vs Word B custom pairs', icon: '⚔️' },
  { id: 'FOOD', name: 'Food & Drinks (60 Pairs)', desc: 'Biryani vs Pulao, Chai vs Coffee, Pizza vs Burger...', icon: '🍔' },
  { id: 'TECH', name: 'Tech & Gadgets (60 Pairs)', desc: 'iPhone vs Android, ChatGPT vs Gemini, Mac vs Windows...', icon: '📱' },
  { id: 'SPORTS', name: 'Sports & Games (60 Pairs)', desc: 'Cricket vs Football, Kohli vs Rohit, Messi vs Ronaldo...', icon: '🏏' },
  { id: 'CAMPUS', name: 'College & Student Life (55 Pairs)', desc: 'Hostel vs Home, Canteen vs Mess, Backlog vs Placement...', icon: '🎓' },
  { id: 'TRAVEL', name: 'Travel & Vacations (55 Pairs)', desc: 'Beach vs Mountains, Goa vs Manali, Flight vs Train...', icon: '✈️' },
  { id: 'LIFESTYLE', name: 'Daily Habits & Routines (55 Pairs)', desc: 'Morning Person vs Night Owl, WFH vs Office, Cash vs UPI...', icon: '☕' },
  { id: 'ANIMALS', name: 'Animals & Nature (55 Pairs)', desc: 'Dog vs Cat, Lion vs Tiger, Dolphin vs Shark...', icon: '🐾' },
  { id: 'CAREERS', name: 'Work & Careers (55 Pairs)', desc: 'Startup vs MNC, Software Dev vs PM, Resume vs LinkedIn...', icon: '💼' },
  { id: 'MOVIES', name: 'Cinema & Pop Culture (65 Pairs)', desc: 'Baahubali vs KGF, Marvel vs DC, Anime vs K-Drama...', icon: '🎬' },
];

const DEFAULT_LOCAL_NAMES = ['You', 'Ravi', 'Priya', 'Suresh', 'Kavya'];

export default function LobbyStage({
  onCreateRoom,
  onJoinRoom,
  loading,
  onOpenAiPackModal,
  onOpenCustomVsModal,
  customPackActive,
  customVsCount = 0,
  initialJoinCode = '',
  onOpenQr
}) {
  const [gameMode, setGameMode] = useState(initialJoinCode ? 'ONLINE_ROOM' : 'SOLO_AI'); // 'SOLO_AI' | 'LOCAL_PASS' | 'ONLINE_ROOM'
  const [hostName, setHostName] = useState(() => {
    return localStorage.getItem('spyworld_player_name') || 'Player 1';
  });
  const [packCategory, setPackCategory] = useState('ALL_REAL_WORLD');

  const handleNameChange = (val) => {
    setHostName(val);
    localStorage.setItem('spyworld_player_name', val);
  };
  
  // Dropdown states for progressive disclosure
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  // Settings
  const [totalPlayers, setTotalPlayers] = useState(5);
  const [undercoversCount, setUndercoversCount] = useState(1);
  const [mrWhitesCount, setMrWhitesCount] = useState(1);
  const [localNames, setLocalNames] = useState(DEFAULT_LOCAL_NAMES);
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState(initialJoinCode || '');

  useEffect(() => {
    if (initialJoinCode) {
      setGameMode('ONLINE_ROOM');
      setJoinCodeInput(initialJoinCode);
    }
  }, [initialJoinCode]);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategoryObj = REAL_WORLD_CATEGORIES.find(c => c.id === packCategory) || REAL_WORLD_CATEGORIES[0];

  const addLocalPlayer = () => {
    if (!newPlayerInput.trim() || localNames.length >= 10) return;
    setLocalNames([...localNames, newPlayerInput.trim()]);
    setNewPlayerInput('');
    playSfx('click');
  };

  const removeLocalPlayer = (idx) => {
    if (localNames.length <= 3) return;
    setLocalNames(localNames.filter((_, i) => i !== idx));
    playSfx('click');
  };

  const handleStart = () => {
    playSfx('bass_drop');
    onCreateRoom({
      gameMode,
      hostName: hostName.trim() || 'Player 1',
      packCategory: customPackActive ? 'CUSTOM_AI' : packCategory,
      totalPlayers: gameMode === 'LOCAL_PASS' ? localNames.length : totalPlayers,
      undercoversCount,
      mrWhitesCount,
      localPlayerNames: gameMode === 'LOCAL_PASS' ? localNames : null
    });
  };

  const handleJoin = () => {
    if (!joinCodeInput.trim()) return;
    playSfx('click');
    onJoinRoom(joinCodeInput.trim().toUpperCase(), hostName.trim() || 'Friend');
  };

  const civilianCount = Math.max(
    1,
    (gameMode === 'LOCAL_PASS' ? localNames.length : totalPlayers) - undercoversCount - mrWhitesCount
  );

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Friendly Humanized Header */}
      <div className="text-center space-y-1.5 pt-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Ready to play? 🕵️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
          Everyone gets the secret word. The spy gets a decoy word. Can you deduce who is bluffing?
        </p>
      </div>

      {/* Mode Selector: Tactile Neumorphic Buttons */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 neu-card-sm">
        <button
          type="button"
          onClick={() => { setGameMode('SOLO_AI'); playSfx('click'); }}
          className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all ${
            gameMode === 'SOLO_AI'
              ? 'neu-inset text-blue-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot size={15} />
          <span>Solo vs AI</span>
        </button>

        <button
          type="button"
          onClick={() => { setGameMode('LOCAL_PASS'); playSfx('click'); }}
          className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all ${
            gameMode === 'LOCAL_PASS'
              ? 'neu-inset text-blue-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone size={15} />
          <span>Pass & Play</span>
        </button>

        <button
          type="button"
          onClick={() => { setGameMode('ONLINE_ROOM'); playSfx('click'); }}
          className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all ${
            gameMode === 'ONLINE_ROOM'
              ? 'neu-inset text-blue-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe size={15} />
          <span>Online Room</span>
        </button>
      </div>

      {/* Main Neumorphic Card */}
      <div className="neu-card p-4 sm:p-7 space-y-4 sm:space-y-5">
        
        {/* Row 1: Player Name Input (Soft Inset) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Type your name..."
            className="w-full neu-inset rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        {/* Row 2: Topic Category Dropdown (Neumorphic Extruded Trigger) */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <label className="text-xs font-bold text-slate-700">
              Topic
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { playSfx('click'); onOpenCustomVsModal(); }}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200"
              >
                <Swords size={12} />
                <span>⚔️ Add VS Words</span>
              </button>
              <button
                type="button"
                onClick={() => { playSfx('click'); onOpenAiPackModal(); }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Sparkles size={12} />
                <span>AI Topic</span>
              </button>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => { setCategoryDropdownOpen(!categoryDropdownOpen); playSfx('click'); }}
            className={`w-full neu-btn p-3.5 flex items-center justify-between text-left ${
              categoryDropdownOpen ? 'neu-btn-pressed' : ''
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <span className="text-2xl p-1.5 rounded-xl neu-card-sm shrink-0">
                {customPackActive ? '✨' : selectedCategoryObj.icon}
              </span>
              <div className="truncate">
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {customPackActive ? 'Custom AI Topic' : selectedCategoryObj.name}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {customPackActive ? 'Crafted with Gemini AI' : selectedCategoryObj.desc}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500 shrink-0 ml-2">
              <span className="text-xs font-semibold">Change</span>
              {categoryDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* Neumorphic Dropdown Menu */}
          {categoryDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2.5 z-50 neu-dropdown p-2.5 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="space-y-1">
                {REAL_WORLD_CATEGORIES.map((cat) => {
                  const isSelected = !customPackActive && packCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setPackCategory(cat.id);
                        setCategoryDropdownOpen(false);
                        playSfx('click');
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                        isSelected
                          ? 'neu-inset text-blue-700 font-bold'
                          : 'hover:bg-slate-200/50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-xl">{cat.icon}</span>
                        <div className="truncate">
                          <span className="text-xs font-bold block">{cat.name}</span>
                          <span className="text-[11px] text-slate-500 block truncate">{cat.desc}</span>
                        </div>
                      </div>
                      {isSelected && <Check size={15} className="text-blue-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Online Room Code (if Online Mode) */}
        {gameMode === 'ONLINE_ROOM' && (
          <div className="pt-2 border-t border-slate-300/50 space-y-2">
            {initialJoinCode && (
              <div className="p-3 rounded-2xl neu-inset bg-blue-50/80 border border-blue-200 text-xs text-blue-900 font-medium">
                ✨ You've been invited to room <strong className="font-mono text-blue-700">{initialJoinCode}</strong>! Enter your name and tap Join below.
              </div>
            )}
            <label className="block text-xs font-bold text-slate-700">
              Joining a friend's room?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="Enter Room Code (e.g. SPY-456)"
                className="flex-1 neu-inset rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 font-mono uppercase"
              />
              <button
                onClick={handleJoin}
                disabled={!joinCodeInput.trim() || loading}
                className="px-5 py-2.5 neu-btn-primary font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Join</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Row 4: Collapsible Game Settings (Progressive Disclosure) */}
        <div className="pt-2 border-t border-slate-300/50">
          <button
            type="button"
            onClick={() => { setSettingsExpanded(!settingsExpanded); playSfx('click'); }}
            className="w-full flex items-center justify-between py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders size={14} className="text-blue-600" />
              <span className="font-bold text-slate-800">Players & Roles</span>
              <span className="text-[11px] text-slate-500">
                ({gameMode === 'LOCAL_PASS' ? localNames.length : totalPlayers} players &bull; {undercoversCount} spy)
              </span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 font-bold text-[11px]">
              <span>{settingsExpanded ? 'Done' : 'Customize'}</span>
              {settingsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {/* Expandable Settings */}
          {settingsExpanded && (
            <div className="mt-3 p-4 rounded-2xl neu-inset space-y-4 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {gameMode !== 'LOCAL_PASS' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Total Players
                    </label>
                    <div className="flex gap-1">
                      {[4, 5, 6, 7].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => { setTotalPlayers(num); playSfx('click'); }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            totalPlayers === num
                              ? 'neu-btn-primary'
                              : 'neu-btn text-slate-600'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Undercover Spies
                  </label>
                  <div className="flex gap-1">
                    {[1, 2].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => { setUndercoversCount(num); playSfx('click'); }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          undercoversCount === num
                            ? 'neu-btn-primary'
                            : 'neu-btn text-slate-600'
                        }`}
                      >
                        {num} {num === 1 ? 'Spy' : 'Spies'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Mr. White (No Word)
                  </label>
                  <div className="flex gap-1">
                    {[0, 1].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => { setMrWhitesCount(num); playSfx('click'); }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          mrWhitesCount === num
                            ? 'neu-btn-primary'
                            : 'neu-btn text-slate-600'
                        }`}
                      >
                        {num === 0 ? 'Off' : '1 Player'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Local Pass: Player Names List inside drawer */}
              {gameMode === 'LOCAL_PASS' && (
                <div className="pt-2 border-t border-slate-300/50 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">
                    Who's playing? ({localNames.length} friends)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPlayerInput}
                      onChange={(e) => setNewPlayerInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addLocalPlayer()}
                      placeholder="Add friend's name..."
                      className="flex-1 bg-white/70 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addLocalPlayer}
                      disabled={localNames.length >= 10 || !newPlayerInput.trim()}
                      className="px-3 py-1.5 neu-btn text-slate-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {localNames.map((name, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white/60 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 font-medium shadow-sm"
                      >
                        <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                        <span>{name}</span>
                        {localNames.length > 3 && (
                          <button onClick={() => removeLocalPlayer(idx)} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Solo AI Friendly note */}
              {gameMode === 'SOLO_AI' && (
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  You'll play against friendly AI bots with distinct personalities (Tech Geek, Foodie Critic, Hostel Senior, Sports Analyst, Cinema Star).
                </p>
              )}
            </div>
          )}
        </div>

        {/* Roles Distribution Badge */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-white/40 border border-white/60 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-600">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-blue-700 font-bold">👑 {civilianCount} Civilians</span>
            <span className="text-rose-600 font-bold">🕵️ {undercoversCount} Undercover</span>
            {mrWhitesCount > 0 && <span className="text-amber-700 font-bold">🎩 1 Mr. White</span>}
          </div>
          <span className="text-slate-500 font-bold text-[11px] shrink-0">
            {gameMode === 'LOCAL_PASS' ? localNames.length : totalPlayers} Players
          </span>
        </div>

        {/* Primary Tactile Start Button */}
        <div className="pt-1">
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 neu-btn-primary font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Preparing the game...</span>
            ) : (
              <>
                <Play size={16} className="fill-white" />
                <span>
                  {gameMode === 'ONLINE_ROOM' ? 'Create Room' : 'Start Game'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
