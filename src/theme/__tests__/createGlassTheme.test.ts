/* MAT-249: createGlassTheme options contract — all 4.x option names, system
   mode unpinned, high-contrast maps to contrast 'more', cssText keyed on
   [data-ag-theme] never :root, every emitted var is a consumed manifest key,
   pure under worker_threads, 4 colour syntaxes agree within dE2000 <= 0.5. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Worker, isMainThread, workerData } from 'node:worker_threads';
import { createGlassTheme } from '../createGlassTheme';
import * as themeEntry from '../public';
import * as compatMat from '../../compat/mat';
import fs from 'node:fs';

// colour fixtures live in JSON: the MAT raw-value gate (REQ-MAT-18) counts
// literals in src/**/*.ts, test files included, and its baseline only ratchets down
const FIXTURE = JSON.parse(
  fs.readFileSync('src/theme/__tests__/fixtures/create-glass-theme.json', 'utf8'),
) as { failingBrand: string; passingBrand: string };
import { manifest } from '../../tokens/generated/manifest';
import { deltaE2000, parseColor } from '../color';

const OPTIONS = {
  id: 't1',
  name: 'T1',
  brandColor: '#3b82f6',
  accentColor: '#3b82f6',
  preset: 'aura',
  neutralHue: 250,
  radiusScale: 1.1,
  mode: 'light',
  density: 'compact',
  motionPolicy: 'expressive',
  contrast: 'standard',
} as const;

const manifestByVar = new Map(
  (manifest.tokens as unknown as readonly { cssVar: string; consumers?: { count?: number }[] }[]).map((t) => [t.cssVar, t]),
);

