/* @jest-environment node */
/* REQ-PLAT-65: externals are generated from dependencies ∪ peerDependencies ∪
   node:*; every bare specifier dist imports is in that set, and no node_modules/
   segment or inlined @base-ui / @tanstack source appears in dist/. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';
import { parse } from './ts-graph';

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>; peerDependencies?: Record<string, string>;
};
const ALLOWED = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]);
const packageOf = (spec: string) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]!);

/** every module specifier (static, re-export, dynamic import) of a dist module. */
function specifiers(file: string): string[] {
  const out: string[] = [];
  const visit = (n: ts.Node): void => {
    if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) out.push(n.moduleSpecifier.text);
    if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments[0] && ts.isStringLiteralLike(n.arguments[0])) out.push(n.arguments[0].text);
    ts.forEachChild(n, visit);
  };
  visit(parse(file));
  return out;
}

describe('externals (REQ-PLAT-65)', () => {
  it('tsdown externals are generated from dependencies ∪ peerDependencies ∪ node:*', () => {
    const cfg = parse(join(ROOT, 'tsdown.config.ts'));
    let list: ts.ArrayLiteralExpression | undefined;
    const find = (n: ts.Node): void => {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'externals' && n.initializer && ts.isArrayLiteralExpression(n.initializer)) list = n.initializer;
      ts.forEachChild(n, find);
    };
    find(cfg);
    expect(list).toBeDefined();
    const items = list!.elements.map((e) => e.getText().replace(/\s+/g, ''));
    expect(items).toContain('...Object.keys(pkg.dependencies??{})');
    expect(items).toContain('...Object.keys(pkg.peerDependencies??{})');
    expect(items).toContain('/^node:/');
    // anything else must be a pattern over a declared package (react/*, react-dom/*), never a new name
    const literals = items.filter((i) => !i.startsWith('...') && i !== '/^node:/');
    const undeclared = literals.filter((i) => {
      const m = /^\/\^([\w@-]+(?:\\\/[\w-]+)?)\(/.exec(i) ?? /^['"]([^'"]+)['"]$/.exec(i);
      return !m || !ALLOWED.has(m[1]!.replace(/\\\//g, '/'));
    });
    expect(undeclared).toEqual([]);
    const config = readFileSync(join(ROOT, 'tsdown.config.ts'), 'utf8');
    expect(config).toMatch(/external:\s*externals/);
  });

  it('every bare specifier imported by dist is a dependency, a peer or node:*', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.js'))) {
      for (const spec of specifiers(f)) {
        if (spec.startsWith('.') || spec.startsWith('node:')) continue;
        if (!ALLOWED.has(packageOf(spec))) bad.push(`${relative(ROOT, f)} -> ${spec}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('no dist file carries a node_modules/ segment or inlined @base-ui / @tanstack source', () => {
    ensureBuilt();
    const offenders: string[] = [];
    let regions = 0;
    for (const f of walk(DIST, (p) => /\.(js|map|d\.ts)$/.test(p))) {
      const text = readFileSync(f, 'utf8');
      if (text.includes('node_modules/')) offenders.push(`${relative(ROOT, f)}: node_modules/ segment`);
      if (!f.endsWith('.js')) continue;
      // rolldown marks every inlined module with a `//#region <path>` banner; only src/ may appear
      for (const m of text.matchAll(/^\/\/#region (\S+)/gm)) {
        regions++;
        if (!m[1]!.startsWith('src/')) offenders.push(`${relative(ROOT, f)}: inlined ${m[1]}`);
      }
    }
    // the region banners are the inlining evidence; without them the scan above proves nothing
    expect(regions).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
