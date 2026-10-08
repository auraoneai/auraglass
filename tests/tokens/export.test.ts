/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-078: export tests for the 5.0 map — ESM aura-glass/tokens exposes exactly
// {tokens, token, materialSpec, manifest}; tokens.css, material.css, tailwind.css
// and compat/tokens.css resolve; removed 4.x subpaths throw
// ERR_PACKAGE_PATH_NOT_EXPORTED; no CJS entry on ./tokens.
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/** Resolution checks run out of process: jest's resolver maps .css specifiers
 *  to identity-obj-proxy, so self-reference must be tested in plain node. */
const specResolution = (specs: string[]): Record<string, string> => {
  const out = execFileSync('node', ['-e', `
    const { createRequire } = require('module');
    const req = createRequire(${JSON.stringify(join(ROOT, 'noop.cjs'))});
    const res = {};
    for (const s of ${JSON.stringify(specs)}) {
      try { res[s] = 'OK:' + req.resolve(s); } catch (e) { res[s] = e.code ?? 'ERR'; }
    }
    console.log(JSON.stringify(res));`], { encoding: 'utf8' });
  return JSON.parse(out.trim().split('\n').pop()!);
};

describe('5.0 exports map (MAT-078)', () => {
  test('aura-glass/tokens ESM exposes exactly tokens, token, materialSpec, manifest', async () => {
    const { build } = await import('esbuild');
    const res = await build({
      entryPoints: [join(ROOT, 'src/tokens/index.ts')],
      bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
    });
    const m = /export\s*\{([^}]*)\}\s*;?\s*$/m.exec(res.outputFiles[0]!.text);
    const names = (m?.[1] ?? '').split(',')
      .map((s) => s.trim().replace(/\s+as\s+\w+$/, ''))
      .filter((s) => s && !s.startsWith('type '))
      .sort();
    expect(names).toEqual(['manifest', 'materialSpec', 'token', 'tokens']);
  });

  test('css subpaths resolve', () => {
    const targets: Array<[string, string]> = [
      ['aura-glass/tokens.css', 'dist/tokens.css'],
      ['aura-glass/tailwind.css', 'dist/tailwind.css'],
      ['aura-glass/compat/tokens.css', 'dist/compat/tokens.css'],
    ];
    const res = specResolution(targets.map(([s]) => s));
    for (const [spec, target] of targets) {
      expect({ spec, code: res[spec] }).toEqual({ spec, code: `OK:${join(ROOT, target)}` });
      expect(existsSync(join(ROOT, target))).toBe(true);
    }
    // material.css is mapped for the material lane's dist output
    expect(pkg.exports['./material.css']).toBe('./dist/material.css');
  });

  test('removed 4.x subpaths throw ERR_PACKAGE_PATH_NOT_EXPORTED', () => {
    const specs = [
      'aura-glass/tokens/json',
      'aura-glass/tokens/tailwind',
      'aura-glass/tokens/manifest',
      'aura-glass/tokens/css',
      'aura-glass/tokens/keyframes',
      'aura-glass/styles',
    ];
    const res = specResolution(specs);
    for (const spec of specs)
      expect({ spec, code: res[spec] }).toEqual({ spec, code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
  });

  test('export.spec.mjs (node --test) is green', () => {
    const out = execFileSync('node', ['--test', join(ROOT, 'tests/tokens/export.spec.mjs')], { encoding: 'utf8' });
    expect(out).toMatch(/\bpass 3\b/);
  });

  test('no CJS entry on ./tokens', () => {
    const tokensEntry = pkg.exports['./tokens'];
    expect(typeof tokensEntry).toBe('object');
    expect('require' in tokensEntry).toBe(false);
    expect(tokensEntry.default).toBe('./dist/tokens/index.js');
    expect(tokensEntry.types).toBe('./dist/tokens/index.d.ts');
  });

  test('no getPersona* anywhere in the map', () => {
    expect(JSON.stringify(pkg.exports)).not.toContain('getPersona');
  });
});
