/* @jest-environment node */
// REQ-PLAT-20: verify-visual-fix.mjs record validation (5 neg/pos cases).
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const S = 'scripts/release/verify-visual-fix.mjs';
const fixture = (recs: Record<string, object>) => {
  const dir = mkdtempSync(join(tmpdir(), 'vf-'));
  for (const [name, rec] of Object.entries(recs)) {
    writeFileSync(join(dir, name), JSON.stringify(rec));
  }
  return dir;
};
const run = (dir: string) => {
  try {
    const out = execFileSync('node', [S, dir], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};
const good = {
  id: 'D-28', defaultMode: true, cells: ['default|a'], compositeArtifact: 'https://example.com/a.png',
};

describe('verify-visual-fix', () => {
  it('live records pass', () => {
    expect(run('docs/release/visual-fixes').code).toBe(0);
  });
  it('a valid record passes', () => {
    const r = run(fixture({ 'x.json': good }));
    expect(r.code).toBe(0);
    expect(r.out).toContain('OK');
  });
  it('rejects a non-D/§13.1 id', () => {
    const r = run(fixture({ 'x.json': { ...good, id: 'W-6' } }));
    expect(r.code).toBe(1);
    expect(r.out).toContain('W-6');
  });
  it('rejects empty cells and a missing composite artifact', () => {
    const r = run(fixture({ 'x.json': { ...good, cells: [], compositeArtifact: '' } }));
    expect(r.code).toBe(1);
    expect(r.out).toContain('cells');
    expect(r.out).toContain('compositeArtifact');
  });
  it('rejects a non-default-mode cell / defaultMode false', () => {
    const r = run(fixture({ 'x.json': { ...good, cells: ['dark|a'], defaultMode: false } }));
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/default/);
  });
});
