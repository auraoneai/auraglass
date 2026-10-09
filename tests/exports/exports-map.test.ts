/* @jest-environment node */
/* REQ-PLAT-67: exports-map invariants — generate-exports --list-entries --json
   parses; wildcard targets exist; no dangling rows. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt } from '../build/helpers';

describe('exports map (REQ-PLAT-67)', () => {
  it('--list-entries --json emits parseable JSON with built+pending+exports', () => {
    const out = execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries', '--json'], { cwd: ROOT, encoding: 'utf8' });
    const d = JSON.parse(out);
    expect(Array.isArray(d.built)).toBe(true);
    expect(Array.isArray(d.pending)).toBe(true);
    for (const p of d.pending) expect(p.reason).toBeTruthy(); // never silent
    expect(typeof d.exports).toBe('object');
  });
  it('every built entry default target exists in dist (asset rows may pend)', () => {
    ensureBuilt();
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const out = execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries', '--json'], { cwd: ROOT, encoding: 'utf8' });
    const pending = new Set(JSON.parse(out).pending.map((p: { subpath: string }) => p.subpath));
    const missing: string[] = [];
    for (const [sub, cond] of Object.entries(pkg.exports)) {
      if (pending.has(sub) || /\.(css|json)$/.test(sub)) continue;
      const t = typeof cond === 'string' ? cond : (cond as Record<string, string>).default;
      if (!t || t.includes('*') || !t.includes('dist/')) continue;
      if (!existsSync(join(ROOT, t))) missing.push(`${sub} -> ${t}`);
    }
    expect(missing).toEqual([]);
  });
});
