import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Smartphone, Globe, Sparkles, ChevronDown, ChevronUp, 
  Play, Plus, Trash2, ArrowRight, Sliders, Users, Check, Swords, Film, Shield, Crown
} from 'lucide-react';
import { playSfx } from '../../audioFx';

const CINESPY_CATEGORIES = [
  { id: 'ALL_INDIAN_CINEMA', name: '🇮🇳 All Indian Cinema (Pan-India)', desc: 'Tollywood, Kollywood, Bollywood, Mollywood & Sandalwood (140+ pairs)', icon: '🎬' },
  { id: 'MOVIES_TELUGU', name: '🌶️ Telugu Cinema (Tollywood)', desc: 'Pokiri vs Businessman, Baahubali, Pushpa, Jersey, Athadu...', icon: '🎟️' },
  { id: 'MOVIES_TAMIL', name: '🦁 Tamil Cinema (Kollywood)', desc: 'Kaithi vs Vikram, Jailer vs Leo, Vikram Vedha, Master...', icon: '🎭' },
  { id: 'MOVIES_HINDI', name: '🌟 Hindi Cinema (Bollywood)', desc: 'Sholay vs Deewaar, 3 Idiots vs Dangal, DDLJ, Swades...', icon: '🎥' },
  { id: 'MOVIES_MALAYALAM', name: '🌴 Malayalam Cinema (Mollywood)', desc: 'Drishyam vs Memories, Lucifer, Premam, Manjummel Boys...', icon: '🍿' },
  { id: 'MOVIES_KANNADA', name: '⚔️ Kannada Cinema (Sandalwood)', desc: 'K.G.F Chapter 1 vs 2, Kantara, 777 Charlie, Lucia, Tagaru...', icon: '📽️' },
  { id: 'CUSTOM_VS', name: '⚔️ Custom VS Pairs (User Created)', desc: 'Play with your own Movie A vs Movie B custom pairs', icon: '⚔️' },
  { id: 'ALL_REAL_WORLD', name: '🎲 Surprise Mix (Movies & Real World)', desc: 'Massive non-repeating deck across movies, food, tech, campus', icon: '🎲' },
  { id: 'FOOD', name: '🍔 Food & Drinks (Bonus Deck)', desc: 'Biryani vs Pulao, Chai vs Coffee, Samosa vs Kachori...', icon: '🍔' },
  { id: 'TECH', name: '📱 Tech & Gadgets (Bonus Deck)', desc: 'iPhone vs Android, ChatGPT vs Gemini, Mac vs Windows...', icon: '📱' },
  { id: 'SPORTS', name: '🏏 Sports & Games (Bonus Deck)', desc: 'Cricket vs Football, Kohli vs Rohit, Messi vs Ronaldo...', icon: '🏏' }
];

