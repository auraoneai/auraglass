/** REQ-PLAT-91 item 3: every codemod fixture input type-checks against the
 *  packed 4.x d.ts and every output against the 5.0 d.ts with
 *  `tsc --noEmit --strict` (TODO outputs may import `aura-glass/compat`).
 *
 *  This is a real type check: no `// @ts-nocheck` is prepended, and a
 *  fixture's own leading `// @ts-nocheck` line is stripped on copy (fixtures
 *  keep it for editors; it must not hide type errors here). Identifiers the
 *  fixtures leave unbound on purpose (state setters, sample data, user
 *  components) are declared `any` in FIXTURE_GLOBALS; everything else must
 *  resolve against the aura-glass types.
 *
 *  Type sources:
 *  - inputs: the vendored packed 4.x tarball (test/vendor/aura-glass-4x.tgz),
 *    installed as node_modules/aura-glass so subpaths resolve through its
 *    `exports`. It is replaced by the packed 4.3 tarball once v4.3.0 is tagged.
 *  - outputs: the packed 5.0 tarball plat:package:pack hands plat:test:cli
 *    (AURAGLASS_TARBALL dotenv), installed the same way; required in that CI
 *    job. Without it (local runs) outputs resolve against src/ via paths.
 *
 *  Fixture cases that do not type-check yet are listed per side in the
 *  expiring baseline scripts/integration/baselines/fixtures-typecheck.json
 *  ({file: <case dir>, side, owner, reqFin, expires: 'RC-1'}, §4.3 rule 3).
 *  A failing case without a row, a row whose case now passes (stale), or a
 *  row naming no discovered case fails the test, so the list only shrinks. */
import { describe, expect, it, beforeAll, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { discoverFixtures } from '../../../../test/helpers/fixture-discovery.js';

jest.setTimeout(300000);

const PKG_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const REPO = path.resolve(PKG_DIR, '..', '..');
const VENDOR = path.join(PKG_DIR, 'test', 'vendor', 'aura-glass-4x.tgz');
const BASELINE = path.join(REPO, 'scripts', 'integration', 'baselines', 'fixtures-typecheck.json');
const OWNER: Record<string, string> = { cli: 'PLAT', plat: 'PLAT', cmp: 'CMP', mat: 'MAT', surf: 'SURF' };
const cases = discoverFixtures().filter((c) => /\.tsx?$/.test(c.input) && /\.tsx?$/.test(c.output));
const caseDir = (file: string) => path.relative(REPO, path.dirname(file)).split(path.sep).join('/');

/* Deliberately unbound identifiers used by fixture code (values, setters,
   sample data and user-land components). aura-glass component names are NOT
   declared here: an unimported Glass* component is a fixture bug. */
const UNBOUND = [
  'a', 'A', 'actions', 'acts', 'Anchor', 'app', 'App', 'Area', 'b', 'B', 'Btn', 'c', 'C', 'Card', 'cb', 'cmds',
  'err', 'f', 'fields', 'handleClose', 'I', 'items', 'list', 'Menu', 'menus', 'n', 'ns', 'o', 'on', 'opts',
  'people', 'PlusIcon', 'q', 'renderItem', 'renderOpt', 'rs', 'run', 's', 'save', 'sel', 'set', 'setB', 'setC',
  'setN', 'setName', 'setOn', 'setQ', 'setSel', 'setTags', 'setV', 'setVs', 't', 'tags', 'Tip', 'v', 'vs', 'X',
  'XIcon', 'zi', 'zo',
];
const FIXTURE_GLOBALS = `declare module "*.css";\n${UNBOUND.map((n) => `declare const ${n}: any;`).join('\n')}\n`;
const NOCHECK_LINE = /^\/\/ @ts-nocheck\b.*\r?\n/;

type Side = 'input' | 'output';
interface BaselineRow { file: string; side: Side; owner: string; reqFin: string; expires: string }

/** Copies a fixture for type-checking; a leading fixture pragma is dropped. */
function typecheckSource(body: string): string {
  return body.replace(NOCHECK_LINE, '');
}

function installTarball(tgz: string, projDir: string): void {
  const nm = path.join(projDir, 'node_modules');
  fs.mkdirSync(nm, { recursive: true });
  execFileSync('tar', ['-xzf', tgz, '-C', nm]);
  fs.renameSync(path.join(nm, 'package'), path.join(nm, 'aura-glass'));
}

function writeProject(
  dir: string,
  files: { src: string; dest: string }[],
  pathsMap: Record<string, string[]>,
  extra: { name: string; src: string }[] = [],
): void {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of files) {
    fs.mkdirSync(path.dirname(path.join(dir, f.dest)), { recursive: true });
    fs.writeFileSync(path.join(dir, f.dest), typecheckSource(fs.readFileSync(f.src, 'utf8')));
  }
  for (const e of extra) fs.writeFileSync(path.join(dir, e.name), e.src);
  const nm = (p: string) => path.join(REPO, 'node_modules', p);
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      strict: true, noEmit: true, jsx: 'react-jsx', module: 'esnext', target: 'es2022',
      lib: ['es2022', 'dom', 'dom.iterable'],
      moduleResolution: 'bundler', skipLibCheck: true, baseUrl: '.', paths: {
        ...pathsMap,
        // the fixture app's own dependencies, as an installed consumer would have them
        'react': [nm('@types/react/index.d.ts')],
        'react/jsx-runtime': [nm('@types/react/jsx-runtime.d.ts')],
        'react-dom': [nm('@types/react-dom/index.d.ts')],
        'framer-motion': [nm('framer-motion')],
        '@tanstack/react-table': [nm('@tanstack/react-table')],
      },
      types: ['node'], typeRoots: [nm('@types')],
    },
    include: files.map((f) => f.dest).concat(extra.map((e) => e.name)),
  }, null, 2));
}

