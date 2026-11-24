import React, { useRef, useEffect } from 'react';
import type { FuzzyVariable } from '../../types/fuzzy';
import { evaluateMF } from '../../core/fuzzyMath';

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
    const padding = { top: 20, right: 25, bottom: 30, left: 35 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Clear
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let mu = 0; mu <= 1.0; mu += 0.5) {
      const y = padding.top + plotH - mu * plotH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(mu.toFixed(1), 10, y + 3);
    }

    const toPxX = (val: number) => {
      const norm = (val - variable.min) / (variable.max - variable.min);
      return padding.left + norm * plotW;
    };

    const toPxY = (mu: number) => {
      return padding.top + plotH - mu * plotH;
    };

    // Draw each Membership Function
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

      // Stroke
      ctx.strokeStyle = mf.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Translucent Fill
      ctx.lineTo(toPxX(variable.max), toPxY(0));
      ctx.lineTo(toPxX(variable.min), toPxY(0));
      ctx.closePath();
      ctx.fillStyle = `${mf.color}18`;
      ctx.fill();

      // Label at peak
      let peakX = mf.params[1];
      if (mf.type === 'trapezoidal') peakX = (mf.params[1] + mf.params[2]) / 2;
      ctx.fillStyle = mf.color;
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(mf.name, toPxX(peakX) - 15, padding.top - 5);
    });

    // Draw Current Input Vertical Line
    const curPx = toPxX(variable.currentValue);
    ctx.beginPath();
    ctx.moveTo(curPx, padding.top - 10);
    ctx.lineTo(curPx, height - padding.bottom);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Intersection Points
    variable.mfs.forEach((mf) => {
      const mu = evaluateMF(variable.currentValue, mf);
      if (mu > 0.001) {
        const py = toPxY(mu);
        ctx.beginPath();
        ctx.arc(curPx, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = mf.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

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
      const tickVal = variable.min + (i / tickCount) * (variable.max - variable.min);
      const tx = toPxX(tickVal);
      ctx.fillText(tickVal.toFixed(1), tx - 8, height - 12);
    }
  }, [variable]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const paddingLeft = 35;
    const paddingRight = 25;
    const plotW = canvas.width - paddingLeft - paddingRight;

    const norm = Math.max(0, Math.min(1, (clickX - paddingLeft) / plotW));
    const newVal = variable.min + norm * (variable.max - variable.min);
    onChangeValue(Number(newVal.toFixed(1)));
  };

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-4 shadow-lg space-y-3 transition-all ${
        highlighted ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
        <div>
          <h4 className="font-bold text-sm text-white">{variable.name}</h4>
          <span className="text-[11px] text-slate-400">
            Domain: [{variable.min}, {variable.max}] {variable.unit}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Crisp Input</span>
          <span className="text-sm font-mono font-extrabold text-cyan-300">
            {variable.currentValue.toFixed(1)} {variable.unit}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={460}
          height={160}
          onClick={handleCanvasInteraction}
          className="w-full max-w-[460px] h-[160px] cursor-crosshair block"
        />
      </div>

      {/* Slider & Quick Readout Pills */}
      <div className="space-y-2">
        <input
          type="range"
          min={variable.min}
          max={variable.max}
          step={variable.step}
          value={variable.currentValue}
          onChange={(e) => onChangeValue(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
        />

        {/* Fuzzified Membership Grades */}
        <div className="flex flex-wrap gap-2 pt-1">
          {variable.mfs.map((mf) => {
            const mu = evaluateMF(variable.currentValue, mf);
            const isActive = mu > 0.001;

            return (
              <div
                key={mf.id}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-950 border-cyan-500/50 text-white font-bold'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mf.color }} />
                <span>μ_{mf.name}:</span>
                <span style={{ color: isActive ? mf.color : undefined }}>{mu.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Drag interaction refined for mobile touch
