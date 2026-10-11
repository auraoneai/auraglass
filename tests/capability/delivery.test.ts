// tests/capability/delivery.test.ts — REQ-SURF-181 (L2 delivery check) and
// REQ-SURF-187 (story ids). A 'delivered' row with release ≤ package version
// must resolve every name through one of four routes: (a) a value export or
// static member of its subpath in the packed tarball, (b) a data-ag-part in a
// *.meta.ts of the row's owner, (c) a story id of the row in
// storybook-static/index.json, (d) a registry item (registry-item.json with
// the form's type plus the built JSON). Each route has a passing and a failing
// fixture; the tarball route runs on a real packed .tgz.
import { describe, expect, it } from '@jest/globals';
import { spawnSync, execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');
const RUBRIC = { r1: true, r2: true, r3: true, r4: true, r5: true, r6: true };

function row(over: Record<string, unknown>) {
  return {
    id: 'X-05', capability: 'Meter', area: 'foundation', priority: 'P1',
    owner: 'CMP', collaborators: [], form: ['export'], names: ['Meter'],
    subpath: '.', release: '5.0', evidence: ['exception:fixture'],
    findings: [], reqRefs: [], rubric: RUBRIC,
    exportDelta: { root: 1, subpath: 0 }, budgetKb: 5, status: 'delivered',
    artifacts: [], demand: [], stories: [],
    ...over,
  };
}

function fixture(rows: object[], extra: Record<string, unknown> = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-delivery-'));
  writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify({ $schema: './capability-ledger.schema.json', version: '1', rows }));
  for (const [name, content] of Object.entries(extra)) {
    writeFileSync(join(dir, name), typeof content === 'string' ? content : JSON.stringify(content));
  }
  return dir;
}

function run(dir: string, args: string[]) {
  return spawnSync(process.execPath,
    [SCRIPT, '--ledger', join(dir, 'capability-ledger.json'), '--evidence-dir', join(dir, 'evidence'), ...args],
    { encoding: 'utf8', cwd: ROOT, env: { ...process.env, CI_COMMIT_TAG: '' } });
}
const out = (r: { stdout: string; stderr: string }) => `${r.stdout}${r.stderr}`;

describe('route (a): value export or static member of the subpath', () => {
  it('passes when the enumerated exports carry every delivered name', () => {
    const dir = fixture([row({})], { 'packed.json': { entries: [{ subpath: '.', exports: ['Meter', 'Kbd'] }] } });
    const r = run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '5.0.0']);
    expect(out(r)).toContain('capability-ledger: ok');
    expect(r.status).toBe(0);
    const ev = JSON.parse(readFileSync(join(dir, 'evidence', 'delivery.json'), 'utf8'));
    expect(ev.rows).toEqual([{ id: 'X-05', area: 'foundation', routes: { Meter: 'export' } }]);
  });
  it('exits 1 naming the row when a delivered name is absent', () => {
    const dir = fixture([row({})], { 'packed.json': { entries: [{ subpath: '.', exports: ['Kbd'] }] } });
    const r = run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '5.0.0']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-05: delivered name Meter resolves through no route');
  });
  it('resolves a static member (MediaControls.Transcript) and fails without it', () => {
    // 'Transcript' is not a data-ag-part of any SURF meta, so only route (a)
    // can resolve it here ('Captions' would also resolve through route (b)).
    const captions = row({ id: 'X-41', owner: 'SURF', area: 'media', form: ['part'], names: ['Transcript'], subpath: './media',
      exportDelta: { root: 0, subpath: 0 }, budgetKb: null, stories: ['media-mediacontrols--full'] });
    const ok = fixture([captions], { 'packed.json': { entries: [{ subpath: './media', exports: ['MediaControls'], statics: { MediaControls: ['Root', 'Transcript'] } }] } });
    expect(run(ok, ['--manifest', join(ok, 'packed.json'), '--pkg-version', '5.0.0']).status).toBe(0);
    const bad = fixture([captions], { 'packed.json': { entries: [{ subpath: './media', exports: ['MediaControls'], statics: { MediaControls: ['Root'] } }] } });
    const r = run(bad, ['--manifest', join(bad, 'packed.json'), '--pkg-version', '5.0.0']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-41');
  });
  it('skips rows whose release exceeds the package version', () => {
    const dir = fixture([row({})], { 'packed.json': { entries: [{ subpath: '.', exports: [] }] } });
    expect(run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '4.9.9']).status).toBe(0);
  });
  it('a missing packed artifact fails (never skipped)', () => {
    const dir = fixture([row({})]);
    const r = run(dir, ['--manifest', join(dir, 'nope.tgz')]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('not present');
  });
});

