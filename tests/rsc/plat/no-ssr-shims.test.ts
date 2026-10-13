/* @jest-environment node */
/* PLAT-262: no SSR shim identifiers survive anywhere under src/ or dist/. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';
import { join } from 'node:path';
import { ROOT, DIST, walk } from '../../build/helpers';

const SHIMS = /^(?:AuraGlassClientBoundary|AuraGlassSSRProvider|StyleSheetManager|registryGuard)$/;

// Removal metadata legitimately names old exports in strings. Inspect syntax
// identifiers so the gate still rejects declarations, imports, exports and
// runtime references without rejecting the doctor's removal catalogue.
function hasShimIdentifier(source: string, filename = 'fixture.tsx'): boolean {
  if (!/AuraGlassClientBoundary|AuraGlassSSRProvider|StyleSheetManager|registryGuard/.test(source)) return false;
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  let hit = false;
  const visit = (node: ts.Node): void => {
    if (ts.isIdentifier(node) && SHIMS.test(node.text)) hit = true;
    // Quoted export names and computed member access are executable names too.
    if (ts.isStringLiteralLike(node) && SHIMS.test(node.text) && (
      ts.isImportSpecifier(node.parent) || ts.isExportSpecifier(node.parent)
      || (ts.isElementAccessExpression(node.parent) && node.parent.argumentExpression === node)
      || ((ts.isPropertyAssignment(node.parent) || ts.isMethodDeclaration(node.parent)) && node.parent.name === node)
    )) hit = true;
    if (!hit) ts.forEachChild(node, visit);
  };
  visit(file);
  return hit;
}

describe('no SSR shims (PLAT-262)', () => {
  it('distinguishes removal metadata from executable shim names', () => {
    expect(hasShimIdentifier('const removed = { symbol: "AuraGlassClientBoundary", message: "AuraGlassSSRProvider was removed" };')).toBe(false);
    expect(hasShimIdentifier('// registryGuard was removed\nconst safe = true;')).toBe(false);
    for (const source of [
      'export function AuraGlassClientBoundary() {}',
      'import { AuraGlassSSRProvider as Provider } from "legacy";',
      'export { Provider as "AuraGlassSSRProvider" };',
      'const view = <StyleSheetManager />;',
      'legacy["registryGuard"]();',
      'const legacy = { "registryGuard": () => {} };',
    ]) expect(hasShimIdentifier(source)).toBe(true);
  });

  it('shim identifiers absent from src/**', () => {
    const hits = walk(join(ROOT, 'src'), p => /\.(ts|tsx)$/.test(p))
      .filter(f => hasShimIdentifier(readFileSync(f, 'utf8'), f));
    expect(hits).toEqual([]);
  });

  it('shim identifiers absent from dist/**', () => {
    if (!existsSync(DIST)) return;
    const hits = walk(DIST, p => /\.(js|d\.ts)$/.test(p)).filter(f => hasShimIdentifier(readFileSync(f, 'utf8'), f));
    expect(hits).toEqual([]);
  });
});
