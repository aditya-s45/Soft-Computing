import React, { useRef, useEffect } from 'react';
import type { FuzzyVariable } from '../../types/fuzzy';
import { evaluateMF } from '../../core/fuzzyMath';
import { SlidersHorizontal, Activity } from 'lucide-react';

interface MFCanvasProps {
  variable: FuzzyVariable;
  onChangeValue: (val: number) => void;
  highlighted?: boolean;
}

export const MFCanvas: React.FC<MFCanvasProps> = ({
  variable,
  onChangeValue,
  highlighted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 24, right: 25, bottom: 32, left: 38 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Clear with dark obsidian background
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

      // Y-axis grade
      ctx.fillStyle = mu === 1.0 || mu === 0 ? '#94a3b8' : '#475569';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(mu.toFixed(2), 6, y + 3);
    }

    const toPxX = (val: number) => {
      const norm = (val - variable.min) / (variable.max - variable.min);
      return padding.left + norm * plotW;
    };

    const toPxY = (mu: number) => {
      return padding.top + plotH - mu * plotH;
    };

    // Draw each Membership Function curve
    variable.mfs.forEach((mf) => {
      ctx.beginPath();
      const samples = 100;
      for (let i = 0; i <= samples; i++) {
        const xVal = variable.min + (i / samples) * (variable.max - variable.min);
        const mu = evaluateMF(xVal, mf);
        const px = toPxX(xVal);
        const py = toPxY(mu);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      // Stroke curve
      ctx.strokeStyle = mf.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Translucent area fill
      ctx.lineTo(toPxX(variable.max), toPxY(0));
      ctx.lineTo(toPxX(variable.min), toPxY(0));
      ctx.closePath();
      ctx.fillStyle = `${mf.color}22`;
      ctx.fill();

      // Peak label
      let peakX = mf.params[1];
      if (mf.type === 'trapezoidal') peakX = (mf.params[1] + mf.params[2]) / 2;
      ctx.fillStyle = mf.color;
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(mf.name, toPxX(peakX) - 16, padding.top - 8);
    });

    // Draw Current Input Laser Line
    const curPx = toPxX(variable.currentValue);
    ctx.beginPath();
    ctx.moveTo(curPx, padding.top - 12);
    ctx.lineTo(curPx, height - padding.bottom);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Intersection Points with glow
    variable.mfs.forEach((mf) => {
      const mu = evaluateMF(variable.currentValue, mf);
      if (mu > 0.001) {
        const py = toPxY(mu);
        // Outer halo
        ctx.beginPath();
        ctx.arc(curPx, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = `${mf.color}44`;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(curPx, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = mf.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // X-axis baseline & Ticks
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const tickVal = variable.min + (i / tickCount) * (variable.max - variable.min);
      const tx = toPxX(tickVal);
      ctx.fillText(tickVal.toFixed(1), tx - 9, height - 12);
    }
  }, [variable]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const paddingLeft = 38;
    const paddingRight = 25;
    const plotW = canvas.width - paddingLeft - paddingRight;

    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clampedX = Math.max(paddingLeft, Math.min(paddingLeft + plotW, clickX));
    const ratio = (clampedX - paddingLeft) / plotW;
    const rawVal = variable.min + ratio * (variable.max - variable.min);

    const step = variable.step || 0.1;
    const steppedVal = Math.round(rawVal / step) * step;
    const finalVal = Number(Math.max(variable.min, Math.min(variable.max, steppedVal)).toFixed(1));
    onChangeValue(finalVal);
  };

  const handlePreset = (fraction: number) => {
    const val = variable.min + fraction * (variable.max - variable.min);
    const step = variable.step || 0.1;
    const steppedVal = Math.round(val / step) * step;
    onChangeValue(Number(steppedVal.toFixed(1)));
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 p-5 ${
        highlighted
          ? 'bg-[#111422] border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10'
          : 'bg-[#0f121d] border border-slate-800/80 shadow-lg'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">{variable.name}</h4>
            <span className="text-[10px] font-mono text-slate-400">
              Domain: [{variable.min}, {variable.max}] {variable.unit}
            </span>
          </div>
        </div>

        {/* Crisp Display Badge */}
        <div className="flex items-center gap-2 bg-[#171b2a] border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-inner">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            Input x:
          </span>
          <span className="text-base font-extrabold font-mono text-amber-300">
            {variable.currentValue}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{variable.unit}</span>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative group cursor-crosshair mb-4">
        <canvas
          ref={canvasRef}
          width={520}
          height={180}
          onClick={handleCanvasInteraction}
          onMouseMove={(e) => {
            if (e.buttons === 1) handleCanvasInteraction(e);
          }}
          className="w-full h-auto rounded-xl border border-slate-800 bg-[#0a0d16] select-none"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm border border-slate-700 text-[10px] text-slate-300 px-2 py-1 rounded-md pointer-events-none">
          Click or drag needle to scrub
        </div>
      </div>

      {/* Slider & Quick Presets */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={variable.min}
            max={variable.max}
            step={variable.step || 0.1}
            value={variable.currentValue}
            onChange={(e) => onChangeValue(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 focus:outline-none"
          />
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            Presets:
            <button
              onClick={() => handlePreset(0)}
              className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 cursor-pointer"
            >
              Min (0%)
            </button>
            <button
              onClick={() => handlePreset(0.5)}
              className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 cursor-pointer"
            >
              Mid (50%)
            </button>
            <button
              onClick={() => handlePreset(1.0)}
              className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 cursor-pointer"
            >
              Max (100%)
            </button>
          </span>
          <span className="text-slate-500">Step: {variable.step || 0.1}</span>
        </div>
      </div>

      {/* Dynamic Fuzzification μ Badges */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-slate-300">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Fuzzified Membership Degrees &mu;(x):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {variable.mfs.map((mf) => {
            const mu = evaluateMF(variable.currentValue, mf);
            const active = mu > 0.001;
            return (
              <div
                key={mf.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                  active
                    ? 'bg-[#151928] border-slate-700 shadow-sm'
                    : 'bg-[#0d101a] border-slate-900/60 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: mf.color }}
                  />
                  <span className="font-sans font-medium text-slate-200">{mf.name}</span>
                </div>
                <span
                  className={`font-bold ${
                    active ? 'text-amber-300' : 'text-slate-500'
                  }`}
                >
                  {mu.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
