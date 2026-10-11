// MAT-078: node --test spec for the 5.0 exports map — the resolution half of
// export.test.ts, runnable on the remote runner without jest.
// `npm run test:tokens:exports` runs this file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const req = createRequire(join(ROOT, 'noop.cjs'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const tryResolve = (spec) => {
  try { return { code: 'OK', path: req.resolve(spec).replace(`${ROOT}/`, '') }; }
  catch (e) { return { code: e.code ?? 'ERR' }; }
};

test('css subpaths resolve to dist files that exist', () => {
  for (const [spec, target] of [
    ['aura-glass/tokens.css', 'dist/tokens.css'],
    ['aura-glass/tailwind.css', 'dist/tailwind.css'],
    ['aura-glass/compat/tokens.css', 'dist/compat/tokens.css'],
  ]) {
    const r = tryResolve(spec);
    assert.deepEqual(r, { code: 'OK', path: target }, spec);
    assert.ok(existsSync(join(ROOT, target)), `${target} exists`);
  }
  assert.equal(pkg.exports['./material.css'], './dist/material.css');
});

test('removed 4.x subpaths throw ERR_PACKAGE_PATH_NOT_EXPORTED', () => {
  for (const spec of [
    'aura-glass/tokens/json',
    'aura-glass/tokens/tailwind',
    'aura-glass/tokens/manifest',
    'aura-glass/tokens/css',
    'aura-glass/tokens/keyframes',
    'aura-glass/styles',
  ]) {
    assert.equal(tryResolve(spec).code, 'ERR_PACKAGE_PATH_NOT_EXPORTED', spec);
  }
});

test('no CJS entry on ./tokens', () => {
  const e = pkg.exports['./tokens'];
  assert.equal(typeof e, 'object');
  assert.ok(!('require' in e), 'no require condition');
  assert.equal(e.default, './dist/tokens/index.js');
});
