/* @jest-environment node */
/* tests/deprecations/prior-deprecation.test.ts — REQ-PLAT-28 (G-07), 4.x side
   (REQ-FIN-33 / AC-FIN-33). scripts/release/lib/deprecation-coverage.mjs and
   `verify-breaking-register.mjs --coverage`:
     no entry → uncovered; unpublished `since` (mocked npm 404) → uncovered;
     published and in that version's packed deprecations.json → covered;
     listed exception → covered; exact matching; snapshot removals against the
     newest published 4.x tarball's surface; PR runs report (exit 0) while the
     GA/tag mode (--ga / --require-covered) exits 1 on any uncovered removal.
   The npm registry is mocked twice: an injected exec for the library, and a
   fake `npm` executable on PATH for the CLI. No network access. */
import { describe, expect, it, afterAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const LIB = join(ROOT, 'scripts/release/lib/deprecation-coverage.mjs');
const REGISTER = join(ROOT, 'scripts/release/verify-breaking-register.mjs');
const GEN = join(ROOT, 'scripts/release/gen-deprecations.mjs');
const lib = (body: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `const m = await import(${JSON.stringify(LIB)}); ${body}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  .trim().split('\n').at(-1) as string);

const temps: string[] = [];
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

const ENTRY = (o: Record<string, unknown> = {}) => ({
  id: 'DEP-P0101', kind: 'export', status: 'active', entry: '.', symbol: 'GlassOld', since: '4.2.0',
  removeIn: '5.0.0', replacement: 'Button', codemod: 'canonical-names', automation: 'full', breaking: 'B4',
  message: 'GlassOld is renamed; import Button instead.', doc: '#dep-glassold', ...o,
});
// Injected registry: `published` maps version → ids in its packed deprecations.json.
const REG = (published: Record<string, string[]>) => `{
  published: (v) => (${JSON.stringify(published)})[v] ? v : null,
  newest4x: () => Object.keys(${JSON.stringify(published)}).sort().at(-1) ?? null,
  packedIds: (v) => (${JSON.stringify(published)})[v] ?? [],
}`;
const cov = (entries: object[], removals: object[], published: Record<string, string[]>, allowlist: string[] = []) =>
  lib(`console.log(JSON.stringify(m.coverage({ entries: ${JSON.stringify(entries)}, removals: ${JSON.stringify(removals)},
    registry: ${REG(published)}, allowlist: new Set(${JSON.stringify(allowlist)}) })));`);
const REMOVED = { kind: 'export', entry: '.', symbol: 'GlassOld' };

describe('prior-deprecation coverage rules', () => {
  it('no entry → uncovered', () => {
    const r = cov([], [REMOVED], { '4.2.0': ['DEP-P0101'] });
    expect(r.uncovered).toHaveLength(1);
    expect(r.uncovered[0]).toMatchObject({ symbol: 'GlassOld', coveringEntry: null, reason: 'no deprecation entry' });
  });

  it('published since whose packed deprecations.json lists the id → covered', () => {
    const r = cov([ENTRY()], [REMOVED], { '4.2.0': ['DEP-P0101'] });
    expect(r.uncoveredCount).toBe(0);
    expect(r.removals).toEqual([expect.objectContaining({ source: 'snapshot', coveringEntry: 'DEP-P0101', coverage: 'covered', verifiedIn: '4.2.0' })]);
  });

  it('unpublished since → uncovered', () => {
    const r = cov([ENTRY({ since: '4.3.0' })], [REMOVED], { '4.2.0': ['DEP-P0101'] });
    expect(r.uncovered[0]).toMatchObject({ coveringEntry: 'DEP-P0101', reason: 'aura-glass@4.3.0 is not published' });
  });

  it('published since without the id in its tarball → uncovered', () => {
    const r = cov([ENTRY()], [REMOVED], { '4.2.0': ['DEP-P0999'] });
    expect(r.uncovered[0].reason).toBe("DEP-P0101 is not in aura-glass@4.2.0's packed deprecations.json");
  });

  it('since below 4.2.0 → uncovered even when published', () => {
    const r = cov([ENTRY({ since: '4.1.0' })], [REMOVED], { '4.1.0': ['DEP-P0101'] });
    expect(r.uncovered[0].reason).toBe("since '4.1.0' is not a 4.x minor >= 4.2.0");
  });

  it('listed exception → covered; the allowlist never covers an entry without `exception`', () => {
    const exc = ENTRY({ id: 'DEP-P0001', since: '4.1.1', exception: 'honesty', evidence: 'x' });
    expect(cov([exc], [], {}, ['DEP-P0001']).removals[0]).toMatchObject({ source: 'entry', coverage: 'covered', verifiedIn: 'exception' });
    expect(cov([exc], [], {}, []).removals[0].coverage).toBe('uncovered');
    expect(cov([ENTRY({ id: 'DEP-P0001', since: '4.1.1' })], [], {}, ['DEP-P0001']).removals[0].coverage).toBe('uncovered');
  });

  it('matching is exact: an entry for Glass does not cover GlassOld, nor one on another subpath', () => {
    const r = cov([ENTRY({ symbol: 'Glass' }), ENTRY({ id: 'DEP-P0102', entry: './forms' })], [REMOVED], { '4.2.0': ['DEP-P0101', 'DEP-P0102'] });
    expect(r.removals.find((x: any) => x.source === 'snapshot')).toMatchObject({ coveringEntry: null, coverage: 'uncovered' });
  });

  it('every entry removed in 5.0 is a row (props, values, CSS vars, selectors); removeIn 6.0.0 is not', () => {
    const entries = [
      ENTRY({ id: 'DEP-P0201', kind: 'prop', symbol: 'GlassCard.glow' }),
      ENTRY({ id: 'DEP-P0202', kind: 'css-var', symbol: '--glass-blur' }),
      ENTRY({ id: 'DEP-P0203', kind: 'css-global', symbol: 'h1-h6, .flex, .grid' }),
      ENTRY({ id: 'DEP-P0204', kind: 'prop-value', symbol: 'Button.variant=glass', removeIn: '6.0.0' }),
    ];
    const r = cov(entries, [], { '4.2.0': ['DEP-P0201'] });
    expect(r.removals.map((x: any) => [x.coveringEntry, x.coverage])).toEqual([
      ['DEP-P0201', 'covered'], ['DEP-P0202', 'uncovered'], ['DEP-P0203', 'uncovered'],
    ]);
  });

  it('snapshot diff: removed subpaths and exports, one row per removed subpath', () => {
    const base = { entries: { '.': { runtime: ['A', 'B'], types: ['TB'] }, './gone': { runtime: ['X'], types: [] } } };
    const head = { entries: { '.': { runtime: ['A'], types: [] } } };
    expect(lib(`console.log(JSON.stringify(m.snapshotRemovals(${JSON.stringify(base)}, ${JSON.stringify(head)})))`)).toEqual([
      { kind: 'export', entry: '.', symbol: 'B' }, { kind: 'export', entry: '.', symbol: 'TB' },
      { kind: 'subpath', entry: './gone', symbol: '*' },
    ]);
    const sub = ENTRY({ id: 'DEP-P0301', kind: 'subpath', entry: './gone', symbol: '*' });
    const r = cov([sub], [{ kind: 'subpath', entry: './gone', symbol: '*' }, { kind: 'export', entry: './gone', symbol: 'X' }], { '4.2.0': ['DEP-P0301'] });
    expect(r.removals).toEqual([expect.objectContaining({ kind: 'subpath', coveringEntry: 'DEP-P0301', coverage: 'covered' })]);
  });
});

describe('npm registry adapter', () => {
  // exec double: `npm view` answers from `versions`, everything else 404s like the real CLI.
  const npmWith = (versions: string[]) => `m.npmRegistry({ exec: (bin, args) => {
    const v = ${JSON.stringify(versions)};
    if (args[0] !== 'view') throw new Error('unexpected ' + args.join(' '));
    const spec = args[1].slice(args[1].lastIndexOf('@') + 1);
    if (spec === '4') return JSON.stringify(v.filter((x) => x.startsWith('4.')));
    if (v.includes(spec)) return JSON.stringify(spec);
    const err = new Error('Command failed'); err.status = 1;
    err.stderr = 'npm error code E404\\nnpm error 404 No match found for version ' + spec; throw err;
  } })`;

  it('mocked 404 → not published; exact version → published; newest 4.x by semver', () => {
    const r = lib(`const reg = ${npmWith(['4.0.0', '4.1.0', '4.10.0', '4.9.0'])};
      console.log(JSON.stringify({ missing: reg.published('4.2.0'), there: reg.published('4.1.0'), newest: reg.newest4x() }))`);
    expect(r).toEqual({ missing: null, there: '4.1.0', newest: '4.10.0' });
  });

  it('mocked 404 makes the removal uncovered end to end', () => {
    const r = lib(`console.log(JSON.stringify(m.coverage({ entries: ${JSON.stringify([ENTRY()])}, removals: ${JSON.stringify([REMOVED])},
      registry: ${npmWith(['4.0.0', '4.1.0'])} })))`);
    expect(r.uncovered[0].reason).toBe('aura-glass@4.2.0 is not published');
  });

  it('a registry failure other than 404 is an error, never "uncovered"', () => {
    expect(() => lib(`const reg = m.npmRegistry({ exec: () => { const e = new Error('ETIMEDOUT'); e.stderr = 'npm error code ETIMEDOUT'; throw e; } });
      reg.published('4.2.0'); console.log('null')`)).toThrow(/ETIMEDOUT/);
  });
});

describe('verify-breaking-register --coverage (CLI, fake npm on PATH)', () => {
  // Hermetic repo: one PLAT fragment, a register whose B-id it references, the guide.
  function repo(): string {
    const t = mkdtempSync(join(tmpdir(), 'ag-prior-dep-'));
    temps.push(t);
    const put = (rel: string, text: string) => { mkdirSync(dirname(join(t, rel)), { recursive: true }); writeFileSync(join(t, rel), text); };
    mkdirSync(join(t, 'src/contracts'), { recursive: true });
    cpSync(join(ROOT, 'src/contracts/load-fragments.mjs'), join(t, 'src/contracts/load-fragments.mjs'));
    cpSync(join(ROOT, 'src/contracts/fragments.ts'), join(t, 'src/contracts/fragments.ts'));
    symlinkSync(join(ROOT, 'node_modules'), join(t, 'node_modules'));
    put('docs/release/breaking-changes.json', JSON.stringify({ version: 1, items: [{ id: 'B4', title: 'Renames' }] }));
    put('docs/release/exception-allowlist.json', JSON.stringify({ version: 1, allowlist: ['DEP-P0001'] }));
    put('fragments/deprecations/plat.ts', `export default ${JSON.stringify([
      ENTRY(), ENTRY({ id: 'DEP-P0001', symbol: 'REPORT_PATH', since: '4.1.1', exception: 'honesty', evidence: 'x', replacement: null, codemod: null, automation: 'none', message: 'drop it' }),
    ])};\n`);
    put('snap/base.json', JSON.stringify({ entries: { '.': { runtime: ['GlassOld', 'GlassNoEntry', 'REPORT_PATH', 'Kept'], types: [] } } }));
    put('snap/head.json', JSON.stringify({ entries: { '.': { runtime: ['Kept'], types: [] } } }));
    // Fake npm: `view` answers from FAKE_NPM_PUBLISHED ({version: ids}) and 404s otherwise; `pack` builds a tarball.
    put('bin/npm', `#!/usr/bin/env node
const { execFileSync } = require('node:child_process');
const fs = require('node:fs'); const path = require('node:path');
const pub = JSON.parse(process.env.FAKE_NPM_PUBLISHED || '{}');
const [cmd, spec, ...rest] = process.argv.slice(2);
const ver = spec.slice(spec.lastIndexOf('@') + 1);
if (cmd === 'view') {
  if (ver === '4') { process.stdout.write(JSON.stringify(Object.keys(pub))); process.exit(0); }
  if (pub[ver]) { process.stdout.write(JSON.stringify(ver)); process.exit(0); }
  process.stderr.write('npm error code E404\\nnpm error 404 No match found for version ' + ver + '\\n'); process.exit(1);
}
if (cmd === 'pack') {
  const dest = rest[rest.indexOf('--pack-destination') + 1];
  fs.mkdirSync(path.join(dest, 'package'), { recursive: true });
  fs.writeFileSync(path.join(dest, 'package/deprecations.json'), JSON.stringify({ version: 1, entries: (pub[ver] || []).map((id) => ({ id })) }));
  const filename = 'aura-glass-' + ver + '.tgz';
  execFileSync('tar', ['-czf', path.join(dest, filename), '-C', dest, 'package']);
  fs.rmSync(path.join(dest, 'package'), { recursive: true });
  process.stdout.write(JSON.stringify([{ filename }])); process.exit(0);
}
process.exit(2);
`);
    chmodSync(join(t, 'bin/npm'), 0o755);
    execFileSync('node', ['--input-type=module', '-e', `const g = await import(${JSON.stringify(GEN)}); process.exitCode = await g.main(['--docs'], { root: ${JSON.stringify(t)} });`], { stdio: 'ignore' });
    return t;
  }
  const run = (t: string, args: string[], published: Record<string, string[]>) => {
    try {
      const out = execFileSync('node', ['--input-type=module', '-e',
        `const m = await import(${JSON.stringify(REGISTER)}); process.exitCode = await m.main(${JSON.stringify(args)}, { root: ${JSON.stringify(t)} });`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, PATH: `${join(t, 'bin')}:${process.env.PATH}`, FAKE_NPM_PUBLISHED: JSON.stringify(published) } });
      return { code: 0, out };
    } catch (e: any) { return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` }; }
  };
  const report = (t: string) => JSON.parse(readFileSync(join(t, '.artifacts/plat/deprecation-coverage.json'), 'utf8'));
  const snaps = (t: string) => ['--base-snapshot', join(t, 'snap/base.json'), '--head-snapshot', join(t, 'snap/head.json')];

  it('PR mode reports uncovered removals (404 on since) and exits 0', () => {
    const t = repo();
    const r = run(t, ['--coverage', ...snaps(t)], { '4.1.0': [] });
    expect(r.code).toBe(0);
    const rep = report(t);
    expect(rep.newestPublished4x).toBe('4.1.0');
    expect(Object.fromEntries(rep.removals.map((x: any) => [x.symbol, [x.coverage, x.reason]]))).toEqual({
      GlassOld: ['uncovered', 'aura-glass@4.2.0 is not published'],
      GlassNoEntry: ['uncovered', 'no deprecation entry'],
      REPORT_PATH: ['covered', "exception 'honesty' listed in exception-allowlist.json"],
    });
  });

  it('GA/tag mode exits 1 on an uncovered removal', () => {
    const t = repo();
    const r = run(t, ['--coverage', '--require-covered', ...snaps(t)], { '4.1.0': [], '4.2.0': ['DEP-P0101'] });
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/1 removal\(s\) without a deprecation shipped in a published 4\.x minor >= 4\.2\.0 \(G-07\)/);
    expect(report(t).uncovered.map((x: any) => x.symbol)).toEqual(['GlassNoEntry']);
  });

  it('GA/tag mode exits 0 once every removal is covered by a published, packed entry', () => {
    const t = repo();
    const r = run(t, ['--coverage', '--ga'], { '4.1.0': [], '4.2.0': ['DEP-P0101'] });
    expect(r.code).toBe(0);
    expect(report(t)).toMatchObject({ ga: true, uncoveredCount: 0, newestPublished4x: '4.2.0' });
  });
});
