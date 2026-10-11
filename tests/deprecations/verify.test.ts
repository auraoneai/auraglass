/* @jest-environment node */
/* tests/deprecations/verify.test.ts — REQ-PLAT-25 (PLAT-183/184), AC-FIN-33.
   One fixture per rule: each fails with its specific message and the valid
   fixture passes; append-only + 4x-vs-next presence on a real temp git repo;
   the repo tree passes `--line 5x`. Replaces tests/release/verify-deprecations.test.mjs. */
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import {
  checkCompareBranch, checkEntries, codemodFixtureIds, compareVersions, loadCodemodIds,
} from '../../scripts/release/verify-deprecations.mjs';

const REPO = process.cwd();
const OK = {
  id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'Old',
  since: '4.2.0', removeIn: '5.0.0', replacement: 'New', codemod: 'canonical-names',
  automation: 'full', breaking: 'B4', message: 'Old is New in 5.0.', doc: '#dep-dep-p0001', stream: 'plat',
};
const CODEMODS = new Set(['canonical-names', 'imports-subpaths']);
const CTX = {
  entriesManifest: ['.'], rootExports: new Set(['Old']), breakingIds: new Set(['B4']),
  codemods: CODEMODS, codemodFixtures: new Set(['canonical-names']), version: '4.3.0',
};

