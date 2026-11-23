import type { MembershipFunction, FuzzyVariable, FuzzyRule, DefuzzMethod } from '../types/fuzzy';

// Evaluates a triangular membership function with params [a, b, c]
export function evaluateTriangular(x: number, [a, b, c]: number[]): number {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  if (x > b && x < c) return (c - x) / (c - b);
  return 0;
}

// Evaluates a trapezoidal membership function with params [a, b, c, d]
export function evaluateTrapezoidal(x: number, [a, b, c, d]: number[]): number {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  if (x > c && x < d) return (d - x) / (d - c);
  return 0;
}

// Universal evaluator for any MF
export function evaluateMF(x: number, mf: MembershipFunction): number {
  if (mf.type === 'triangular') {
    return evaluateTriangular(x, mf.params);
  }
  return evaluateTrapezoidal(x, mf.params);
}

// Evaluates rule firing strength using Mamdani min (AND) / max (OR)
export function evaluateRuleFiring(rule: FuzzyRule, inputs: FuzzyVariable[]): number {
  const muValues: number[] = [];

  for (const ant of rule.antecedents) {
    const inputVar = inputs.find((v) => v.id === ant.varId);
    if (!inputVar) continue;

    const mf = inputVar.mfs.find((m) => m.id === ant.termId);
    if (!mf) continue;

    const mu = evaluateMF(inputVar.currentValue, mf);
    muValues.push(mu);
  }

  if (muValues.length === 0) return 0;

  if (rule.operator === 'AND') {
    return Math.min(...muValues);
  } else {
    return Math.max(...muValues);
  }
}

export interface SamplePoint {
  x: number;
  mu: number;
  ruleCuts: Record<number, number>; // ruleId -> clipped mu at this x
}

// Discretize output variable domain and compute Mamdani min-clipping & max-aggregation
export function computeFuzzyAggregation(
  outputVar: FuzzyVariable,
  rules: FuzzyRule[],
  inputs: FuzzyVariable[],
  numSamples: number = 200
): { samples: SamplePoint[]; activeRules: FuzzyRule[] } {
  // 1. Evaluate all rules
  const evaluatedRules = rules.map((r) => {
    const alpha = evaluateRuleFiring(r, inputs);
    return {
      ...r,
      firingStrength: Number(alpha.toFixed(3)),
      isActive: alpha > 0,
    };
  });

  // 2. Discretize output domain
  const samples: SamplePoint[] = [];
  const step = (outputVar.max - outputVar.min) / (numSamples - 1);

  for (let i = 0; i < numSamples; i++) {
    const x = outputVar.min + i * step;
    const ruleCuts: Record<number, number> = {};
    let aggMu = 0;

    for (const rule of evaluatedRules) {
      if (!rule.isActive) {
        ruleCuts[rule.id] = 0;
        continue;
      }

      const mf = outputVar.mfs.find((m) => m.id === rule.outputTermId);
      if (!mf) continue;

      const rawMu = evaluateMF(x, mf);
      // Mamdani min-implication: clip shape at rule firing strength alpha
      const clippedMu = Math.min(rule.firingStrength, rawMu);
      ruleCuts[rule.id] = clippedMu;

      // Aggregation: fuzzy union (max)
      aggMu = Math.max(aggMu, clippedMu);
    }

    samples.push({
      x: Number(x.toFixed(2)),
      mu: Number(aggMu.toFixed(4)),
      ruleCuts,
    });
  }

  return { samples, activeRules: evaluatedRules };
}

// Defuzzification: Centroid (COG), Bisector, and Mean of Maxima (MOM)
export function defuzzify(
  samples: SamplePoint[],
  method: DefuzzMethod = 'centroid',
  defaultFallback: number = 0
): { crispValue: number; numerator?: number; denominator?: number } {
  if (samples.length === 0) return { crispValue: defaultFallback };

  const sumMu = samples.reduce((acc, s) => acc + s.mu, 0);

  // If no rule fired, return midpoint
  if (sumMu <= 0.0001) {
    const mid = (samples[0].x + samples[samples.length - 1].x) / 2;
    return { crispValue: Number(mid.toFixed(2)), numerator: 0, denominator: 0 };
  }

  if (method === 'centroid') {
    // Center of Gravity: z* = Σ(z_i * μ_i) / Σ(μ_i)
    const sumWeighted = samples.reduce((acc, s) => acc + s.x * s.mu, 0);
    const cog = sumWeighted / sumMu;
    return {
      crispValue: Number(cog.toFixed(2)),
      numerator: Number(sumWeighted.toFixed(2)),
      denominator: Number(sumMu.toFixed(2)),
    };
  }


  return { crispValue: Number(cog.toFixed(2)) };
}
