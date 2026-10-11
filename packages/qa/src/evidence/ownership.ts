/* QUAL. Path → owning stream from contracts/ownership.json (5x line, first matching row wins,
   unmatched paths are PLAT's Z01 row) — the same resolution scripts/ci/verify-ownership.mjs uses.
   Used to attribute expiring-baseline rows and pre-existing failures to their owner. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import picomatch from 'picomatch';

interface OwnershipRow { id: string; glob: string; owner: string; lines?: string[] }

export type OwnerOf = (path: string) => string;

export function loadOwnerOf(root: string, line: '5x' | '4x' = '5x'): OwnerOf {
  const rows = (JSON.parse(readFileSync(join(root, 'contracts/ownership.json'), 'utf8')) as { rows: OwnershipRow[] }).rows
    .filter((r) => (line === '4x' ? !!r.lines?.includes('4x') : !r.lines || r.lines.includes(line)));
  const matchers = rows.map((r) => ({ owner: r.owner, is: picomatch(r.glob, { dot: true }) }));
  return (path) => matchers.find((m) => m.is(path))?.owner ?? 'PLAT';
}
