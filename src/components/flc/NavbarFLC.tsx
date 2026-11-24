import React from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw, Cpu, BookOpen } from 'lucide-react';
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
    <header className="bg-[#090b12]/90 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Cpu className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                FuzzyCraft
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Studio // FLC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Soft Computing Lab &bull; Mamdani Inference &bull; Ross & Sivanandam Verified
            </p>
          </div>
        </div>

        {/* Quick Section Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-400">
          <a href="#workbench" className="hover:text-amber-300 transition-colors">
            Workbench
          </a>
          <a href="#rules" className="hover:text-amber-300 transition-colors">
            Rule Base
          </a>
          <a href="#defuzzification" className="hover:text-amber-300 transition-colors">
            Defuzzification
          </a>
          <a href="#verification" className="hover:text-amber-300 transition-colors">
            Textbook Proof
          </a>
          <a href="#pid-comparison" className="hover:text-amber-300 transition-colors">
            PID vs Fuzzy
          </a>
          <a href="#quiz" className="hover:text-amber-300 transition-colors">
            Viva Prep
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Problem Selector Pills */}
          <div className="flex items-center gap-1 bg-[#121624] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundFX.click();
                onSelectProblem('tipping');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentProblemId === 'tipping'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🍽️ Restaurant Tipping
            </button>
            <button
              onClick={() => {
                soundFX.click();
                onSelectProblem('washing');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentProblemId === 'washing'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🧺 Washing Machine
            </button>
          </div>

          {/* 1-Click Textbook Benchmark Loader */}
          <button
            onClick={() => {
              soundFX.celebration();
              onLoadBenchmark();
            }}
            title="Load Timothy J. Ross Benchmark (Service=7.0, Food=8.0 -> Tip=17.9%)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 hover:from-amber-500/20 hover:to-emerald-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Textbook Benchmark</span>
          </button>

          {/* Textbook Proof Modal Trigger */}
          <button
            onClick={() => {
              soundFX.click();
              onToggleVerification();
            }}
            title="Open step-by-step textbook proof modal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141828] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Textbook Proof</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              soundFX.click();
              onReset();
            }}
            title="Reset parameters to initial state"
            className="p-1.5 rounded-lg bg-[#121624] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            className="p-1.5 rounded-lg bg-[#121624] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
