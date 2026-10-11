/** @jest-environment node */
/* REQ-FIN-06 / AC-FIN-06 (REQ-CMP-29, REQ-CMP-23 acceptance; FIN-A.3 #6):
   packed-tarball root exports. Builds dist/, runs `npm pack`, installs the
   tarball into a consumer directory, then proves from the INSTALLED package:
     - import('aura-glass') and import('aura-glass/primitives') both resolve
       VisuallyHidden (and it is the same binding);
     - exports['./charts'] is absent while the package is below its ga line
       (ga:'5.1' in src/contracts/entries.ts → absent on 5.0.x);
     - top-level "types" (and "main") exist and point at files in the tarball.
   Remote-only (PRD-F §12 rule 6): it builds and packs, so outside GitLab CI it
   exits 2 and prints the remote command instead of running. */
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, ensureBuilt, withBuildLock } from '../build/helpers';

const REMOTE_CMD = 'npx jest --ci tests/integration/root-exports.test.ts  # GitLab CI only (AC-FIN-06: plat:package:pack / plat:test:pack-matrix)';
if (process.env.GITLAB_CI !== 'true') {
  console.error(`root-exports.test.ts is remote-only (it builds dist/ and runs npm pack). Run remotely:\n  ${REMOTE_CMD}`);
  process.exit(2);
}

let work: string;
let consumer: string;
let installed: string;
let probe: { root: string; primitives: string; same: boolean };

beforeAll(() => {
  ensureBuilt();
  // Consumer dir inside the repo: the installed package's own dependencies and
  // peers (react, …) resolve by walking up to the repo's node_modules, so the
  // install needs no registry access. /.artifacts/ is gitignored.
  mkdirSync(join(ROOT, '.artifacts'), { recursive: true });
  work = mkdtempSync(join(ROOT, '.artifacts', 'root-exports-'));
  const packed = withBuildLock(() =>
    execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', work], { cwd: ROOT, encoding: 'utf8' }));
  const [meta] = JSON.parse(packed) as Array<{ filename: string }>;
  if (!meta) throw new Error(`npm pack produced no tarball: ${packed}`);
  const tgz = join(work, meta.filename);
  expect(existsSync(tgz)).toBe(true);

  consumer = join(work, 'consumer');
  mkdirSync(join(consumer, 'node_modules'), { recursive: true });
  execFileSync('tar', ['-xzf', tgz, '-C', work]);
  installed = join(consumer, 'node_modules', 'aura-glass');
  renameSync(join(work, 'package'), installed);

  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `
    const root = await import('aura-glass');
    const prim = await import('aura-glass/primitives');
    console.log(JSON.stringify({
      root: typeof root.VisuallyHidden,
      primitives: typeof prim.VisuallyHidden,
      same: root.VisuallyHidden === prim.VisuallyHidden,
    }));
  `], { cwd: consumer, encoding: 'utf8' });
  probe = JSON.parse(out.trim().split('\n').pop() as string);
}, 600_000);

afterAll(() => { if (work) rmSync(work, { recursive: true, force: true }); });

describe('packed-tarball root exports (REQ-FIN-06)', () => {
  it("import('aura-glass') and import('aura-glass/primitives') resolve VisuallyHidden", () => {
    expect(probe).toEqual({ root: 'function', primitives: 'function', same: true });
  });

  it("exports['./charts'] follows its ga line (absent on 5.0.x)", () => {
    const pkg = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
    const [maj = NaN, min = NaN] = String(pkg.version).split('.').map(Number);
    expect(Number.isNaN(maj) || Number.isNaN(min)).toBe(false);
    const belowGa = maj * 1000 + min < 5 * 1000 + 1; // ./charts is ga:'5.1' (src/contracts/entries.ts)
    expect(pkg.exports['./charts'] === undefined).toBe(belowGa);
    expect(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).exports['./charts'] === undefined).toBe(belowGa);
  });

  it('top-level "types" and "main" exist and ship in the tarball', () => {
    const pkg = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
    expect(pkg.types).toBe('./dist/index.d.ts');
    expect(pkg.main).toBe('./dist/index.js');
    expect(existsSync(join(installed, pkg.types))).toBe(true);
    expect(existsSync(join(installed, pkg.main))).toBe(true);
    expect(pkg.exports['.'].types).toBe(pkg.types);
  });
});