describe('route (a) on a real packed tarball', () => {
  const rootName = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).name;
  function pack(files: Record<string, string>) {
    const dir = mkdtempSync(join(tmpdir(), 'ledger-tgz-'));
    const pkg = join(dir, 'src', 'package');
    for (const [p, c] of Object.entries(files)) {
      mkdirSync(join(pkg, p, '..'), { recursive: true });
      writeFileSync(join(pkg, p), c);
    }
    mkdirSync(join(dir, 'pack'));
    execFileSync('tar', ['-czf', join(dir, 'pack', 'aura-glass-5.0.0.tgz'), '-C', join(dir, 'src'), 'package']);
    return dir;
  }
  const PKG = JSON.stringify({
    name: rootName, version: '5.0.0', type: 'module',
    exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' }, './media': { import: './dist/media.js' }, './styles.css': './dist/styles.css' },
  });
  it('extracts the tarball, imports each entry and resolves exports and statics', () => {
    const t = pack({
      'package.json': PKG,
      'dist/index.js': 'export const Meter = () => null;\nexport const Kbd = () => null;\n',
      'dist/media.js': 'const MediaControls = { Root() {}, Transcript() {} };\nexport { MediaControls };\n',
      'dist/styles.css': '',
    });
    const transcript = row({ id: 'X-41', owner: 'SURF', area: 'media', form: ['part'], names: ['Transcript'], subpath: './media',
      exportDelta: { root: 0, subpath: 0 }, budgetKb: null, stories: ['media-mediacontrols--full'] });
    const dir = fixture([row({}), transcript]);
    const r = run(dir, ['--manifest', join(t, 'pack')]);
    expect(out(r)).toContain('delivery: 2 delivered row(s)');
    expect(r.status).toBe(0);
    const ev = JSON.parse(readFileSync(join(dir, 'evidence', 'packed-exports.json'), 'utf8'));
    expect(ev.version).toBe('5.0.0');
    expect(ev.entries).toEqual([
      { subpath: '.', exports: ['Kbd', 'Meter'], statics: {} },
      { subpath: './media', exports: ['MediaControls'], statics: { MediaControls: ['Root', 'Transcript'] } },
    ]);
    const delivery = JSON.parse(readFileSync(join(dir, 'evidence', 'delivery.json'), 'utf8'));
    expect(delivery.rows.map((x: any) => x.routes)).toEqual([{ Meter: 'export' }, { Transcript: 'static' }]);
  });
  it('exits 1 when the packed entry lacks the delivered name', () => {
    const t = pack({ 'package.json': PKG, 'dist/index.js': 'export const Kbd = 1;\n', 'dist/media.js': 'export {};\n' });
    const dir = fixture([row({})]);
    const r = run(dir, ['--manifest', join(t, 'pack')]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-05: delivered name Meter');
  });
});

describe('route (b): data-ag-part in an owner meta', () => {
  // ColorPicker.meta.ts (owner CMP) declares the 'area' part (X-18). A
  // delivered part row must cite an existing story id (REQ-SURF-187), so the
  // fixture cites one; route (b) itself does not read it.
  const area = row({ id: 'X-18', form: ['part'], names: ['Area'], subpath: null, exportDelta: { root: 0, subpath: 0 }, budgetKb: null,
    stories: ['media-mediacontrols--full'] });
  const empty = { 'packed.json': { entries: [] } };
  it('resolves a part declared by a meta of the row owner', () => {
    const dir = fixture([area], empty);
    expect(run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '5.0.0']).status).toBe(0);
  });
  it('fails for a part no owner meta declares, and for a foreign owner', () => {
    const missing = fixture([{ ...area, names: ['NoSuchPart'] }], empty);
    const a = run(missing, ['--manifest', join(missing, 'packed.json'), '--pkg-version', '5.0.0']);
    expect(a.status).toBe(1);
    expect(a.stderr).toContain('X-18: delivered name NoSuchPart');
    const foreign = fixture([{ ...area, owner: 'MAT' }], empty);
    expect(run(foreign, ['--manifest', join(foreign, 'packed.json'), '--pkg-version', '5.0.0']).status).toBe(1);
  });
});

describe('route (c): story id in storybook-static/index.json', () => {
  const virt = row({ id: 'X-24', owner: 'SURF', area: 'data', form: ['prop'], names: ['virtualize'], subpath: null,
    exportDelta: { root: 0, subpath: 0 }, budgetKb: null, stories: ['surf-table--virtualized'] });
  it('resolves a row story id present in the index', () => {
    const dir = fixture([virt], {
      'packed.json': { entries: [] },
      'index.json': { v: 5, entries: { 'surf-table--virtualized': { id: 'surf-table--virtualized', title: 'surf/table', name: 'Virtualized', type: 'story' } } },
    });
    const r = run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '5.0.0', '--storybook-index', join(dir, 'index.json')]);
    expect(out(r)).toContain('capability-ledger: ok');
    expect(r.status).toBe(0);
  });
  it('fails when the built index lacks the story', () => {
    const dir = fixture([virt], { 'packed.json': { entries: [] }, 'index.json': { v: 5, entries: {} } });
    const r = run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '5.0.0', '--storybook-index', join(dir, 'index.json')]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-24: delivered name virtualize');
  });
});

