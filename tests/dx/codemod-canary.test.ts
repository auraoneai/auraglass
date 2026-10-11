/** Jest leg of REQ-PLAT-92: recipes-4x frozen fixtures through the migrate
 *  engine — expected-todos.json per recipe + idempotent second pass. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { runOnSource, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '../../packages/cli/src/migrate/4to5/index.js';

const FIX = path.join(__dirname, 'fixtures', 'recipes-4x');
const mappings = loadCompiledMappings();
const all = selectTransforms(undefined);
const MANUAL = '__manual__source-parse-failure';

function recipeDirs(): string[] {
  return fs.readdirSync(FIX).filter((d) => fs.existsSync(path.join(FIX, d, 'expected-todos.json'))).sort();
}

describe('codemod canary (recipes-4x, engine leg)', () => {
  it('14 transforms, frozen order', () => {
    expect(TRANSFORM_ORDER.length).toBe(14);
  });
  it('28 recipe fixtures discovered (files.json marker)', () => {
    expect(fs.readdirSync(FIX).filter((d) => fs.existsSync(path.join(FIX, d, 'files.json'))).length).toBe(28);
  });
  for (const name of recipeDirs()) {
    it(`recipe ${name}: output matches expected-todos.json`, () => {
      const dir = path.join(FIX, name);
      const expected = JSON.parse(fs.readFileSync(path.join(dir, 'expected-todos.json'), 'utf8')) as string[];
      const input = ['input.tsx', 'input.ts', 'input.css', 'input.json'].find((f) => fs.existsSync(path.join(dir, f)))!;
      const source = fs.readFileSync(path.join(dir, input), 'utf8');
      const kind = input.endsWith('.css') ? 'css' : input.endsWith('.json') ? 'json' : 'code';
      if (expected[0] === MANUAL) {
        expect(() => runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' })).toThrow();
        return;
      }
      const r = runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' });
      expect(r.todos.map((t) => t.reason)).toEqual(expected);
      /* second pass over the migrated output must change nothing */
      const r2 = runOnSource({ path: input, abs: 'x', kind, source: r.final }, all, { mappings, docBase: 'docs' });
      expect(r2.final).toBe(r.final);
    });
  }
  it('flagship subset: 0 unexpected TODOs', () => {
    const subsetPath = path.join(FIX, 'flagship-subset.json');
    const ids = JSON.parse(fs.readFileSync(subsetPath, 'utf8')) as string[];
    expect(ids.length).toBeGreaterThan(0);
    const offenders = ids.filter((id) => {
      const e = JSON.parse(fs.readFileSync(path.join(FIX, id, 'expected-todos.json'), 'utf8')) as string[];
      return e.length > 0;
    });
    expect(offenders).toEqual([]);
  });
});
