/* tests/docs/lint-claims.test.ts — REQ-PLAT-104 (PLAT-389/390/391, REQ-FIN-43).
   gen-claims sha custody + GA rule, paired-region render-claims, and the
   PRD-verbatim lint-claims over README, apps/docs/content/**, llms.txt.tmpl
   and the release body. Fixture trees are real temp git repos so tree
   custody (HEAD == build SHA, clean file) is exercised for real. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { CLAIM_SOURCES, GA_TAG_RE, generate, main as genMain } from '../../scripts/docs/gen-claims.mjs';
import { formatClaim, render } from '../../scripts/docs/render-claims.mjs';
import { NUMBER_RE, lint, lintText, loadAllow, main as lintMain } from '../../scripts/docs/lint-claims.mjs';
import { ARTIFACTS, TREE_SOURCES } from '../../scripts/docs/paths.mjs';

const repoRoot = join(__dirname, '..', '..');

function put(root: string, rel: string, body: string) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), body);
}
const git = (root: string, ...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

/** Temp git repo with the committed tree sources; returns { root, sha }. */
function fixtureRepo() {
  const root = mkdtempSync(join(tmpdir(), 'claims-repo-'));
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'claims@example.invalid');
  git(root, 'config', 'user.name', 'claims');
  git(root, 'config', 'commit.gpgsign', 'false');
  put(root, TREE_SOURCES.rootExports, JSON.stringify({ entry: '.', exports: ['Button', 'Card', 'Dialog'] }));
  put(root, TREE_SOURCES.catalogue, JSON.stringify({ version: 1, transforms: [{ id: 'a' }, { id: 'b' }] }));
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'fixture');
  return { root, sha: git(root, 'rev-parse', 'HEAD') };
}

/** Write every PLAT-owned artifact stamped with `sha`. */
function platArtifacts(root: string, sha: string) {
  put(root, ARTIFACTS.packEnv, `AURAGLASS_TARBALL=.artifacts/pack/aura-glass-5.0.0.tgz\nTARBALL_MB=1.42\nPACK_SHA=${sha}\n`);
  put(root, ARTIFACTS.sizeBudgets, JSON.stringify({ sha, rows: [{ id: 'Button', measuredBytes: 4710, status: 'pass' }], measured: { stylesCssGzBytes: 16758 } }));
  put(root, ARTIFACTS.quickstartTiming, JSON.stringify({ sha, cells: {}, 'quickstart-seconds-next': { value: 141, state: 'pass' }, 'quickstart-seconds-vite': { value: null, state: 'pending' } }));
  put(root, ARTIFACTS.registryReport, JSON.stringify({ sha, items: [
    { name: 'app-frame', kind: 'blocks', status: 'certified' }, { name: 'auth', kind: 'blocks', status: 'certified' },
    { name: 'pricing', kind: 'blocks', status: 'omitted' }, { name: 'kanban', kind: 'items', status: 'certified' },
  ] }));
}

