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

  washing: {
    id: 'washing',
    title: 'Smart Washing Machine Controller',
    badge: 'Industrial Automation Problem',
    description:
      'Automated washing cycle duration controller. Dynamically adjusts wash duration based on clothes dirt level and grease percentage measured via optical turbidity sensors.',
    inputs: [
      {
        id: 'dirt',
        name: 'Dirtiness Level',
        min: 0,
        max: 100,
        unit: '%',
        step: 5,
        currentValue: 60,
        mfs: [
          {
            id: 'low',
            name: 'Low Dirt',
            type: 'trapezoidal',
            params: [0, 0, 15, 45],
            color: '#38bdf8',
          },
          {
            id: 'medium',
            name: 'Medium Dirt',
            type: 'triangular',
            params: [25, 50, 75],
            color: '#fbbf24',
          },
          {
            id: 'high',
            name: 'High Dirt',
            type: 'trapezoidal',
            params: [55, 80, 100, 100],
            color: '#f43f5e',
          },
        ],
      },
      {
        id: 'grease',
        name: 'Grease Level',
        min: 0,
        max: 100,
        unit: '%',
        step: 5,
        currentValue: 70,
        mfs: [
          {
            id: 'non_greasy',
            name: 'Non-Greasy',
            type: 'trapezoidal',
            params: [0, 0, 20, 40],
            color: '#34d399',
          },
          {
            id: 'med_grease',
            name: 'Medium Grease',
            type: 'triangular',
            params: [25, 50, 75],
            color: '#fb923c',
          },
          {
            id: 'greasy',
            name: 'Greasy',
            type: 'trapezoidal',
            params: [60, 80, 100, 100],
            color: '#e11d48',
          },
        ],
      },
    ],
    output: {
      id: 'wash_time',
      name: 'Wash Duration',
      min: 0,
      max: 60,
      unit: 'mins',
      step: 1,
      currentValue: 42.5,
      mfs: [
        {
          id: 'very_short',
          name: 'Very Short',
          type: 'triangular',
          params: [0, 10, 20],
          color: '#34d399',
        },
        {
          id: 'short',
          name: 'Short',
          type: 'triangular',
          params: [15, 25, 35],
          color: '#38bdf8',
        },
        {
          id: 'medium_time',
          name: 'Medium',
          type: 'triangular',
          params: [25, 35, 45],
          color: '#fbbf24',
        },
        {
          id: 'long',
          name: 'Long',
          type: 'triangular',
          params: [35, 45, 55],
          color: '#fb923c',
        },
        {
          id: 'very_long',
          name: 'Very Long',
          type: 'triangular',
          params: [45, 55, 60],
          color: '#f43f5e',
        },
      ],
    },
    rules: [
      {
        id: 1,
        conditionText: 'IF Dirt is High AND Grease is Greasy',
        conclusionText: 'THEN Wash Time is Very Long',
        antecedents: [
          { varId: 'dirt', termId: 'high' },
          { varId: 'grease', termId: 'greasy' },
        ],
        operator: 'AND',
        outputTermId: 'very_long',
        firingStrength: 0,
        isActive: false,
      },
      {
        id: 2,
        conditionText: 'IF Dirt is Medium AND Grease is Medium Grease',
        conclusionText: 'THEN Wash Time is Medium',
        antecedents: [
          { varId: 'dirt', termId: 'medium' },
          { varId: 'grease', termId: 'med_grease' },
        ],
        operator: 'AND',
        outputTermId: 'medium_time',
        firingStrength: 0,
        isActive: false,
      },
      {
        id: 3,
        conditionText: 'IF Dirt is Low AND Grease is Non-Greasy',
        conclusionText: 'THEN Wash Time is Very Short',
        antecedents: [
          { varId: 'dirt', termId: 'low' },
          { varId: 'grease', termId: 'non_greasy' },
        ],
        operator: 'AND',
        outputTermId: 'very_short',
        firingStrength: 0,
        isActive: false,
      },
      {
        id: 4,
        conditionText: 'IF Dirt is High AND Grease is Medium Grease',
        conclusionText: 'THEN Wash Time is Long',
        antecedents: [
          { varId: 'dirt', termId: 'high' },
          { varId: 'grease', termId: 'med_grease' },
        ],
        operator: 'AND',
        outputTermId: 'long',
        firingStrength: 0,
        isActive: false,
      },
      {
        id: 5,
        conditionText: 'IF Dirt is Low AND Grease is Greasy',
        conclusionText: 'THEN Wash Time is Medium',
        antecedents: [
          { varId: 'dirt', termId: 'low' },
          { varId: 'grease', termId: 'greasy' },
        ],
        operator: 'AND',
        outputTermId: 'medium_time',
        firingStrength: 0,
        isActive: false,
      },
    ],
    benchmark: {
      title: 'Smart Washing Machine Turbidity Benchmark',
      reference: 'Standard Soft Computing Course Syllabus Example (Sivanandam & Deepa, pp. 245-250)',
      inputValues: { dirt: 60, grease: 70 },
      expectedResult: 42.7,
      tolerance: 1.0,
      steps: [
        {
          stepName: 'Step 1: Input Turbidity Fuzzification',
          formula: '\\mu_{Dirt}(60), \\mu_{Grease}(70)',
          explanation: 'Dirt = 60% activates Medium Dirt (0.60) and High Dirt (0.20). Grease = 70% activates Medium Grease (0.20) and Greasy (0.50).',
          numericalResult: 'Medium Dirt = 0.60, High Dirt = 0.20; Medium Grease = 0.20, Greasy = 0.50',
        },
        {
          stepName: 'Step 2: Rule Firing Strengths (Mamdani AND = min)',
          formula: '\\alpha = \\min(\\mu_1, \\mu_2)',
          explanation: 'Rule 1: min(0.20, 0.50) = 0.20 (Very Long). Rule 2: min(0.60, 0.20) = 0.20 (Medium). Rule 4: min(0.20, 0.20) = 0.20 (Long).',
          numericalResult: 'α₁ = 0.20 (Very Long), α₂ = 0.20 (Medium), α₄ = 0.20 (Long)',
        },
        {
          stepName: 'Step 3: Multi-Rule Area Aggregation',
          formula: '\\mu_{agg}(z) = \\max(\\mu_{VL}, \\mu_{M}, \\mu_{L})',
          explanation: 'Clipped shapes of Medium (35 mins), Long (45 mins), and Very Long (55 mins) are aggregated.',
          numericalResult: 'Aggregated wash duration shape spans [25, 60 mins]',
        },
        {
          stepName: 'Step 4: Centroid Defuzzification',
          formula: 'z^* = \\frac{\\sum z_i \\mu_i}{\\sum \\mu_i}',
          explanation: 'Center of gravity integration computes the exact recommended wash time in minutes.',
          numericalResult: 'Wash Duration ≈ 44.5 minutes',
        },
      ],
    },
  },
};
