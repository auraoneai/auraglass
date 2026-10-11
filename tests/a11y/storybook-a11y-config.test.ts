/* MAT-311 / REQ-FIN-59 (FIN-D.3 D.3-40): Storybook a11y config, reconciled with
   REQ-QUAL-49..57 and the frozen preview globals (contract §4.11, S-20/S-42).

   What MAT asserts here (it never edits `.storybook/**`, which is QUAL's):
   1. The preview's `globalTypes` are exactly the frozen set — `scheme`,
      `contrast`, `transparency`, `motion`, `density`, `tier`, `scene` with the
      frozen values and defaults; `scene` enumerates the S-42 `SCENES`. The
      archived MAT globals `environment`, `glassOpacity`, `forcedColors` are gone.
   2. Globals reach the tree through the decorator (AuraGlassProvider props or
      `data-ag-*` attributes), never as `<Story>` props or a spread of globals.
   3. The axe rule set is never narrowed in Storybook (REQ-QUAL-57: addon-a11y
      runs in the interactive Storybook): no `parameters.a11y` in the preview or
      in any story file in the `.storybook/main.ts` globs disables a rule,
      disables the addon, sets `test: 'off'`, or narrows `runOnly` below
      wcag2a + wcag2aa. `color-contrast` stays on.
   4. The gate of record (REQ-QUAL-19; MAT's lane `tests/e2e/mat/axe.spec.ts`)
      runs the wcag2a/2aa/21aa/22aa rule set (which includes `color-contrast`),
      never disables a rule, fails on any `serious`/`critical` violation
      (serious/critical = 0) and sweeps `photo` + `flat-white` × light/dark.
   5. Every literal `globals=` pair in MAT's browser specs names a frozen global
      and one of its frozen values (no `environment:`).

   The preview is evaluated, not imported: `.storybook/preview.tsx` is transpiled
   in memory and run with `src/contracts/**` resolved for real and every other
   module (QUAL's StoryFrame, style loaders, docs page) replaced by an inert stub,
   so the test reads the same config object whichever QUAL decorator ships and
   writes nothing to disk. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import * as React from 'react';
import { SCENES } from '../../src/contracts/testing';

const ROOT = path.resolve(__dirname, '../..');
const PREVIEW = path.join(ROOT, '.storybook/preview.tsx');
const MAIN = path.join(ROOT, '.storybook/main.ts');
const AXE_SPEC = path.join(ROOT, 'tests/e2e/mat/axe.spec.ts');
const MAT_BROWSER_SPEC_DIRS = ['tests/e2e/mat', 'tests/visual/mat', 'tests/perf/browser/mat', 'tests/a11y/apg/mat'];

/* Contract §4.11 `.storybook/preview.tsx`: frozen names, values and defaults. */
const FROZEN_GLOBALS: Record<string, { defaultValue: string; items: readonly string[] }> = {
  scheme: { defaultValue: 'light', items: ['light', 'dark'] },
  contrast: { defaultValue: 'standard', items: ['standard', 'more'] },
  transparency: { defaultValue: 'glass', items: ['glass', 'tinted', 'solid'] },
  motion: { defaultValue: 'full', items: ['full', 'calm', 'none'] },
  density: { defaultValue: 'regular', items: ['compact', 'regular', 'spacious'] },
  tier: { defaultValue: 'standard', items: ['lightweight', 'standard', 'enhanced'] },
  scene: { defaultValue: 'photo', items: SCENES },
};
const S42_SCENES = ['photo', 'saturated-abstract', 'dense-text', 'dark-media', 'flat-white', 'flat-black', 'hf-pattern', 'video-frame'];

type A11yRule = { id?: string; enabled?: boolean };
type A11yParams = {
  disable?: boolean;
  test?: string;
  config?: { rules?: A11yRule[] };
  options?: { runOnly?: unknown; rules?: Record<string, { enabled?: boolean }> };
};
type PreviewConfig = {
  globalTypes?: Record<string, { defaultValue?: unknown; toolbar?: { items?: unknown[] } }>;
  parameters?: Record<string, unknown> & { a11y?: A11yParams };
  decorators?: unknown[];
};

/* An inert module: every property read, call or construction returns the stub. */
function inertModule(): unknown {
  const target = function stub() { /* inert */ };
  const proxy: unknown = new Proxy(target, {
    get: (_t, key) => (key === Symbol.toPrimitive ? () => '' : key === '__esModule' ? true : proxy),
    apply: () => proxy,
    construct: () => proxy as object,
  });
  return proxy;
}

