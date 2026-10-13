// REQ-SURF-155 / -158 / -159 / -160 — Backdrop CSS shape. Static reads of the
// shipped sheets (jsdom applies no cascade); the rendered behaviour is proved
// by tests/e2e/surf/backdrops/*.spec.ts and tests/e2e/surf/motion/backdrop-drift.spec.ts.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import surfCss from '../../fragments/css/surf';

const ROOT = process.cwd();
const read = (f: string) => readFileSync(join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/** Declaration bodies of every rule whose selector list matches `sel`. */
function rulesFor(css: string, sel: RegExp): string[] {
  const out: string[] = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (sel.test(m[1]!)) out.push(m[2]!);
  }
  return out;
}

const PALETTES = ['aurora', 'prism', 'ocean', 'ember', 'mono'] as const;
const S03_COLOR = /var\(--ag-color-(?:canvas|on-surface|on-surface-muted|accent|on-accent|border|focus-inner|focus-outer|specular|danger|warning|success|info)\)/;

describe('palettes (REQ-SURF-155)', () => {
  const css = read('src/backdrops/presets/palettes.css');
  it('is registered in the SURF css fragment for the backdrops bundle', () => {
    expect(surfCss.filter((row) => row.file === 'src/backdrops/presets/palettes.css'))
      .toEqual([{ file: 'src/backdrops/presets/palettes.css', layer: 'ag.components', bundle: 'backdrops.css', a11y: 'none' }]);
  });
  it.each(PALETTES)('[data-ag-palette=%s] sets the four hues from S-03 colours only', (id) => {
    const bodies = rulesFor(css, new RegExp(`\\[data-ag-palette='${id}'\\]`));
    expect(bodies).toHaveLength(1);
    for (const n of [1, 2, 3, 4]) {
      const decl = bodies[0]!.match(new RegExp(`--_ag-backdrop-c${n}\\s*:\\s*([^;]+);`));
      expect(decl).not.toBeNull();
      expect(decl![1]).toMatch(S03_COLOR);
      // no colour literal: every colour argument is an S-03 var()
      expect(decl![1]!.replace(/var\([^)]*\)/g, '')).not.toMatch(/#|rgb|hsl|oklch\(|\d+\s*%\s*,\s*\d/);
    }
  });
  it('the preset layers read the palette hues, not hard-coded colours', () => {
    expect(read('src/backdrops/presets/aurora.css')).toMatch(/var\(--_ag-backdrop-c3\)/);
    expect(read('src/backdrops/presets/mesh.css')).toMatch(/var\(--_ag-backdrop-c4\)/);
    for (const f of ['aurora', 'mesh']) {
      expect(read(`src/backdrops/presets/${f}.css`)).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i);
    }
  });
});

describe('scheme declarations (REQ-SURF-158)', () => {
  it.each(['aurora', 'mesh'])('%s.css has light, dark and auto sets; auto uses light-dark()', (preset) => {
    const css = read(`src/backdrops/presets/${preset}.css`);
    const at = (scheme: string) => rulesFor(css, new RegExp(`\\[data-ag-backdrop-preset='${preset}'\\]\\[data-ag-backdrop='${scheme}'\\]`));
    const [light, dark, auto] = [at('light'), at('dark'), at('auto')];
    expect(light).toHaveLength(1);
    expect(dark).toHaveLength(1);
    expect(auto).toHaveLength(1);
    expect(light[0]).toMatch(/color-scheme:\s*light;/);
    expect(dark[0]).toMatch(/color-scheme:\s*dark;/);
    // auto follows the inherited scheme: it never pins one, and picks per stop
    expect(auto[0]).not.toMatch(/color-scheme:/);
    const stops = [...auto[0]!.matchAll(/(--_ag-backdrop-[a-z]+-[a-z0-9]+)\s*:\s*([^;]+);/g)].filter(([, n]) => !n!.endsWith('-tint'));
    expect(stops.length).toBeGreaterThanOrEqual(3);
    for (const [, , v] of stops) expect(v).toMatch(/^light-dark\(/);
  });
});

describe('drift (REQ-SURF-159)', () => {
  const css = read('src/backdrops/backdrops.css');
  it('exactly one keyframe, named ag-backdrop-drift, animating transform only', () => {
    const frames = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
    expect(frames).toEqual(['ag-backdrop-drift']);
    const body = css.slice(css.indexOf('@keyframes ag-backdrop-drift'));
    expect(body).toMatch(/transform:\s*translate3d\(/);
    expect(body.slice(0, body.indexOf('}\n  }') + 1)).not.toMatch(/background-position/);
  });
  it('the only animation is under [data-ag-continuous=on] + .ag-backdrop--drift, as longhands', () => {
    const animated = rulesFor(css, /./).filter((b) => /\banimation(?:-name)?\s*:/.test(b) && !/animation:\s*none/.test(b));
    expect(animated).toHaveLength(1);
    const gate = rulesFor(css, /\[data-ag-continuous='on'\] \.ag-backdrop\.ag-backdrop--drift \.ag-backdrop-layer/);
    expect(gate).toHaveLength(1);
    expect(gate[0]).toMatch(/animation-name:\s*ag-backdrop-drift;/);
    expect(gate[0]).toMatch(/animation-duration:\s*var\(--ag-duration-ambient\);/);
    // the shorthand would reset animation-play-state and undo the pause rules
    expect(gate[0]).not.toMatch(/\banimation:/);
  });
  it('pauses under data-ag-offscreen and data-backdrop-hidden, off under reduced motion', () => {
    const paused = rulesFor(css, /\.ag-backdrop\[data-ag-offscreen\] \.ag-backdrop-layer/);
    expect(paused).toHaveLength(1);
    expect(paused[0]).toMatch(/animation-play-state:\s*paused/);
    expect(rulesFor(css, /\.ag-backdrop\[data-backdrop-hidden\] \.ag-backdrop-layer/)[0]).toMatch(/animation-play-state:\s*paused/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.ag-backdrop \.ag-backdrop-layer \{ animation: none; \}/);
  });
});

describe('grain + forced colours (REQ-SURF-160)', () => {
  it('grain overlay keys on data-backdrop-grain at opacity 0.03 via image-set, no blend mode', () => {
    const css = read('src/backdrops/presets/grain.css');
    const body = rulesFor(css, /\[data-backdrop-grain\]/);
    expect(body).toHaveLength(1);
    expect(body[0]).toMatch(/opacity:\s*0\.03;/);
    expect(body[0]).toMatch(/image-set\(\s*url\('\.\.\/assets\/grain-112\.avif'\) type\('image\/avif'\),\s*url\('\.\.\/assets\/grain-112\.png'\) type\('image\/png'\)/);
    expect(css).not.toMatch(/mix-blend-mode/);
  });
  it('forced-colors: decorative layer display:none and the root background is Canvas', () => {
    const css = read('src/backdrops/backdrops.css');
    const block = css.slice(css.indexOf('@media (forced-colors: active)'));
    expect(block).toMatch(/\.ag-backdrop \{ background: Canvas; \}/);
    expect(block).toMatch(/\.ag-backdrop \.ag-backdrop-layer \{ display: none; \}/);
  });
});
