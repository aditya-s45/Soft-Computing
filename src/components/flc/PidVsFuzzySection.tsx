import React from 'react';
import { Cpu, Check, X } from 'lucide-react';

export const PidVsFuzzySection: React.FC = () => {
  return (
    <section id="pid-comparison" className="scroll-mt-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            Engineering Benchmark: Classical PID vs Fuzzy Logic
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40">
              Control Theory Analysis
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Why Soft Computing fuzzy heuristics excel where classical differential control loops struggle
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classical PID Card */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <h4 className="font-bold text-base text-slate-200">Classical PID Controller</h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
              u(t) = Kp&bull;e + Ki&int;e + Kd&bull;de/dt
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Conventional control relying on linear differential equations and exact transfer functions of the plant.
          </p>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Requires Exact Mathematical Model:</strong> Plant transfer function must be analytically derived (differential equations).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Fails on High Non-Linearities:</strong> Sensitive to parameter drift, saturation, and actuator lag.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">No Human Knowledge Integration:</strong> Expert operator heuristics cannot be translated directly into gain constants (Kp, Ki, Kd).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Simple Linear Plants:</strong> Computationally lightweight and effective for ideal, linear steady-state mechanisms.
              </span>
            </li>
          </ul>
        </div>

        {/* Fuzzy Logic Controller Card */}
        <div className="bg-[#121626] border-2 border-emerald-500/40 rounded-2xl p-6 shadow-xl shadow-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <h4 className="font-bold text-base text-white">Fuzzy Logic Controller (FLC)</h4>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
              Soft Computing Paradigm
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Rule-based model-free controller that mimics human cognitive decision-making using linguistic IF-THEN rules.
          </p>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Model-Free Architecture:</strong> Operates directly without needing complex differential plant transfer functions.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Smooth Non-Linear Interpolation:</strong> Overlapping membership functions provide natural continuous interpolation across operating regions.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Linguistic Expert Heuristics:</strong> Human expert rules (<em className="text-amber-300">"IF Dirt is High THEN Wash is Long"</em>) map directly into controller actions.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">High Noise &amp; Imprecision Tolerance:</strong> Partial truth values [0, 1] gracefully absorb sensor noise and vague measurements.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