describe('gen-claims (sha custody, pending/GA rules)', () => {
  it('declares the 14 PRD minimum ids', () => {
    expect(Object.keys(CLAIM_SOURCES).sort()).toEqual([
      'button-gzip-kb', 'codemod-transform-count', 'component-count', 'contrast-min-large', 'contrast-min-regular',
      'flagship-count', 'glass-recipes', 'pixel-gates-passed', 'quickstart-seconds-next', 'quickstart-seconds-vite',
      'registry-block-count', 'root-value-exports', 'styles-css-gzip-kb', 'tarball-mb',
    ]);
  });

  it('reads values from PLAT artifacts and tree sources; absent cross-stream claims are pending, not errors, off-tag', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    const r = generate({ root, env: { CI_COMMIT_SHA: sha }, write: false });
    expect(r.errors).toEqual([]);
    expect(r.sha).toBe(sha);
    expect(r.claims['tarball-mb']).toMatchObject({ value: 1.42, unit: 'MB', source: { artifact: ARTIFACTS.packEnv, sha, path: 'TARBALL_MB' } });
    expect(r.claims['button-gzip-kb'].value).toBe(4.6);
    expect(r.claims['styles-css-gzip-kb'].value).toBe(16.4);
    expect(r.claims['registry-block-count'].value).toBe(2);
    expect(r.claims['root-value-exports']).toMatchObject({ value: 3, source: { artifact: TREE_SOURCES.rootExports, sha } });
    expect(r.claims['codemod-transform-count'].value).toBe(2);
    expect(r.claims['quickstart-seconds-next'].value).toBe(141);
    expect(r.claims['quickstart-seconds-vite']).toMatchObject({ value: null, state: 'pending' });
    for (const id of ['flagship-count', 'component-count', 'contrast-min-regular', 'contrast-min-large', 'glass-recipes', 'pixel-gates-passed']) {
      expect(r.claims[id]).toMatchObject({ value: null, state: 'pending' });
      expect(r.pending).toContain(id);
    }
  });

  it('exits 1 on a foreign-sha artifact', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    put(root, ARTIFACTS.registryReport, JSON.stringify({ sha: 'f'.repeat(40), items: [] }));
    const r = generate({ root, env: { CI_COMMIT_SHA: sha }, write: false });
    expect(r.errors.some((e: string) => /registry-block-count: .* sha f{40} != build/.test(e))).toBe(true);
    expect(r.claims['registry-block-count'].value).toBeNull();
    expect(genMain({ root, env: { CI_COMMIT_SHA: sha } })).toBe(1);
  });

  it('a foreign sha on a cross-stream artifact fails too (not merely pending)', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    put(root, ARTIFACTS.releaseVerdict, JSON.stringify({ version: 1, sha: 'a'.repeat(40), tag: 'v5.0.0', items: [], ga: false }));
    expect(genMain({ root, env: { CI_COMMIT_SHA: sha } })).toBe(1);
  });

  it('fails when the build checkout is not the build SHA (tree custody)', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, 'b'.repeat(40));
    const r = generate({ root, env: { CI_COMMIT_SHA: 'b'.repeat(40) }, write: false });
    expect(r.errors.some((e: string) => e.startsWith('root-value-exports:') && e.includes(`sha ${sha} != build`))).toBe(true);
  });

  it('fails when a tree source is modified in the checkout', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    put(root, TREE_SOURCES.catalogue, JSON.stringify({ version: 1, transforms: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }));
    const r = generate({ root, env: { CI_COMMIT_SHA: sha }, write: false });
    expect(r.errors.some((e: string) => e.startsWith('codemod-transform-count:') && e.includes('no tree custody'))).toBe(true);
  });

  it('on a v5.0.0 tag a pending cross-stream claim exits 1; on a pre-release tag it does not', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    const ga = generate({ root, env: { CI_COMMIT_SHA: sha, CI_COMMIT_TAG: 'v5.0.0' }, write: false });
    expect(ga.ga).toBe(true);
    expect(ga.errors.some((e: string) => e.startsWith('flagship-count: pending on GA tag v5.0.0'))).toBe(true);
    expect(genMain({ root, env: { CI_COMMIT_SHA: sha, CI_COMMIT_TAG: 'v5.0.0' } })).toBe(1);
    const beta = generate({ root, env: { CI_COMMIT_SHA: sha, CI_COMMIT_TAG: 'v5.0.0-beta.1' }, write: false });
    expect(beta.ga).toBe(false);
    expect(beta.errors).toEqual([]);
    expect(GA_TAG_RE.test('5.0.0')).toBe(false);
    expect(GA_TAG_RE.test('v5.2.13')).toBe(true);
  });

  it('a PLAT artifact that is missing, or carries no sha, always fails; a .sha sidecar supplies custody', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    put(root, ARTIFACTS.packEnv, 'TARBALL_MB=1.42\n');
    let r = generate({ root, env: { CI_COMMIT_SHA: sha }, write: false });
    expect(r.errors.some((e: string) => e.startsWith('tarball-mb: PLAT artifact') && e.includes('carries no sha'))).toBe(true);
    put(root, `${ARTIFACTS.packEnv}.sha`, `${sha}\n`);
    r = generate({ root, env: { CI_COMMIT_SHA: sha }, write: false });
    expect(r.errors).toEqual([]);
    expect(r.claims['tarball-mb'].value).toBe(1.42);

    const bare = fixtureRepo();
    const missing = generate({ root: bare.root, env: { CI_COMMIT_SHA: bare.sha }, write: false });
    for (const id of ['tarball-mb', 'button-gzip-kb', 'quickstart-seconds-next', 'registry-block-count']) {
      expect(missing.errors.some((e: string) => e.startsWith(`${id}: PLAT artifact`) && e.endsWith('missing'))).toBe(true);
    }
  });

  it('a cross-stream artifact without a sha is pending (no custody), never a number', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    put(root, ARTIFACTS.matRecipes, JSON.stringify({ 'independent-glass-recipes': 1, inside: [], outside: [] }));
    put(root, ARTIFACTS.subjects, JSON.stringify({ version: 1, stories: [{ id: 'a', subject: 'Button', kind: 'component', tags: ['flagship'], owner: 'CMP' }] }));
    put(root, `${ARTIFACTS.subjects}.sha`, sha);
    const r = generate({ root, env: { CI_COMMIT_SHA: sha }, write: false });
    expect(r.errors).toEqual([]);
    expect(r.claims['glass-recipes']).toMatchObject({ value: null, state: 'pending' });
    expect(r.claims['glass-recipes'].reason).toMatch(/no sha custody/);
    expect(r.claims['flagship-count'].value).toBe(1);
    expect(r.claims['component-count'].value).toBe(1);
  });

  it('uses the checkout HEAD when CI_COMMIT_SHA is unset (no "local" bypass)', () => {
    const { root, sha } = fixtureRepo();
    platArtifacts(root, sha);
    expect(generate({ root, env: {}, write: false }).sha).toBe(sha);
    put(root, ARTIFACTS.registryReport, JSON.stringify({ sha: 'c'.repeat(40), items: [] }));
    expect(generate({ root, env: {}, write: false }).errors.length).toBeGreaterThan(0);
  });

  it('has no reference to GitHub CI variables', () => {
    const src = require('node:fs').readFileSync(join(repoRoot, 'scripts/docs/gen-claims.mjs'), 'utf8');
    expect(src).not.toMatch(/GITHUB_|REF_NAME/);
  });
});

