/* tests/showcase/showcase-imports.test.mjs — REQ-QUAL-59 import and static hygiene (FIN-G G-27, REQ-FIN-107, FIN-455).
 *
 * Exercises scripts/storybook/verify-showcase-imports.mjs as the CLI the lanes run:
 *   - on this repository (all 10 showcases): exit 0, every showcase listed, 0 violations;
 *   - on a scratch repository: a clean showcase passes, and every rule fails on its own invalid fixture
 *     (banned/unknown imports, 4.x Glass* names, !important, colour literals, banned style props, [data-ag-part]
 *     selectors, non-deterministic calls, meta copy, asset format/size/count/licence);
 *   - build mode (Vite build against the packed tarball) refuses to run outside a remote runner (exit 2 with the
 *     remote command) and fails closed without AURAGLASS_TARBALL. The real tarball build runs on L2 (remote).
 *
 * Written without import/export statements on purpose: Jest loads .mjs tests as ES modules under
 * `--experimental-vm-modules` (`npm test`, the L12 runner) and as CommonJS without it; node built-ins come from
 * process.getBuiltinModule so the file runs unchanged in both modes. */
const fs = process.getBuiltinModule('node:fs');
const os = process.getBuiltinModule('node:os');
const path = process.getBuiltinModule('node:path');
const { spawnSync } = process.getBuiltinModule('node:child_process');

const ROOT = path.resolve(path.dirname(expect.getState().testPath), '..', '..');
const SCRIPT = path.join(ROOT, 'scripts/storybook/verify-showcase-imports.mjs');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'showcase/showcases.json'), 'utf8'));
const scratch = [];

afterAll(() => {
  for (const d of scratch) fs.rmSync(d, { recursive: true, force: true });
});

function run(args, env = {}) {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ag-showcase-imports-report-')), 'report.json');
  scratch.push(path.dirname(out));
  const baseEnv = { ...process.env };
  delete baseEnv.CI;
  delete baseEnv.AG_REMOTE_RUNNER;
  delete baseEnv.CI_JOB_NAME_SLUG;
  delete baseEnv.AURAGLASS_TARBALL;
  const r = spawnSync(process.execPath, [SCRIPT, ...args, '--json', out], { cwd: ROOT, encoding: 'utf8', env: { ...baseEnv, ...env } });
  const report = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : null;
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, report };
}

/** Minimal AVIF container header (ftyp box, brand avif) followed by `size` bytes. */
function avif(size = 64) {
  const head = Buffer.from([0, 0, 0, 0x1c, ...Buffer.from('ftypavif'), 0, 0, 0, 0, ...Buffer.from('avifmif1miaf')]);
  return Buffer.concat([head, Buffer.alloc(Math.max(0, size - head.length))]);
}

const CLEAN_SHOWCASE = `import * as React from 'react';
import { Button } from 'aura-glass';
import { AppShell } from 'aura-glass/app-shell';
import { Demo as DemoBlock } from '../../registry/blocks/demo/index';
import { DEMO_ROWS } from '../../registry/blocks/demo/fixtures';
import { COPY, EPOCH } from './copy';
import styles from './demo.module.css';
import mark from './assets/mark.avif';

export function Demo({ now = EPOCH }: { now?: number }) {
  const day = new Date(now).toISOString().slice(0, 10);
  return (
    <AppShell.Root>
      <img src={mark} alt="" width={28} height={28} />
      <main id="demo-main" className={styles.page} style={{ maxInlineSize: '60rem' }}>
        <h1>{COPY.title}</h1>
        <p>{day}</p>
        <a href="#feed">Activity</a>
        <svg aria-hidden="true"><path fill="currentColor" d="M0 0h1v1z" /></svg>
        <Button>{COPY.cta}</Button>
        <DemoBlock rows={DEMO_ROWS} />
      </main>
    </AppShell.Root>
  );
}
`;

const CLEAN_STORIES = `import type { Meta, StoryObj } from '@storybook/react';
import { Demo } from './Demo.showcase';
const meta = { title: 'Showcases/Demo', component: Demo, tags: ['showcase'] } satisfies Meta<typeof Demo>;
export default meta;
export const FullPage: StoryObj<typeof meta> = {};
`;

