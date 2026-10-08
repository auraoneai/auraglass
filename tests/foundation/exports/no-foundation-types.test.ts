/** @jest-environment node */
/* CMP-014: the built package's d.ts surface must not leak foundation types.
   Walks dist/** /*.d.ts and fails on Base UI / react-aria / internationalized
   type or value references. Runs in the remote build-dts job after `npm run
   build`; fails with 'dist missing' when dist/ is absent. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..', '..');
const LEAKED = /@base-ui|react-aria|@internationalized|BaseUI/;

function walkDts(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkDts(p, out);
    else if (entry.name.endsWith('.d.ts') || entry.name.endsWith('.d.mts')) out.push(p);
  }
  return out;
}

describe('dist d.ts contains no foundation type leaks (REQ-CMP-01)', () => {
  it('dist/ exists', () => {
    if (!existsSync(join(root, 'dist'))) throw new Error('dist missing — run npm run build first');
  });
  it('no dist d.ts references Base UI / react-aria / internationalized', () => {
    const dir = join(root, 'dist');
    const files = existsSync(dir) ? walkDts(dir) : [];
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      const m = text.match(LEAKED);
      if (m) offenders.push(`${f}: ${m[0]}`);
    }
    expect(offenders).toEqual([]);
  });
});
