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

