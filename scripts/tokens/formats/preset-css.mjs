// MAT-14 (REQ-MAT-14, REQ-FIN-52, FIN D.3-10): preset override emitter.
//
// A preset overrides only ref.color.* (through the neutral ramp re-hued to its
// neutralHue) and sys.color.{canvas,accent,on-accent,border}, each as a
// light-dark() pair, plus the radius ladder xs..xl scaled by radiusScale.
//
// Scope: `data-ag-theme` is not in AG_ATTRIBUTES (contract-v1.1; OD-16 item
// C-2 adds it through contract/v1.2-final). Until that lands, no preset block
// reaches dist/ (css-layered.mjs emits none) and each preset ships as cssText
// scoped to `[data-ag-root]`, which AuraGlassProvider renders in its single
// <style> (src/theme/presets.ts `presetCss`).
import { colorToCss, colorToSrgb, contrastRatio, gamutMapOklch } from '../color.mjs';
import { die, dim } from './_shared.mjs';

export const PRESET_IDS = ['aura', 'graphite', 'daylight', 'midnight'];
export const PRESET_SCOPE = '[data-ag-root]';
/** sys.color tokens a preset may override (REQ-MAT-14). */
export const PRESET_COLOR_TOKENS = ['canvas', 'accent', 'on-accent', 'border'];
/** Radius steps scaled by radiusScale; `full` is never scaled. */
export const PRESET_RADIUS_STEPS = ['xs', 'sm', 'md', 'lg', 'xl'];

const NEUTRAL_RAMP = 'ref.color.slate';
const MIN_ACCENT = 3;      // accent vs canvas (non-text UI)
const MIN_ON_ACCENT = 4.5; // on-accent text vs accent
const MIN_BORDER = 3;      // border vs canvas

const oklch = (l, c, h) => ({ colorSpace: 'oklch', components: [+l.toFixed(4), +c.toFixed(4), +h.toFixed(4)], alpha: 1 });
const parts = (cv) => {
  if (cv?.colorSpace !== 'oklch') die(`preset emitter: expected an oklch colour, got ${JSON.stringify(cv)}`);
  const [l, c, h] = cv.components;
  return { l, c, h };
};
const ratio = (a, b) => contrastRatio(colorToSrgb(a).rgb, colorToSrgb(b).rgb);
const aliasOf = (raw) => {
  const m = typeof raw === 'string' ? /^\{([^}]+)\}$/.exec(raw) : null;
  return m ? m[1] : null;
};

/** The 12-step neutral ramp with every step's hue set to `neutralHue`. */
export function neutralRamp(resolved, neutralHue) {
  const ramp = {};
  for (let i = 1; i <= 12; i++) {
    const step = resolved.get(`${NEUTRAL_RAMP}.${i}`);
    if (!step) die(`preset emitter: ${NEUTRAL_RAMP}.${i} missing`);
    const { l, c } = parts(step);
    const m = gamutMapOklch({ l, c, h: neutralHue });
    ramp[i] = oklch(m.l, m.c, m.h);
  }
  return ramp;
}

/** The preset axis default (mode.preset.default), whose radius cells are scale 1. */
function presetAxisDefault(records, resolved) {
  for (const rec of records.values()) {
    if (rec.ext?.['ag.axisDef'] === 'preset' && rec.name.startsWith('mode.')) return resolved.get(rec.name).default;
  }
  return die('preset emitter: no mode table declares ag.axisDef "preset"');
}

/** Resolve one scheme side of a sys.color token, re-hueing neutral-ramp refs. */
function sysSide(records, resolved, ramp, token, scheme) {
  const rec = records.get(`sys.color.${token}`);
  if (!rec) die(`preset emitter: sys.color.${token} missing`);
  const alias = aliasOf(rec.value?.[scheme]);
  if (alias && alias.startsWith(`${NEUTRAL_RAMP}.`)) return ramp[Number(alias.split('.').pop())];
  const v = resolved.get(`sys.color.${token}`)?.[scheme];
  if (!v) die(`preset emitter: sys.color.${token}.${scheme} unresolved`);
  return v;
}

/** Dark accent: the preset accent moved along the same L/C offset that the
 *  default sys.color.accent pair uses between its light and dark ref steps. */
function darkAccent(records, resolved, accent, canvasDark, id) {
  const rec = records.get('sys.color.accent');
  const lightRef = aliasOf(rec?.value?.light);
  const darkRef = aliasOf(rec?.value?.dark);
  if (!lightRef || !darkRef) die('preset emitter: sys.color.accent must alias a ref step per scheme');
  const a = parts(resolved.get(lightRef));
  const b = parts(resolved.get(darkRef));
  const p = parts(accent);
  let l = Math.min(0.98, p.l + (b.l - a.l));
  const c = a.c > 0 ? p.c * (b.c / a.c) : p.c;
  let out = gamutMapOklch({ l, c, h: p.h });
  // lift until the dark accent clears 3:1 on the dark canvas (bounded walk)
  while (ratio(oklch(out.l, out.c, out.h), canvasDark) < MIN_ACCENT) {
    if (l >= 0.98) die(`preset.${id}: no dark accent reaches ${MIN_ACCENT}:1 on the dark canvas`);
    l = Math.min(0.98, l + 0.01);
    out = gamutMapOklch({ l, c, h: p.h });
  }
  return oklch(out.l, out.c, out.h);
}