describe('checkEntries rule list', () => {
  it('accepts a fully valid entry', () => {
    expect(checkEntries([OK], CTX)).toEqual([]);
  });
  it.each([
    ['bad id', { id: 'DEP-X0001' }, /id must match DEP-\[PMCSQ\]/],
    ['id prefix vs stream', { id: 'DEP-C0001' }, /id prefix DEP-C does not match stream 'plat' \(expected DEP-P\)/],
    ['dup id', null, /duplicate id/],
    ['bad kind', { kind: 'module' }, /invalid kind 'module'/],
    ['bad status', { status: 'done' }, /invalid status 'done'/],
    ['unknown subpath', { entry: './nowhere' }, /entry '\.\/nowhere' is not a 4\.x subpath/],
    ['non-root export symbol', { symbol: 'NotRoot', message: 'NotRoot is New.' }, /'NotRoot' is not in ROOT_EXPORTS/],
    ['since not 4.x', { since: '5.0.0' }, /since '5\.0\.0' is not a 4\.x\.y version/],
    ['since before 4.2 removing in 5.0', { since: '4.1.0' }, /requires the deprecation to have shipped in a 4\.x minor >= 4\.2\.0/],
    ['removeIn invalid', { removeIn: '7.0.0' }, /removeIn must be '5\.0\.0' or '6\.0\.0'/],
    ['active before its minor', { since: '4.4.0' }, /status 'active' but since 4\.4\.0 is after the line version 4\.3\.0/],
    ['planned after its minor shipped', { status: 'planned', since: '4.3.0' }, /status 'planned' but since 4\.3\.0 has shipped/],
    ['codemod null but automation full', { codemod: null }, /codemod is null but automation is 'full'/],
    ['unknown codemod', { codemod: 'nope' }, /unknown codemod 'nope'/],
    ['codemod without fixtures', { codemod: 'imports-subpaths' }, /codemod 'imports-subpaths' has no fragments\/codemods\/<stream>\/fixtures\/imports-subpaths\//],
    ['bad automation', { automation: 'magic' }, /invalid automation 'magic'/],
    ['breaking not B-id', { breaking: 'BX' }, /breaking 'BX' must be B<n>/],
    ['breaking not in register', { breaking: 'B99' }, /breaking 'B99' is not in docs\/release\/breaking-changes\.json/],
    ['message too long', { message: `Old is New ${'x'.repeat(200)}` }, /chars \(> 200\)/],
    ['message empty', { message: '' }, /message is empty/],
    ['message without replacement', { message: 'Old is removed in 5.0.' }, /message must name the replacement 'New'/],
    ['doc not dep anchor', { doc: '#other' }, /doc '#other' must be a '#dep-\*' anchor/],
    ['bad exception', { exception: 'vibes', evidence: 'x' }, /invalid exception 'vibes'/],
    ['exception without evidence', { exception: 'security' }, /exception entries require evidence/],
  ])('%s fails', (_n, patch, re) => {
    const entries = patch === null ? [OK, { ...OK }] : [{ ...OK, ...patch }];
    const errors = checkEntries(entries, CTX);
    expect(errors.join('\n')).toMatch(re);
  });
  it('exception entries may reference unknown subpaths/symbols and ship in 4.1.x', () => {
    const e = { ...OK, entry: './gone', symbol: 'Gone', since: '4.1.1', exception: 'security', evidence: 'GHSA draft', message: 'Gone: use New.' };
    expect(checkEntries([e], CTX)).toEqual([]);
  });
  it('manual automation allows codemod null', () => {
    expect(checkEntries([{ ...OK, codemod: null, automation: 'manual' }], CTX)).toEqual([]);
  });
  it('version rules are off when no line version is given (next)', () => {
    expect(checkEntries([{ ...OK, status: 'planned', since: '4.2.0' }], { ...CTX, version: null })).toEqual([]);
  });
});

describe('compareVersions', () => {
  it('orders releases and prereleases', () => {
    expect(compareVersions('4.2.0', '4.3.0')).toBe(-1);
    expect(compareVersions('4.3.0', '4.3.0')).toBe(0);
    expect(compareVersions('5.0.0-alpha.0', '5.0.0')).toBe(-1);
    expect(compareVersions('4.10.0', '4.9.9')).toBe(1);
  });
});

describe('codemod ids and fixtures come from the tree', () => {
  it('CORE_CODEMODS ∪ AREA_CODEMODS from src/contracts/fragments.ts', async () => {
    const ids = await loadCodemodIds(REPO);
    for (const id of ['imports-subpaths', 'canonical-names', 'removed', 'ai-chat', 'motion-props']) expect(ids.has(id)).toBe(true);
    expect(ids.size).toBe(14);
  });
  it('fixture dirs are read from fragments/codemods/*/fixtures/*', () => {
    const ids = codemodFixtureIds(REPO);
    expect(ids.has('canonical-names')).toBe(true);
    expect(ids.has('not-a-codemod')).toBe(false);
  });
});

describe('append-only vs compare branch', () => {
  it('flags removed ids, edited and added fields', () => {
    const base = [OK, { ...OK, id: 'DEP-P0002' }];
    expect(checkCompareBranch([OK], base).join('\n')).toMatch(/DEP-P0002: entry removed vs compare branch/);
    expect(checkCompareBranch([{ ...OK, since: '4.3.0' }], [OK]).join('\n')).toMatch(/field 'since' changed/);
    expect(checkCompareBranch([{ ...OK, compat: 'Old' }], [OK]).join('\n')).toMatch(/field 'compat' changed/);
  });
  it('allows pure additions unless every id must exist on the ref (4x vs next)', () => {
    const cur = [OK, { ...OK, id: 'DEP-P0003' }];
    expect(checkCompareBranch(cur, [OK])).toEqual([]);
    expect(checkCompareBranch(cur, [OK], { requireInBase: true, ref: 'origin/next' }))
      .toEqual(['DEP-P0003: present here but missing on origin/next']);
  });
});

describe('verify-deprecations CLI', () => {
  let root = '';
  const git = (...a: string[]) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const frag = (rows: object[]) => `export default ${JSON.stringify(rows, null, 2)};\n`;
  const run = (...a: string[]) => spawnSync('node', [join(root, 'scripts/release/verify-deprecations.mjs'), ...a], { cwd: root, encoding: 'utf8' });
  const { stream: _s, ...row } = OK;
  beforeAll(() => {
    root = realpathSync(mkdtempSync(join(tmpdir(), 'ag-verify-cli-')));
    for (const p of ['src/contracts/load-fragments.mjs', 'src/contracts/fragments.ts', 'docs/release/breaking-changes.json',
      'scripts/release/verify-deprecations.mjs']) {
      mkdirSync(join(root, p, '..'), { recursive: true });
      cpSync(join(REPO, p), join(root, p));
    }
    cpSync(join(REPO, 'scripts/release/lib'), join(root, 'scripts/release/lib'), { recursive: true });
    symlinkSync(join(REPO, 'node_modules'), join(root, 'node_modules'), 'dir');
    mkdirSync(join(root, 'fragments/codemods/plat/fixtures/canonical-names'), { recursive: true });
    writeFileSync(join(root, 'fragments/codemods/plat/fixtures/canonical-names/input.tsx'), 'export {};\n');
    writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'fixture', version: '4.3.0', exports: { '.': './index.js' } }));
    mkdirSync(join(root, 'fragments/deprecations'), { recursive: true });
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([row]));
    writeFileSync(join(root, '.gitignore'), 'node_modules\n');
    git('init', '-q', '-b', 'next');
    git('-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'add', '-A');
    git('-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'commit', '-q', '-m', 'base');
  });
  afterAll(() => rmSync(root, { recursive: true, force: true }));

  it('passes on a valid tree and prints the line', () => {
    const r = run('--line', '5x');
    expect(r.stderr).toBe('');
    expect(r.stdout).toMatch(/verify-deprecations --line 5x: 1 entries OK/);
  });
  it('4x line enforces the package.json version and the exports manifest', () => {
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([{ ...row, since: '4.4.0' }]));
    const r = run('--line', '4x');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/DEP-P0001: status 'active' but since 4\.4\.0 is after the line version 4\.3\.0/);
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([row]));
  });
  it('--compare-branch: edit and removal fail; 4x also fails on ids missing on the ref', () => {
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([{ ...row, message: 'Old is New (edited).' }]));
    let r = run('--compare-branch', 'next');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/DEP-P0001: field 'message' changed vs next/);
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([row, { ...row, id: 'DEP-P0002', doc: '#dep-dep-p0002' }]));
    expect(run('--line', '5x', '--compare-branch', 'next').status).toBe(0);
    r = run('--line', '4x', '--compare-branch', 'next');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/DEP-P0002: present here but missing on next/);
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([]));
    r = run('--compare-branch', 'next');
    expect(r.stderr).toMatch(/DEP-P0001: entry removed vs next/);
    writeFileSync(join(root, 'fragments/deprecations/plat.ts'), frag([row]));
  });
  it('the repo tree passes --line 5x', () => {
    const r = spawnSync('node', ['scripts/release/verify-deprecations.mjs', '--line', '5x'], { cwd: REPO, encoding: 'utf8' });
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
  });
});
