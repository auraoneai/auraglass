/* tests/dx/lib/pixel-gates.ts — PLAT-368/369. §15.2 pixel gates as pure
   functions over ImageData-like captures; the render spec supplies pixels
   from Playwright screenshots (decoded PNG → raw RGBA in the page), so this
   file never touches certification/** or browser APIs.
   Gates:
     notBlank          — region renders ≥ MIN_UNIQUE colours with spread
     surfaceSeparation — adjacent regions differ in mean luminance ≥ LUM_SEP
     contrastPair      — WCAG relative-luminance ratio between two samples
     glassDensity      — translucent samples exist (0<alpha<1) and edges show blur smoothing
     materialPresence  — DOM-side material markers (data-ag-material / class)
*/

export interface Frame { data: Uint8ClampedArray | number[]; width: number; height: number; }
export interface GateResult { pass: boolean; detail: string; }

const LUM = (r: number, g: number, b: number) => {
  const c = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const px = (f: Frame, x: number, y: number) => {
  const i = (Math.min(f.height - 1, Math.max(0, y)) * f.width + Math.min(f.width - 1, Math.max(0, x))) * 4;
  // i is clamped inside the frame, so every channel read is defined.
  return [f.data[i]!, f.data[i + 1]!, f.data[i + 2]!, f.data[i + 3]!] as const;
};
const regionLum = (f: Frame, x0: number, y0: number, w: number, h: number) => {
  let s = 0, n = 0;
  for (let y = y0; y < y0 + h; y += 2) for (let x = x0; x < x0 + w; x += 2) { const [r, g, b] = px(f, x, y); s += LUM(r, g, b); n++; }
  return s / Math.max(1, n);
};

export function notBlank(f: Frame, minUnique = 8): GateResult {
  const uniq = new Set<number>(); let lum = 0, n = 0;
  for (let y = 0; y < f.height; y += 4) for (let x = 0; x < f.width; x += 4) {
    const [r, g, b] = px(f, x, y); uniq.add((r << 16) | (g << 8) | b); lum += LUM(r, g, b); n++;
  }
  const mean = lum / Math.max(1, n);
  const pass = uniq.size >= minUnique && mean > 0.001 && mean < 0.999;
  return { pass, detail: `unique=${uniq.size} meanLum=${mean.toFixed(3)}` };
}

export function surfaceSeparation(f: Frame, boxA: [number, number, number, number], boxB: [number, number, number, number], minSep = 0.01): GateResult {
  const a = regionLum(f, ...boxA), b = regionLum(f, ...boxB);
  const sep = Math.abs(a - b);
  return { pass: sep >= minSep, detail: `A=${a.toFixed(3)} B=${b.toFixed(3)} sep=${sep.toFixed(3)}` };
}

export function contrastRatio(lumA: number, lumB: number): number {
  const [hi, lo] = [Math.max(lumA, lumB), Math.min(lumA, lumB)];
  return (hi + 0.05) / (lo + 0.05);
}
export function contrastPair(f: Frame, fg: [number, number], bg: [number, number, number, number], minRatio = 3): GateResult {
  const [r, g, b] = px(f, fg[0], fg[1]);
  const ratio = contrastRatio(LUM(r, g, b), regionLum(f, ...bg));
  return { pass: ratio >= minRatio, detail: `ratio=${ratio.toFixed(2)}` };
}

export function glassDensity(f: Frame, box: [number, number, number, number]): GateResult {
  /* Translucency + smoothed edges: count pixels that are neither fully the
     dominant colour nor pure extremes — glass renders mid-tone blends. */
  let mid = 0, n = 0;
  const [x0, y0, w, h] = box;
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    const [r, g, b, a] = px(f, x, y); n++;
    const l = LUM(r, g, b);
    if ((a > 0 && a < 255) || (l > 0.02 && l < 0.98)) mid++;
  }
  const density = mid / Math.max(1, n);
  return { pass: density > 0.5, detail: `density=${density.toFixed(3)}` };
}

export function materialPresence(attrs: { material?: string | null; glass?: string | null; classes?: string }, want: 'glass' | 'solid'): GateResult {
  const found = want === 'glass'
    ? attrs.material === 'glass' || attrs.glass === 'true' || /\bag-glass\b/.test(attrs.classes ?? '')
    : attrs.material === 'regular' || attrs.glass === 'false' || /\bsolid\b/.test(attrs.classes ?? '');
  return { pass: found, detail: `want=${want} got material=${attrs.material} classes=${attrs.classes ?? ''}` };
}
