import React from 'react';
import { GitBranch, CheckCircle2, XCircle } from 'lucide-react';
import type { FuzzyRule, FuzzyVariable } from '../../types/fuzzy';
import { evaluateMF } from '../../core/fuzzyMath';

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
      className={`bg-slate-900 border rounded-2xl p-4 shadow-lg space-y-3 transition-all ${
        highlighted ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-sm text-white">
            Mamdani Rule Base & Firing Evaluation
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Operator: Min (AND) / Max (OR)
        </span>
      </div>

      <div className="space-y-2.5">
        {rules.map((rule) => {
          // Compute antecedent μ values for transparency
          const antecedentMUs = rule.antecedents.map((ant) => {
            const v = inputs.find((inp) => inp.id === ant.varId);
            const mf = v?.mfs.find((m) => m.id === ant.termId);
            const mu = v && mf ? evaluateMF(v.currentValue, mf) : 0;
            return {
              varName: v?.name || ant.varId,
              termName: mf?.name || ant.termId,
              mu,
            };
          });

          return (
            <div
              key={rule.id}
              className={`p-3 rounded-xl border transition-all text-xs ${
                rule.isActive
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/20'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              {/* Rule Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center text-[10px] font-mono">
                    R{rule.id}
                  </span>
                  <span>{rule.conditionText}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {rule.isActive ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fired
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Antecedent Calculations breakdown */}
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800/60 mb-2 flex flex-wrap items-center gap-2">
                <span>Calculation:</span>
                {antecedentMUs.map((ant, idx) => (
                  <span key={idx} className="text-slate-300">
                    μ({ant.termName}) = <strong className="text-cyan-300">{ant.mu.toFixed(2)}</strong>
                    {idx < antecedentMUs.length - 1 && (
                      <span className="text-amber-400 font-bold mx-1.5">{rule.operator}</span>
                    )}
                  </span>
                ))}
                <span className="ml-auto font-bold text-amber-300">
                  → Firing Strength α_{rule.id} = {rule.firingStrength.toFixed(2)}
                </span>
              </div>

              {/* Consequent Implication */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-indigo-300 font-semibold">{rule.conclusionText}</span>
                <span className="text-slate-400">
                  {rule.isActive
                    ? `Clips output shape at height α = ${rule.firingStrength.toFixed(2)}`
                    : 'No contribution'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Firing strength visual clipping bar
