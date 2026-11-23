import type { ProblemConfig } from '../types/fuzzy';

export const PROBLEMS: Record<string, ProblemConfig> = {
  tipping: {
    id: 'tipping',
    title: 'Restaurant Gratuity / Tipping Controller',
    badge: 'Textbook Benchmark Problem',
    description:
      'The classic canonical Fuzzy Logic Controller benchmark problem (Timothy J. Ross, S.N. Sivanandam & S.N. Deepa). Maps non-linear human assessments of food and service quality to an appropriate gratuity tip percentage.',
    inputs: [
      {
        id: 'service',
        name: 'Service Quality',
        min: 0,
        max: 10,
        unit: '/ 10',
        step: 0.5,
        currentValue: 7.0,
        mfs: [
          {
            id: 'poor',
            name: 'Poor',
            type: 'trapezoidal',
            params: [0, 0, 1.5, 4.0],
            color: '#f43f5e', // Rose
          },
          {
            id: 'good',
            name: 'Good',
            type: 'triangular',
            params: [1.0, 5.0, 9.0],
            color: '#38bdf8', // Sky
          },
          {
            id: 'excellent',
            name: 'Excellent',
            type: 'trapezoidal',
            params: [6.0, 8.5, 10.0, 10.0],
            color: '#34d399', // Emerald
          },
        ],
      },
      {
        id: 'food',
        name: 'Food Quality',
        min: 0,
        max: 10,
        unit: '/ 10',
        step: 0.5,
        currentValue: 8.0,
        mfs: [
          {
            id: 'bad',
            name: 'Bad',
            type: 'trapezoidal',
            params: [0, 0, 1.0, 5.0],
            color: '#fb923c', // Orange
          },
          {
            id: 'delicious',
            name: 'Delicious',
            type: 'trapezoidal',
            params: [4.0, 8.0, 10.0, 10.0],
            color: '#a855f7', // Purple
          },
        ],
      },
    ],
    output: {
      id: 'tip',
      name: 'Tip Percentage',
      min: 0,
      max: 25,
      unit: '%',
      step: 0.1,
      currentValue: 16.8,
      mfs: [
        {
          id: 'low',
          name: 'Low Tip',
          type: 'triangular',
          params: [0, 5, 10],
          color: '#fb7185',
        },
        {
          id: 'medium',
          name: 'Medium Tip',
          type: 'triangular',
          params: [10, 15, 20],
          color: '#38bdf8',
        },
        {
          id: 'high',
          name: 'High Tip',
          type: 'triangular',
          params: [15, 20, 25],
          color: '#34d399',
        },
      ],
    },
    rules: [
      {
        id: 1,
        conditionText: 'IF Service is Poor OR Food is Bad',
        conclusionText: 'THEN Tip is Low',
        antecedents: [
          { varId: 'service', termId: 'poor' },
          { varId: 'food', termId: 'bad' },
        ],
        operator: 'OR',
        outputTermId: 'low',
        firingStrength: 0,
        isActive: false,
      },
      {
        id: 2,
        conditionText: 'IF Service is Good',
        conclusionText: 'THEN Tip is Medium',
        antecedents: [{ varId: 'service', termId: 'good' }],
        operator: 'AND',
        outputTermId: 'medium',
        firingStrength: 0,
        isActive: false,
      },
      {
        id: 3,
        conditionText: 'IF Service is Excellent OR Food is Delicious',
        conclusionText: 'THEN Tip is High',
        antecedents: [
          { varId: 'service', termId: 'excellent' },
          { varId: 'food', termId: 'delicious' },
        ],
        operator: 'OR',
        outputTermId: 'high',
        firingStrength: 0,
        isActive: false,
      },
    ],
    benchmark: {
      title: 'Canonical Tipping Hand-Calculation Benchmark',
      reference:
        'Timothy J. Ross, "Fuzzy Logic with Engineering Applications", Chapter 5; S.N. Sivanandam & S.N. Deepa, Chapter 7.',
      inputValues: { service: 7.0, food: 8.0 },
      expectedResult: 17.9,
      tolerance: 0.5,
      steps: [
        {
          stepName: 'Step 1: Fuzzification of Crisp Inputs',
          formula: '\\mu(x) \\in [0, 1]',
          explanation:
            'Service = 7.0 falls on Good (decreasing ramp: (9-7)/(9-5) = 0.50) and Excellent (rising ramp: (7-6)/(8.5-6) = 0.40). Food = 8.0 falls on Delicious (μ = 1.00).',
          numericalResult:
            'μ_Poor(7) = 0.00, μ_Good(7) = 0.50, μ_Excellent(7) = 0.40; μ_Bad(8) = 0.00, μ_Delicious(8) = 1.00',
        },
        {
          stepName: 'Step 2: Mamdani Rule Firing Strengths (α_k)',
          formula: '\\alpha_k = \\min / \\max(\\mu_{A}, \\mu_{B})',
          explanation:
            'Rule 1 (OR) = max(0.0, 0.0) = 0.00 (Inactive). Rule 2 = μ_Good = 0.50. Rule 3 (OR) = max(μ_Excellent, μ_Delicious) = max(0.40, 1.00) = 1.00.',
          numericalResult: 'α₁ = 0.00 (Low), α₂ = 0.50 (Medium), α₃ = 1.00 (High)',
        },
        {
          stepName: 'Step 3: Implication & Aggregation',
          formula: '\\mu_{agg}(z) = \\max_k [ \\min(\\alpha_k, \\mu_k(z)) ]',
          explanation:
            'Medium Tip triangle (10, 15, 20) is clipped at 0.50. High Tip triangle (15, 20, 25) is active at 1.00. The two clipped shapes are unioned via max.',
          numericalResult: 'Aggregated polygon spans z ∈ [10, 25]',
        },
        {
          stepName: 'Step 4: Defuzzification (Centroid Method)',
          formula: 'z^* = \\frac{\\int z \\cdot \\mu_{agg}(z) dz}{\\int \\mu_{agg}(z) dz} \\approx \\frac{\\sum z_i \\mu_i}{\\sum \\mu_i}',
          explanation:
            'Computing the center of gravity of the aggregated polygon balances mass toward the high tip region: numerator Σ(z·μ) = 1069.6, denominator Σμ = 59.7.',
          numericalResult: 'Calculated Crisp Tip = 17.9% (Exact Centroid COG = 17.92%)',
        },
      ],
    },
  },


};
