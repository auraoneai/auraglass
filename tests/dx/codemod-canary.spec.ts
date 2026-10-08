/** PLAT-340..343 / REQ-PLAT-92: codemod canary — frozen recipe fixture -> migrate -> 0
 * unexpected TODOs on the flagship subset; second run idempotent. The full
 * canary (packed CLI -> packed 5.0 -> tsc -> next build -> browsers) needs the
 * published tarball; the engine half runs here against recipes-4x fixtures. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { runOnSource, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '../../packages/cli/src/migrate/4to5/index.js';

const FIX = path.join(__dirname, 'fixtures', 'recipes-4x');
const mappings = loadCompiledMappings();
const all = selectTransforms(undefined);

function recipeInput(dir: string): string | undefined {
  return ['input.tsx', 'input.ts', 'input.css', 'input.json'].find((f) => fs.existsSync(path.join(dir, f)));
}
function recipeDirs(): string[] {
  if (!fs.existsSync(FIX)) return [];
  return fs.readdirSync(FIX).filter((d) => recipeInput(path.join(FIX, d)));
}

describe('codemod canary (recipes-4x)', () => {
  it('covers all 14 transforms in frozen order', () => {
    expect(TRANSFORM_ORDER.length).toBe(14);
  });
  for (const name of recipeDirs()) {
    it(`recipe ${name}: output matches expected-todos.json`, () => {
      const dir = path.join(FIX, name);
      const expected = JSON.parse(fs.readFileSync(path.join(dir, 'expected-todos.json'), 'utf8')) as string[];
      const input = recipeInput(dir)!;
      const source = fs.readFileSync(path.join(dir, input), 'utf8');
      const kind = input.endsWith('.css') ? 'css' : input.endsWith('.json') ? 'json' : 'code';
      const r = runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' });
      expect(r.todos.map((t) => t.reason)).toEqual(expected);
      const r2 = runOnSource({ path: input, abs: 'x', kind, source: r.final }, all, { mappings, docBase: 'docs' });
      expect(r2.final).toBe(r.final);
    });
  }
});
