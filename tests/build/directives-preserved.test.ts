/* @jest-environment node */
/* REQ-PLAT-65: a source whose first statement is "use client" emits it as the
   first statement of its dist module; any other source emits no directive.
   Statements are read with the TypeScript compiler API, so a directive string
   in a comment or later in the file never counts. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { DIST, ROOT, SRC, ensureBuilt, walk } from './helpers';
import { parse } from './ts-graph';

type Graph = typeof import('../../scripts/build/lib/graph.mjs');
let g: Graph;
beforeAll(async () => { g = await import('../../scripts/build/lib/graph.mjs'); });

const DIRECTIVE = /^use (client|server)$/;
/** directive prologue strings ("use client", "use server") of a module. */
function prologue(file: string): string[] {
  const out: string[] = [];
  for (const s of parse(file).statements) {
    if (!(ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression))) break;
    out.push(s.expression.text);
  }
  return out.filter((d) => DIRECTIVE.test(d));
}
/** every directive-shaped expression statement anywhere at top level (not only the prologue). */
function anyTopLevelDirective(file: string): string[] {
  return parse(file).statements
    .filter((s): s is ts.ExpressionStatement => ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression) && DIRECTIVE.test(s.expression.text))
    .map((s) => (s.expression as ts.StringLiteral).text);
}

const srcFiles = () => walk(SRC, (p) => /\.tsx?$/.test(p) && !p.endsWith('.d.ts'));

describe('directives-preserved (REQ-PLAT-65)', () => {
  it('every emitted "use client" source keeps the directive as its first dist statement', () => {
    ensureBuilt();
    const misses: string[] = [];
    for (const s of srcFiles()) {
      const dirs = prologue(s);
      if (!dirs.length) continue;
      const dist = join(DIST, `${g.distChunkStem(relative(SRC, s).replace(/\.tsx?$/, ''))}.js`);
      if (!existsSync(dist)) continue; // not emitted (seed graph / tree-shaken): preserve-modules owns presence
      const first = prologue(dist);
      if (first[0] !== dirs[0]) misses.push(`${relative(ROOT, dist)}: expected "${dirs[0]}" first, got ${JSON.stringify(first)}`);
    }
    expect(misses).toEqual([]);
  });

  it('a dist module carries a directive only when its own source starts with one', () => {
    ensureBuilt();
    const bySrc = new Map<string, string>();
    for (const s of srcFiles()) bySrc.set(`${g.distChunkStem(relative(SRC, s).replace(/\.tsx?$/, ''))}.js`, s);
    const leaks: string[] = [];
    for (const d of walk(DIST, (p) => p.endsWith('.js'))) {
      const found = anyTopLevelDirective(d);
      if (!found.length) continue;
      const src = bySrc.get(relative(DIST, d));
      const own = src ? prologue(src) : [];
      if (!own.length || found.some((x) => !own.includes(x))) leaks.push(`${relative(ROOT, d)}: ${found.join(',')} (source: ${src ? relative(ROOT, src) : 'none'})`);
    }
    expect(leaks).toEqual([]);
  });

  it('no source places a directive anywhere but its prologue', () => {
    const late = srcFiles().filter((s) => anyTopLevelDirective(s).length !== prologue(s).length).map((s) => relative(ROOT, s));
    expect(late).toEqual([]);
  });
});