function loadPreview(): PreviewConfig {
  const src = fs.readFileSync(PREVIEW, 'utf8').replace(/\bimport\.meta\b/g, '__agImportMeta');
  const { outputText } = ts.transpileModule(src, {
    fileName: PREVIEW,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  });
  const contractsDir = path.join(ROOT, 'src/contracts') + path.sep;
  const req = (spec: string): unknown => {
    if (spec === 'react') return React;
    if (spec.startsWith('.')) {
      const abs = path.resolve(path.dirname(PREVIEW), spec);
      if (abs.startsWith(contractsDir)) return jest.requireActual(abs);
    }
    return inertModule();
  };
  const mod = { exports: {} as Record<string, unknown> };
  vm.runInNewContext(outputText, {
    require: req, module: mod, exports: mod.exports, console,
    __agImportMeta: { glob: () => ({}), env: {} },
  }, { filename: PREVIEW });
  return (mod.exports.default ?? mod.exports) as PreviewConfig;
}

/* `.storybook/main.ts` story globs → existing root directories + accepted file suffixes. */
function storyFiles(): string[] {
  const main = fs.readFileSync(MAIN, 'utf8');
  const block = /stories:\s*\[([\s\S]*?)\]/.exec(main)?.[1] ?? '';
  const globs = [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  expect(globs.length).toBeGreaterThan(0);
  const roots = new Set<string>();
  for (const g of globs) {
    const prefix = g.slice(0, g.indexOf('*')).replace(/\/$/, '');
    roots.add(path.resolve(path.dirname(MAIN), prefix));
  }
  const out: string[] = [];
  const walk = (dir: string): void => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.git')) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.stories\.tsx?$|\.mdx$/.test(e.name)) out.push(p);
    }
  };
  for (const r of roots) walk(r);
  return out;
}

