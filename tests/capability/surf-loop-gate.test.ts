// tests/capability/surf-loop-gate.test.ts — REQ-SURF-190 (REQ-FIN-90), the
// SURF share of the REQ-FIN-12 loop gate (PRD-F §6.1 transfer).
//
// Every `infinite` animation and every use of the ambient-duration token in a
// SURF CSS file must sit under [data-ag-continuous="on"], which the provider
// writes only when allowContinuous && motion === 'full'. A rule counts as
// gated when every one of its selectors (after dropping :not(...) groups, so a
// negated gate never counts) carries the gate, or a nesting ancestor rule
// does. Outside the gate each part keeps its static frame, so a story at rest
// has 0 running loops at every motion setting (tests/e2e/surf/motion/idle.spec.ts).
//
// FIN-A's scripts/mat/verify-motion-css.mjs enforces the same rule repo-wide
// with an expiring baseline; this test keeps SURF at 0 offenders with no
// baseline at all.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import type { AtRule, ChildNode, Container, Declaration, Rule } from 'postcss';

const ROOT = process.cwd();

/** SURF-owned CSS roots (PRD-F §6, FIN-F "May touch"). */
const SURF_CSS_ROOTS = [
  'src/app-shell', 'src/data', 'src/date', 'src/ai', 'src/media', 'src/backdrops',
  'src/charts', 'src/three', 'src/compat/surf',
  'src/components/tabs', 'src/components/tab-bar', 'src/components/breadcrumbs',
  'src/components/pagination', 'src/components/command-palette',
  'src/components/source-transition', 'src/components/timeline',
  'packages/labs/src',
];

function* cssFiles(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === '__fixtures__') continue;
      yield* cssFiles(p);
    } else if (name.endsWith('.css')) yield p;
  }
}

const GATE_RE = /\[\s*data-ag-continuous\s*=\s*(?:"on"|'on'|on)\s*\]/;

/** Drop every :not(...) group (balanced parens). */
function stripNot(selector: string): string {
  let out = '';
  for (let i = 0; i < selector.length; i++) {
    if (selector.startsWith(':not(', i)) {
      let depth = 0;
      let j = i + ':not'.length;
      for (; j < selector.length; j++) {
        if (selector[j] === '(') depth++;
        else if (selector[j] === ')') { depth--; if (depth === 0) break; }
      }
      i = j;
      continue;
    }
    out += selector[i];
  }
  return out;
}

const ruleIsGated = (rule: Rule): boolean =>
  rule.selectors.length > 0 && rule.selectors.every((s) => GATE_RE.test(stripNot(s)));

function gatedByAncestry(node: ChildNode): boolean {
  let p: Container | undefined = node.parent as Container | undefined;
  while (p) {
    if (p.type === 'rule' && ruleIsGated(p as Rule)) return true;
    p = p.parent as Container | undefined;
  }
  return false;
}

const isLoop = (d: Declaration): boolean =>
  (/^animation(-iteration-count)?$/i.test(d.prop) && /\binfinite\b/i.test(d.value)) ||
  d.value.includes('--ag-duration-ambient');

/** ungatedLoops(css, file) → ["file:line prop: value", …] */
function ungatedLoops(css: string, file = '<css>'): string[] {
  const out: string[] = [];
  postcss.parse(css, { from: file }).walkDecls((d) => {
    if (!isLoop(d)) return;
    // @keyframes bodies never loop by themselves
    const grand = d.parent?.parent;
    if (grand?.type === 'atrule' && (grand as AtRule).name.endsWith('keyframes')) return;
    if (gatedByAncestry(d)) return;
    out.push(`${file}:${d.source?.start?.line ?? 0} ${d.prop}: ${d.value}`);
  });
  return out;
}

describe('SURF loop gate (REQ-SURF-190, REQ-FIN-12 SURF share)', () => {
  const files = SURF_CSS_ROOTS.flatMap((r) => [...cssFiles(join(ROOT, r))]);

  it('scans the SURF CSS roots (non-vacuous)', () => {
    const rel = files.map((f) => relative(ROOT, f));
    expect(rel).toEqual(expect.arrayContaining(['src/ai/ai.css', 'src/backdrops/backdrops.css']));
    expect(rel.length).toBeGreaterThanOrEqual(5);
  });

  it('every SURF CSS file parses (an unclosed block silently swallows the rules after it)', () => {
    const broken: string[] = [];
    for (const f of files) {
      try { postcss.parse(readFileSync(f, 'utf8'), { from: f }); } catch (e) {
        broken.push(`${relative(ROOT, f)}: ${(e as Error).message}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('every SURF infinite animation / ambient duration sits under [data-ag-continuous="on"]', () => {
    const offenders = files.flatMap((f) => ungatedLoops(readFileSync(f, 'utf8'), relative(ROOT, f)));
    expect(offenders).toEqual([]);
  });

  it('the ai loops (caret, running dots, typing dots) still exist, gated', () => {
    const css = readFileSync(join(ROOT, 'src/ai/ai.css'), 'utf8');
    const gatedLoops: string[] = [];
    postcss.parse(css).walkDecls((d) => {
      if (isLoop(d) && gatedByAncestry(d)) gatedLoops.push((d.parent as Rule).selector);
    });
    expect(gatedLoops).toHaveLength(3);
    for (const part of ['caret', 'running-dots', 'typing-dot']) {
      expect(gatedLoops.some((s) => s.includes(`"${part}"`))).toBe(true);
    }
  });

  it('fails an ungated loop, a negated gate, a partially gated selector list and a bare ambient duration', () => {
    const bad = `
      @layer ag.components {
        .a { animation: spin 1s linear infinite; }
        :root:not([data-ag-continuous=on]) .b { animation: spin 1s infinite; }
        [data-ag-continuous=on] .c, .d { animation-iteration-count: infinite; }
        .e { animation-duration: var(--ag-duration-ambient); }
      }`;
    const found = ungatedLoops(bad, 'fixture.css');
    expect(found).toHaveLength(4);
    expect(found[0]).toMatch(/^fixture\.css:3 animation: spin 1s linear infinite$/);
  });

  it('passes a gated loop, a nested gate and keyframes', () => {
    const good = `
      @layer ag.components {
        @keyframes spin { from { rotate: 0deg; } to { rotate: 360deg; } }
        [data-ag-continuous='on'] .a { animation: spin 1s infinite; }
        [data-ag-continuous="on"] { .b { animation-iteration-count: infinite; } }
        .c { animation: spin 1s 1; }
      }`;
    expect(ungatedLoops(good, 'fixture.css')).toEqual([]);
  });
});
