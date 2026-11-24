import { useState, useEffect, useRef, useMemo } from 'react';
import { NavbarFLC } from './components/flc/NavbarFLC';
import { StepperBar, PHASES } from './components/flc/StepperBar';
import { MFCanvas } from './components/flc/MFCanvas';
import { RuleMatrix } from './components/flc/RuleMatrix';
import { DefuzzCanvas } from './components/flc/DefuzzCanvas';
import { PlainExplainerFLC } from './components/flc/PlainExplainerFLC';
import { TextbookVerificationModal } from './components/flc/TextbookVerificationModal';

import { PROBLEMS } from './core/problemConfigs';
import { computeFuzzyAggregation, defuzzify } from './core/fuzzyMath';
import type { DefuzzMethod, FLCPhase, FuzzyVariable } from './types/fuzzy';
import { soundFX } from './utils/audio';

export function App() {
  const [problemId, setProblemId] = useState<string>('tipping');
  const problemConfig = PROBLEMS[problemId] || PROBLEMS.tipping;

  // Working inputs state
  const [inputVars, setInputVars] = useState<FuzzyVariable[]>(() =>
    JSON.parse(JSON.stringify(problemConfig.inputs))
  );

  const [defuzzMethod, setDefuzzMethod] = useState<DefuzzMethod>('centroid');
  const [currentPhase, setCurrentPhase] = useState<FLCPhase>('INPUTS');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1500);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Switch problem
  const handleSelectProblem = (id: string) => {
    setIsPlaying(false);
    setProblemId(id);
    const newConfig = PROBLEMS[id];
    setInputVars(JSON.parse(JSON.stringify(newConfig.inputs)));
    setCurrentPhase('INPUTS');
  };

  // Update a single input variable
  const handleUpdateInputValue = (varId: string, val: number) => {
    soundFX.click();
    setInputVars((prev) =>
      prev.map((v) => (v.id === varId ? { ...v, currentValue: val } : v))
    );
  };

  // Load Textbook Benchmark (Service = 7.0, Food = 8.0)
  const handleLoadBenchmark = () => {
    setIsPlaying(false);
    setProblemId('tipping');
    const benchmarkInputs = PROBLEMS.tipping.benchmark.inputValues;
    setInputVars(
      PROBLEMS.tipping.inputs.map((v) => ({
        ...v,
        currentValue: benchmarkInputs[v.id] ?? v.currentValue,
      }))
    );
    setCurrentPhase('DEFUZZIFICATION');
    setShowVerificationModal(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setInputVars(JSON.parse(JSON.stringify(problemConfig.inputs)));
    setCurrentPhase('INPUTS');
  };

  // Compute fuzzy aggregation & defuzzification live
  const { samples, activeRules } = useMemo(() => {
    return computeFuzzyAggregation(problemConfig.output, problemConfig.rules, inputVars, 200);
  }, [problemConfig.output, problemConfig.rules, inputVars]);

  const { crispValue, numerator, denominator } = useMemo(() => {
    return defuzzify(samples, defuzzMethod, problemConfig.output.min);
  }, [samples, defuzzMethod, problemConfig.output.min]);

  // Stepper functions
  const handleStepNext = () => {
    const idx = PHASES.findIndex((p) => p.id === currentPhase);
    if (idx < PHASES.length - 1) {
      setCurrentPhase(PHASES[idx + 1].id);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepPrev = () => {
    const idx = PHASES.findIndex((p) => p.id === currentPhase);
    if (idx > 0) {
      setCurrentPhase(PHASES[idx - 1].id);
    }
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentPhase((prev) => {
          const idx = PHASES.findIndex((p) => p.id === prev);
          if (idx < PHASES.length - 1) {
            soundFX.generation();
            return PHASES[idx + 1].id;
          } else {
            soundFX.celebration();
            setIsPlaying(false);
            return PHASES[0].id;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <NavbarFLC
        currentProblemId={problemId}
        onSelectProblem={handleSelectProblem}
        onLoadBenchmark={handleLoadBenchmark}
        onReset={handleReset}
        onToggleVerification={() => setShowVerificationModal(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          soundFX.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Problem Description Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white">{problemConfig.title}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {problemConfig.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              {problemConfig.description}
            </p>
          </div>

          <button
            onClick={() => setShowVerificationModal(true)}
            className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline decoration-amber-500/50 underline-offset-4 cursor-pointer"
          >
            Check Textbook Proof →
          </button>
        </div>

        {/* 5-Step Process Stepper & Playback Dock */}
        <StepperBar
          currentPhase={currentPhase}
          onSetPhase={setCurrentPhase}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onStepNext={handleStepNext}
          onStepPrev={handleStepPrev}
          onReset={handleReset}
          speed={speed}
          onChangeSpeed={setSpeed}
        />

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Input Sliders & Fuzzification Curves */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-200">
                1. Crisp Inputs & Fuzzification Curves
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {inputVars.length} Input Variables
              </span>
            </div>

            {inputVars.map((v) => (
              <MFCanvas
                key={v.id}
                variable={v}
                onChangeValue={(newVal) => handleUpdateInputValue(v.id, newVal)}
                highlighted={currentPhase === 'INPUTS' || currentPhase === 'FUZZIFICATION'}
              />
            ))}
          </div>

          {/* Right Column: Rule Inference & Defuzzification Output */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-200">
                2. Mamdani Inference & Crisp Defuzzification
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {problemConfig.rules.length} Linguistic Rules
              </span>
            </div>

            {/* Rule Matrix */}
            <RuleMatrix
              rules={activeRules}
              inputs={inputVars}
              highlighted={currentPhase === 'INFERENCE'}
            />

            {/* Defuzzification Output Graph */}
            <DefuzzCanvas
              outputVar={problemConfig.output}
              samples={samples}
              crispValue={crispValue}
              numerator={numerator}
              denominator={denominator}
              defuzzMethod={defuzzMethod}
              onChangeMethod={setDefuzzMethod}
              highlighted={currentPhase === 'AGGREGATION' || currentPhase === 'DEFUZZIFICATION'}
            />
          </div>
        </div>

        {/* Plain-Language Step Explainer */}
        <PlainExplainerFLC
          phase={currentPhase}
          crispValue={crispValue}
          outputUnit={problemConfig.output.unit}
        />
      </main>

      {/* Textbook Verification Modal */}
      <TextbookVerificationModal
        problem={problemConfig}
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        currentSimulatorOutput={crispValue}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-slate-200">
              FuzzyCraft: Fuzzy Logic Controller Educational Tool
            </div>
            <p className="text-[11px] text-slate-400">
              Subject: Soft Computing (CS-401) • Topic: Fuzzy Logic Controller (FLC) • Textbook
              Benchmark: Timothy J. Ross & S.N. Sivanandam
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Clean & Intuitive Interface</span>
            <span>•</span>
            <span>Ready for GitHub & Vercel</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">100% Verified Math</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
