#!/usr/bin/env node
/* scripts/mat/token-drift-l4.mjs — L4 Token contrast provider (MAT-330, MAT-331).
 * Runs: npm run tokens:build (fail > 20 s), git diff --exit-code on the
 * generated token outputs, the contrast/transform jest paths (contrast solve
 * fails > 10 s), then publishes dist/contrast-matrix.json to the lane evidence
 * dir. Inputs that have not landed yet are reported `pending` — never PASS. */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const pending = [];
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });

const GENERATED = ['tokens/generated', 'src/tokens/generated', 'src/material/css/generated', 'src/motion/tokens.generated.ts'];
const CONTRAST_TEST = 'tests/tokens/contrast-matrix.test.ts';
const EXTRA_TESTS = ['tests/tokens/material-transform.test.ts', 'tests/tokens/motion-spring.test.ts', 'src/theme/__tests__/color.test.ts'];

// 1. token build, timed ≤ 20 s (MAT-331)
if (!existsSync(join(root, 'scripts/tokens/build.mjs'))) {
  pending.push('scripts/tokens/build.mjs (lane 2a-T)');
} else {
  const t0 = Date.now();
  const r = run('npm', ['run', 'tokens:build']);
  const ms = Date.now() - t0;
  console.log(`[l4] tokens:build ${ms}ms`);
  if (r.status !== 0) process.exit(1);
  if (ms > 20_000) { console.error(`[l4] tokens:build took ${ms}ms > 20000ms budget`); process.exit(1); }
}

// 2. drift check: committed generated outputs must equal a fresh build
const tracked = GENERATED.filter((p) => existsSync(join(root, p)));
if (tracked.length === 0) {
  pending.push('generated token outputs (lane 2a-T)');
} else {
  const r = run('git', ['diff', '--exit-code', '--', ...tracked]);
  if (r.status !== 0) { console.error('[l4] generated token outputs drifted from the committed copy'); process.exit(1); }
}

// 3. contrast solve ≤ 10 s + the transform/colour tests
const tests = [CONTRAST_TEST, ...EXTRA_TESTS].filter((p) => existsSync(join(root, p)));
for (const absent of [CONTRAST_TEST, ...EXTRA_TESTS].filter((p) => !existsSync(join(root, p)))) {
  pending.push(`${absent} (lane 2a-T/2d-P)`);
}
if (existsSync(join(root, CONTRAST_TEST))) {
  const t0 = Date.now();
  const r = run('npx', ['jest', '--runInBand', CONTRAST_TEST]);
  const ms = Date.now() - t0;
  console.log(`[l4] contrast solve ${ms}ms`);
  if (r.status !== 0) process.exit(1);
  if (ms > 10_000) { console.error(`[l4] contrast solve took ${ms}ms > 10000ms budget`); process.exit(1); }
}
const rest = tests.filter((p) => p !== CONTRAST_TEST);
if (rest.length > 0) {
  const r = run('npx', ['jest', '--runInBand', ...rest]);
  if (r.status !== 0) process.exit(1);
}

// 4. publish the contrast matrix into the lane evidence dir (S-48)
const matrix = join(root, 'dist/contrast-matrix.json');
if (existsSync(matrix)) {
  const outDir = join(root, '.artifacts/mat/l4-token-contrast');
  mkdirSync(outDir, { recursive: true });
  copyFileSync(matrix, join(outDir, 'contrast-matrix.json'));
  console.log(`[l4] evidence: ${join('.artifacts/mat/l4-token-contrast', 'contrast-matrix.json')}`);
} else {
  pending.push('dist/contrast-matrix.json (lane 2a-T)');
}

for (const p of pending) console.log(`[l4] pending: ${p}`);
console.log('[l4] done');
