/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-001 + MAT-055: types-runtime honesty — the d.ts/export snapshot must equal
// runtime exports for aura-glass/tokens and aura-glass/theme, modulo the removed
// deprecated set {getPersona, getPersonaModeTokens} (DS-068: 0 differences at 5.0).
// Drives scripts/tokens/gates/types-runtime.mjs so the test and the gate can never
// diverge. Snapshots live at etc/api/<entry>.exports.json (api-report.mjs).
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const GATE = join(ROOT, 'scripts/tokens/gates/types-runtime.mjs');
const DEPRECATED = ['getPersona', 'getPersonaModeTokens'];

describe('types-runtime parity (MAT-001/MAT-055)', () => {
  test('snapshots exist (node scripts/build/api-report.mjs --entry <e>)', () => {
    for (const entry of ['tokens', 'theme']) {
      expect({ entry, ok: existsSync(join(ROOT, `etc/api/${entry}.exports.json`)) })
        .toEqual({ entry, ok: true });
    }
  });

  for (const entry of ['tokens', 'theme']) {
    test(`${entry}: gate exits 0 and declares parity`, () => {
      const out = execFileSync('node', [GATE, '--check', entry], { encoding: 'utf8' });
      expect(out).toContain('parity');
    });

    test(`${entry}: no getPersona* exports`, () => {
      const snap = JSON.parse(readFileSync(join(ROOT, `etc/api/${entry}.exports.json`), 'utf8'));
      expect(snap.exports.filter((n: string) => DEPRECATED.includes(n))).toEqual([]);
    });
  }

  test('tokens snapshot is exactly the 5.0 surface', () => {
    const snap = JSON.parse(readFileSync(join(ROOT, 'etc/api/tokens.exports.json'), 'utf8'));
    expect([...snap.exports].sort()).toEqual(['manifest', 'materialSpec', 'token', 'tokens']);
  });
});
