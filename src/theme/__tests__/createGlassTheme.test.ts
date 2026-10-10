/* MAT-249: createGlassTheme options contract — the 4.x option names (minus
   the 4.x motion-policy option, compat-only per REQ-MAT-45 / D.3-27), system
   mode unpinned, high-contrast maps to contrast 'more', cssText keyed on
   [data-ag-theme] never :root, every emitted var is a consumed manifest key,
   pure under worker_threads, 4 colour syntaxes agree within dE2000 <= 0.5. */
import { describe, expect, it } from '@jest/globals';
import { Worker, isMainThread, workerData } from 'node:worker_threads';
import { createGlassTheme } from '../createGlassTheme';
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
    // REQ-MAT-45: the 5.0 theme never sets motion; the 4.x option is compat-only
    expect(theme.tokens.motion).toEqual({ axis: 'system', allowContinuous: false });
    expect(theme.contrast.pairs.length).toBeGreaterThan(0);
    expect(theme.contrast.pairs.every((p) => p.pass)).toBe(true);
  });

  it("mode 'system' emits no scheme pin and no 'color-scheme: dark'", () => {
    const theme = createGlassTheme({ mode: 'system' });
    expect(theme.vars['--ag-color-canvas']).toContain('light-dark(');
    expect(theme.cssText).not.toContain('color-scheme: dark');
    expect(theme.cssText).not.toContain('prefers-color-scheme');
  });

  it("mode 'high-contrast' resolves contrast 'more' and the dark canvas", () => {
    const theme = createGlassTheme({ mode: 'high-contrast' });
    expect(theme.tokens.contrast).toBe('more');
    expect(theme.vars['--ag-color-canvas']).not.toContain('light-dark(');
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
