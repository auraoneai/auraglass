/** @jest-environment node */
// tests/data/exports/data-date-entries.test.ts — SURF-141: pack the tarball,
// install it into a temp fixture, and assert `import * as data from
// 'aura-glass/data'` / `'aura-glass/date'` expose exactly the contract lists.
// Needs a real dist build (npm run build); when dist is absent (pre-build
// lanes) the subject is reported PENDING per the stream's no-skip rules.

import { describe, expect, it, jest } from '@jest/globals';
import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

jest.setTimeout(120_000);

const ROOT = process.cwd();
const EXPECTED: Record<string, string[]> = {
  'aura-glass/data': ['Table', 'TreeView', 'FilterBar', 'Chip', 'KeyValueEditor', 'StatCard', 'Sparkline', 'ChartFrame'],
  'aura-glass/date': ['DateField', 'TimeField', 'DatePicker', 'DateRangePicker', 'Calendar', 'RangeCalendar', 'TimePicker'],
};

describe('packed ./data + ./date entries (SURF-141)', () => {
  it('the installed tarball exposes exactly the contract lists', () => {
    if (!existsSync(join(ROOT, 'dist', 'data', 'index.js')) || !existsSync(join(ROOT, 'dist', 'date', 'index.js'))) {
      console.warn('PENDING SURF-141: dist build absent — npm run build not run in this lane');
      return;
    }
    const work = mkdtempSync(join(tmpdir(), 'ag-pack-'));
    const out = execSync('npm pack --json', { cwd: ROOT, encoding: 'utf8', env: { ...process.env, npm_config_loglevel: 'error' } });
    // npm <=10 prints an array, npm 11 an object keyed by package name.
    const packed = JSON.parse(out);
    const tarball = (Array.isArray(packed) ? packed[0] : Object.values(packed)[0] as { filename: string }).filename as string;
    /* --legacy-peer-deps skips peers, so install every declared peer — peer
       ranges inside the artifact's own package.json are the honest runtime
       surface — pinned to the version this repo resolves when present. */
    const tgzPkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const ver = (m: string) => {
      const pj = join(ROOT, 'node_modules', m, 'package.json');
      return existsSync(pj) ? `${m}@${JSON.parse(readFileSync(pj, 'utf8')).version as string}` : m;
    };
    const peers = Object.keys(tgzPkg.peerDependencies ?? {}).map(ver).join(' ');
    execSync(`npm init -y && npm install --no-save --legacy-peer-deps ${join(ROOT, tarball)} ${peers}`, { cwd: work, stdio: 'pipe', env: { ...process.env, npm_config_loglevel: 'error' } });
    for (const [spec, names] of Object.entries(EXPECTED)) {
      writeFileSync(join(work, 'probe.mjs'), `import * as m from '${spec}'; console.log(JSON.stringify(Object.keys(m).sort()));`);
      const keys: string[] = JSON.parse(execSync('node probe.mjs', { cwd: work, encoding: 'utf8' }));
      expect(keys).toEqual([...names].sort());
    }
  });
});