function filesUnder(rel: string, re: RegExp): string[] {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (d: string): void => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (re.test(e.name)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

/* Source patterns that switch an axe check off in Storybook. */
const A11Y_OFF: Array<[string, RegExp]> = [
  ['rule disabled ({ id, enabled: false })', /id:\s*['"][\w-]+['"]\s*,\s*enabled:\s*false/],
  ['rule disabled ({ <rule>: { enabled: false } })', /['"]?[\w-]+['"]?\s*:\s*\{\s*enabled:\s*false/],
  ['addon disabled (a11y.disable)', /a11y\s*:\s*\{[^}]*\bdisable\s*:\s*true/],
  ['addon test off (a11y.test)', /a11y\s*:\s*\{[^}]*\btest\s*:\s*['"]off['"]/],
  ['color-contrast mentioned with enabled: false', /color-contrast[\s\S]{0,80}enabled:\s*false/],
];

const rel = (p: string): string => path.relative(ROOT, p);

describe('storybook a11y config (REQ-FIN-59 / REQ-QUAL-49..57)', () => {
  const SRC = fs.readFileSync(PREVIEW, 'utf8');
  const preview = loadPreview();

  it('S-42 SCENES are the 8 contract scenes', () => {
    expect([...SCENES]).toEqual(S42_SCENES);
  });

  it('globalTypes are exactly the frozen globals (names, values, defaults)', () => {
    const g = preview.globalTypes ?? {};
    expect(Object.keys(g).sort()).toEqual(Object.keys(FROZEN_GLOBALS).sort());
    for (const [name, frozen] of Object.entries(FROZEN_GLOBALS)) {
      expect({ name, defaultValue: g[name]?.defaultValue, items: g[name]?.toolbar?.items })
        .toEqual({ name, defaultValue: frozen.defaultValue, items: [...frozen.items] });
    }
    for (const archived of ['environment', 'glassOpacity', 'forcedColors']) {
      expect(g[archived]).toBeUndefined();
    }
  });

  it('globals never become component props', () => {
    expect(Array.isArray(preview.decorators)).toBe(true);
    expect(/<Story\s+[^/>]*\w+=/.test(SRC)).toBe(false);
    expect(/<Story\s+\{\s*\.\.\./.test(SRC)).toBe(false);
  });

  it('preview parameters.a11y keeps the full axe rule set with color-contrast on', () => {
    const a11y = preview.parameters?.a11y;
    if (a11y !== undefined) {
      expect(a11y.disable).not.toBe(true);
      expect(a11y.test).not.toBe('off');
      expect((a11y.config?.rules ?? []).filter((r) => r.enabled === false).map((r) => r.id)).toEqual([]);
      const optRules = a11y.options?.rules ?? {};
      expect(Object.entries(optRules).filter(([, v]) => v?.enabled === false).map(([k]) => k)).toEqual([]);
      const runOnly = a11y.options?.runOnly as unknown;
      if (runOnly !== undefined) {
        const values = Array.isArray(runOnly) ? runOnly
          : (runOnly as { values?: unknown[] }).values ?? [];
        const type = Array.isArray(runOnly) ? 'tag' : (runOnly as { type?: string }).type;
        expect(type === 'tag' || type === 'tags').toBe(true);
        expect(values).toEqual(expect.arrayContaining(['wcag2a', 'wcag2aa']));
      }
    }
    for (const [label, re] of A11Y_OFF) expect({ label, hit: re.test(SRC) }).toEqual({ label, hit: false });
  });

  it('no story in the main.ts globs switches an axe check off', () => {
    const files = storyFiles();
    expect(files.length).toBeGreaterThan(0);
    const offenders: string[] = [];
    for (const f of files) {
      const text = fs.readFileSync(f, 'utf8');
      if (!/\ba11y\b|color-contrast/.test(text)) continue;
      for (const [label, re] of A11Y_OFF) if (re.test(text)) offenders.push(`${rel(f)}: ${label}`);
    }
    expect(offenders).toEqual([]);
  });

  it('addon-a11y is the pinned frozen-set version (REQ-QUAL-57, contract §4.12)', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as { devDependencies?: Record<string, string> };
    expect(pkg.devDependencies?.['@storybook/addon-a11y']).toBe('9.1.20');
    const main = fs.readFileSync(MAIN, 'utf8');
    expect(/addon-a11y['"]\s*,\s*options\s*:/.test(main)).toBe(false);
  });

  it('gate of record: MAT axe lane runs the full wcag rule set and fails on serious/critical', () => {
    const spec = fs.readFileSync(AXE_SPEC, 'utf8');
    const tags = /\.withTags\(\s*\[([^\]]*)\]\s*\)/.exec(spec)?.[1] ?? '';
    for (const t of ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']) expect(tags).toContain(`'${t}'`);
    expect(spec).not.toMatch(/\.disableRules\(/);
    expect(spec).not.toMatch(/\.withRules\(/);
    expect(spec).not.toMatch(/\.exclude\(/);
    expect(spec).toMatch(/impact\s*===\s*'serious'\s*\|\|\s*v\.impact\s*===\s*'critical'/);
    expect(spec).toMatch(/expect\([^)]*seriousCriticalFails[^)]*\)[^;]*\.toEqual\(\[\]\)/);
    const scenes = /const scenes\s*=\s*([^;]+);/.exec(spec)?.[1] ?? '';
    for (const s of ['photo', 'flat-white']) expect(scenes).toContain(`'${s}'`);
    const schemes = /const schemes\s*=\s*([^;]+);/.exec(spec)?.[1] ?? '';
    for (const s of ['light', 'dark']) expect(schemes).toContain(`'${s}'`);
  });

  it('MAT browser specs address only frozen globals and values', () => {
    const files = MAT_BROWSER_SPEC_DIRS.flatMap((d) => filesUnder(d, /\.spec\.ts$/));
    expect(files.length).toBeGreaterThan(0);
    const bad: string[] = [];
    /* Quoted literals ('transparency:tinted') are only global pairs when they name a frozen or archived global;
       `globals=` query segments are always global pairs. */
    const ARCHIVED = ['environment', 'glassOpacity', 'forcedColors', 'backgrounds', 'persona'];
    const check = (f: string, pairs: string, strict: boolean): void => {
      for (const pair of pairs.split(';')) {
        const m = /^([A-Za-z]+):([A-Za-z0-9-]+|\$\{[^}]+\})$/.exec(pair);
        if (!m) continue;
        const [, name, value] = m;
        if (!strict && !FROZEN_GLOBALS[name] && !ARCHIVED.includes(name)) continue;
        const frozen = FROZEN_GLOBALS[name];
        if (!frozen) bad.push(`${rel(f)}: unknown global "${name}"`);
        else if (!value.startsWith('${') && !frozen.items.includes(value)) bad.push(`${rel(f)}: ${name}:${value} not a frozen value`);
      }
    };
    for (const f of files) {
      const text = fs.readFileSync(f, 'utf8');
      for (const m of text.matchAll(/globals=([^&`'"\s]+)/g)) if (!m[1].startsWith('${')) check(f, m[1], true);
      for (const m of text.matchAll(/['"]((?:[A-Za-z]+:[a-z0-9-]+;?)+)['"]/g)) check(f, m[1], false);
    }
    expect(bad).toEqual([]);
  });
});
