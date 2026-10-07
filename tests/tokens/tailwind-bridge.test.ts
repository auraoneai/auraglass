/** @jest-environment node */
import { describe, test, expect, beforeAll } from '@jest/globals';
// MAT-069: Tailwind bridge — compile the fixture input.css with @tailwindcss/node
// over glass-regular glass-thin content-sunken bg-accent/50 ag-dark:bg-canvas;
// each @utility output byte-equals its attribute rule; bg-accent/50 emits
// color-mix(in oklab, ...); ag-dark output is scoped by [data-ag-scheme=dark].
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const INPUT = join(ROOT, 'tests/tokens/fixtures/tailwind/input.css');
const LADDERS = readFileSync(join(ROOT, 'src/material/css/generated/ladders.css'), 'utf8');

/** Declarations of the attribute rule for a variant/thickness cell (minus ladder vars). */
const attributeDecls = (variant: string, thickness: string): string[] => {
  const root = postcss.parse(LADDERS);
  let decls: string[] = [];
  root.walkRules((r) => {
    const sel = r.selector.replace(/\s+/g, ' ');
    if (sel === `[data-ag-variant="${variant}"][data-ag-thickness="${thickness}"]`) {
      decls = r.nodes!
        .filter((n) => n.type === 'decl')
        .map((n) => `${(n as postcss.Declaration).prop}: ${(n as postcss.Declaration).value}`.replace(/\s+/g, ' '))
        .filter((d) => !d.startsWith('--_ag-ladder-'));
    }
  });
  return decls;
};

/** Declarations of a utility class rule in the compiled css. */
const utilityDecls = (css: string, klass: string): string[] => {
  const root = postcss.parse(css);
  const decls: string[] = [];
  root.walkRules((r) => {
    if (r.selector === `.${klass}`) {
      r.walkDecls((d) => { decls.push(`${d.prop}: ${d.value}`.replace(/\s+/g, ' ')); });
    }
  });
  return decls;
};

let builtCss = '';

beforeAll(() => {
  // @tailwindcss/node calls module.registerHooks which jest forbids — compile
  // in a child node process and read its stdout.
  const dir = mkdtempSync(join(tmpdir(), 'ag-tw-'));
  const script = join(dir, 'compile.mjs');
  const out = join(dir, 'out.css');
  writeFileSync(script, `
    import { readFileSync, writeFileSync } from 'node:fs';
    import { dirname, join } from 'node:path';
    import { createRequire } from 'node:module';
    const req = createRequire(${JSON.stringify(join(ROOT, 'x.js'))});
    const { compile } = await import(req.resolve('@tailwindcss/node'));
    const input = ${JSON.stringify(INPUT)};
    const c = await compile(readFileSync(input, 'utf8'), { base: dirname(input), onDependency: () => {} });
    writeFileSync(${JSON.stringify(out)}, c.build(['glass-regular', 'glass-thin', 'content-sunken', 'bg-accent/50', 'ag-dark:bg-canvas']));
  `);
  execFileSync('node', [script], { cwd: ROOT, stdio: 'pipe' });
  builtCss = readFileSync(out, 'utf8');
}, 60_000);

describe('tailwind bridge (MAT-069)', () => {
  test('compiler emitted rules for all candidates', () => {
    for (const klass of ['glass-regular', 'glass-thin', 'content-sunken'])
      expect(utilityDecls(builtCss, klass).length).toBeGreaterThan(0);
  });

  test('glass-regular decls byte-equal the attribute rule', () => {
    const attr = attributeDecls('regular', 'regular');
    const util = utilityDecls(builtCss, 'glass-regular');
    expect(attr.length).toBeGreaterThan(0);
    expect(util).toEqual(attr);
  });

  test('glass-thin decls byte-equal the attribute rule', () => {
    const attr = attributeDecls('regular', 'thin');
    const util = utilityDecls(builtCss, 'glass-thin');
    expect(attr.length).toBeGreaterThan(0);
    expect(util).toEqual(attr);
  });

  test('content-sunken decls byte-equal the attribute rule', () => {
    const root = postcss.parse(LADDERS);
    let attr: string[] = [];
    root.walkRules((r) => {
      if (r.selector === '[data-ag-content="content-sunken"][data-ag-thickness="regular"]') {
        attr = r.nodes!.filter((n) => n.type === 'decl')
          .map((n) => `${(n as postcss.Declaration).prop}: ${(n as postcss.Declaration).value}`.replace(/\s+/g, ' '));
      }
    });
    const util = utilityDecls(builtCss, 'content-sunken');
    expect(attr.length).toBeGreaterThan(0);
    expect(util).toEqual(attr);
  });

  test('bg-accent/50 emits color-mix(in oklab, ...)', () => {
    expect(builtCss).toContain('.bg-accent\\/50');
    expect(builtCss).toMatch(/color-mix\(in oklab,\s*var\(--ag-color-accent\) 50%,\s*transparent\)/);
  });

  test('ag-dark:bg-canvas is scoped by [data-ag-scheme="dark"]', () => {
    const root = postcss.parse(builtCss);
    let found = false;
    root.walkRules((r) => {
      if (r.selector.includes('bg-canvas')) {
        found = true;
        expect(r.selector).toContain('data-ag-scheme="dark"');
      }
    });
    expect(found).toBe(true);
  });
});
