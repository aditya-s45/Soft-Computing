import React from 'react';
import { Lightbulb, Info } from 'lucide-react';
import type { FLCPhase } from '../../types/fuzzy';
import { MathView } from '../MathView';

interface PlainExplainerFLCProps {
  phase: FLCPhase;
  crispValue: number;
  outputUnit: string;
}

const PHASE_DETAILS: Record<
  FLCPhase,
  {
    title: string;
    narrative: string;
    formula: string;
  }
> = {
  INPUTS: {
    title: 'Phase 1: Crisp Real-World Inputs',
    narrative:
      'The controller receives exact numerical measurements from user input sliders or sensors. In classical Boolean logic, inputs must be strict 0 or 1, but fuzzy logic allows continuous degrees of truth across physical domains.',
    formula: 'X = \\{ x_1, x_2, \\dots, x_n \\}',
  },
  FUZZIFICATION: {
    title: 'Phase 2: Fuzzification (Membership Evaluation)',
    narrative:
      'Crisp inputs are mapped onto linguistic fuzzy sets (e.g. "Poor", "Good", "Excellent") via triangular and trapezoidal membership functions. Each function produces a membership grade μ ∈ [0, 1] representing the degree of truth.',
    formula: '\\mu_A(x): X \\to [0, 1]',
  },
  INFERENCE: {
    title: 'Phase 3: Mamdani Fuzzy Rule Inference',
    narrative:
      'The fuzzy engine evaluates the IF-THEN linguistic rule base. Fuzzy AND computes minimum (Zadeh t-norm), while fuzzy OR computes maximum (s-norm). The resulting firing strength α_k clips the corresponding output fuzzy set.',
    formula: '\\alpha_k = \\min(\\mu_A(x_1), \\mu_B(x_2)), \\quad \\mu_{clipped}(z) = \\min(\\alpha_k, \\mu_{out}(z))',
  },
  AGGREGATION: {
    title: 'Phase 4: Rule Aggregation (Fuzzy Union)',
    narrative:
      'All clipped output fuzzy sets from every active rule are combined into a single unified geometric area using the fuzzy MAX operator (union). This composite polygon contains the collective wisdom of all firing rules.',
    formula: '\\mu_{agg}(z) = \\max_{k} [ \\mu_{clipped, k}(z) ]',
  },
  DEFUZZIFICATION: {
    title: 'Phase 5: Defuzzification (Center of Gravity / COG)',
    narrative:
      'The aggregated fuzzy shape is transformed back into a single actionable crisp control output. The Centroid method calculates the physical center of mass (balance point) of the polygon.',
    formula: 'z^* = \\frac{\\int z \\cdot \\mu_{agg}(z) dz}{\\int \\mu_{agg}(z) dz} \\approx \\frac{\\sum z_i \\cdot \\mu_{agg}(z_i)}{\\sum \\mu_{agg}(z_i)}',
  },
};

export const PlainExplainerFLC: React.FC<PlainExplainerFLCProps> = ({
  phase,
  crispValue,
  outputUnit,
}) => {
  const info = PHASE_DETAILS[phase];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
            Algorithmic Stepper Commentary (Plain-Language Explanation)
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
          Current Output: {crispValue} {outputUnit}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{info.title}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">{info.narrative}</p>

        {/* Formula Box */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            Governing Math Formulation:
          </span>
          <div className="font-mono text-xs text-cyan-200">
            <MathView math={info.formula} />
          </div>
        </div>
      </div>
    </div>
  );
};
