import React, { useState, useEffect } from 'react';
import { X, Swords, Plus, Trash2, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { playSfx } from '../../audioFx';
import { getApiBase } from '../../apiConfig';

const API_BASE = getApiBase();
const STORAGE_KEY = 'spyworld_custom_vs_pairs';

export default function CustomVsModal({ isOpen, onClose, onSelectVsPack }) {
  const [wordA, setWordA] = useState('');
  const [wordB, setWordB] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [savedPairs, setSavedPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Fetch saved VS pairs from backend & localStorage on modal open
  useEffect(() => {
    if (isOpen) {
      loadSavedPairs();
    }
  }, [isOpen]);

  const loadSavedPairs = async () => {
    try {
      const res = await fetch(`${API_BASE}/packs/custom-vs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSavedPairs(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return;
        }
      }
    } catch (err) {
      console.warn('Backend custom-vs fetch error, falling back to localStorage:', err);
    }

    // Fallback to localStorage
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        setSavedPairs(JSON.parse(local));
      } catch (e) {}
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Add single pair
  const handleAddSingle = async (e) => {
    e?.preventDefault();
    if (!wordA.trim() || !wordB.trim()) return;

    const newPair = {
      wordA: wordA.trim(),
      wordB: wordB.trim()
    };

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/packs/custom-vs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'CUSTOM_VS',
          pairs: [newPair]
        })
      });

      if (res.ok) {
        playSfx('click');
        setWordA('');
        setWordB('');
        showToast(`Added: "${newPair.wordA} vs ${newPair.wordB}"!`);
        await loadSavedPairs();
      }
    } catch (err) {
      console.error('Error saving single VS pair:', err);
      // Fallback local save
      const updated = [...savedPairs, { id: Date.now(), wordA: newPair.wordA, wordB: newPair.wordB }];
      setSavedPairs(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setWordA('');
      setWordB('');
      showToast(`Saved locally: "${newPair.wordA} vs ${newPair.wordB}"!`);
    } finally {
      setLoading(false);
    }
  };

  // Add bulk text using "vs" delimiter
  const handleAddBulk = async (e) => {
    e?.preventDefault();
    if (!bulkText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/packs/custom-vs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'CUSTOM_VS',
          rawText: bulkText.trim()
        })
      });

      if (res.ok) {
        const added = await res.json();
        playSfx('spy_reveal');
        setBulkText('');
        setIsBulkMode(false);
        showToast(`Successfully imported ${added.length} VS pairs!`);
        await loadSavedPairs();
      }
    } catch (err) {
      console.error('Error importing bulk VS pairs:', err);
      // Fallback parse locally
      const lines = bulkText.split('\n');
      const parsed = [];
      for (const line of lines) {
        const parts = line.split(/\s+(?:vs\.?|versus|\/)\s+/i);
        if (parts.length >= 2 && parts[0].trim() && parts[1].trim()) {
          parsed.push({
            id: Date.now() + Math.random(),
            wordA: parts[0].trim(),
            wordB: parts[1].trim()
          });
        }
      }
      if (parsed.length > 0) {
        const updated = [...savedPairs, ...parsed];
        setSavedPairs(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBulkText('');
        setIsBulkMode(false);
        showToast(`Saved ${parsed.length} pairs locally!`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePair = async (id, index) => {
    playSfx('click');
    try {
      if (id && typeof id === 'number') {
        await fetch(`${API_BASE}/packs/custom-vs/${id}`, { method: 'DELETE' });
      }
    } catch (e) {}

    const updated = savedPairs.filter((_, i) => i !== index);
    setSavedPairs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('Pair removed.');
  };

  const handleUsePack = () => {
    playSfx('bass_drop');
    if (onSelectVsPack) {
      onSelectVsPack(savedPairs.length);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="neu-card bg-[#e6ecf5] max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-card-sm flex items-center justify-center text-blue-600">
              <Swords size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Custom VS Word Pairs
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Create pairs by differentiating two words with "vs"
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

        {/* Notification Toast */}
        {notification && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 text-center animate-in fade-in duration-200">
            {notification}
          </div>
        )}

        {/* Mode Toggle: Single Pair vs Bulk Multi-Line */}
        <div className="flex items-center gap-2 p-1 neu-card-sm rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsBulkMode(false)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isBulkMode ? 'neu-inset text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Single Pair
          </button>
          <button
            type="button"
            onClick={() => setIsBulkMode(true)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isBulkMode ? 'neu-inset text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Bulk Paste with "vs"
          </button>
        </div>

        {/* Mode 1: Single Pair Form */}
        {!isBulkMode ? (
          <form onSubmit={handleAddSingle} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Civilian Word (A)
                </label>
                <input
                  type="text"
                  value={wordA}
                  onChange={(e) => setWordA(e.target.value)}
                  placeholder="e.g. Filter Coffee"
                  className="w-full neu-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium"
                />
              </div>

              <div className="px-2 py-1 rounded-xl bg-blue-100 text-blue-700 text-[11px] font-black shrink-0 sm:mt-5">
                VS
              </div>

              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Undercover Word (B)
                </label>
                <input
                  type="text"
                  value={wordB}
                  onChange={(e) => setWordB(e.target.value)}
                  placeholder="e.g. Masala Chai"
                  className="w-full neu-inset rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!wordA.trim() || !wordB.trim() || loading}
              className="w-full py-3 neu-btn font-bold text-xs text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Plus size={15} />
              <span>Add Pair ({wordA || 'Word A'} vs {wordB || 'Word B'})</span>
            </button>
          </form>
        ) : (
          /* Mode 2: Bulk Multi-Line Form */
          <form onSubmit={handleAddBulk} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Paste word pairs (separated by "vs", one per line):
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={5}
                placeholder={"Biryani vs Pulao\niPhone vs Android\nMarvel vs DC\nMessi vs Ronaldo\nTea vs Coffee"}
                className="w-full neu-inset rounded-xl p-3 text-xs text-slate-800 font-mono resize-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Supports: <code className="text-blue-600">Word A vs Word B</code>, <code className="text-blue-600">Item 1 VS Item 2</code>, or <code className="text-blue-600">A / B</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={!bulkText.trim() || loading}
              className="w-full py-3 neu-btn-primary font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Sparkles size={14} />
              <span>Import & Save All Pairs</span>
            </button>
          </form>
        )}

        {/* Saved Pairs List */}
        <div className="space-y-2 pt-2 border-t border-slate-300/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800">
              Saved VS Pairs ({savedPairs.length}):
            </span>
            <span className="text-[11px] text-slate-400">
              Persisted permanently in database
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {savedPairs.length === 0 ? (
              <div className="p-4 rounded-xl neu-inset text-center text-xs text-slate-400 italic">
                No custom pairs yet. Add your first "Word A vs Word B" pair above!
              </div>
            ) : (
              savedPairs.map((pair, idx) => (
                <div
                  key={pair.id || idx}
                  className="p-2.5 rounded-xl bg-white/60 border border-slate-200/80 flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-900 truncate">{pair.wordA}</span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                      VS
                    </span>
                    <span className="font-bold text-slate-700 truncate">{pair.wordB}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePair(pair.id, idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors shrink-0 ml-2"
                    title="Delete pair"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action: Select this pack for the game */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleUsePack}
            disabled={savedPairs.length === 0}
            className="w-full py-3.5 neu-btn-primary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Check size={16} />
            <span>Play With Custom VS Pack ({savedPairs.length} pairs)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
