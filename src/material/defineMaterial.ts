/* AuraGlass 5.0 — defineMaterial (architecture §3.2/§4.3). Build-time only input to the
   token compiler: pure, side-effect free, tree-shakeable. Not part of the frozen
   ./material export list (OI-MAT-05: proposed as a C-E addition for 5.1). */
import type {
  Backdrop, ContentMaterial, MaterialSpec, MaterialStateSpec, Thickness, Transparency,
} from './types';

const BLUR_CAP = 32;          // px — REQ-MAT-32
const SCRIM_BLUR_CAP = 12;    // px — REQ-MAT-31
const GRAIN_MIN = 0.02;       // REQ-MAT-07 / §4.3
const GRAIN_MAX = 0.04;
const FALLBACK_MIN_ALPHA = 0.85; // REQ-MAT-35 lightweight fill floor

const THICKNESSES: readonly Thickness[] = ['thin', 'regular', 'thick'];
const TRANSPARENCIES: readonly Transparency[] = ['glass', 'tinted', 'solid'];
const BACKDROPS: readonly Exclude<Backdrop, 'auto'>[] = ['light', 'dark', 'media'];
const CONTENTS: readonly ContentMaterial[] = ['content-raised', 'content-sunken'];

/** Pre-solve floor initials. The contrast-solve transform (REQ-MAT-10) rewrites every cell. */
const initialFloor = (v: number) =>
  Object.fromEntries(TRANSPARENCIES.map((t) => [t,
    Object.fromEntries(THICKNESSES.map((k) => [k,
      Object.fromEntries(BACKDROPS.map((b) => [b, v]))]))])) as MaterialSpec['opacityFloor'];

const DEFAULT_STATE: MaterialStateSpec = {
  hoverSpecular: 0.15,
  pressGlow: 0.25,
  disabledAlpha: 0.45,
  hoverFloor: 0.02,
  pressFloor: 0.04,
  selectedTint: 0.16,
  loadingAlpha: 0.7,
  draggingLift: 'var(--ag-shadow-regular)',
  draggingSpecular: 0.2,
  dropTargetRim: '2px',
  dropTargetFill: 0.06,
};

export const DEFAULT_MATERIAL_SPEC: MaterialSpec = {
  blur: { thin: '12px', regular: '20px', thick: '32px' },
  saturation: 1.6,
  brightness: 1.0,
  tint: { light: 0.6, dark: 0.72, media: 0.55 },
  opacityFloor: initialFloor(0.6),
  innerFill: {
    light: 'oklch(96% 0.005 260 / 0.85)',
    dark: 'oklch(24% 0.02 260 / 0.85)',
  },
  content: {
    'content-raised': { light: 'oklch(98% 0.004 260)', dark: 'oklch(22% 0.02 260)' },
    'content-sunken': { light: 'oklch(94% 0.006 260)', dark: 'oklch(18% 0.02 260)' },
  },
  rim: {
    width: { thin: '1px', regular: '1px', thick: '1.5px' },
    light: 'oklch(100% 0 0 / 0.45)',
    shade: 'oklch(0% 0 0 / 0.08)',
  },
  specular: { intensity: 0.5, spread: '40deg' },
  refraction: {
    bezel: { thin: '12px', regular: '16px', thick: '24px' },
    scale: { thin: 8, regular: 12, thick: 18 },
  },
  grain: { opacity: 0.03, asset: 'ag-grain-128.avif' },
  shadow: {
    thin: {
      light: { ambient: '0 0 0 0 transparent', key: '0 1px 2px 0 rgb(0 0 0 / 0.06)' },
      dark: { ambient: '0 0 0 0 transparent', key: '0 1px 2px 0 rgb(0 0 0 / 0.4)' },
    },
    regular: {
      light: { ambient: '0 0 0 0 transparent', key: '0 4px 12px -2px rgb(0 0 0 / 0.1)' },
      dark: { ambient: '0 0 0 0 transparent', key: '0 4px 12px -2px rgb(0 0 0 / 0.5)' },
    },
    thick: {
      light: { ambient: '0 0 0 0 transparent', key: '0 12px 32px -8px rgb(0 0 0 / 0.18)' },
      dark: { ambient: '0 0 0 0 transparent', key: '0 12px 32px -8px rgb(0 0 0 / 0.6)' },
    },
  },
  scrim: { clearOverBright: 0.35, modal: 0.5, blur: '12px' },
  fallbackFill: {
    light: 'oklch(97% 0.004 260 / 0.9)',
    dark: 'oklch(26% 0.02 260 / 0.92)',
  },
  state: DEFAULT_STATE,
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const px = (v: unknown): v is `${number}px` =>
  typeof v === 'string' && /^[0-9]+(\.[0-9]+)?px$/.test(v);

const pxNumber = (v: unknown): number | undefined => {
  const m = typeof v === 'string' && /^([0-9]+(\.[0-9]+)?)px$/.exec(v);
  return m ? Number(m[1]) : undefined;
};

const alphaOf = (v: unknown): number | undefined => {
  const m = typeof v === 'string' && /\/\s*([0-9]*\.?[0-9]+)\s*\)\s*$/.exec(v);
  return m ? Number(m[1]) : undefined;
};