/** A scratch repository with one clean showcase; `files` override or add paths. */
function scratchRepo(files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-showcase-imports-'));
  scratch.push(root);
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const base = {
    'package.json': JSON.stringify({ name: pkg.name, version: pkg.version, exports: pkg.exports }),
    'deprecations.json': JSON.stringify({ version: 1, entries: [{ id: 'DEP-C0001', kind: 'export', symbol: 'GlassButton', compat: 'GlassButton' }] }),
    'registry/blocks/demo/index.tsx': 'export function Demo() { return null; }\n',
    'registry/blocks/demo/fixtures.ts': 'export const DEMO_ROWS = [];\n',
    'registry/blocks/demo/internal.ts': 'export const X = 1;\n',
    'registry/items/kanban/fixtures.ts': 'export const K = 1;\n',
    'showcase/demo/Demo.showcase.tsx': CLEAN_SHOWCASE,
    'showcase/demo/Demo.stories.tsx': CLEAN_STORIES,
    'showcase/demo/copy.ts': "export const EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);\nexport const COPY = { title: 'Harbor payouts', cta: 'Export ledger' } as const;\n",
    'showcase/demo/demo.module.css': '.page { display: grid; gap: var(--ag-space-4); padding: 1rem; }\n',
    'showcase/demo/assets/mark.avif': avif(),
    'showcase/demo/assets/ASSETS.json': JSON.stringify({ licence: 'CC0-1.0', files: [{ file: 'mark.avif' }] }),
  };
  for (const [rel, content] of Object.entries({ ...base, ...files })) {
    const p = path.join(root, rel);
    if (content === null) { fs.rmSync(p, { force: true }); continue; }
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  }
  return root;
}

const withBody = (body, imports = '') => `import * as React from 'react';\n${imports}\nexport function Demo({ now = 0 }: { now?: number }) {\n  return (${body});\n}\n`;

describe('this repository', () => {
  it('passes every static rule over all showcases', () => {
    const r = run([]);
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(r.report.mode).toBe('static');
    expect(r.report.violations).toEqual([]);
    const expected = MANIFEST.showcases.map((s) => `${s.dir}/${s.component}.showcase.tsx`).sort();
    expect([...r.report.showcases].sort()).toEqual(expected);
    expect(expected).toHaveLength(10);
  });
});

