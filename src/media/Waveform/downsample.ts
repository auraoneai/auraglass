'use client';
/* REQ-SURF-140 — pure deterministic max-abs downsampling; same input →
 * byte-identical output. */
export function downsamplePeaks(peaks: Float32Array | number[], bars: number): number[] {
  const n = Math.min(256, Math.max(8, Math.floor(bars)));
  const src = Array.from(peaks, (v) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0)));
  if (src.length === 0) return new Array(n).fill(0);
  const out: number[] = new Array(n).fill(0);
  const bucket = src.length / n;
  for (let i = 0; i < n; i++) {
    const s = Math.floor(i * bucket);
    const e = Math.min(src.length, Math.max(s + 1, Math.ceil((i + 1) * bucket)));
    let m = 0;
    for (let j = s; j < e; j++) m = Math.max(m, Math.abs(src[j]!));
    out[i] = m;
  }
  return out;
}

/** Deterministic path for a column waveform: rounds to 3 decimals. */
export function waveformPath(peaks: Float32Array | number[], bars: number, width: number, height: number): string {
  const cols = downsamplePeaks(peaks, bars);
  const colW = width / cols.length;
  const gap = Math.min(1, colW * 0.2);
  const r = (v: number) => Math.round(v * 1000) / 1000;
  let d = '';
  for (let i = 0; i < cols.length; i++) {
    const h = Math.max(0.5, cols[i]! * height);
    const x = r(i * colW + gap / 2);
    const y = r((height - h) / 2);
    d += `M${x} ${y}h${r(colW - gap)}v${r(h)}h${-r(colW - gap)}z`;
  }
  return d;
}
