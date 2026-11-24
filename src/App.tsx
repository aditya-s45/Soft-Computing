import { useState, useEffect, useRef, useMemo } from 'react';
import { NavbarFLC } from './components/flc/NavbarFLC';
import { StepperBar, PHASES } from './components/flc/StepperBar';
import { MFCanvas } from './components/flc/MFCanvas';
import { RuleMatrix } from './components/flc/RuleMatrix';
import { DefuzzCanvas } from './components/flc/DefuzzCanvas';
import { PlainExplainerFLC } from './components/flc/PlainExplainerFLC';
import { TextbookVerificationSection } from './components/flc/TextbookVerificationSection';
import { PidVsFuzzySection } from './components/flc/PidVsFuzzySection';
import { TheoryGlossarySection } from './components/flc/TheoryGlossarySection';
import { TextbookVerificationModal } from './components/flc/TextbookVerificationModal';

import { PROBLEMS } from './core/problemConfigs';
import { computeFuzzyAggregation, defuzzify } from './core/fuzzyMath';
import type { DefuzzMethod, FLCPhase, FuzzyVariable } from './types/fuzzy';
import { soundFX } from './utils/audio';
import { ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
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

      {/* Main Scrollable Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#121626] to-[#0c0f1a] border border-slate-800/90 p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 relative z-10">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              B.Tech Soft Computing Lab Suite
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Hand-Verified Parity
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs">
              Course Code: CS-401
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3 relative z-10 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Precision Fuzzy Logic Controller{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                &amp; Mamdani Inference Studio
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              An interactive, step-by-step educational platform bridging human heuristic intuition with continuous mathematical control. Featuring real-time fuzzification, Mamdani implication clipping, max-union aggregation, and continuous Center of Gravity (COG) numerical integration.
            </p>
          </div>

          {/* Problem Overview Cards in Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 pt-2">
            {/* Card 1: Restaurant Tipping */}
            <div
              onClick={() => handleSelectProblem('tipping')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                problemId === 'tipping'
                  ? 'bg-[#181d2f] border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-[#0f121d] border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  🍽️ Restaurant Gratuity Benchmark
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Ross Ch. 5
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Classic canonical problem. Maps service quality [0, 10] and food quality [0, 10] to an appropriate tip percentage [0, 25%] using 3 nonlinear rules.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800">
                <span>Benchmark: Service=7.0, Food=8.0</span>
                <span className="text-amber-400 font-bold">&rarr; Tip: 17.9%</span>
              </div>
            </div>

            {/* Card 2: Washing Machine */}
            <div
              onClick={() => handleSelectProblem('washing')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                problemId === 'washing'
                  ? 'bg-[#181d2f] border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-[#0f121d] border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  🧺 Smart Washing Machine Controller
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Sivanandam Ch. 7
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Embedded automation controller. Evaluates fabric dirtiness [0, 100%] and grease [0, 100%] to optimize cycle wash time [0, 60 mins] across 5 multi-condition rules.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800">
                <span>Benchmark: Dirt=60%, Grease=70%</span>
                <span className="text-emerald-400 font-bold">&rarr; Wash: 42.7 mins</span>
              </div>
            </div>
          </div>

          {/* Quick Jump Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-200 font-semibold">Active Model:</span>
              <span className="font-mono text-amber-300 font-bold">{problemConfig.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLoadBenchmark}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Textbook Benchmark
              </button>
              <a
                href="#workbench"
                className="px-4 py-2 rounded-xl bg-[#181d2f] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                Go to Simulator <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ==================== 5-PHASE ALGORITHM STEPPER ==================== */}
        <section className="relative z-20 pt-1">
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
        </section>

        {/* ==================== SECTION 1: SIMULATOR WORKBENCH ==================== */}
        <section id="workbench" className="scroll-mt-28 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                01
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Interactive Crisp Inputs &amp; Fuzzification</h3>
                <p className="text-xs text-slate-400">
                  Scrub sliders or drag vertical indicator lines directly on the canvas to inspect membership degrees &mu;(x)
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {inputVars.length} Input Dimensions
            </span>
          </div>

          {/* Input Canvases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputVars.map((v) => (
              <MFCanvas
                key={v.id}
                variable={v}
                onChangeValue={(newVal) => handleUpdateInputValue(v.id, newVal)}
                highlighted={currentPhase === 'INPUTS' || currentPhase === 'FUZZIFICATION'}
              />
            ))}
          </div>
        </section>

        {/* ==================== SECTION 2: MAMDANI RULES & INFERENCE ==================== */}
        <section id="rules" className="scroll-mt-28 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                02
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mamdani Knowledge Base &amp; Implication Matrix</h3>
                <p className="text-xs text-slate-400">
                  Visual rule evaluation using Zadeh's min-intersection for compound conditions and consequent clipping
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              {activeRules.filter((r) => r.isActive).length} Active Rules Firing
            </span>
          </div>

          <RuleMatrix
            rules={activeRules}
            inputs={inputVars}
            highlighted={currentPhase === 'INFERENCE'}
          />
        </section>

        {/* ==================== SECTION 3: DEFUZZIFICATION LAB ==================== */}
        <section id="defuzzification" className="scroll-mt-28 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
                03
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Aggregation Surface &amp; Centroid Defuzzification</h3>
                <p className="text-xs text-slate-400">
                  Fuzzy union &mu;_agg(z) = max(&mu;_1, &mu;_2, ...) and continuous center-of-gravity integration
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40 font-bold">
              z* = {crispValue} {problemConfig.output.unit}
            </span>
          </div>

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
        </section>

        {/* ==================== STEP EXPLAINER ==================== */}
        <PlainExplainerFLC
          phase={currentPhase}
          crispValue={crispValue}
          outputUnit={problemConfig.output.unit}
        />

        {/* ==================== SECTION 4: TEXTBOOK VERIFICATION LAB ==================== */}
        <TextbookVerificationSection
          problem={problemConfig}
          currentSimulatorOutput={crispValue}
        />

        {/* ==================== SECTION 5: PID VS FUZZY BENCHMARK ==================== */}
        <PidVsFuzzySection />

        {/* ==================== SECTION 6: THEORY & REFERENCES ==================== */}
        <TheoryGlossarySection />
      </main>

      {/* Modal for 1-Click Verification Inspection */}
      <TextbookVerificationModal
        problem={problemConfig}
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        currentSimulatorOutput={crispValue}
      />

      {/* ==================== PROFESSIONAL ACADEMIC FOOTER ==================== */}
      <footer className="bg-[#090b12] border-t border-slate-800/90 text-slate-400 py-10 px-4 sm:px-6 text-xs mt-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="font-extrabold text-base text-slate-200 tracking-tight flex items-center gap-2">
                <span>FuzzyCraft Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v2.0 Clean Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                B.Tech Computer Science &bull; Subject: Soft Computing (CS-401) &bull; Topic: Fuzzy Logic Controller (FLC). Hand-checked against Timothy J. Ross and S.N. Sivanandam.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <a
                href="https://github.com/aditya-s45/Soft-Computing"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
              >
                GitHub Repository &rarr;
              </a>
              <span>&bull;</span>
              <a
                href="https://aditya-s45.github.io/Soft-Computing/"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                GitHub Pages Live App &rarr;
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              Designed &amp; Developed for Academic Evaluation &bull; Open-Source MIT License
            </div>
            <div className="flex items-center gap-3">
              <span>Client-Side Engine</span>
              <span>&bull;</span>
              <span>Zero External Backend</span>
              <span>&bull;</span>
              <span className="text-slate-400 font-semibold">Ready for Viva &amp; Demo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
