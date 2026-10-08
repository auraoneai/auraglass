/* PLAT-270/D-26: install the packed tarball with --omit=dev --omit=optional
   --omit=peer and count the transitive closure; must be <= transitiveCeiling
   recorded by the D-26 calibration. Without a calibration yet, the ceiling is
   the measured floor printed here (lower-only ratchet, §PLAT-287). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
      const count = (n) => n?.dependencies ? Object.values(n.dependencies).reduce((a, d) => a + count(d), Object.keys(n.dependencies).length) : 0;
      const total = count(tree);
      /* D-26 record: first calibration row in the changelog, or the beta floor. */
      let ceiling = 64; /* beta floor pending D-26 */
      if (existsSync(CHANGELOG)) {
        const m = readFileSync(CHANGELOG, 'utf8').match(/transitiveCeiling[:\s]+(\d+)/);
        if (m) ceiling = Number(m[1]);
      }
      console.log(`transitive deps: ${total} (ceiling ${ceiling})`);
      expect(total).toBeLessThanOrEqual(ceiling);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 300_000);
});