const GAME_RULE_MODES = [
  { id: 'CLASSIC', name: 'Classic Mode', desc: 'Majority Normal + 1 Undercover. Pure social deduction.', icon: '🎬' },
  { id: 'MR_WHITE', name: 'Mr. White Mode', desc: 'Normal + 1 Undercover + 1 Mr. White (No movie, gets final guess).', icon: '🎩' },
  { id: 'DOUBLE_UNDERCOVER', name: 'Double Undercover', desc: 'Normal + 2 Undercovers working independently to survive.', icon: '🎭' },
  { id: 'RANDOM_SPY', name: 'Random Spy Mode', desc: 'System automatically balances special roles for player count.', icon: '🎲' }
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
  const [gameRuleMode, setGameRuleMode] = useState('CLASSIC'); // 'CLASSIC' | 'MR_WHITE' | 'DOUBLE_UNDERCOVER' | 'RANDOM_SPY'
  
  const [hostName, setHostName] = useState(() => {
    return localStorage.getItem('spyworld_player_name') || 'Agent 1';
  });
  const [packCategory, setPackCategory] = useState('ALL_INDIAN_CINEMA');
  const [movieDifficulty, setMovieDifficulty] = useState('EASY'); // 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'

  // Timers
  const [clueTimerSeconds, setClueTimerSeconds] = useState(30);
  const [discussionTimerSeconds, setDiscussionTimerSeconds] = useState(60);
  const [votingTimerSeconds, setVotingTimerSeconds] = useState(30);

  const handleNameChange = (val) => {
    setHostName(val);
    localStorage.setItem('spyworld_player_name', val);
  };
  
  // Dropdown states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  // Settings
  const [totalPlayers, setTotalPlayers] = useState(5);
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

  const selectedCategoryObj = CINESPY_CATEGORIES.find(c => c.id === packCategory) || CINESPY_CATEGORIES[0];

  const addLocalPlayer = () => {
    if (!newPlayerInput.trim() || localNames.length >= 20) return;
    setLocalNames([...localNames, newPlayerInput.trim()]);
    setNewPlayerInput('');
    playSfx('click');
  };

  const removeLocalPlayer = (idx) => {
    if (localNames.length <= 4) return;
    setLocalNames(localNames.filter((_, i) => i !== idx));
    playSfx('click');
  };

  // Determine role breakdown preview
  const currentTotal = gameMode === 'LOCAL_PASS' ? localNames.length : totalPlayers;
  let previewUndercovers = 1;
  let previewWhites = 0;

  if (gameRuleMode === 'MR_WHITE') {
    previewUndercovers = 1;
    previewWhites = 1;
  } else if (gameRuleMode === 'DOUBLE_UNDERCOVER') {
    previewUndercovers = 2;
    previewWhites = 0;
  } else if (gameRuleMode === 'RANDOM_SPY') {
    if (currentTotal <= 5) { previewUndercovers = 1; previewWhites = 0; }
    else if (currentTotal <= 8) { previewUndercovers = 1; previewWhites = 1; }
    else { previewUndercovers = 2; previewWhites = 1; }
  }

  const previewNormals = Math.max(1, currentTotal - previewUndercovers - previewWhites);

  const handleStart = () => {
    playSfx('bass_drop');
    onCreateRoom({
      gameMode,
      hostName: hostName.trim() || 'Agent 1',
      packCategory: customPackActive ? 'CUSTOM_AI' : packCategory,
      totalPlayers: currentTotal,
      gameRuleMode,
      movieLanguage: packCategory,
      movieDifficulty,
      clueTimerSeconds,
      discussionTimerSeconds,
      votingTimerSeconds,
      undercoversCount: previewUndercovers,
      mrWhitesCount: previewWhites,
      localPlayerNames: gameMode === 'LOCAL_PASS' ? localNames : null
    });
  };

  const handleJoin = () => {
    if (!joinCodeInput.trim()) return;
    playSfx('click');
    onJoinRoom(joinCodeInput.trim().toUpperCase(), hostName.trim() || 'Agent');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Friendly Cinematic Header */}
      <div className="text-center space-y-1.5 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold neu-card-sm text-blue-700">
          <span>🎬 Indian Cinema Social Deduction</span>
          <span className="text-slate-300">•</span>
          <span>4 to 20 Players</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          CineSpy 🕵️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
          Normal players get the same movie. The Undercover gets a related movie. Mr. White gets no movie! Can you deduce who is bluffing?
        </p>
      </div>

      {/* Mode Selector: Solo AI vs Pass & Play vs Online */}
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
          <span>Solo (vs AI)</span>
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

      {/* Primary Card */}
      <div className="neu-card p-5 sm:p-7 space-y-5">
        
        {/* Row 1: Player Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Your Agent Name</span>
            <span className="text-[10px] font-normal text-slate-400">Saved automatically</span>
          </label>
          <input
            type="text"
            value={hostName}
            maxLength={18}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full neu-input py-2.5 px-3.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Row 2: Indian Cinema Topic Selection */}
        <div className="space-y-1.5 relative" ref={dropdownRef}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Movie Topic / Language
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { playSfx('click'); onOpenCustomVsModal(); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
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
                {CINESPY_CATEGORIES.map((cat) => {
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

        {/* Row 3: Game Rule Mode (Section 32-35) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Game Mode Rules
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GAME_RULE_MODES.map((m) => {
              const active = gameRuleMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setGameRuleMode(m.id); playSfx('click'); }}
                  className={`p-2.5 rounded-xl text-left transition-all ${
                    active ? 'neu-inset text-blue-700' : 'neu-btn text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Role Distribution Preview (Section 6) */}
        <div className="p-3 rounded-xl neu-card-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Users size={14} className="text-blue-600" />
            <span>{currentTotal} Players:</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-blue-700">{previewNormals} Normal</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600">{previewUndercovers} Undercover</span>
            {previewWhites > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600">{previewWhites} Mr. White</span>
              </>
            )}
          </div>
        </div>

        {/* Online Room Code (if Online Mode) */}
        {gameMode === 'ONLINE_ROOM' && (
          <div className="pt-2 border-t border-slate-300/50 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Join an Existing Room Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="SPY-XXX"
                maxLength={7}
                className="flex-1 neu-input py-2.5 px-3.5 text-sm font-mono font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleJoin}
                disabled={loading || !joinCodeInput.trim()}
                className="neu-btn px-5 py-2.5 text-xs font-bold text-blue-700 disabled:opacity-50 flex items-center gap-1"
              >
                <span>Join</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Pass & Play Local Names (Section 9) */}
        {gameMode === 'LOCAL_PASS' && (
          <div className="space-y-2.5 pt-2 border-t border-slate-300/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Local Players ({localNames.length} of 4–20)
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">Min 4 &bull; Max 20</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
              {localNames.map((name, idx) => (
                <div
                  key={idx}
                  className="neu-card-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 animate-in fade-in"
                >
                  <span>{name}</span>
                  {localNames.length > 4 && (
                    <button
                      type="button"
                      onClick={() => removeLocalPlayer(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove player"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {localNames.length < 20 && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPlayerInput}
                  maxLength={16}
                  onChange={(e) => setNewPlayerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLocalPlayer()}
                  placeholder="Add friend's name..."
                  className="flex-1 neu-input py-2 px-3 text-xs font-medium text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addLocalPlayer}
                  className="neu-btn px-3 py-2 text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Advanced Settings Accordion (Section 36) */}
        <div className="pt-2 border-t border-slate-300/50">
          <button
            type="button"
            onClick={() => { setSettingsExpanded(!settingsExpanded); playSfx('click'); }}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sliders size={13} />
              <span>Advanced Timers & Settings</span>
            </span>
            {settingsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {settingsExpanded && (
            <div className="pt-3 space-y-4 animate-in fade-in duration-200">
              {/* Player Count Slider (Solo AI or Online) */}
              {gameMode !== 'LOCAL_PASS' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Total Players (Min 4, Max 20)</span>
                    <span className="font-bold text-blue-700">{totalPlayers}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={totalPlayers}
                    onChange={(e) => setTotalPlayers(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Clue Timer (Section 16) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Clue Timer per Player</span>
                  <span className="font-bold text-blue-700">{clueTimerSeconds}s</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 30, 45, 60].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setClueTimerSeconds(t)}
                      className={`py-1.5 text-xs font-bold rounded-lg ${
                        clueTimerSeconds === t ? 'neu-inset text-blue-700' : 'neu-btn text-slate-600'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussion Timer (Section 17) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Discussion Timer</span>
                  <span className="font-bold text-blue-700">{discussionTimerSeconds}s</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 60, 90, 120].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDiscussionTimerSeconds(t)}
                      className={`py-1.5 text-xs font-bold rounded-lg ${
                        discussionTimerSeconds === t ? 'neu-inset text-blue-700' : 'neu-btn text-slate-600'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Movie Difficulty (Section 37) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Movie Difficulty</span>
                  <span className="font-bold text-blue-700">{movieDifficulty}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {['EASY', 'MEDIUM', 'HARD', 'EXPERT'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setMovieDifficulty(d)}
                      className={`py-1.5 text-[11px] font-bold rounded-lg ${
                        movieDifficulty === d ? 'neu-inset text-blue-700' : 'neu-btn text-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="w-full neu-btn py-3.5 px-4 text-sm font-extrabold text-blue-700 flex items-center justify-center gap-2 hover:text-blue-800 disabled:opacity-50"
        >
          <Play size={18} className="fill-current" />
          <span>
            {gameMode === 'ONLINE_ROOM'
              ? 'Create Online Room & Start'
              : gameMode === 'LOCAL_PASS'
              ? 'Start Pass & Play Match'
              : 'Start Match (vs AI)'}
          </span>
        </button>
      </div>
    </div>
  );
}