describe('scratch repository', () => {
  it('accepts a clean showcase', () => {
    const r = run(['--root', scratchRepo()]);
    expect(r.report.violations).toEqual([]);
    expect(r.status).toBe(0);
  });

  const SRC = 'showcase/demo/Demo.showcase.tsx';
  it.each([
    ['library source', withBody('<p />', "import { Button } from '../../src/components/button';"), 'import', /library source/],
    ['a path alias', withBody('<p />', "import { Button } from '@/components/button';"), 'import', /path alias/],
    ['the Storybook shell', withBody('<p />', "import { StoryRoot } from '../../.storybook/contract/StoryRoot';"), 'import', /Storybook shell/],
    ['aura-glass/compat', withBody('<p />', "import { GlassCard } from 'aura-glass/compat';"), 'import', /compat is banned/],
    ['an unknown package subpath', withBody('<p />', "import { X } from 'aura-glass/internal';"), 'import', /not a package export/],
    ['a stream internal fixture', withBody('<p />', "import { K } from '../../registry/items/kanban/fixtures';"), 'import', /internal fixture/],
    ['a registry block internal module', withBody('<p />', "import { X } from '../../registry/blocks/demo/internal';"), 'import', /outside the showcase folder/],
    ['a missing registry block', withBody('<p />', "import { Y } from '../../registry/blocks/nope/index';"), 'import', /does not exist/],
    ['another showcase folder', withBody('<p />', "import { O } from '../other/Other.showcase';"), 'import', /outside the showcase folder/],
    ['a third-party package', withBody('<p />', "import _ from 'lodash';"), 'import', /not allowed/],
    ['a computed dynamic import', withBody('<p />', 'const name = "x"; void import(name);'), 'import', /computed specifier/],
    ['a 4.x Glass* name', withBody('<GlassButton />', "import { GlassButton } from 'aura-glass';"), 'legacy-name', /GlassButton/],
    ['a background style prop', withBody("<div style={{ background: 'var(--ag-x)' }} />"), 'style', /background/],
    ['a border style prop', withBody("<div style={{ borderRadius: '4px' }} />"), 'style', /borderRadius/],
    ['a backdrop-filter style prop', withBody("<div style={{ backdropFilter: 'none' }} />"), 'style', /backdropFilter/],
    ['an opacity style prop', withBody('<div style={{ opacity: 0.5 }} />'), 'style', /opacity/],
    ['a non-literal style value', withBody('<div style={undefined} />'), 'style', /inline object literal/],
    ['a hex colour', withBody("<div data-tone={'#ff0000'} />"), 'colour', /colour literal/],
    ['a colour function', withBody("<div title={'rgb(0 0 0)'} />"), 'colour', /colour literal/],
    ['a literal fill colour', withBody('<svg><path fill="red" /></svg>'), 'colour', /fill="red"/],
    ['!important', withBody("<div className={'x !important'} />"), 'important', /important/],
    ['a [data-ag-part] selector', withBody("<div>{String(document.querySelector('[data-ag-part=\"root\"]'))}</div>"), 'part-selector', /data-ag-part/],
    ['Math.random', withBody('<p>{Math.random()}</p>'), 'determinism', /Math\.random/],
    ['Date.now', withBody('<p>{Date.now()}</p>'), 'determinism', /Date\.now/],
    ['new Date()', withBody('<p>{new Date().toISOString()}</p>'), 'determinism', /wall clock/],
    ['fetch', withBody("<p>{String(fetch('/api/ledger'))}</p>"), 'determinism', /fetch/],
    ['XMLHttpRequest', withBody('<p>{String(new XMLHttpRequest())}</p>'), 'determinism', /XMLHttpRequest/],
    ['meta copy about the library', withBody('<p>Built with AuraGlass</p>'), 'copy', /AuraGlass/],
    ['meta copy about glass', withBody("<p>{'Frosted glass panels'}</p>"), 'copy', /glass/],
    ['meta copy about Storybook', withBody('<p>Storybook demo</p>'), 'copy', /Storybook/],
  ])('fails on %s', (_label, source, rule, message) => {
    const r = run(['--root', scratchRepo({ [SRC]: source })]);
    expect(r.status).toBe(1);
    const hits = r.report.violations.filter((v) => v.rule === rule && v.file === SRC);
    expect(hits.map((v) => v.message).join('\n')).toMatch(message);
  });

  it('allows @storybook/* only as a type-only import in stories', () => {
    const bad = CLEAN_STORIES.replace('import type { Meta, StoryObj }', 'import { Meta, StoryObj }');
    const r = run(['--root', scratchRepo({ 'showcase/demo/Demo.stories.tsx': bad })]);
    expect(r.status).toBe(1);
    expect(r.report.violations).toEqual([expect.objectContaining({ rule: 'import', file: 'showcase/demo/Demo.stories.tsx', message: expect.stringMatching(/type-only/) })]);
  });

  const CSS = 'showcase/demo/demo.module.css';
  it.each([
    ['a hex colour', '.page { --tone: #fff; }', 'colour'],
    ['!important', '.page { display: grid !important; }', 'important'],
    ['a [data-ag-part] selector', '.page [data-ag-part="root"] { display: block; }', 'part-selector'],
  ])('fails on %s in showcase CSS', (_label, css, rule) => {
    const r = run(['--root', scratchRepo({ [CSS]: `${css}\n` })]);
    expect(r.status).toBe(1);
    expect(r.report.violations.filter((v) => v.file === CSS).map((v) => v.rule)).toContain(rule);
  });

  const A = 'showcase/demo/assets';
  const listing = (names) => JSON.stringify({ licence: 'CC0-1.0', files: names.map((file) => ({ file })) });
  it.each([
    ['a PNG asset', { [`${A}/photo.png`]: Buffer.from('png'), [`${A}/ASSETS.json`]: listing(['mark.avif', 'photo.png']) }, /must be AVIF/],
    ['a renamed non-AVIF file', { [`${A}/fake.avif`]: Buffer.from('not an avif container at all'), [`${A}/ASSETS.json`]: listing(['mark.avif', 'fake.avif']) }, /must be AVIF/],
    ['an asset over 300 KB', { [`${A}/big.avif`]: avif(300 * 1024 + 1), [`${A}/ASSETS.json`]: listing(['mark.avif', 'big.avif']) }, /max 307200/],
    ['more than 12 assets', {
      ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`${A}/a${i}.avif`, avif()])),
      [`${A}/ASSETS.json`]: listing(['mark.avif', ...Array.from({ length: 12 }, (_, i) => `a${i}.avif`)]),
    }, /13 assets \(max 12\)/],
    ['an unlisted asset', { [`${A}/extra.avif`]: avif() }, /not listed in ASSETS\.json/],
    ['a missing licence record', { [`${A}/ASSETS.json`]: null }, /missing ASSETS\.json/],
    ['an empty licence', { [`${A}/ASSETS.json`]: JSON.stringify({ licence: ' ', files: [{ file: 'mark.avif' }] }) }, /no licence/],
    ['an image outside assets/', { 'showcase/demo/hero.avif': avif() }, /image outside assets/],
  ])('fails on %s', (_label, files, message) => {
    const r = run(['--root', scratchRepo(files)]);
    expect(r.status).toBe(1);
    expect(r.report.violations.filter((v) => v.rule === 'asset').map((v) => v.message).join('\n')).toMatch(message);
  });

  it('fails when there is no showcase at all', () => {
    const r = run(['--root', scratchRepo({ 'showcase/demo/Demo.showcase.tsx': null, 'showcase/demo/Demo.stories.tsx': null })]);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/no showcase/);
  });
});

describe('tarball build mode', () => {
  it('exits 2 with the remote command outside CI / the remote runner', () => {
    const r = run(['--build']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/Remote command: node certification\/run\.mjs --lane L2/);
  });

  it('fails closed on a remote runner without AURAGLASS_TARBALL', () => {
    const r = run(['--build'], { AG_REMOTE_RUNNER: '1' });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/AURAGLASS_TARBALL is unset/);
  });
});
