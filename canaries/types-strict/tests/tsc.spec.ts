/* PLAT-293: `import *` from every emitted entry type-checks under strict +
   exactOptionalPropertyTypes + noUncheckedIndexedAccess + skipLibCheck:false
   with the consumer's own typescript, against the packed artifact's .d.ts. */
import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('..', import.meta.url));

test('types-strict consumer: tsc --noEmit reports 0 errors', () => {
  const r = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.json'], {
    cwd: DIR, encoding: 'utf8',
  });
  if (r.status !== 0) console.error(r.stdout, r.stderr);
  expect(r.stdout + r.stderr).toBe('');
  expect(r.status).toBe(0);
});
