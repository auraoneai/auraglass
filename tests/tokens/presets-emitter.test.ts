/** @jest-environment node */
import { describe, test, expect, jest, afterEach } from '@jest/globals';
// MAT-14 (REQ-MAT-14, REQ-FIN-52, FIN D.3-10): preset emitter.
// - dist/tokens.css compiles one [data-ag-theme="<id>"] block set per preset
//   (data-ag-theme is in AG_ATTRIBUTES); the provider's interim path still ships
//   each preset as cssText scoped to [data-ag-root] in src/tokens/generated/presets.ts.
// - each cssText overrides only sys.color.{canvas,accent,on-accent,border}
//   (each light-dark()) and --ag-radius-{xs..xl} (default x radiusScale).
// - neutral steps follow the preset's neutralHue; contrast pairs hold in both
//   schemes (recomputed here with src/theme/color, not with the emitter's math).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { presets, presetCssText, PRESET_SCOPE } from '../../src/tokens/generated/presets';
import type { PresetId } from '../../src/tokens/generated/presets';
import { parseColor, wcagContrast } from '../../src/theme/color';

const DIST_CSS = ['dist/tokens.css'].map((f) => [f, readFileSync(join(ROOT, f), 'utf8')] as const);
const IDS = Object.keys(presets) as PresetId[];
const COLOR_VARS = ['--ag-color-canvas', '--ag-color-accent', '--ag-color-on-accent', '--ag-color-border'];
const RADIUS_VARS = ['xs', 'sm', 'md', 'lg', 'xl'].map((s) => `--ag-radius-${s}`);

const load = async () => {
  const { loadTokens, resolveAliases } = await import('../../scripts/tokens/build.mjs');
  const records = loadTokens(join(ROOT, 'tokens'));
  return { records, resolved: resolveAliases(records) };
};
const emitter = () => import('../../scripts/tokens/formats/preset-css.mjs');

const LD = /^light-dark\((oklch\([^)]*\)),\s*(oklch\([^)]*\))\)$/;
/** Top-level (non-@supports) declarations of a preset's cssText. */
const mainDecls = (css: string) => {
  const out = new Map<string, string>();
  postcss.parse(css).each((node) => {
    if (node.type !== 'rule') return;
    node.walkDecls((d) => void out.set(d.prop, d.value));
  });
  return out;
};
const pair = (decls: Map<string, string>, v: string) => {
  const m = LD.exec(decls.get(v) ?? '');
  if (!m) throw new Error(`${v} is not light-dark(): ${decls.get(v)}`);
  return { light: m[1]!, dark: m[2]! };
};

afterEach(() => { jest.restoreAllMocks(); });

