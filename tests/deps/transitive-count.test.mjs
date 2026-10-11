/* PLAT-270/D-26: install the packed tarball with --omit=dev --omit=optional
   --omit=peer and count the transitive closure; must be <= the machine-readable
   `transitiveCeiling:` record in docs/size-budgets.changelog.md (provisional
   until scripts/build/calibrate-transitive.mjs records the D-26 measurement;
   lower-only ratchet, §PLAT-287). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { countTree, readRecord } from '../../scripts/build/calibrate-transitive.mjs';

const ROOT = process.cwd();
const CHANGELOG = join(ROOT, 'docs', 'size-budgets.changelog.md');

describe('transitive dep count (PLAT-270)', () => {
  it('tarball install footprint is at or below the recorded ceiling', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-deps-'));
    try {
      execFileSync('npm', ['init', '-y'], { cwd: dir, stdio: 'pipe' });
      const pack = execFileSync('npm', ['pack', '--json', '--pack-destination', dir], { cwd: ROOT, encoding: 'utf8' });
      const tgz = join(dir, JSON.parse(pack)[0].filename);
      execFileSync('npm', ['install', '--omit=dev', '--omit=optional', '--omit=peer', '--no-audit', '--no-fund', tgz],
        { cwd: dir, encoding: 'utf8', timeout: 240_000 });
      /* npm ls exits ELSPROBLEMS when optional peers are unresolved — parse its
         stdout tree regardless; the dep count is what we measure. */
      const ls = spawnSync('npm', ['ls', '--json', '--all', '--omit=dev'], { cwd: dir, encoding: 'utf8' });
      const tree = JSON.parse(ls.stdout);
      const total = countTree(tree);
      /* REQ-PLAT-71: machine-readable `transitiveCeiling: <n>` line in the
         changelog is the only source — fail closed when absent. */
      expect(existsSync(CHANGELOG)).toBe(true);
      const { ceiling, status } = readRecord(readFileSync(CHANGELOG, 'utf8'));
      expect(ceiling).not.toBeNull();
      expect(status).not.toBeNull();
      console.log(`transitive deps: ${total} (ceiling ${ceiling}, ${status})`);
      expect(total).toBeLessThanOrEqual(ceiling);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 300_000);
});
