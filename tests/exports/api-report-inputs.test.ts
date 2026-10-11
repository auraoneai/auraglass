/* @jest-environment node */
/* REQ-PLAT-73: api-report inputs are honest.
   - `generate-exports.mjs --list-entries --json` agrees with
     build/exports.manifest.json: built ∪ pending covers every JS manifest
     entry exactly once, and each built row carries the manifest's
     subpath/default/types verbatim.
   - every non-pending (built) entry's `types` target is exactly one .d.ts
     file that API Extractor loads with skipLibCheck:false. */
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

import { join } from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, ensureBuilt, read } from '../build/helpers';

const require = createRequire(import.meta.url);
const tmpDirs = [];
afterAll(() => { for (const d of tmpDirs) rmSync(d, { recursive: true, force: true }); });
const JS_SOURCES = (e) => !['build:css', 'build:deprecations', 'package.json'].includes(e.source);

describe('api-report inputs (REQ-PLAT-73)', () => {
  let listed;
  let manifest;

  beforeAll(() => {
    ensureBuilt();
    listed = JSON.parse(
      execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries', '--json'], { cwd: ROOT, encoding: 'utf8' }),
    );
    manifest = JSON.parse(read('build/exports.manifest.json'));
  });

  it('--list-entries --json equals the manifest', () => {
    const jsEntries = manifest.entries.filter(JS_SOURCES);
    const covered = [...listed.built.map((e) => e.subpath), ...listed.pending.map((e) => e.subpath)].sort();
    expect(covered).toEqual(jsEntries.map((e) => e.subpath).sort());
    const bySub = new Map(jsEntries.map((e) => [e.subpath, e]));
    for (const row of listed.built) {
      const m = bySub.get(row.subpath);
      expect(m).toBeDefined();
      expect(row.default).toBe(m.default);
      expect(row.types).toBe(m.types);
    }
    for (const row of listed.pending) expect(row.reason).toBeTruthy();
    expect(listed.exports).toEqual(JSON.parse(read('package.json')).exports);
  });

  it('each built entry has exactly one .d.ts that API Extractor loads with skipLibCheck:false', () => {
    // jest's sandboxed require ignores `paths`, and ./bin/* is not in the package's
    // exports map — resolve via package.json + bin field (same as api-report.mjs).
    const extractor = execFileSync(
      process.execPath,
      ['-e', `const r=require('module').createRequire('${ROOT}/package.json');const p=r.resolve('@microsoft/api-extractor/package.json');const pkg=require('fs').readFileSync(p,'utf8');console.log(require('path').join(require('path').dirname(p),JSON.parse(pkg).bin['api-extractor']))`],
      { cwd: ROOT, encoding: 'utf8' },
    ).trim();
    for (const row of listed.built) {
      expect(typeof row.types).toBe('string');
      expect(row.types.endsWith('.d.ts')).toBe(true);
      const dts = join(ROOT, row.types);
      expect(existsSync(dts)).toBe(true);
      // api-extractor finds the project's package.json by walking up from the
      // config file — keep the temp config inside the repo (cleaned up below).
      const tmp = mkdtempSync(join(ROOT, 'build', '.ae-input-'));
      tmpDirs.push(tmp);
      const cfg = {
        extends: join(ROOT, 'api-extractor.base.json'),
        projectFolder: ROOT,
        mainEntryPointFilePath: dts,
        apiReport: { enabled: true, reportFileName: 'report.api.md', reportFolder: tmp },
        docModel: { enabled: false },
        tsdocMetadata: { enabled: false },
        compiler: { overrideTsconfig: { compilerOptions: { skipLibCheck: false } } },
      };
      const cfgPath = join(tmp, 'api-extractor.json');
      writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
      const out = execFileSync(process.execPath, [extractor, 'run', '--local', '--config', cfgPath], {
        cwd: ROOT,
        encoding: 'utf8',
      });
      expect(out).toMatch(/API Extractor completed successfully/i);
      expect(existsSync(join(tmp, 'report.api.md'))).toBe(true);
    }
  }, 120_000);
});