describe('route (d): registry item source + built JSON of the matching type', () => {
  const ps = row({ id: 'X-46', owner: 'SURF', area: 'workspaces', form: ['registry-item'], names: ['presence-stack'], subpath: null,
    release: '5.1', exportDelta: { root: 0, subpath: 0 }, budgetKb: null });
  it('resolves registry/items/presence-stack with its built JSON', () => {
    const dir = fixture([ps], { 'packed.json': { entries: [] } });
    mkdirSync(join(dir, 'r'));
    writeFileSync(join(dir, 'r', 'presence-stack.json'), '{}');
    const r = run(dir, ['--manifest', join(dir, 'packed.json'), '--pkg-version', '5.1.0', '--registry-out', join(dir, 'r')]);
    expect(out(r)).toContain('capability-ledger: ok');
    expect(r.status).toBe(0);
  });
  it('fails without the built JSON, and when the type does not match the form', () => {
    const noBuild = fixture([ps], { 'packed.json': { entries: [] } });
    mkdirSync(join(noBuild, 'r'));
    const a = run(noBuild, ['--manifest', join(noBuild, 'packed.json'), '--pkg-version', '5.1.0', '--registry-out', join(noBuild, 'r')]);
    expect(a.status).toBe(1);
    expect(a.stderr).toContain('X-46: delivered name presence-stack');
    const wrongType = fixture([{ ...ps, form: ['registry-block'] }], { 'packed.json': { entries: [] } });
    mkdirSync(join(wrongType, 'r'));
    writeFileSync(join(wrongType, 'r', 'presence-stack.json'), '{}');
    expect(run(wrongType, ['--manifest', join(wrongType, 'packed.json'), '--pkg-version', '5.1.0', '--registry-out', join(wrongType, 'r')]).status).toBe(1);
  });
});

describe('rc rule: no 5.0 P0/P1 row is planned from 5.0.0-rc.1', () => {
  it('a planned 5.0 P1 row fails at rc; deferred passes', () => {
    const planned = fixture([row({ status: 'planned' })], { 'packed.json': { entries: [] } });
    const r = run(planned, ['--manifest', join(planned, 'packed.json'), '--pkg-version', '5.0.0', '--rc']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-05: 5.0 P1 row is still planned at rc');
    const deferred = fixture([row({ status: 'deferred' })], { 'packed.json': { entries: [] } });
    expect(run(deferred, ['--manifest', join(deferred, 'packed.json'), '--pkg-version', '5.0.0', '--rc']).status).toBe(0);
  });
});

// ---- REQ-SURF-187: every stories[] id exists (static parse of CSF files) ----
const sanitize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const startCase = (k: string) => k.replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/([a-zA-Z])(\d)/g, '$1 $2').replace(/(\d)([a-zA-Z])/g, '$1 $2');
function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.stories\.(ts|tsx)$/.test(name)) yield p;
  }
}
function csfIds() {
  const ids = new Set<string>();
  for (const base of ['src', 'stories', 'registry', 'showcase']) {
    for (const f of walk(join(ROOT, base))) {
      const text = readFileSync(f, 'utf8');
      const title = /\btitle:\s*['"]([^'"]+)['"]/.exec(text)?.[1];
      if (!title) continue;
      for (const m of text.matchAll(/^export\s+const\s+([A-Za-z_$][\w$]*)\s*[:=]/gm)) ids.add(`${sanitize(title)}--${sanitize(startCase(m[1]!))}`);
    }
  }
  return ids;
}

describe('ledger stories[] ids', () => {
  const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));
  it('every committed stories[] id is a CSF export of a story file', () => {
    const ids = csfIds();
    const cited = ledger.rows.flatMap((r: any) => r.stories.map((s: string) => `${r.id}:${s}`));
    expect(cited.length).toBeGreaterThan(0);
    expect(cited.filter((c: string) => !ids.has(c.split(':')[1]!))).toEqual([]);
  });
  it('the verifier fails on a fake story id in a row', () => {
    const dir = fixture([row({ id: 'X-24', owner: 'SURF', area: 'data', form: ['prop'], names: ['virtualize'], subpath: null,
      exportDelta: { root: 0, subpath: 0 }, budgetKb: null, status: 'planned', stories: ['surf-table--does-not-exist'] })]);
    const r = run(dir, []);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-24: story id surf-table--does-not-exist not found');
  });
  it('a delivered part/prop row must cite a story id', () => {
    const dir = fixture([row({ id: 'X-24', owner: 'SURF', area: 'data', form: ['prop'], names: ['virtualize'], subpath: null,
      exportDelta: { root: 0, subpath: 0 }, budgetKb: null, stories: [] })]);
    const r = run(dir, []);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-24: delivered part/prop row cites no story id');
  });
});
