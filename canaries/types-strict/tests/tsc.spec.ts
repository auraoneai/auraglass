/* PLAT-293: `import *` from every emitted entry type-checks under strict +
   exactOptionalPropertyTypes + noUncheckedIndexedAccess + skipLibCheck:false
   with the consumer's own typescript, against the packed artifact's .d.ts. */
import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('..', import.meta.url));

test('types-strict consumer: src/imports.ts imports exactly the packed JS entries', () => {
  const pkg = JSON.parse(readFileSync(`${DIR}node_modules/aura-glass/package.json`, 'utf8')) as {
    exports: Record<string, unknown>;
  };
  // JS entries: conditional objects with a `types` condition, excluding `*` patterns.
  const entries = Object.entries(pkg.exports)
    .filter(([k, v]) => !k.includes('*') && typeof v === 'object' && v !== null && 'types' in v)
    .map(([k]) => (k === '.' ? 'aura-glass' : `aura-glass/${k.slice(2)}`))
    .sort();
  const src = readFileSync(`${DIR}src/imports.ts`, 'utf8');
  const imported = [...src.matchAll(/from '(aura-glass[^']*)'/g)].map((m) => m[1]).sort();
  expect(imported).toEqual(entries);
});

test('types-strict consumer: tsc --noEmit reports 0 errors', () => {
  const r = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.json'], {
    cwd: DIR, encoding: 'utf8',
  });
  if (r.status !== 0) console.error(r.stdout, r.stderr);
  expect(r.stdout + r.stderr).toBe('');
  expect(r.status).toBe(0);
});
