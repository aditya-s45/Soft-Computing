import React from 'react';
import { BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';

export const TheoryGlossarySection: React.FC = () => {
  return (
    <section id="theory" className="scroll-mt-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            Mathematical Foundations &amp; Literature References
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              CS-401 Soft Computing
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Formulations for membership geometry, T-norm implication, and defuzzification integrals
          </p>
        </div>
      </div>

      {/* 3-Column Theory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Membership Geometry */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>1. Membership Geometry</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuous mapping from crisp universe of discourse X to truth interval [0, 1]:
          </p>
          <div className="p-3 rounded-xl bg-[#0a0d16] border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-2">
            <div>
              <span className="text-amber-400 font-bold">Triangular(x; a, b, c):</span>
              <div className="text-slate-400 pl-2">
                &mu;(x) = max(min((x-a)/(b-a), (c-x)/(c-b)), 0)
              </div>
            </div>
            <div>
              <span className="text-amber-400 font-bold">Trapezoidal(x; a, b, c, d):</span>
              <div className="text-slate-400 pl-2">
                &mu;(x) = max(min((x-a)/(b-a), 1, (d-x)/(d-c)), 0)
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Zadeh Logic Operations */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Terminal className="w-4 h-4" />
            <span>2. Zadeh's T-Norm &amp; S-Norm</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Compound logic evaluation over fuzzy truth grades:
          </p>
          <div className="p-3 rounded-xl bg-[#0a0d16] border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-2">
            <div>
              <span className="text-emerald-400 font-bold">Fuzzy AND (T-Norm):</span>
              <div className="text-slate-400 pl-2">&mu;_(A &cap; B)(x) = min(&mu;_A(x), &mu;_B(x))</div>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">Fuzzy OR (S-Norm):</span>
              <div className="text-slate-400 pl-2">&mu;_(A &cup; B)(x) = max(&mu;_A(x), &mu;_B(x))</div>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">Fuzzy NOT (Complement):</span>
              <div className="text-slate-400 pl-2">&mu;_(~A)(x) = 1 - &mu;_A(x)</div>
            </div>
          </div>
        </div>

        {/* Card 3: Defuzzification Methods */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>3. Defuzzification Taxonomy</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Converting aggregated fuzzy subset &mu;_agg(z) into actionable crisp control signal z*:
          </p>
          <div className="p-3 rounded-xl bg-[#0a0d16] border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-2">
            <div>
              <span className="text-violet-400 font-bold">Centroid (COG):</span>
              <div className="text-slate-400 pl-2">z* = &int; z&bull;&mu;(z) dz / &int; &mu;(z) dz</div>
            </div>
            <div>
              <span className="text-violet-400 font-bold">Bisector of Area (BOA):</span>
              <div className="text-slate-400 pl-2">Area(z &le; z*) = Area(z &ge; z*)</div>
            </div>
            <div>
              <span className="text-violet-400 font-bold">Mean of Maxima (MOM):</span>
              <div className="text-slate-400 pl-2">z* = (1 / |M|) &sum; z for z &isin; M</div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Citation References */}
      <div className="p-4 rounded-xl bg-[#0a0d16] border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="font-bold text-slate-200">Recommended Soft Computing Course Textbooks:</div>
        <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-400">
          <li>Timothy J. Ross, <em>Fuzzy Logic with Engineering Applications</em>, 3rd Edition, John Wiley &amp; Sons, Ch. 5 (Fuzzy Rule-Based Systems).</li>
          <li>S.N. Sivanandam, S. Sumathi, S.N. Deepa, <em>Introduction to Fuzzy Logic using MATLAB</em> &amp; <em>Principles of Soft Computing</em>, Springer, Ch. 7.</li>
          <li>George J. Klir &amp; Bo Yuan, <em>Fuzzy Sets and Fuzzy Logic: Theory and Applications</em>, Prentice Hall.</li>
        </ul>
      </div>
    </section>
  );
};