describe('render-claims (paired regions)', () => {
  const claims = { 'tarball-mb': { value: 3.1, unit: 'MB' }, 'contrast-min-regular': { value: 4.62, unit: ':1' }, 'glass-recipes': { value: null, unit: 'recipes' } };

  it('fills regions, keeps markers, renders pending for null and unknown ids', () => {
    const src = 'a <!-- ag:claim id="tarball-mb" -->old<!-- /ag:claim --> b <!-- ag:claim id="glass-recipes" -->9<!-- /ag:claim --> c <!-- ag:claim id="contrast-min-regular" --><!-- /ag:claim -->';
    const out = render(src, claims);
    expect(out).toBe('a <!-- ag:claim id="tarball-mb" -->3.1 MB<!-- /ag:claim --> b <!-- ag:claim id="glass-recipes" -->pending<!-- /ag:claim --> c <!-- ag:claim id="contrast-min-regular" -->4.62:1<!-- /ag:claim -->');
    expect(render(out, claims)).toBe(out);
    expect(render('<!-- ag:claim id="tarball-mb" -->x<!-- /ag:claim -->', {})).toBe('<!-- ag:claim id="tarball-mb" -->pending<!-- /ag:claim -->');
    expect(formatClaim(undefined)).toBe('pending');
  });

  it('a region whose body spans lines is refilled', () => {
    expect(render('<!-- ag:claim id="tarball-mb" -->\nstale\n<!-- /ag:claim -->', claims)).toBe('<!-- ag:claim id="tarball-mb" -->3.1 MB<!-- /ag:claim -->');
  });
});