function runTsc(dir: string): { code: number; out: string } {
  try {
    const o = execFileSync(path.join(REPO, 'node_modules', '.bin', 'tsc'), ['-p', dir], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out: o };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}\n${err.stderr ?? ''}` };
  }
}

/** Splits tsc output into failing fixture case dirs and diagnostics outside any fixture. */
function attribute(out: string, files: { src: string; dest: string }[]): { failing: Set<string>; foreign: string[] } {
  const byDest = new Map(files.map((f) => [f.dest, caseDir(f.src)]));
  const failing = new Set<string>();
  const foreign: string[] = [];
  for (const line of out.split('\n')) {
    const m = /^(\S+?)\(\d+,\d+\): error TS\d+/.exec(line) ?? /^error TS\d+/.exec(line);
    if (!m) continue;
    // tsc prints paths relative to the project dir, possibly through the
    // tmpdir symlink (../../var/... vs /private/var/...): match the dest suffix.
    const target = m[1];
    const dest = target ? files.find((f) => target === f.dest || target.endsWith(`/${f.dest}`))?.dest : undefined;
    const owner = dest ? byDest.get(dest) : undefined;
    if (owner) failing.add(owner);
    else foreign.push(line);
  }
  return { failing, foreign };
}

const baseline: BaselineRow[] = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));

function checkAgainstBaseline(side: Side, files: { src: string; dest: string }[], r: { code: number; out: string }): void {
  const { failing, foreign } = attribute(r.out, files);
  // A diagnostic outside the fixture files (aura-glass types, globals) is never baselined.
  expect(foreign).toEqual([]);
  if (failing.size === 0) expect(r.code).toBe(0);
  const rows = new Set(baseline.filter((b) => b.side === side).map((b) => b.file));
  const fresh = [...failing].filter((d) => !rows.has(d)).sort();
  const stale = [...rows].filter((d) => !failing.has(d)).sort();
  // fresh: case(s) that stopped type-checking (fix the fixture; rows are never added).
  // The tsc output for them is in the failure message.
  expect({ side, fresh, tsc: fresh.length ? r.out.split('\n').filter((l) => fresh.some((d) => {
    const f = files.find((x) => caseDir(x.src) === d);
    return f !== undefined && (l.startsWith(`${f.dest}(`) || l.includes(`/${f.dest}(`));
  })) : [] }).toEqual({ side, fresh: [], tsc: [] });
  // stale: case(s) that type-check now; delete their baseline rows.
  expect({ side, stale }).toEqual({ side, stale: [] });
}

let work4: string;
let work5: string;

beforeAll(() => {
  work4 = fs.mkdtempSync(path.join(os.tmpdir(), 'agtc4-'));
  work5 = fs.mkdtempSync(path.join(os.tmpdir(), 'agtc5-'));
});

describe('fixture typecheck baseline rows', () => {
  it('every row is well-formed, owned by its stream, and names a discovered case', () => {
    const dirs = new Set(cases.map((c) => caseDir(c.input)));
    const keys = new Set<string>();
    for (const row of baseline) {
      const stream = row.file.startsWith('packages/cli/') ? 'cli' : (row.file.split('/')[2] ?? '');
      expect(row).toEqual({ file: row.file, side: row.side, owner: OWNER[stream], reqFin: 'REQ-FIN-40', expires: 'RC-1' });
      expect(['input', 'output']).toContain(row.side);
      expect([row.file, dirs.has(row.file)]).toEqual([row.file, true]);
      expect([`${row.side}:${row.file}`, keys.has(`${row.side}:${row.file}`)]).toEqual([`${row.side}:${row.file}`, false]);
      keys.add(`${row.side}:${row.file}`);
    }
  });
});

describe('fixture typecheck', () => {
  it('inputs typecheck vs the packed 4.x d.ts (installed tarball, exports-resolved subpaths)', () => {
    const proj = path.join(work4, 'proj');
    installTarball(VENDOR, proj);
    const files = cases.map((c, i) => ({ src: c.input, dest: `in/${i}.tsx` }));
    writeProject(proj, files, {}, [{ name: 'globals.d.ts', src: FIXTURE_GLOBALS }]);
    checkAgainstBaseline('input', files, runTsc(proj));
  });

  it('outputs typecheck vs the 5.0 d.ts (packed tarball in plat:test:cli, src/ locally)', () => {
    const proj = path.join(work5, 'proj');
    const tgz = process.env.AURAGLASS_TARBALL ? path.resolve(REPO, process.env.AURAGLASS_TARBALL) : '';
    if (process.env.CI_JOB_NAME === 'plat:test:cli') {
      // the job needs plat:package:pack; the packed d.ts is the contract here, not src/
      expect([tgz, tgz !== '' && fs.existsSync(tgz)]).toEqual([tgz, true]);
    }
    let pathsMap: Record<string, string[]> = {};
    if (tgz && fs.existsSync(tgz)) installTarball(tgz, proj);
    else {
      pathsMap = {
        'aura-glass': [path.join(REPO, 'src', 'index.ts')],
        'aura-glass/compat': [path.join(REPO, 'src', 'compat', 'index.ts')],
        // ENTRIES whose public source is not src/<name>/index.ts (see
        // src/contracts/entries.ts): the packed types resolve there, so
        // src-mode must too, or the two modes disagree on the export surface.
        'aura-glass/motion': [path.join(REPO, 'src', 'motion', 'public.ts')],
        'aura-glass/theme': [path.join(REPO, 'src', 'theme', 'public.ts')],
        'aura-glass/*': [path.join(REPO, 'src', '*', 'index.ts'), path.join(REPO, 'src', '*.ts')],
      };
    }
    const files = cases.map((c, i) => ({ src: c.output, dest: `out/${i}.tsx` }));
    writeProject(proj, files, pathsMap, [{ name: 'globals.d.ts', src: FIXTURE_GLOBALS }]);
    checkAgainstBaseline('output', files, runTsc(proj));
  });

  it('fails on a seeded real type error (harness is not vacuous)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agtcx-'));
    writeProject(dir, [], { 'aura-glass': [path.join(REPO, 'src', 'index.ts')] }, [
      { name: 'seeded.ts', src: 'export const n: number = "not a number";\n' },
    ]);
    const r = runTsc(dir);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain('seeded.ts');
  });

  it('a fixture\'s own leading @ts-nocheck does not suppress its type errors', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agtcn-'));
    const src = path.join(dir, 'fixture-input.tsx');
    fs.writeFileSync(src, '// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports\nexport const n: number = "x";\n');
    const files = [{ src, dest: 'in/0.tsx' }];
    writeProject(path.join(dir, 'proj'), files, {}, [{ name: 'globals.d.ts', src: FIXTURE_GLOBALS }]);
    expect(fs.readFileSync(path.join(dir, 'proj', 'in/0.tsx'), 'utf8')).toBe('export const n: number = "x";\n');
    const r = runTsc(path.join(dir, 'proj'));
    expect(r.code).not.toBe(0);
    expect(attribute(r.out, files).failing).toEqual(new Set([caseDir(src)]));
  });

  it('the baseline never covers every case of a side (the check is not vacuous)', () => {
    for (const side of ['input', 'output'] as const) {
      const rows = baseline.filter((b) => b.side === side).length;
      expect([side, rows < cases.length]).toEqual([side, true]);
    }
  });
});
