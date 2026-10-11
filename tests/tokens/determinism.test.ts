/** @jest-environment node */
import { test, expect } from '@jest/globals';
// MAT-009: two sequential builds produce byte-identical outputs (deterministic compiler).
import { createHash } from 'node:crypto';
import { mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const harvest = (dir: string, out: Record<string, string> = {}, base = ''): Record<string, string> => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) harvest(p, out, `${base}${name}/`);
    else out[`${base}${name}`] = createHash('sha256').update(readFileSync(p)).digest('hex');
  }
  return out;
};

test('deterministic output (MAT-009)', async () => {
  const a = mkdtempSync(join(tmpdir(), 'ag-det-a-'));
  const b = mkdtempSync(join(tmpdir(), 'ag-det-b-'));
  const { runBuild } = await import('../../scripts/tokens/build.mjs');
  await runBuild({ outRoot: a, quiet: true });
  await runBuild({ outRoot: b, quiet: true });
  const ha = harvest(a);
  const hb = harvest(b);
  expect(Object.keys(ha).sort()).toEqual(Object.keys(hb).sort());
  const diffs = Object.keys(ha).filter((k) => ha[k] !== hb[k]);
  console.log(`determinism: ${Object.keys(ha).length} files hashed`);
  expect(diffs).toEqual([]);
}, 120000);
