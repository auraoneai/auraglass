/** @jest-environment node */
// tests/data/exports/data-date-entries.test.ts — SURF-141: install the packed
// tarball (AURAGLASS_TARBALL) into a temp fixture and assert `import * as data
// from 'aura-glass/data'` / `'aura-glass/date'` expose exactly these literal
// lists (an independent copy of the contract rows). Runs remotely in
// surf:package:packed-entries; without AURAGLASS_TARBALL it fails closed.

import { describe, expect, it, jest } from '@jest/globals';
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

jest.setTimeout(300_000);

const ROOT = join(__dirname, '..', '..', '..');
const EXPECTED: Record<string, string[]> = {
  'aura-glass/data': ['Table', 'TreeView', 'FilterBar', 'Chip', 'KeyValueEditor', 'StatCard', 'Sparkline', 'ChartFrame'],
  'aura-glass/date': ['DateField', 'TimeField', 'DatePicker', 'DateRangePicker', 'Calendar', 'RangeCalendar', 'TimePicker'],
};

describe('packed ./data + ./date entries (SURF-141)', () => {
  it('the installed tarball exposes exactly the contract lists', () => {
    const tarball = process.env.AURAGLASS_TARBALL;
    if (tarball === undefined || tarball === '') {
      throw new Error('AURAGLASS_TARBALL is not set — SURF-141 asserts the packed artifact only. Run it in GitLab job surf:package:packed-entries.');
    }
    const tgz = resolve(tarball);
    if (!existsSync(tgz)) throw new Error(`AURAGLASS_TARBALL=${tgz} does not exist`);
    const work = mkdtempSync(join(tmpdir(), 'ag-pack-'));
    writeFileSync(join(work, 'package.json'), '{"name":"surf-141-probe","private":true,"type":"module"}');
    /* Install the tarball plus every declared peer — peer ranges inside the
       artifact's own package.json are the honest runtime surface. */
    const peers = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).peerDependencies ?? {});
    execFileSync('npm', ['install', '--ignore-scripts', '--no-save', '--no-audit', '--no-fund', '--legacy-peer-deps', tgz, ...peers], {
      cwd: work, stdio: 'pipe', env: { ...process.env, npm_config_loglevel: 'error' },
    });
    for (const [spec, names] of Object.entries(EXPECTED)) {
      writeFileSync(join(work, 'probe.mjs'), `import * as m from '${spec}'; console.log(JSON.stringify(Object.keys(m).sort()));`);
      const keys: string[] = JSON.parse(execSync('node probe.mjs', { cwd: work, encoding: 'utf8' }));
      expect({ spec, keys }).toEqual({ spec, keys: [...names].sort() });
    }
  });
});
