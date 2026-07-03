"use client";

import { useRef, useState } from "react";

interface Props {
  dates: string[];
  closes: number[];
  digits: number;
}

const W = 320;
const H = 72;
const PAD = 4;

/** Single-series price sparkline with crosshair + tooltip on hover. */
export function Sparkline({ dates, closes, digits }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const n = closes.length;
  if (n < 2) return null;

  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;
  const x = (i: number) => PAD + (i / (n - 1)) * (W - 2 * PAD);
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - 2 * PAD);

  const path = closes.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L${x(n - 1).toFixed(1)},${H - PAD} L${x(0).toFixed(1)},${H - PAD} Z`;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD) / (W - 2 * PAD)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  const hx = hover !== null ? x(hover) : 0;
  const hy = hover !== null ? y(closes[hover]) : 0;

  return (
    <div className="spark-wrap" ref={wrapRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`Price history, last ${n} sessions, from ${closes[0].toFixed(digits)} to ${closes[n - 1].toFixed(digits)}`}
      >
        <path d={area} fill="var(--series)" opacity={0.12} />
        <path d={path} fill="none" stroke="var(--series)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        {hover !== null && (
          <>
            <line x1={hx} x2={hx} y1={PAD} y2={H - PAD} stroke="var(--ink-muted)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <circle cx={hx} cy={hy} r={3.5} fill="var(--series)" stroke="var(--surface)" strokeWidth={2} />
          </>
        )}
      </svg>
      {hover !== null && wrapRef.current && (
        <div
          className="spark-tip"
          style={{
            left: `${(hx / W) * 100}%`,
            top: `${(hy / H) * 100}%`,
          }}
        >
          {closes[hover].toFixed(digits)} <span className="d">{dates[hover]}</span>
        </div>
      )}
    </div>
  );
}
