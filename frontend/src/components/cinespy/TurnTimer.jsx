import React, { useState, useEffect, useRef } from 'react';
import { Clock, Pause, Play, Plus, AlertCircle } from 'lucide-react';
import { playSfx } from '../../audioFx';

export default function TurnTimer({
  duration = 15,
  onExpire,
  active = true,
  speakerName = '',
  allowExtend = true
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Reset timer on speaker change or active reset
  useEffect(() => {
    setTimeLeft(duration);
    setIsPaused(false);
  }, [speakerName, duration, active]);

  useEffect(() => {
    if (!active || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onExpire) onExpire();
          return 0;
        }

        const next = prev - 1;
        // Sound effects
        if (next <= 5 && next > 0) {
          playSfx('heartbeat');
        } else if (next > 5) {
          playSfx('timer_tick');
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, isPaused, onExpire]);

  const handleExtend = () => {
    setTimeLeft((prev) => Math.min(prev + 10, 60));
    playSfx('click');
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
    playSfx('click');
  };

  const isCritical = timeLeft <= 5 && timeLeft > 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeLeft / duration));
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/70 border border-slate-200/90 shadow-sm select-none">
      {/* Left side: Circular SVG Progress Ring */}
      <div className="flex items-center gap-3">
        <div className={`relative w-12 h-12 flex items-center justify-center ${isCritical ? 'animate-pulse' : ''}`}>
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 60 60">
            {/* Background track */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              className={`transition-all duration-300 ease-linear ${
                isCritical
                  ? 'stroke-rose-600'
                  : timeLeft <= 8
                  ? 'stroke-amber-500'
                  : 'stroke-blue-600'
              }`}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time digits */}
          <span
            className={`absolute font-mono font-black text-sm tracking-tighter ${
              isCritical ? 'text-rose-600 font-extrabold' : 'text-slate-800'
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        {/* Status text */}
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isCritical
                  ? 'text-rose-600 flex items-center gap-1'
                  : 'text-slate-500'
              }`}
            >
              {isCritical ? (
                <>
                  <AlertCircle size={10} className="stroke-[2.5]" />
                  Hurry up!
                </>
              ) : (
                'Turn Timer'
              )}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">
            {speakerName ? `${speakerName}'s turn` : 'Thinking...'}
          </p>
        </div>
      </div>

      {/* Right side: Quick Tactical Controls */}
      <div className="flex items-center gap-1.5">
        {allowExtend && (
          <button
            type="button"
            onClick={handleExtend}
            className="neu-btn px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            title="Add 10 seconds"
          >
            <Plus size={12} className="stroke-[2.5]" />
            <span>10s</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleTogglePause}
          className="neu-btn p-1.5 text-slate-600 hover:text-slate-900"
          title={isPaused ? 'Resume timer' : 'Pause timer'}
        >
          {isPaused ? <Play size={13} className="fill-current" /> : <Pause size={13} className="fill-current" />}
        </button>
      </div>
    </div>
  );
}
