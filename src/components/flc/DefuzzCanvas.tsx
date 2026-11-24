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
    const padding = { top: 28, right: 30, bottom: 38, left: 42 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Clear background
    ctx.fillStyle = '#0a0d16';
    ctx.fillRect(0, 0, width, height);

    // Subtle technical grid
    ctx.strokeStyle = '#181e30';
    ctx.lineWidth = 1;
    for (let mu = 0; mu <= 1.0; mu += 0.25) {
      const y = padding.top + plotH - mu * plotH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = mu === 1.0 || mu === 0 ? '#94a3b8' : '#475569';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(mu.toFixed(2), 8, y + 3);
    }

    const toPxX = (val: number) => {
      const norm = (val - outputVar.min) / (outputVar.max - outputVar.min);
      return padding.left + norm * plotW;
    };

    const toPxY = (mu: number) => {
      return padding.top + plotH - mu * plotH;
    };

    // 1. Draw raw unclipped output membership sets (subtle reference lines)
    outputVar.mfs.forEach((mf) => {
      ctx.beginPath();
      const numPts = 80;
      for (let i = 0; i <= numPts; i++) {
        const xVal = outputVar.min + (i / numPts) * (outputVar.max - outputVar.min);
        // evaluate raw
        let rawMu = 0;
        if (mf.type === 'triangular') {
          const [a, b, c] = mf.params;
          if (xVal > a && xVal < b) rawMu = (xVal - a) / (b - a);
          else if (xVal >= b && xVal < c) rawMu = (c - xVal) / (c - b);
          else if (xVal === b) rawMu = 1;
        } else {
          const [a, b, c, d] = mf.params;
          if (xVal > a && xVal < b) rawMu = (xVal - a) / (b - a);
          else if (xVal >= b && xVal <= c) rawMu = 1;
          else if (xVal > c && xVal < d) rawMu = (d - xVal) / (d - c);
        }

        const px = toPxX(xVal);
        const py = toPxY(rawMu);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `${mf.color}40`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 2. Draw Mamdani max-aggregated polygon surface
    ctx.beginPath();
    ctx.moveTo(toPxX(samples[0].x), toPxY(0));

    samples.forEach((pt) => {
      ctx.lineTo(toPxX(pt.x), toPxY(pt.mu));
    });

    ctx.lineTo(toPxX(samples[samples.length - 1].x), toPxY(0));
    ctx.closePath();

    // Vibrant gradient fill (Amber to Emerald)
    const gradient = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
    gradient.addColorStop(0, 'rgba(244, 63, 94, 0.35)'); // Rose
    gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)'); // Amber
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.45)'); // Emerald
    ctx.fillStyle = gradient;
    ctx.fill();

    // Outline of aggregated surface
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Draw Defuzzified Crisp Output Needle (z*)
    const defuzzPx = toPxX(crispValue);

    ctx.beginPath();
    ctx.moveTo(defuzzPx, padding.top - 14);
    ctx.lineTo(defuzzPx, height - padding.bottom);
    ctx.strokeStyle = '#ef4444'; // Bright Red/Crimson Laser
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Glow halo on laser line
    ctx.beginPath();
    ctx.moveTo(defuzzPx, padding.top - 14);
    ctx.lineTo(defuzzPx, height - padding.bottom);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Fulcrum balance triangle at base
    ctx.beginPath();
    ctx.moveTo(defuzzPx, height - padding.bottom);
    ctx.lineTo(defuzzPx - 8, height - padding.bottom + 12);
    ctx.lineTo(defuzzPx + 8, height - padding.bottom + 12);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Value badge above laser needle
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(defuzzPx - 28, padding.top - 24, 56, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`z*=${crispValue}`, defuzzPx, padding.top - 11);
    ctx.textAlign = 'left';

    // 4. X-axis baseline & Ticks
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    const tickCount = 6;
    for (let i = 0; i <= tickCount; i++) {
      const tickVal = outputVar.min + (i / tickCount) * (outputVar.max - outputVar.min);
      const tx = toPxX(tickVal);
      ctx.fillText(tickVal.toFixed(0), tx - 6, height - 12);
    }
  }, [outputVar, samples, crispValue]);

  return (
    <div
      className={`rounded-2xl transition-all duration-300 p-5 ${
        highlighted
          ? 'bg-[#111422] border-2 border-red-500/50 shadow-2xl shadow-red-500/10'
          : 'bg-[#0f121d] border border-slate-800/80 shadow-lg'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">
              Aggregated Surface & Defuzzification (z*)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Union of Clipped Consequents: &mu;_agg(z) = max(&mu;_1, &mu;_2, ...)
            </span>
          </div>
        </div>

        {/* Method Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#090b12] p-1 rounded-xl border border-slate-800">
          {(
            [
              { id: 'centroid', label: 'Centroid (COG)' },
              { id: 'bisector', label: 'Bisector (BOA)' },
              { id: 'mom', label: 'Mean of Max (MOM)' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => onChangeMethod(m.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                defuzzMethod === m.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Resolution Defuzzification Canvas */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          width={520}
          height={200}
          className="w-full h-auto rounded-xl border border-slate-800 bg-[#0a0d16] select-none"
        />
      </div>

      {/* Live Formula & Calculation Box */}
      <div className="bg-[#090c14] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>Defuzzified Output:</span>
            <span className="font-mono text-base font-extrabold text-red-400 ml-1">
              {crispValue} {outputVar.unit}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded">
              <Scale className="w-3 h-3 text-red-400" />
              <span>Fulcrum Balance</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Method: {defuzzMethod.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Integration Details if Centroid */}
        {defuzzMethod === 'centroid' && numerator !== undefined && denominator !== undefined && (
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Formula:</span>
              <span className="text-amber-300 font-bold">z* = &int; z&bull;&mu;(z)dz / &int; &mu;(z)dz</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>= {numerator.toFixed(1)} / {denominator.toFixed(1)}</span>
              <span className="text-emerald-400 font-bold">= {crispValue} {outputVar.unit}</span>
            </div>
          </div>
        )}

        {defuzzMethod === 'bisector' && (
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            Bisector of Area splits the aggregated polygon into two halves with equal area: Area(Left) = Area(Right).
          </div>
        )}

        {defuzzMethod === 'mom' && (
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            Mean of Maximum (MOM) computes the arithmetic average of all domain points that reach peak membership &mu; = max(&mu;).
          </div>
        )}
      </div>
    </div>
  );
};