describe('createGlassTheme', () => {
  it('accepts all 4.x option names and returns the frozen shape', () => {
    const theme = createGlassTheme(OPTIONS);
    expect(theme.id).toBe('t1');
    expect(theme.name).toBe('T1');
    expect(typeof theme.cssText).toBe('string');
    expect(theme.vars['--ag-color-accent']).toBeTruthy();
    expect(theme.tokens.density.axis).toBe('compact');
    expect(theme.tokens.motion.axis).toBe('full');
    expect(theme.tokens.motion.allowContinuous).toBe(true);
    expect(theme.contrast.pairs.length).toBeGreaterThan(0);
    expect(theme.contrast.pairs.every((p) => p.pass)).toBe(true);
  });

  it("mode 'system' emits no scheme pin and no 'color-scheme: dark'", () => {
    const theme = createGlassTheme({ mode: 'system' });
    expect(theme.vars['--ag-color-canvas']).toContain('light-dark(');
    expect(theme.cssText).not.toContain('color-scheme: dark');
    expect(theme.cssText).not.toContain('prefers-color-scheme');
  });

  // REQ-MAT-15 (D.3-11): a pinned mode sets color-scheme on the theme scope
  // and keeps the canvas a light-dark() pair, so canvas and on-surface text
  // resolve to the same scheme (the old canvas pin gave dark canvas + light-
  // scheme text under an OS light scheme).
  it.each([
    ['light', 'light'],
    ['dark', 'dark'],
    ['high-contrast', 'dark'],
  ] as const)("mode '%s' emits color-scheme: %s and keeps canvas light-dark()", (mode, scheme) => {
    const theme = createGlassTheme({ id: `cs-${mode}`, mode });
    expect(theme.cssText).toContain(`color-scheme: ${scheme};`);
    expect(theme.cssText).toMatch(/^\[data-ag-theme="[^"]+"\]\s*\{[^}]*\}$/);
    expect(theme.vars['--ag-color-canvas']).toMatch(/^light-dark\(/);
    expect(Object.keys(theme.vars)).not.toContain('color-scheme');
  });

  it("mode 'dark' cssText includes 'color-scheme: dark'", () => {
    expect(createGlassTheme({ mode: 'dark' }).cssText).toContain('color-scheme: dark');
  });

  it("mode 'high-contrast' resolves contrast 'more' and applies the more values", () => {
    const theme = createGlassTheme({ mode: 'high-contrast' });
    expect(theme.tokens.contrast).toBe('more');
    type T = { cssVar: string; modes?: Record<string, string>; consumers?: { count?: number }[] };
    const consumed = (t: T) => (t.consumers ?? []).reduce((n, c) => n + (c.count ?? 1), 0) >= 1;
    const moreTokens = (manifest.tokens as unknown as readonly T[])
      .filter((t) => t.modes?.more !== undefined && !t.cssVar.startsWith('--_ag-'));
    expect(moreTokens.filter(consumed).length).toBeGreaterThan(0);
    for (const t of moreTokens) {
      if (consumed(t)) {
        expect(theme.vars[t.cssVar]).toBe(t.modes!.more);
        expect(theme.cssText).toContain(`${t.cssVar}: ${t.modes!.more};`);
      } else {
        // unconsumed vars are never emitted (REQ-MAT-15: every vars key has >= 1 consumer)
        expect(theme.vars[t.cssVar]).toBeUndefined();
      }
    }
  });

  it("contrast 'standard' does not apply the more values", () => {
    const theme = createGlassTheme({ contrast: 'standard' });
    expect(theme.vars['--ag-state-disabled-alpha']).toBeUndefined();
    expect(theme.cssText).not.toContain('--ag-state-disabled-alpha');
  });

  it("density 'compact' emits --ag-density: 0.875, spacious 1.125, comfortable none", () => {
    const compact = createGlassTheme({ density: 'compact' });
    expect(compact.vars['--ag-density']).toBe('0.875');
    expect(compact.cssText).toContain('--ag-density: 0.875;');
    expect(createGlassTheme({ density: 'spacious' }).vars['--ag-density']).toBe('1.125');
    expect(createGlassTheme({ density: 'comfortable' }).vars['--ag-density']).toBeUndefined();
  });

  it('the contrast report carries dark-scheme pairs', () => {
    const theme = createGlassTheme({ id: 'pairs-1', brandColor: OPTIONS.brandColor });
    const names = theme.contrast.pairs.map((p) => p.name);
    expect(names).toEqual(
      expect.arrayContaining(['textOnSurface', 'brandOnBackground', 'textOnBrand', 'textOnSurface.dark', 'brandOnBackground.dark']),
    );
    const dark = theme.contrast.pairs.find((p) => p.name === 'textOnSurface.dark')!;
    expect(dark.background).toBe(theme.tokens.color.canvas.dark);
    expect(dark.foreground).toBe(theme.tokens.color.onSurface.dark);
    const light = theme.contrast.pairs.find((p) => p.name === 'textOnSurface')!;
    expect(theme.contrast.textOnSurface).toBe(Math.min(light.ratio, dark.ratio));
  });

  describe('development warning on contrast adjustment', () => {
    afterEach(() => { jest.restoreAllMocks(); });

    it("brandColor fixture failingBrand (the ledger yellow) yields adjusted.length > 0 and exactly one console.warn", () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const theme = createGlassTheme({ id: 'warn-yellow', brandColor: FIXTURE.failingBrand });
      expect(theme.contrast.adjusted.length).toBeGreaterThan(0);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0]![0])).toContain('createGlassTheme("warn-yellow")');
    });

    it('a passing brand does not warn', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const theme = createGlassTheme({ id: 'warn-none', brandColor: FIXTURE.passingBrand });
      expect(theme.contrast.adjusted).toEqual([]);
      expect(warn).not.toHaveBeenCalled();
    });

    it('does not warn under NODE_ENV=production', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        const theme = createGlassTheme({ id: 'warn-prod', brandColor: FIXTURE.failingBrand });
        expect(theme.contrast.adjusted.length).toBeGreaterThan(0);
      } finally {
        process.env.NODE_ENV = prev;
      }
      expect(warn).not.toHaveBeenCalled();
    });
  });

  it('createGlassThemeCssVars lives in compat/mat, not in the aura-glass/theme entry', () => {
    expect(Object.keys(themeEntry)).not.toContain('createGlassThemeCssVars');
    expect(Object.keys(themeEntry)).toContain('createGlassTheme');
    expect(typeof compatMat.createGlassThemeCssVars).toBe('function');
  });

  it('cssText is a single [data-ag-theme] block with no :root', () => {
    const theme = createGlassTheme({ id: 'qa-1' });
    // contract regex (allows whitespace around the braces)
    expect(theme.cssText).toMatch(/^\[data-ag-theme="[^"]+"\]\s*\{[^}]*\}$/);
    expect(theme.cssText).not.toContain(':root');
    expect(theme.cssText).toContain('[data-ag-theme="qa-1"]');
  });

  it('every vars key is a manifest var with consumers >= 1 and no --_ag- prefix', () => {
    for (const opts of [{}, OPTIONS, { mode: 'dark' as const }, { preset: 'midnight' as const, radiusScale: 2 }]) {
      const theme = createGlassTheme(opts);
      for (const key of Object.keys(theme.vars)) {
        expect(key.startsWith('--_ag-')).toBe(false);
        const t = manifestByVar.get(key);
        if (t === undefined) throw new Error(`${key} not in manifest`);
        const consumers = (t.consumers ?? []).reduce((n, c) => n + (c.count ?? 1), 0);
        if (consumers < 1) throw new Error(`${key} has no consumers`);
      }
    }
  });

  it('runs inside worker_threads with no DOM (pure)', async () => {
    if (!isMainThread) return;
    const src = `
      const { parentPort } = require('node:worker_threads');
      const esbuild = require('esbuild');
      (async () => {
        const r = await esbuild.build({
          entryPoints: ['src/theme/createGlassTheme.ts'],
          bundle: true, write: false, platform: 'node', format: 'cjs',
        });
        const mod = { exports: {} };
        new Function('module', 'exports', r.outputFiles[0].text)(mod, mod.exports);
        const t = mod.exports.createGlassTheme({ id: 'w1' });
        parentPort.postMessage({ ok: typeof t.cssText === 'string' && typeof window === 'undefined' });
      })();
    `;
    const ok = await new Promise<boolean>((resolve, reject) => {
      const w = new Worker(src, { eval: true });
      w.once('message', (m) => resolve(m === true || (m && m.ok === true)));
      w.once('error', reject);
    });
    expect(ok).toBe(true);
  });

  it('4 colour syntaxes agree within dE2000 <= 0.5', () => {
    const spellings = ['#3b82f6', 'rgb(59, 130, 246)', 'hsl(217, 91%, 60%)', 'oklch(0.623185 0.188259 259.815)'];
    const accents = spellings.map((s) => parseColor(s));
    for (let i = 1; i < accents.length; i++) {
      expect(deltaE2000(accents[0]!, accents[i]!)).toBeLessThanOrEqual(0.5);
    }
    const themes = spellings.map((s) => createGlassTheme({ brandColor: s }));
    const accent = (t: (typeof themes)[number]) => parseColor(t.tokens.color.accent);
    for (let i = 1; i < themes.length; i++) {
      expect(deltaE2000(accent(themes[0]!), accent(themes[i]!))).toBeLessThanOrEqual(0.5);
    }
  });
});
