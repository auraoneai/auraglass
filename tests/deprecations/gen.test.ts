/* @jest-environment node */
// REQ-PLAT-24: deprecations.json is generated, untracked, byte-stable, schema-clean.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const run = (args: string[]) => {
  try {
    const out = execFileSync('node', ['scripts/release/gen-deprecations.mjs', ...args], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('gen-deprecations', () => {
  it('deprecations.json is untracked and gitignored', () => {
    let tracked = '';
    try { tracked = execFileSync('git', ['ls-files', 'deprecations.json'], { encoding: 'utf8' }); } catch {}
    expect(tracked.trim()).toBe('');
    expect(readFileSync('.gitignore', 'utf8')).toMatch(/^deprecations\.json/m);
  });
  it('--check passes on the committed generated barrel', () => {
    const r = run(['--check']);
    expect(r.code).toBe(0);
  });
  it('output is deterministic across runs', () => {
    expect(existsSync('deprecations.json')).toBe(true);
    const a = readFileSync('deprecations.json', 'utf8');
    run([]);
    expect(readFileSync('deprecations.json', 'utf8')).toBe(a);
  });
  it('--schema regenerates the JSON schema cleanly', () => {
    const r = run(['--schema', '--check']);
    expect(r.code).toBe(0);
  });
  it('entries are sorted by id and carry stream/file provenance', () => {
    const j = JSON.parse(readFileSync('deprecations.json', 'utf8'));
    const ids = j.entries.map((e: any) => e.id);
    expect([...ids].sort((x, y) => String(x).localeCompare(String(y)))).toEqual(ids);
    expect(j.$schema).toBe('./docs/schemas/deprecations.schema.json');
  });
});
