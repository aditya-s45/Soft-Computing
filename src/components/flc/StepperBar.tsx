import React from 'react';
import { Play, Pause, StepForward, StepBack, RotateCcw, Gauge } from 'lucide-react';
import type { FLCPhase } from '../../types/fuzzy';
import { soundFX } from '../../utils/audio';

interface StepperBarProps {
  currentPhase: FLCPhase;
  onSetPhase: (phase: FLCPhase) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (s: number) => void;
}

export const PHASES: Array<{
  id: FLCPhase;
  num: number;
  label: string;
  sub: string;
}> = [
  { id: 'INPUTS', num: 1, label: '1. Crisp Inputs', sub: 'Read values' },
  { id: 'FUZZIFICATION', num: 2, label: '2. Fuzzification', sub: 'Compute μ(x)' },
  { id: 'INFERENCE', num: 3, label: '3. Mamdani Rules', sub: 'Clip shapes (α)' },
  { id: 'AGGREGATION', num: 4, label: '4. Aggregation', sub: 'Union output areas' },
  { id: 'DEFUZZIFICATION', num: 5, label: '5. Defuzzification', sub: 'Center of Gravity' },
];

export const StepperBar: React.FC<StepperBarProps> = ({
  currentPhase,
  onSetPhase,
  isPlaying,
  onTogglePlay,
  onStepNext,
  onStepPrev,
  onReset,
  speed,
  onChangeSpeed,
}) => {
  const activeIndex = PHASES.findIndex((p) => p.id === currentPhase);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-3">
      {/* 5-Step Process Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PHASES.map((p, idx) => {
          const isActive = p.id === currentPhase;
          const isPassed = activeIndex > idx;

          return (
            <button
              key={p.id}
              onClick={() => {
                soundFX.click();
                onSetPhase(p.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50 scale-[1.02]'
                  : isPassed
                  ? 'bg-slate-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold block">{p.label}</span>
                {isPassed && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">{p.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Playback Controls & Speed Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.click();
              onTogglePlay();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>AUTO PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundFX.click();
              onStepPrev();
            }}
            disabled={activeIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Step to previous phase"
          >
            <StepBack className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => {
              soundFX.click();
              onStepNext();
            }}
            disabled={activeIndex === PHASES.length - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Step to next phase"
          >
            <span>Next</span>
            <StepForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundFX.click();
              onReset();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Step Interval:</span>
            <input
              type="range"
              min="500"
              max="2500"
              step="250"
              value={3000 - speed} // Invert: right is faster
              onChange={(e) => onChangeSpeed(3000 - Number(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            <span className="text-xs font-mono font-bold text-cyan-300 w-12">
              {(speed / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
