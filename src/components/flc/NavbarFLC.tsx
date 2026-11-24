import React from 'react';
import { Sliders, BookOpen, Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { soundFX } from '../../utils/audio';

interface NavbarFLCProps {
  currentProblemId: string;
  onSelectProblem: (id: string) => void;
  onLoadBenchmark: () => void;
  onReset: () => void;
  onToggleVerification: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NavbarFLC: React.FC<NavbarFLCProps> = ({
  currentProblemId,
  onSelectProblem,
  onLoadBenchmark,
  onReset,
  onToggleVerification,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                FuzzyCraft
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                Fuzzy Logic Controller
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Mamdani FLC Visualizer & Pedagogical Stepper
            </p>
          </div>
        </div>

        {/* Problem Picker (Tipping vs Washing Machine) */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              soundFX.click();
              onSelectProblem('tipping');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              currentProblemId === 'tipping'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🍽️ Restaurant Tipping</span>
          </button>

          <button
            onClick={() => {
              soundFX.click();
              onSelectProblem('washing');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              currentProblemId === 'washing'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🧺 Washing Machine</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.celebration();
              onLoadBenchmark();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-900/30 transition-all border border-emerald-400/30 cursor-pointer"
            title="Load textbook benchmark values (Service = 7.0, Food = 8.0)"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>Load Textbook Benchmark</span>
          </button>

          <button
            onClick={() => {
              soundFX.click();
              onToggleVerification();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 hover:border-amber-500/40 transition-all cursor-pointer"
            title="View Step-by-Step Textbook Hand Calculation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hand Calculations</span>
          </button>

          <button
            onClick={() => {
              soundFX.click();
              onReset();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Reset to default inputs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg transition-all border cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-800/50 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
