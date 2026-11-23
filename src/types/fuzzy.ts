export type MFType = 'triangular' | 'trapezoidal';

export interface MembershipFunction {
  id: string;
  name: string;
  type: MFType;
  params: number[]; // [a, b, c] for triangular; [a, b, c, d] for trapezoidal
  color: string;
}

export interface FuzzyVariable {
  id: string;
  name: string;
  min: number;
  max: number;
  unit: string;
  step: number;
  currentValue: number;
  mfs: MembershipFunction[];
}

export interface RuleAntecedent {
  varId: string;
  termId: string;
}

export interface FuzzyRule {
  id: number;
  conditionText: string;
  conclusionText: string;
  antecedents: RuleAntecedent[];
  operator: 'AND' | 'OR';
  outputTermId: string;
  firingStrength: number;
  isActive: boolean;
}

export type DefuzzMethod = 'centroid' | 'bisector' | 'mom';

export type FLCPhase = 
  | 'INPUTS' 
  | 'FUZZIFICATION' 
  | 'INFERENCE' 
  | 'AGGREGATION' 
  | 'DEFUZZIFICATION';

export interface HandCalculationStep {
  stepName: string;
  formula: string;
  explanation: string;
  numericalResult: string;
}

export interface TextbookBenchmark {
  title: string;
  reference: string;
  inputValues: Record<string, number>;
  expectedResult: number;
  tolerance: number;
  steps: HandCalculationStep[];
}

export interface ProblemConfig {
  id: string;
  title: string;
  badge: string;
  description: string;
  inputs: FuzzyVariable[];
  output: FuzzyVariable;
  rules: FuzzyRule[];
  benchmark: TextbookBenchmark;
}