describe('preset emitter (MAT-14)', () => {
  test('dist token CSS compiles exactly 4 [data-ag-theme] blocks overriding only the allowed vars', () => {
    const THEME_RE = /^\[data-ag-theme="([a-z]+)"\]((?:\[data-ag-scheme="dark"\]|:not\(\[data-ag-scheme\]\))?)$/;
    for (const [file, css] of DIST_CSS) {
      const root = postcss.parse(css);
      const mainBlocks = new Map<string, Map<string, string>>();
      const sides: string[] = [];
      root.walkRules((r) => {
        if (!r.selector.includes('data-ag-theme')) return;
        let layer = '';
        const chain: string[] = [];
        for (let n = r.parent; n && n.type !== 'root'; n = n.parent as postcss.Container) {
          const at = n as postcss.AtRule;
          if (at.name === 'layer') layer = at.params;
          else chain.push(`${at.name} ${at.params}`);
        }
        expect({ file, sel: r.selector, layer }).toEqual({ file, sel: r.selector, layer: 'ag.tokens' });
        if (chain.some((c) => c.startsWith('media (forced-colors'))) return; // forced-colours absolute block
        for (const sel of r.selector.split(/,\s*/)) {
          const m = THEME_RE.exec(sel);
          expect({ file, sel, ok: !!m && IDS.includes(m[1] as PresetId) }).toEqual({ file, sel, ok: true });
        }
        const decls = new Map<string, string>();
        // prettier may wrap long light-dark() values; compare normalised values
        r.walkDecls((d) => void decls.set(d.prop, d.value.replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')')));
        for (const k of decls.keys()) expect([...COLOR_VARS, ...RADIUS_VARS]).toContain(k);
        if (chain.length === 0) {
          const id = THEME_RE.exec(r.selector)![1]!;
          expect(mainBlocks.has(id)).toBe(false);
          mainBlocks.set(id, decls);
        } else sides.push(r.selector);
      });
      // 4 main blocks equal the preset emitter's light-dark()/radius declarations
      expect([...mainBlocks.keys()].sort()).toEqual([...IDS].sort());
      for (const id of IDS) expect(Object.fromEntries(mainBlocks.get(id)!)).toEqual(Object.fromEntries(mainDecls(presetCssText[id])));
      // each preset carries its no-light-dark() and sRGB scheme mirrors (light, dark, media dark) x 2
      for (const id of IDS) expect({ id, n: sides.filter((s) => s.startsWith(`[data-ag-theme="${id}"]`)).length }).toEqual({ id, n: 6 });
    }
  });

  test('forced colours repeat every [data-ag-theme] colour selector', () => {
    for (const [file, css] of DIST_CSS) {
      const forced: string[] = [];
      postcss.parse(css).walkAtRules('media', (at) => {
        if (at.params === '(forced-colors: active)') at.walkRules((r) => void forced.push(...r.selector.split(/,\s*/)));
      });
      for (const id of IDS)
        for (const sel of [`[data-ag-theme="${id}"]`, `[data-ag-theme="${id}"][data-ag-scheme="dark"]`, `[data-ag-theme="${id}"]:not([data-ag-scheme])`])
          expect({ file, sel, ok: forced.includes(sel) }).toEqual({ file, sel, ok: true });
    }
  });

  test('every preset has cssText scoped to [data-ag-root] only', () => {
    expect(PRESET_SCOPE).toBe('[data-ag-root]');
    expect(Object.keys(presetCssText).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      const selectors: string[] = [];
      postcss.parse(presetCssText[id]).walkRules((r) => void selectors.push(r.selector));
      expect(selectors.length).toBeGreaterThan(0);
      for (const s of selectors) expect(s.startsWith('[data-ag-root]')).toBe(true);
      expect(presetCssText[id]).not.toMatch(/data-ag-theme|:root|--_ag-|material/);
    }
  });

  test('overrides exactly the four sys colours (light-dark) and radius xs..xl', () => {
    for (const id of IDS) {
      const decls = mainDecls(presetCssText[id]);
      expect([...decls.keys()].sort()).toEqual([...COLOR_VARS, ...RADIUS_VARS].sort());
      for (const v of COLOR_VARS) expect(decls.get(v)).toMatch(LD);
      expect(decls.has('--ag-radius-full')).toBe(false);
    }
  });

  test('canvas and light accent are the authored preset values', () => {
    for (const id of IDS) {
      const decls = mainDecls(presetCssText[id]);
      expect(pair(decls, '--ag-color-canvas')).toEqual(presets[id].canvas);
      expect(pair(decls, '--ag-color-accent').light).toBe(presets[id].accent);
      // the dark accent is a distinct, lighter colour (the old block dropped it)
      const dark = parseColor(pair(decls, '--ag-color-accent').dark);
      expect(dark.l).toBeGreaterThan(parseColor(presets[id].accent).l);
      expect(dark.h).toBeCloseTo(parseColor(presets[id].accent).h, 3);
    }
  });

  test('border follows the neutral ramp re-hued to neutralHue', () => {
    const hues = new Set<number>();
    for (const id of IDS) {
      const b = pair(mainDecls(presetCssText[id]), '--ag-color-border');
      for (const side of [b.light, b.dark]) {
        const c = parseColor(side);
        expect(c.h).toBeCloseTo(presets[id].neutralHue, 3);
        hues.add(Math.round(c.h));
      }
    }
    expect(hues.size).toBeGreaterThan(1);
  });

  test('contrast pairs hold in both schemes', () => {
    const failures: string[] = [];
    for (const id of IDS) {
      const d = mainDecls(presetCssText[id]);
      const canvas = pair(d, '--ag-color-canvas');
      const accent = pair(d, '--ag-color-accent');
      const onAccent = pair(d, '--ag-color-on-accent');
      const border = pair(d, '--ag-color-border');
      for (const s of ['light', 'dark'] as const) {
        const a = wcagContrast(accent[s], canvas[s]);
        const o = wcagContrast(onAccent[s], accent[s]);
        const b = wcagContrast(border[s], canvas[s]);
        if (a < 3) failures.push(`${id}/${s} accent/canvas ${a.toFixed(2)}`);
        if (o < 4.5) failures.push(`${id}/${s} on-accent/accent ${o.toFixed(2)}`);
        if (b < 3) failures.push(`${id}/${s} border/canvas ${b.toFixed(2)}`);
      }
    }
    expect(failures).toEqual([]);
  });

  test('radius xs..xl = default ladder x radiusScale', () => {
    const base = mainDecls(presetCssText.aura);
    for (const id of IDS) {
      const d = mainDecls(presetCssText[id]);
      const scale = presets[id].radiusScale ?? 1;
      for (const v of RADIUS_VARS) {
        expect(parseFloat(d.get(v)!)).toBeCloseTo(parseFloat(base.get(v)!) * scale, 4);
        expect(d.get(v)).toMatch(/px$/);
      }
    }
    // the aura ladder is the :root ladder
    const root = DIST_CSS[0]![1];
    for (const v of RADIUS_VARS) expect(root).toContain(`${v}: ${base.get(v)};`);
  });

  test('no-light-dark() fallback repeats each side', () => {
    for (const id of IDS) {
      const d = mainDecls(presetCssText[id]);
      const root = postcss.parse(presetCssText[id]);
      const sup = root.nodes.find((n) => n.type === 'atrule' && n.name === 'supports');
      expect(sup && (sup as postcss.AtRule).params).toBe('not (color: light-dark(#000, #fff))');
      const sides = new Map<string, Map<string, string>>();
      (sup as postcss.AtRule).walkRules((r) => {
        const m = new Map<string, string>();
        r.walkDecls((x) => void m.set(x.prop, x.value));
        sides.set(r.selector, m);
      });
      const light = sides.get('[data-ag-root]')!;
      const dark = sides.get('[data-ag-root][data-ag-scheme="dark"]')!;
      const media = sides.get('[data-ag-root]:not([data-ag-scheme])')!;
      for (const v of COLOR_VARS) {
        expect(light.get(v)).toBe(pair(d, v).light);
        expect(dark.get(v)).toBe(pair(d, v).dark);
        expect(media.get(v)).toBe(pair(d, v).dark);
      }
    }
  });

  test('aura reproduces the default sys accent/border pairs', async () => {
    const { records, resolved } = await load();
    const { presetOverrides } = await emitter();
    const { colorToCss } = await import('../../scripts/tokens/color.mjs');
    const o = presetOverrides('aura', records, resolved);
    for (const t of ['accent', 'border'] as const) {
      const sys = resolved.get(`sys.color.${t}`);
      if (!sys || typeof sys !== 'object' || !('light' in sys) || !('dark' in sys))
        throw new Error(`sys.color.${t} must contain light/dark colors`);
      expect(colorToCss(o.colors[t].light)).toBe(colorToCss(sys.light as import('../../scripts/tokens/color.mjs').DtcgColorValue));
      expect(colorToCss(o.colors[t].dark)).toBe(colorToCss(sys.dark as import('../../scripts/tokens/color.mjs').DtcgColorValue));
    }
  });

  test('generated presets.ts is current (emitter output)', async () => {
    const { records, resolved } = await load();
    const { presetOverrides, presetCssText: emit } = await emitter();
    for (const id of IDS) expect(emit(presetOverrides(id, records, resolved))).toBe(presetCssText[id]);
  });

  describe('fails closed', () => {
    const exitSpy = () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
      return jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
        throw new Error(`exit ${code}`);
      }) as never);
    };
    const clone = (resolved: Map<string, any>) => new Map([...resolved].map(([k, v]) => [k, structuredClone(v)]));

    test('an accent below 3:1 on its light canvas', async () => {
      const { records, resolved } = await load();
      const { presetOverrides } = await emitter();
      const r = clone(resolved);
      r.get('preset.graphite').accent = { colorSpace: 'oklch', components: [0.93, 0.01, 240], alpha: 1 };
      const spy = exitSpy();
      expect(() => presetOverrides('graphite', records, r)).toThrow('exit 1');
      expect(spy).toHaveBeenCalledWith(1);
    });

    test('an authored radius cell that is not default x radiusScale', async () => {
      const { records, resolved } = await load();
      const { presetOverrides } = await emitter();
      const r = clone(resolved);
      r.get('sys.radius.md').graphite = { value: 11, unit: 'px' };
      exitSpy();
      expect(() => presetOverrides('graphite', records, r)).toThrow('exit 1');
    });

    test('an unknown preset id', async () => {
      const { records, resolved } = await load();
      const { presetOverrides } = await emitter();
      exitSpy();
      expect(() => presetOverrides('nope', records, resolved)).toThrow('exit 1');
    });
  });
});
