import React from 'react';
import type { FuzzyRule, FuzzyVariable } from '../../types/fuzzy';
import { evaluateMF } from '../../core/fuzzyMath';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface RuleMatrixProps {
  rules: FuzzyRule[];
  inputs: FuzzyVariable[];
  highlighted?: boolean;
}

export const RuleMatrix: React.FC<RuleMatrixProps> = ({
  rules,
  inputs,
  highlighted = false,
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 p-5 ${
        highlighted
          ? 'bg-[#111422] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10'
          : 'bg-[#0f121d] border border-slate-800/80 shadow-lg'
      }`}
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">
              Mamdani Rule Base & Implication Matrix
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Fuzzy Conjunction: min (AND) / max (OR) &bull; Consequence Clipping: min(&alpha;, &mu;)
            </span>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
          {rules.filter((r) => r.isActive).length} / {rules.length} Firing
        </span>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => {
          const isActive = rule.isActive;
          const alpha = rule.firingStrength ?? 0;

          return (
            <div
              key={rule.id}
              className={`rounded-xl border p-3.5 transition-all duration-200 ${
                isActive
                  ? 'bg-[#14192b] border-emerald-500/40 shadow-md shadow-emerald-950/30'
                  : 'bg-[#0c0f17] border-slate-900/80 opacity-55 hover:opacity-75'
              }`}
            >
              {/* Header: Rule ID & Firing Tag */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-extrabold ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    R{rule.id}
                  </span>
                  <span className="text-xs font-bold text-slate-200 tracking-tight">
                    Rule #{rule.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Fires at &alpha; = {alpha.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md">
                      Inactive (&alpha; = 0)
                    </span>
                  )}
                </div>
              </div>

              {/* Antecedents -> Consequent Circuit */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* IF Antecedents */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#090b12] px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    IF
                  </span>
                  {rule.antecedents.map((ant, idx) => {
                    const variable = inputs.find((v) => v.id === ant.varId);
                    const mf = variable?.mfs.find((m) => m.id === ant.termId);
                    const mu = variable && mf ? evaluateMF(variable.currentValue, mf) : 0;

                    return (
                      <React.Fragment key={ant.varId + ant.termId}>
                        {idx > 0 && (
                          <span className="text-[10px] font-mono font-extrabold px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {rule.operator}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="text-slate-300 font-medium">{variable?.name}:</span>
                          <span
                            className="font-semibold underline decoration-dotted underline-offset-2"
                            style={{ color: mf?.color || '#cbd5e1' }}
                          >
                            {mf?.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            (&mu;={mu.toFixed(2)})
                          </span>
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Arrow */}
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                {/* THEN Consequent */}
                <div className="flex items-center gap-1.5 bg-[#090b12] px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    THEN
                  </span>
                  <span className="font-semibold text-emerald-300 capitalize">
                    {rule.outputTermId.replace('_', ' ')}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      Clip at {alpha.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Firing Strength Meter Bar */}
              {isActive && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-3">
                  <div className="text-[10px] font-mono text-slate-400 shrink-0">
                    Firing Strength:
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300 rounded-full"
                      style={{ width: `${alpha * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-300">
                    {(alpha * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
