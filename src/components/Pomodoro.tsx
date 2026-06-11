import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

type Mode = 'work' | 'break';

export const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState<Mode>('work');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem('cisp_pomodoro');
    if (raw) {
      try {
        const o = JSON.parse(raw);
        setCompleted(o.completed || 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (mode === 'work') {
            setCompleted((c) => {
              const n = c + 1;
              localStorage.setItem('cisp_pomodoro', JSON.stringify({ completed: n }));
              return n;
            });
            setMode('break');
            setSeconds(5 * 60);
          } else {
            setMode('work');
            setSeconds(25 * 60);
          }
          try {
            const AudioCtx =
              (window as any).AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioCtx();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.frequency.value = 880;
            g.gain.value = 0.15;
            o.start();
            o.stop(ctx.currentTime + 0.2);
          } catch {}
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  const totalSec = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = ((totalSec - seconds) / totalSec) * 100;

  const reset = () => {
    setRunning(false);
    setSeconds(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const toggleMode = () => {
    setRunning(false);
    if (mode === 'work') {
      setMode('break');
      setSeconds(5 * 60);
    } else {
      setMode('work');
      setSeconds(25 * 60);
    }
  };

  return (
    <div className="p-5 rounded-lg bg-gradient-to-br from-cyber-purple/20 to-cyber-green/10 border border-cyber-purple/40">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white flex items-center gap-2">
          {mode === 'work' ? <Brain size={18} className="text-cyber-green" /> : <Coffee size={18} className="text-cyber-blue" />}
          番茄钟 · {mode === 'work' ? '专注学习' : '休息一下'}
        </span>
        <button
          onClick={toggleMode}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          切换
        </button>
      </div>

      <div className="text-center mb-4">
        <div
          className={`font-orbitron text-5xl font-bold ${
            mode === 'work' ? 'text-cyber-green' : 'text-cyber-blue'
          }`}
        >
          {mm}:{ss}
        </div>
        <div className="h-2 mt-4 rounded-full bg-cyber-purple/30 overflow-hidden">
          <div
            className={`h-full ${
              mode === 'work' ? 'bg-cyber-green' : 'bg-cyber-blue'
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
              transition: 'width 1s linear',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            running
              ? 'bg-cyber-gold/20 text-cyber-gold hover:bg-cyber-gold/30'
              : 'bg-cyber-green/20 text-cyber-green hover:bg-cyber-green/30'
          }`}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? '暂停' : '开始'}
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-cyber-purple/40 text-gray-300 text-sm hover:bg-cyber-purple/20 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyber-gold" />
        今日已完成 <span className="text-cyber-gold font-medium">{completed}</span> 个番茄
      </div>
    </div>
  );
};

export default Pomodoro;
