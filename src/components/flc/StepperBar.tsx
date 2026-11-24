import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Clock } from 'lucide-react';
import type { FLCPhase } from '../../types/fuzzy';
import { soundFX } from '../../utils/audio';

export interface PhaseInfo {
  id: FLCPhase;
  number: string;
  label: string;
  subtitle: string;
}

export const PHASES: PhaseInfo[] = [
  { id: 'INPUTS', number: '01', label: 'Inputs', subtitle: 'Sample crisp values' },
  { id: 'FUZZIFICATION', number: '02', label: 'Fuzzification', subtitle: 'Compute grades μ(x)' },
  { id: 'INFERENCE', number: '03', label: 'Mamdani Rules', subtitle: 'Evaluate firing α_k' },
  { id: 'AGGREGATION', number: '04', label: 'Aggregation', subtitle: 'Max-union surface' },
  { id: 'DEFUZZIFICATION', number: '05', label: 'Defuzzification', subtitle: 'Centroid z* output' },
];

interface StepperBarProps {
  currentPhase: FLCPhase;
  onSetPhase: (p: FLCPhase) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (s: number) => void;
}

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
  const currentIdx = PHASES.findIndex((p) => p.id === currentPhase);

  return (
    <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* 5-Phase Horizontal Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PHASES.map((p, idx) => {
          const isActive = p.id === currentPhase;
          const isPassed = idx < currentIdx;

          return (
            <button
              key={p.id}
              onClick={() => {
                soundFX.click();
                onSetPhase(p.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-[#181d2f] border-amber-500 shadow-lg shadow-amber-500/10'
                  : isPassed
                  ? 'bg-[#111422] border-emerald-500/30 text-slate-300 hover:border-slate-700'
                  : 'bg-[#0a0d16] border-slate-900 text-slate-500 hover:border-slate-800'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-amber-500 text-slate-950'
                      : isPassed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : 'bg-slate-900 text-slate-600'
                  }`}
                >
                  {p.number}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <div
                className={`font-bold text-xs ${
                  isActive ? 'text-amber-200' : isPassed ? 'text-slate-200' : 'text-slate-400'
                }`}
              >
                {p.label}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">{p.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Stepper Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => {
              soundFX.click();
              onStepPrev();
            }}
            disabled={currentIdx === 0}
            className="p-2 rounded-xl bg-[#161a29] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none border border-slate-700/50 text-slate-200 transition-colors cursor-pointer"
            title="Step Backwards"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => {
              soundFX.click();
              onTogglePlay();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Auto-Step
              </>
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => {
              soundFX.click();
              onStepNext();
            }}
            disabled={currentIdx === PHASES.length - 1}
            className="p-2 rounded-xl bg-[#161a29] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none border border-slate-700/50 text-slate-200 transition-colors cursor-pointer"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              soundFX.click();
              onReset();
            }}
            className="p-2 rounded-xl bg-[#161a29] hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to Phase 01"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Phase Status Readout */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span>Current Stage:</span>
            <span className="font-bold text-amber-300">
              {PHASES[currentIdx].label} ({currentIdx + 1}/5)
            </span>
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-2 bg-[#121524] px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-mono">Speed:</span>
            <input
              type="range"
              min={600}
              max={3000}
              step={200}
              value={speed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] font-mono text-slate-400">{speed}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
