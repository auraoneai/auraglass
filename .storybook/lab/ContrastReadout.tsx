/* REQ-QUAL-54 (REQ-FIN-106, FIN-451): Material Lab contrast read-out — an ESTIMATE, never the gate of record (that is
   the L6 OCR contrast lane, REQ-QUAL-13).

   How it measures: the scene pixels under the subject rect are read back from a canvas the Lab owns (the scene asset is
   same-origin, served from /scenes by Storybook's staticDirs), the subject's resolved `--_ag-surface-fill` is
   composited over each pixel, and the worst-case WCAG 2.x ratio of `--ag-on-surface` / `--ag-on-surface-muted` over
   that composite is compared with 4.5:1 / 3:1 (7:1 / 4.5:1 under contrast "more"). Blur, saturation and rim are not
   modelled, hence "estimate". The result is announced through a `role="status"` live region once the subject settles
   (debounced ≤100 ms). No runtime contrast code from src/** is imported: the maths below is self-contained. */
import * as React from 'react';

export type Rgb = readonly [number, number, number];
export type Rgba = readonly [number, number, number, number];

/** Debounce between the last change and the measurement (REQ-QUAL-54: within one frame of a settled change). */
export const SETTLE_MS = 100;

/** WCAG 2.x thresholds per contrast preference. */
export function thresholds(contrast: 'standard' | 'more'): { onSurface: number; muted: number } {
  return contrast === 'more' ? { onSurface: 7, muted: 4.5 } : { onSurface: 4.5, muted: 3 };
}

const channel = (c: number): number => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2.x relative luminance of an sRGB colour (0–255 channels). */
export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Source-over composite of `fg` (alpha 0–1) on an opaque `bg`, in sRGB like the browser's default compositing. */
export function compositeOver([r, g, b, a]: Rgba, bg: Rgb): Rgb {
  return [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];
}

/** Worst-case (minimum) ratio of `ink` over `fill` composited on every RGBA pixel of `pixels` (alpha ignored: owned
    scene pixels are opaque). Returns null for an empty sample. */
export function worstCaseContrast(pixels: ArrayLike<number>, fill: Rgba, ink: Rgba): number | null {
  let worst: number | null = null;
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    const surface = compositeOver(fill, [pixels[i]!, pixels[i + 1]!, pixels[i + 2]!]);
    const ratio = contrastRatio(compositeOver(ink, surface), surface);
    if (worst === null || ratio < worst) worst = ratio;
  }
  return worst;
}

export interface Box { x: number; y: number; width: number; height: number }

/** Source rectangle (in image pixels) shown under `target` when the image of natural size `natural` is painted into
    `box` with CSS `object-fit`/`background-size` `fit` and centred position. Null when they do not intersect. */
export function sourceRect(target: Box, box: Box, natural: { width: number; height: number }, fit: 'cover' | 'contain' | 'fill'): Box | null {
  let sx = box.width / natural.width;
  let sy = box.height / natural.height;
  if (fit === 'cover') sx = sy = Math.max(sx, sy);
  if (fit === 'contain') sx = sy = Math.min(sx, sy);
  const ox = box.x + (box.width - natural.width * sx) / 2;
  const oy = box.y + (box.height - natural.height * sy) / 2;
  const x0 = Math.max(0, (target.x - ox) / sx);
  const y0 = Math.max(0, (target.y - oy) / sy);
  const x1 = Math.min(natural.width, (target.x + target.width - ox) / sx);
  const y1 = Math.min(natural.height, (target.y + target.height - oy) / sy);
  return x1 > x0 && y1 > y0 ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null;
}

export interface ContrastEstimate { onSurface: number; muted: number; samples: number }
export type Measure = (subject: HTMLElement) => Promise<ContrastEstimate>;

// ---- browser readback --------------------------------------------------------------------------------------------

/** Resolve any CSS colour the engine understands to sRGB RGBA by painting one pixel on a canvas the Lab owns.
    Throws when the canvas parser rejects the value (an assignment it cannot parse leaves fillStyle unchanged). */
function resolveColor(ctx: CanvasRenderingContext2D, value: string): Rgba {
  const sentinel = '#010203';
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = sentinel;
  ctx.fillStyle = value;
  if (String(ctx.fillStyle).toLowerCase() === sentinel && value.trim().toLowerCase() !== sentinel) {
    throw new Error(`ContrastReadout: the engine cannot resolve the colour "${value}"`);
  }
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!, a! / 255];
}

const images = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string): Promise<HTMLImageElement> {
  if (!images.has(src)) {
    images.set(src, new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`ContrastReadout: cannot load scene asset ${src}`));
      img.src = src;
    }));
  }
  return images.get(src)!;
}

const urlOf = (bg: string): string | null => /url\(["']?([^"')]+)["']?\)/.exec(bg)?.[1] ?? null;
const fitOf = (v: string): 'cover' | 'contain' | 'fill' => (v.includes('contain') ? 'contain' : v.includes('cover') ? 'cover' : 'fill');

