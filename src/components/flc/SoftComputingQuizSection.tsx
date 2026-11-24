import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { soundFX } from '../../utils/audio';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Why does the Mamdani inference engine evaluate the linguistic "AND" connector using the fuzzy minimum operator (min)?',
    options: [
      'Because minimum represents the standard Zadeh intersection (T-norm) where truth cannot exceed the weakest antecedent constraint.',
      'Because minimum is faster to compute on microcontrollers than multiplication.',
      'Because minimum eliminates all active rules that have low membership.',
      'Because classical Boolean logic requires taking the minimum of truth values.'
    ],
    correct: 0,
    explanation: 'In fuzzy set theory formulated by Lotfi A. Zadeh, the intersection of two fuzzy sets A and B is defined by the standard T-norm: μ_{A ∩ B}(x) = min(μ_A(x), μ_B(x)). The compound truth degree of an AND condition is limited by its most restrictive antecedent.'
  },
  {
    id: 2,
    question: 'What is the primary architectural difference between a Mamdani Fuzzy System and a Takagi-Sugeno (TSK) Fuzzy System?',
    options: [
      'Mamdani uses Boolean crisp rules while Sugeno uses fuzzy rules.',
      'Mamdani consequents are fuzzy sets requiring defuzzification, whereas Sugeno consequents are mathematical functions or crisp constants.',
      'Mamdani only supports two input variables, while Sugeno supports infinite inputs.',
      'Mamdani does not require membership functions.'
    ],
    correct: 1,
    explanation: 'In Mamdani systems, the rule consequents are linguistic fuzzy sets (e.g., "Tip is High") that must be aggregated and defuzzified. In Takagi-Sugeno-Kang (TSK) systems, the consequent is a crisp polynomial function z = p0 + p1*x1 + p2*x2 (or a constant singleton), eliminating the need for geometric integration.'
  },
  {
    id: 3,
    question: 'Why is the Centroid (Center of Gravity - COG) method preferred over Mean of Maximum (MOM) in real-world industrial controllers?',
    options: [
      'Centroid produces smoother, continuous control outputs without sudden discrete step-jumps when input variables change gradually.',
      'Centroid requires less computational memory than MOM.',
      'MOM only works for triangular membership functions.',
      'Centroid always equals 50% of the maximum domain range.'
    ],
    correct: 0,
    explanation: 'The Centroid (COG) method takes into account the entire geometric area and shape of the aggregated fuzzy output set. This produces smooth, continuous control responses. In contrast, MOM can exhibit sudden abrupt discontinuities (jumps) when the dominant peak shifts between disjoint output sets.'
  },
  {
    id: 4,
    question: 'In standard Zadeh fuzzy logic, if μ_A(x) = 0.70, what is the value of the fuzzy complement μ_{NOT A}(x)?',
    options: [
      '0.00 (Boolean false)',
      '0.30 (1.00 - 0.70)',
      '0.70 (law of excluded middle)',
      '1.00 (fully true)'
    ],
    correct: 1,
    explanation: 'According to Zadeh\'s standard fuzzy complement operation (negation), the membership grade of NOT A is: μ_{~A}(x) = 1 - μ_A(x) = 1.00 - 0.70 = 0.30.'
  }
];

export const SoftComputingQuizSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (submitted) return;
    soundFX.click();
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleGrade = () => {
    soundFX.celebration();
    setSubmitted(true);
  };

  const handleReset = () => {
    soundFX.click();
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, optIdx]) => {
    const q = QUESTIONS.find((item) => item.id === Number(qId));
    return q && q.correct === optIdx ? acc + 1 : acc;
  }, 0);

  return (
    <section id="quiz" className="scroll-mt-20 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              Soft Computing Viva &amp; Exam Practice Lab
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800/40">
                Self-Assessment
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive conceptual check on Zadeh fuzzy sets, Mamdani implications, and defuzzification theory
            </p>
          </div>
        </div>

        {/* Score Badge */}
        {submitted && (
          <div className="flex items-center gap-2 bg-[#121624] px-4 py-2 rounded-xl border border-violet-500/40">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              Score: <span className="text-emerald-400 font-mono text-sm">{score} / {QUESTIONS.length}</span> ({((score / QUESTIONS.length) * 100).toFixed(0)}%)
            </span>
          </div>
        )}
      </div>

      {/* Quiz Grid */}
      <div className="space-y-4">
        {QUESTIONS.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correct;

          return (
            <div
              key={q.id}
              className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  Q{qIndex + 1}
                </span>
                <h4 className="font-semibold text-sm text-slate-100 leading-snug">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-[#0a0d16] border-slate-800 hover:border-slate-700 text-slate-300';

                  if (userChoice === optIdx && !submitted) {
                    btnStyle = 'bg-violet-950/80 border-violet-500 text-violet-200 font-semibold';
                  }

                  if (submitted) {
                    if (optIdx === q.correct) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (userChoice === optIdx && !isCorrect) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                    } else {
                      btnStyle = 'bg-[#0a0d16] border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400 shrink-0">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submitted && (
                <div
                  className={`mt-3 p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      : 'bg-red-950/40 border-red-500/30 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" /> Incorrect (Correct is {String.fromCharCode(65 + q.correct)})
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 text-[11px] font-sans">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400 font-mono">
          {Object.keys(selectedAnswers).length} of {QUESTIONS.length} questions answered
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121624] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
          </button>

          {!submitted ? (
            <button
              onClick={handleGrade}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Submit &amp; View Answers
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Practice Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
