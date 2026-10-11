/* @jest-environment node */
// REQ-PLAT-30 (compat coverage input): extractNames reads every esbuild
// `export {…}` group and keeps the public name of `a as b` re-exports.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from '@jest/globals';
import { extractNames } from '../../scripts/build/api-report.mjs';

const dir = mkdtempSync(join(tmpdir(), 'ag-api-names-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('api-report extractNames', () => {
  it('collects aliased and multi-module re-exports under their public names', async () => {
    writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { jsx: 'react-jsx', module: 'esnext', target: 'es2022' } }));
    mkdirSync(join(dir, 'src'), { recursive: true });
    writeFileSync(join(dir, 'src/a.ts'), 'export const internalA = 1;\nexport function helperA() { return 2; }\n');
    writeFileSync(join(dir, 'src/b.ts'), 'export const B = 3;\nexport class Klass {}\n');
    writeFileSync(join(dir, 'src/index.ts'), [
      "export { internalA as PublicA, helperA } from './a';",
      "export * from './b';",
      'export const Local = 4;',
    ].join('\n'));
    const names = await extractNames(join(dir, 'src/index.ts'), { root: dir });
    expect(names).toEqual(['B', 'Klass', 'Local', 'PublicA', 'helperA']);
    expect(names).not.toContain('internalA');
  });
});