describe('lint-claims (PRD regex, scope, allow-list)', () => {
  it('uses the PRD REQ-PLAT-104 regex verbatim', () => {
    expect(NUMBER_RE.source).toBe(String.raw`\b\d+(\.\d+)?\s?(%|KB|MB|ms|s|components|flagships|targets|recipes|blocks|transforms)\b`);
  });

  it('the repository is clean (README, apps/docs/content/**, llms.txt.tmpl)', () => {
    expect(lint(repoRoot)).toEqual([]);
  });

  it('every allow-list entry has a reason', () => {
    for (const row of loadAllow(repoRoot)) expect(row.reason.trim().length).toBeGreaterThan(10);
    const dir = mkdtempSync(join(tmpdir(), 'claims-allow-'));
    put(dir, 'scripts/docs/claims-allow.json', JSON.stringify([{ text: '12 KB' }]));
    expect(() => loadAllow(dir)).toThrow(/reason/);
  });

  it('fails the 4.x template prose and passes once the numbers are claims', () => {
    const old = [
      'The package registry includes 28 recipes:',
      '[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](https://react.dev/)',
      '**5.0 status:** <!-- ag:claim component-count --> components',
    ].join('\n');
    const v = lintText(old);
    expect(v.map((x: { text: string }) => x.text)).toEqual(expect.arrayContaining(['28 recipes', '18%']));
    expect(v.some((x: { kind: string }) => x.kind === 'unpaired-claim-marker')).toBe(true);
    expect(lintText('Ships <!-- ag:claim id="component-count" -->42 components<!-- /ag:claim --> today.')).toEqual([]);
  });

  it('skips only claim regions and code fences, not headings', () => {
    expect(lintText('```bash\nnpm test # 12 s\n```\n~~~\n3 MB\n~~~')).toEqual([]);
    expect(lintText('## Under 12 KB').map((x: { text: string }) => x.text)).toEqual(['12 KB']);
    expect(lintText('<Claim id="tarball-mb" /> and 2 blocks').map((x: { text: string }) => x.text)).toEqual(['2 blocks']);
  });

  it('rejects unknown claim ids', () => {
    expect(lintText('<!-- ag:claim id="made-up" -->x<!-- /ag:claim -->')[0]?.kind).toBe('unknown-claim');
    expect(lintText('<Claim id="made-up" />')[0]?.kind).toBe('unknown-claim');
  });

  it('scans README.md, apps/docs/content/**, llms.txt.tmpl and the release body', () => {
    const dir = mkdtempSync(join(tmpdir(), 'claims-scope-'));
    put(dir, 'README.md', 'Ships 42 components.\n');
    put(dir, 'apps/docs/content/cmp/button.mdx', 'Button is 4 KB.\n');
    put(dir, 'llms.txt.tmpl', 'Has 15 blocks.\n');
    put(dir, '.artifacts/plat/release-notes.md', '## Added\n- 14 transforms\n');
    put(dir, 'docs/notes/other.md', 'Not scanned: 9 KB.\n');
    const files = lint(dir).map((x: { file: string }) => x.file).sort();
    expect(files).toEqual(['.artifacts/plat/release-notes.md', 'README.md', 'apps/docs/content/cmp/button.mdx', 'llms.txt.tmpl']);
    put(dir, 'body.md', 'Total 3 MB\n');
    expect(lintMain(['--file', 'body.md'], dir)).toBe(1);
    expect(lintMain(['--file', 'absent.md'], dir)).toBe(1);
  });
});
