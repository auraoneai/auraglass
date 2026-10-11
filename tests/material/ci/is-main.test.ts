/* @jest-environment node */
/* REQ-MAT-39 (FIN-D D.3-03): every scripts/mat/*.mjs CLI that guards its body with
   isMain must still run when invoked through a symlinked path. Node resolves the
   main module's symlink (import.meta.url = real path) while process.argv[1] keeps
   the link, so the old resolve(argv[1]) === pathname check silently skipped the
   body and exited 0. Each case runs the script through a symlink and asserts the
   same observable behaviour (stdout marker and exit code) as the direct path. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const REPO = resolve(__dirname, '../../..');
const SCRIPTS = join(REPO, 'scripts/mat');
const FIX = join(__dirname, 'fixtures/glass-recipes');
const TMP = mkdtempSync(join(tmpdir(), 'ag-is-main-'));
const LINKS = join(TMP, 'links');
mkdirSync(LINKS);

afterAll(() => rmSync(TMP, { recursive: true, force: true }));

const link = (script: string) => {
  const p = join(LINKS, `${script}.mjs`);
  symlinkSync(join(SCRIPTS, `${script}.mjs`), p);
  return p;
};

const run = (entry: string, args: string[]) => {
  const r = spawnSync(process.execPath, [entry, ...args], {
    encoding: 'utf8',
    cwd: TMP,
    env: { ...process.env, AURAGLASS_EVIDENCE_DIR: join(TMP, 'evidence') },
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};

const emptyRoot = () => {
  const root = join(TMP, 'empty-root');
  mkdirSync(join(root, 'src'), { recursive: true });
  return root;
};

const CASES: Array<{ script: string; args: () => string[]; code: number; marker: RegExp }> = [
  { script: 'count-glass-recipes', args: () => ['--root', join(FIX, 'one')], code: 0, marker: /independent-glass-recipes: 2/ },
  { script: 'verify-optics-css', args: () => ['--root', join(__dirname, 'fixtures/optics-css/violating')], code: 1, marker: /src\/components\/y\.module\.css/ },
  { script: 'verify-material-runtime', args: () => ['--root', emptyRoot()], code: 0, marker: /\[verify-material-runtime\] OK/ },
  { script: 'verify-recipe-removal', args: () => ['--root', emptyRoot()], code: 0, marker: /\[verify-recipe-removal\] OK/ },
  { script: 'material-css-api', args: () => ['--root', emptyRoot()], code: 0, marker: /\[material-css-api\] wrote/ },
  { script: 'make-grain', args: () => ['--png-only', '--out', join(TMP, 'grain/ag-grain-128.avif')], code: 0, marker: /\[make-grain\] wrote .*png-only/ },
];

describe('scripts/mat isMain through a symlinked path', () => {
  it.each(CASES)('$script runs its CLI body via a symlink', ({ script, args, code, marker }) => {
    const direct = run(join(SCRIPTS, `${script}.mjs`), args());
    expect(direct.code).toBe(code);
    expect(direct.out).toMatch(marker);

    const viaLink = run(link(script), args());
    expect(viaLink.code).toBe(code);
    expect(viaLink.out).toMatch(marker);
  });
});

describe('scripts/mat/_is-main.mjs', () => {
  it('compares realpaths of import.meta.url and argv[1]', () => {
    const real = join(SCRIPTS, 'count-glass-recipes.mjs');
    const viaLink = join(TMP, 'direct-link.mjs');
    symlinkSync(real, viaLink);
    const probes = [real, viaLink, join(SCRIPTS, 'make-grain.mjs'), join(TMP, 'does-not-exist.mjs')];
    // Run the ESM helper in a child process (no jest ESM transform involved).
    const src = [
      `import { isMain } from ${JSON.stringify(pathToFileURL(join(SCRIPTS, '_is-main.mjs')).href)};`,
      `const url = ${JSON.stringify(pathToFileURL(real).href)};`,
      `const probes = ${JSON.stringify(probes)};`,
      'console.log(JSON.stringify([...probes.map((p) => isMain(url, p)), isMain(url, undefined)]));',
    ].join('\n');
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', src], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual([true, true, false, false, false]);
  });
});