/** First candidate that reaches 4.5:1 on the accent: the sys default, the
 *  darkest and lightest re-hued neutral steps, then ref black and white. */
function onAccent(records, resolved, ramp, accent, scheme, id) {
  const candidates = [
    sysSide(records, resolved, ramp, 'on-accent', scheme), ramp[12], ramp[1],
    resolved.get('ref.color.black'), resolved.get('ref.color.white'),
  ].filter(Boolean);
  const hit = candidates.find((c) => ratio(c, accent) >= MIN_ON_ACCENT);
  if (!hit) die(`preset.${id}: no on-accent candidate reaches ${MIN_ON_ACCENT}:1 on the ${scheme} accent`);
  return hit;
}

/**
 * Compute a preset's overrides.
 * @returns {{ id: string, colors: Record<string, {light: object, dark: object}>, radius: Array<[string, string]> }}
 */
export function presetOverrides(id, records, resolved) {
  const t = resolved.get(`preset.${id}`);
  if (!t) die(`preset ${id} missing — expected preset.${id} token`);
  if (typeof t.neutralHue !== 'number') die(`preset.${id}: neutralHue must be a number`);
  const ramp = neutralRamp(resolved, t.neutralHue);
  const canvas = { light: t.canvas.light, dark: t.canvas.dark };
  const accent = { light: t.accent, dark: darkAccent(records, resolved, t.accent, canvas.dark, id) };
  for (const scheme of ['light', 'dark']) {
    if (ratio(accent[scheme], canvas[scheme]) < MIN_ACCENT)
      die(`preset.${id}: ${scheme} accent ${colorToCss(accent[scheme])} is below ${MIN_ACCENT}:1 on its canvas`);
  }
  const onAcc = {
    light: onAccent(records, resolved, ramp, accent.light, 'light', id),
    dark: onAccent(records, resolved, ramp, accent.dark, 'dark', id),
  };
  const border = {
    light: sysSide(records, resolved, ramp, 'border', 'light'),
    dark: sysSide(records, resolved, ramp, 'border', 'dark'),
  };
  for (const scheme of ['light', 'dark']) {
    if (ratio(border[scheme], canvas[scheme]) < MIN_BORDER)
      die(`preset.${id}: ${scheme} border is below ${MIN_BORDER}:1 on its canvas`);
  }

  const scale = t.radiusScale ?? 1;
  const radius = [];
  for (const step of PRESET_RADIUS_STEPS) {
    const rec = records.get(`sys.radius.${step}`);
    const v = resolved.get(`sys.radius.${step}`);
    const cssVar = rec?.ext?.['ag.cssVar'];
    if (!v || typeof cssVar !== 'string') die(`preset emitter: sys.radius.${step} missing`);
    const base = v.default ?? v[presetAxisDefault(records, resolved)];
    if (!base) die(`preset emitter: sys.radius.${step} has no default cell`);
    const value = { value: +(base.value * scale).toFixed(4), unit: base.unit };
    // the authored per-preset cell must equal default x radiusScale (MAT-14)
    const authored = v[id];
    if (authored && (authored.value !== value.value || authored.unit !== value.unit))
      die(`sys.radius.${step}.${id}: authored ${dim(authored)} != ${dim(base)} x ${scale}`);
    radius.push([cssVar, dim(value)]);
  }

  return { id, colors: { canvas, accent, 'on-accent': onAcc, border }, radius };
}

/** Serialize a preset's overrides to cssText scoped to `scope`. */
export function presetCssText(o, scope = PRESET_SCOPE) {
  const colorVar = (name) => `--ag-color-${name}`;
  const main = [
    ...PRESET_COLOR_TOKENS.map((n) => `${colorVar(n)}: light-dark(${colorToCss(o.colors[n].light)}, ${colorToCss(o.colors[n].dark)});`),
    ...o.radius.map(([v, val]) => `${v}: ${val};`),
  ];
  const side = (scheme) => PRESET_COLOR_TOKENS.map((n) => `${colorVar(n)}: ${colorToCss(o.colors[n][scheme])};`);
  const css = [
    `${scope} { ${main.join(' ')} }`,
    '@supports not (color: light-dark(#000, #fff)) {',
    ` ${scope} { ${side('light').join(' ')} }`,
    ` ${scope}[data-ag-scheme="dark"] { ${side('dark').join(' ')} }`,
    ` @media (prefers-color-scheme: dark) { ${scope}:not([data-ag-scheme]) { ${side('dark').join(' ')} } }`,
    '}',
  ].join('\n');
  if (/--_ag-/.test(css)) die(`preset.${o.id}: preset/theme output contains --_ag-*`);
  if (/material/.test(css)) die(`preset.${o.id}: preset output mentions material`);
  return css;
}
