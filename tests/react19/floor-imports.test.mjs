/* @jest-environment node */
/* REQ-PLAT-72: every non-pending entry imports cleanly under react@19.0.0
   (the peer floor) and the latest 19.x stable (spec calls for 19.3.x; as of
   authoring 19.2.8 is the newest stable — bump the default or override via
   AG_REACT_FLOOR_VERSIONS when 19.3.0 lands), resolving react from a real
   install — no named imports of feature-detected APIs may reach dist. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt } from '../build/helpers';

const VERSIONS = (process.env.AG_REACT_FLOOR_VERSIONS ?? '19.0.0,19.2.8').split(',');

const importsFor = async () => {
  const { manifestEntries } = await import('../../scripts/build/lib/graph.mjs');
  return manifestEntries(ROOT).js
    .map(e => ({ subpath: e.subpath, file: join(ROOT, e.default) }))
    .filter(e => existsSync(e.file));
};

describe('react floor imports (REQ-PLAT-72)', () => {
  for (const version of VERSIONS) {
    it(`every entry imports under react@${version}`, async () => {
      ensureBuilt();
      const dir = mkdtempSync(join(tmpdir(), `ag-react${version}-`));
      try {
        execFileSync('npm', ['init', '-y'], { cwd: dir, stdio: 'pipe' });
        execFileSync('npm', ['install', '--no-audit', '--no-fund',
          `react@${version}`, `react-dom@${version}`, '@base-ui/react@1.8.0', 'clsx@2.1.1'],
          { cwd: dir, encoding: 'utf8', timeout: 240_000 });
        /* probe: dynamic import from a script whose node_modules shadows react */
        const probe = join(dir, 'probe.mjs');
        writeFileSync(probe, `
import { pathToFileURL } from 'node:url';
const files = ${JSON.stringify((await importsFor()).map(e => e.file))};
const bad = [];
for (const f of files) {
  try { await import(pathToFileURL(f).href); }
  catch (e) { bad.push(f.split('/dist/')[1] + ' :: ' + String(e.message ?? e).slice(0, 120)); }
}
console.log(JSON.stringify(bad));
`);
        const r = spawnSync(process.execPath, [probe], { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20 });
        expect(r.status).toBe(0);
        expect(JSON.parse(r.stdout.trim().split('\n').pop())).toEqual([]);
      } finally { rmSync(dir, { recursive: true, force: true }); }
    }, 300_000);
  }
});
