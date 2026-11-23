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

