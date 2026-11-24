import React, { useRef, useEffect } from 'react';
import { Target, Scale } from 'lucide-react';
import type { FuzzyVariable, DefuzzMethod } from '../../types/fuzzy';
import type { SamplePoint } from '../../core/fuzzyMath';

interface DefuzzCanvasProps {
  outputVar: FuzzyVariable;
  samples: SamplePoint[];
  crispValue: number;
  numerator?: number;
  denominator?: number;
  defuzzMethod: DefuzzMethod;
  onChangeMethod: (m: DefuzzMethod) => void;
  highlighted?: boolean;
}

export const DefuzzCanvas: React.FC<DefuzzCanvasProps> = ({
  outputVar,
  samples,
  crispValue,
  numerator,
  denominator,
  defuzzMethod,
  onChangeMethod,
  highlighted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || samples.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 25, right: 30, bottom: 35, left: 40 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Clear
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let mu = 0; mu <= 1.0; mu += 0.5) {
      const y = padding.top + plotH - mu * plotH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(mu.toFixed(1), 12, y + 3);
    }

    const toPxX = (val: number) => {
      const norm = (val - outputVar.min) / (outputVar.max - outputVar.min);
      return padding.left + norm * plotW;
    };

    const toPxY = (mu: number) => {
      return padding.top + plotH - mu * plotH;
    };

    // Draw Unclipped Outlines of Output MFs in background
    outputVar.mfs.forEach((mf) => {
      ctx.beginPath();
      const points = 80;
      for (let i = 0; i <= points; i++) {
        const val = outputVar.min + (i / points) * (outputVar.max - outputVar.min);
        // Find raw unclipped mu
        let rawMu = 0;
        if (mf.type === 'triangular') {
          const [a, b, c] = mf.params;
          if (val > a && val <= b) rawMu = (val - a) / (b - a);
          else if (val > b && val < c) rawMu = (c - val) / (c - b);
          else if (val === b) rawMu = 1;
        }
        const px = toPxX(val);
        const py = toPxY(rawMu);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      const peakX = mf.params[1];
      ctx.fillStyle = '#64748b';
      ctx.font = '10px system-ui';
      ctx.fillText(mf.name, toPxX(peakX) - 10, padding.top - 8);
    });

    // Draw Aggregated Filled Area
    ctx.beginPath();
    ctx.moveTo(toPxX(samples[0].x), toPxY(0));
    samples.forEach((s) => {
      ctx.lineTo(toPxX(s.x), toPxY(s.mu));
    });
    ctx.lineTo(toPxX(samples[samples.length - 1].x), toPxY(0));
    ctx.closePath();

    // Gradient fill for aggregated fuzzy area
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw Centroid / Defuzzified Crisp Line
    const cx = toPxX(crispValue);
    ctx.beginPath();
    ctx.moveTo(cx, padding.top - 12);
    ctx.lineTo(cx, height - padding.bottom);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center of gravity marker balance triangle
    ctx.beginPath();
    ctx.moveTo(cx, height - padding.bottom);
    ctx.lineTo(cx - 7, height - padding.bottom + 12);
    ctx.lineTo(cx + 7, height - padding.bottom + 12);
    ctx.closePath();
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    // Crisp text badge above line
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${crispValue} ${outputVar.unit}`, cx - 18, padding.top - 14);

    // X-axis baseline & Ticks
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const tickVal = outputVar.min + (i / tickCount) * (outputVar.max - outputVar.min);
      const tx = toPxX(tickVal);
      ctx.fillText(`${tickVal.toFixed(1)}${outputVar.unit}`, tx - 12, height - 12);
    }
  }, [outputVar, samples, crispValue]);

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-4 shadow-lg space-y-3 transition-all ${
        highlighted ? 'border-rose-400 ring-1 ring-rose-400/50' : 'border-slate-800'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-400" />
          <div>
            <h4 className="font-bold text-sm text-white">
              Aggregated Fuzzy Output & Defuzzification
            </h4>
            <span className="text-[11px] text-slate-400">
              Center of Gravity Integration balances the composite shape
            </span>
          </div>
        </div>

        {/* Crisp Output Callout */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Crisp Controller Output
            </span>
            <span className="text-xl font-mono font-extrabold text-rose-400">
              {crispValue} {outputVar.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={560}
          height={200}
          className="w-full max-w-[560px] h-[200px] block"
        />
      </div>

      {/* Defuzzification Method Selector & Mathematical Fraction */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-slate-400" /> Method:
          </span>
          <select
            value={defuzzMethod}
            onChange={(e) => onChangeMethod(e.target.value as DefuzzMethod)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold cursor-pointer"
          >
            <option value="centroid">Centroid (Center of Gravity / COG)</option>
            <option value="bisector">Bisector of Area (BOA)</option>
            <option value="mom">Mean of Maximum (MOM)</option>
          </select>
        </div>

        {defuzzMethod === 'centroid' && numerator !== undefined && denominator !== undefined && (
          <div className="font-mono text-[11px] text-slate-300 bg-slate-950 p-1.5 px-3 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">z* =</span>
            <span>Σ(z·μ) / Σμ =</span>
            <span className="text-cyan-300">{numerator.toFixed(1)}</span>
            <span>/</span>
            <span className="text-purple-300">{denominator.toFixed(1)}</span>
            <span>=</span>
            <strong className="text-rose-400 font-bold">{crispValue}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

// Dynamic balance fulcrum and centroid indicator