/** The scene painted behind `subject`: Environment's backdrop media, else the body background (body-painted scenes). */
function scenePaint(subject: HTMLElement): { src: string; box: Box; fit: 'cover' | 'contain' | 'fill' } {
  const media = subject.closest('[data-ag-backdrop]')?.querySelector<HTMLImageElement>(':scope > img[data-ag-part="backdrop-media"]');
  if (media?.currentSrc || media?.src) {
    const r = media.getBoundingClientRect();
    return { src: media.currentSrc || media.src, box: { x: r.left, y: r.top, width: r.width, height: r.height }, fit: fitOf(getComputedStyle(media).objectFit) };
  }
  const body = getComputedStyle(document.body);
  const src = urlOf(body.backgroundImage);
  if (!src) throw new Error('ContrastReadout: no scene is painted behind the subject (no backdrop media, no body background)');
  const fixed = body.backgroundAttachment === 'fixed';
  const r = fixed ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight } : document.body.getBoundingClientRect();
  return { src, box: { x: r.left, y: r.top, width: r.width, height: r.height }, fit: fitOf(body.backgroundSize) };
}

/** Longest side of the sampled region; enough resolution for a worst case, cheap enough for one frame. */
const MAX_SAMPLE = 160;

export const canvasMeasure: Measure = async (subject) => {
  const paint = scenePaint(subject);
  const img = await loadImage(paint.src);
  const rect = subject.getBoundingClientRect();
  const src = sourceRect({ x: rect.left, y: rect.top, width: rect.width, height: rect.height }, paint.box,
    { width: img.naturalWidth, height: img.naturalHeight }, paint.fit);
  if (!src) throw new Error('ContrastReadout: the subject does not overlap the scene');
  const scale = Math.min(1, MAX_SAMPLE / Math.max(src.width, src.height));
  const w = Math.max(1, Math.round(src.width * scale));
  const h = Math.max(1, Math.round(src.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(w, 1);
  canvas.height = Math.max(h, 1);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('ContrastReadout: 2D canvas unavailable');
  const cs = getComputedStyle(subject);
  const read = (name: string): string => {
    const v = cs.getPropertyValue(name).trim();
    if (!v) throw new Error(`ContrastReadout: ${name} does not resolve on the subject`);
    return v;
  };
  const fill = resolveColor(ctx, read('--_ag-surface-fill'));
  const ink = resolveColor(ctx, read('--ag-on-surface'));
  const muted = resolveColor(ctx, read('--ag-on-surface-muted'));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, src.x, src.y, src.width, src.height, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;
  const onSurface = worstCaseContrast(pixels, fill, ink);
  const mutedRatio = worstCaseContrast(pixels, fill, muted);
  if (onSurface === null || mutedRatio === null) throw new Error('ContrastReadout: empty sample');
  return { onSurface, muted: mutedRatio, samples: w * h };
};

// ---- component ---------------------------------------------------------------------------------------------------

export interface ContrastReadoutProps {
  /** The Surface whose contrast is estimated. */
  subject: React.RefObject<HTMLElement | null>;
  /** Contrast preference in force (globals.contrast). */
  contrast: 'standard' | 'more';
  /** Any value that changes when the subject's material, scene or knobs change. */
  watch: unknown;
  /** Readback implementation (the canvas readback by default). */
  measure?: Measure;
  label?: string;
}

type State = { kind: 'idle' } | { kind: 'ok'; value: ContrastEstimate } | { kind: 'error'; message: string };

const fmt = (n: number): string => `${n.toFixed(2)}:1`;

export function ContrastReadout({ subject, contrast, watch, measure = canvasMeasure, label = 'Contrast' }: ContrastReadoutProps): React.ReactElement {
  const [state, setState] = React.useState<State>({ kind: 'idle' });
  const [busy, setBusy] = React.useState(true);
  React.useEffect(() => {
    let cancelled = false;
    setBusy(true);
    const timer = setTimeout(() => {
      const el = subject.current;
      if (!el) { setState({ kind: 'error', message: 'no subject' }); setBusy(false); return; }
      measure(el).then(
        (value) => { if (!cancelled) { setState({ kind: 'ok', value }); setBusy(false); } },
        (e: unknown) => { if (!cancelled) { setState({ kind: 'error', message: e instanceof Error ? e.message : String(e) }); setBusy(false); } },
      );
    }, SETTLE_MS);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [subject, measure, watch, contrast]);

  const t = thresholds(contrast);
  let text = `${label} estimate: measuring…`;
  if (state.kind === 'ok') {
    const { onSurface, muted } = state.value;
    text = `${label} estimate: on-surface ${fmt(onSurface)} (${onSurface >= t.onSurface ? 'meets' : 'below'} ${t.onSurface}:1), `
      + `muted ${fmt(muted)} (${muted >= t.muted ? 'meets' : 'below'} ${t.muted}:1)`;
  } else if (state.kind === 'error') {
    text = `${label} estimate unavailable: ${state.message}`;
  }
  return (
    <p role="status" aria-busy={busy} data-ag-part="contrast-readout"
      data-lab-contrast-pass={state.kind === 'ok' ? String(state.value.onSurface >= t.onSurface && state.value.muted >= t.muted) : undefined}>
      {text}
    </p>
  );
}