function fail(field: string, detail: string): never {
  throw new Error(`[aura-glass] defineMaterial: invalid ${field} — ${detail}`);
}

function checkBlur(spec: MaterialSpec): void {
  for (const t of THICKNESSES) {
    const v = spec.blur[t];
    if (!px(v)) fail(`blur.${t}`, `expected a px length, got ${JSON.stringify(v)}`);
    if (pxNumber(v)! > BLUR_CAP) fail(`blur.${t}`, `${v} exceeds the ${BLUR_CAP}px cap`);
  }
}

function checkScrim(spec: MaterialSpec): void {
  const modal = spec.scrim.modal;
  if (typeof modal !== 'number' || modal < 0 || modal > 1) {
    fail('scrim.modal', `expected an alpha in [0,1], got ${JSON.stringify(modal)}`);
  }
  if (typeof spec.scrim.clearOverBright !== 'number'
      || spec.scrim.clearOverBright < 0 || spec.scrim.clearOverBright > 1) {
    fail('scrim.clearOverBright', `expected an alpha in [0,1], got ${JSON.stringify(spec.scrim.clearOverBright)}`);
  }
  const blur = spec.scrim.blur;
  if (!px(blur)) fail('scrim.blur', `expected a px length, got ${JSON.stringify(blur)}`);
  if (pxNumber(blur)! > SCRIM_BLUR_CAP) {
    fail('scrim.blur', `${blur} exceeds the ${SCRIM_BLUR_CAP}px scrim cap`);
  }
}

function checkGrain(spec: MaterialSpec): void {
  const o = spec.grain.opacity;
  if (typeof o !== 'number' || o < GRAIN_MIN || o > GRAIN_MAX) {
    fail('grain.opacity', `${JSON.stringify(o)} outside ${GRAIN_MIN}–${GRAIN_MAX}`);
  }
  if (spec.grain.asset !== 'ag-grain-128.avif') {
    fail('grain.asset', `expected 'ag-grain-128.avif', got ${JSON.stringify(spec.grain.asset)}`);
  }
}

function checkFloors(spec: MaterialSpec): void {
  for (const tr of TRANSPARENCIES) {
    const byT = spec.opacityFloor[tr];
    if (!isRecord(byT)) fail('opacityFloor', `missing ${tr} row`);
    for (const t of THICKNESSES) {
      const byB = byT[t];
      if (!isRecord(byB)) fail(`opacityFloor.${tr}.${t}`, 'missing row');
      for (const b of BACKDROPS) {
        const v = byB[b];
        if (typeof v !== 'number' || v < 0 || v > 1) {
          fail(`opacityFloor.${tr}.${t}.${b}`, `expected an alpha in [0,1], got ${JSON.stringify(v)}`);
        }
      }
    }
  }
}

function checkFallbackFill(spec: MaterialSpec): void {
  for (const scheme of ['light', 'dark'] as const) {
    const v = spec.fallbackFill[scheme];
    const a = alphaOf(v);
    if (a === undefined || a < FALLBACK_MIN_ALPHA) {
      fail(`fallbackFill.${scheme}`, `alpha ${a ?? 'missing'} below ${FALLBACK_MIN_ALPHA}`);
    }
  }
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (!isRecord(patch)) return patch === undefined ? base : (patch as T);
  if (!isRecord(base)) return patch as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = k in base ? deepMerge(base[k], v) : v;
  }
  return out as T;
}

function checkContent(spec: MaterialSpec): void {
  for (const c of CONTENTS) {
    const row = spec.content[c];
    if (!isRecord(row) || typeof row.light !== 'string' || typeof row.dark !== 'string') {
      fail(`content.${c}`, 'expected { light, dark } OKLCH colours');
    }
  }
}

/**
 * Build-time material definition (architecture §3.2). Merges `spec` over the REQ-MAT-07
 * initial values, validates the caps, and returns a deeply frozen {@link MaterialSpec}.
 * Pure and side-effect free: bundles that never import it tree-shake it away.
 */
export function defineMaterial(spec: Partial<MaterialSpec> = {}): MaterialSpec {
  const merged = deepMerge(DEFAULT_MATERIAL_SPEC, spec);
  checkBlur(merged);
  checkScrim(merged);
  checkGrain(merged);
  checkFloors(merged);
  checkContent(merged);
  checkFallbackFill(merged);
  return deepFreeze(merged);
}

function deepFreeze<T>(v: T): T {
  if (isRecord(v)) {
    for (const k of Object.keys(v)) deepFreeze(v[k]);
  }
  return Object.freeze(v);
}
