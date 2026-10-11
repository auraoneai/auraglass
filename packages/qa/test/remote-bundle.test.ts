/* REQ-QUAL-67 (FIN-425): offline bundle for the gated AWS worker — scripts/qual/remote/build-bundle.mjs packs every
   input with sha256s, git SHA and image digest (missing inputs fail, naming them); scripts/qual/remote/worker-entry.sh
   refuses a bundle whose files do not match bundle.sha256 / bundle.manifest.json (exit 65) before running anything. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { bareImports, buildBundle, hashTree, moduleClosure, parseArgs } from '../../../scripts/qual/remote/build-bundle.mjs';
import { REPO } from './helpers/laneFixture.ts';

const made: string[] = [];
afterAll(() => { for (const d of made) rmSync(d, { recursive: true, force: true }); });
const SHA = '1234567890abcdef1234567890abcdef12345678';
const DIGEST = `sha256:${'b'.repeat(64)}`;

function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), 'ag-bundle-'));
  made.push(root);
  const w = (rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
  w('package.json', JSON.stringify({ name: 'aura-glass' }));
  w('certification/run.mjs', "import { build } from 'esbuild';\nimport x from 'left-pad';\n");
  w('certification/lanes/a.spec.ts', "import { test } from '@playwright/test';\nimport 'node:fs';\nimport './local';\n");
  w('packages/qa/src/evidence/laneRunner.ts', 'export const lane = 1;\n');
  w('scripts/qual/x.mjs', "const y = await import('pixelmatch');\n");
  w('src/contracts/testing.ts', 'export {};\n');
  const pkg = (name: string, deps: Record<string, string> = {}, extra: Record<string, unknown> = {}) => w(`node_modules/${name}/package.json`, JSON.stringify({ name, dependencies: deps, ...extra }));
  pkg('@playwright/test', { playwright: '1' });
  pkg('playwright', { 'playwright-core': '1' }, { optionalDependencies: { fsevents: '2' } });
  pkg('playwright-core');
  pkg('esbuild', {}, { optionalDependencies: { '@esbuild/linux-x64': '0' } });
  pkg('left-pad', { 'nested-dep': '1' });
  w('node_modules/left-pad/node_modules/nested-dep/package.json', JSON.stringify({ name: 'nested-dep' }));
  pkg('pixelmatch', { pngjs: '7' });
  pkg('pngjs');
  pkg('unused');
  w('storybook-static/index.json', '{"entries":{}}');
  w('pack/aura-glass-5.0.0.tgz', 'tarball-bytes');
  for (const b of ['chromium-1200', 'firefox-1500', 'webkit-2200', 'ffmpeg-1011']) w(`browsers/${b}/bin`, b);
  w('tools/tesseract', '#!/bin/sh\n');
  w('tessdata/eng.traineddata', 'eng');
  return root;
}

const opts = (root: string, extra: string[] = []) => parseArgs(['--out', join(root, 'out'), '--root', root, '--storybook', join(root, 'storybook-static'),
  '--tarball', join(root, 'pack/aura-glass-5.0.0.tgz'), '--browsers', join(root, 'browsers'), '--tesseract', join(root, 'tools/tesseract'),
  '--tessdata', join(root, 'tessdata'), '--image-digest', DIGEST, '--sha', SHA, ...extra], {});

describe('build-bundle.mjs', () => {
  it('collects bare imports and their dependency closure (nested packages copied with their parent)', () => {
    const root = fixture();
    expect(bareImports(join(root, 'certification'))).toEqual(['@playwright/test', 'esbuild', 'left-pad']);
    expect(moduleClosure(root, ['@playwright/test', 'esbuild', 'left-pad', 'pixelmatch'])).toEqual([
      'node_modules/@playwright/test', 'node_modules/esbuild', 'node_modules/left-pad', 'node_modules/pixelmatch', 'node_modules/playwright',
      'node_modules/playwright-core', 'node_modules/pngjs',
    ]);
    expect(() => moduleClosure(root, ['not-installed'])).toThrow(/node_modules missing: not-installed/);
  });

  it('packs every input with sha256s, the git SHA and the image digest', async () => {
    const root = fixture();
    const r = await buildBundle(opts(root));
    expect(r.problems).toEqual([]);
    const m = r.manifest!;
    expect(m).toMatchObject({ version: 1, gitSha: SHA, imageDigest: DIGEST, tarball: 'aura-glass-5.0.0.tgz', browsers: ['chromium-1200', 'ffmpeg-1011', 'firefox-1500', 'webkit-2200'] });
    const paths = m.files.map((f: { path: string }) => f.path);
    for (const p of ['storybook-static/index.json', 'package/aura-glass-5.0.0.tgz', 'repo/certification/run.mjs', 'repo/packages/qa/src/evidence/laneRunner.ts',
      'repo/node_modules/pixelmatch/package.json', 'repo/node_modules/left-pad/node_modules/nested-dep/package.json', 'browsers/webkit-2200/bin',
      'tools/tesseract', 'tessdata/eng.traineddata', 'qa-build/lane-runner.mjs']) expect(paths).toContain(p);
    expect(paths).not.toContain('repo/node_modules/unused/package.json');
    for (const f of m.files) expect(f.sha256).toBe(createHash('sha256').update(readFileSync(join(r.bundle!, f.path))).digest('hex'));
    expect(readFileSync(join(r.bundle!, 'bundle.sha256'), 'utf8').trim().split('\n')).toHaveLength(m.files.length);
    expect(r.archive).toBe(join(root, 'out', `auraglass-cert-bundle-${SHA.slice(0, 12)}.tar.gz`));
    expect(hashTree(r.bundle!, new Set(['bundle.manifest.json', 'bundle.sha256'])).files).toEqual(m.files);
  });

  it('fails naming every missing input', async () => {
    const root = fixture();
    rmSync(join(root, 'browsers/webkit-2200'), { recursive: true });
    rmSync(join(root, 'tessdata/eng.traineddata'));
    const r = await buildBundle({ ...opts(root), imageDigest: null });
    expect(r.ok).toBe(false);
    expect(r.problems).toEqual([
      expect.stringContaining('image digest'),
      expect.stringContaining('Playwright browser build ^webkit-'),
      expect.stringContaining('eng.traineddata'),
    ]);
  });
});

describe('worker-entry.sh bundle verification', () => {
  const entry = join(REPO, 'scripts/qual/remote/worker-entry.sh');
  const run = (bundle: string) => spawnSync('bash', [entry, bundle, 'L6', 'release', 's3://example/none'], { encoding: 'utf8', env: { PATH: process.env.PATH, HOME: process.env.HOME }, timeout: 60_000 });

  it('exits 64 on usage errors', () => {
    expect(spawnSync('bash', [entry, 'x', 'L99', 'pr'], { encoding: 'utf8' }).status).toBe(64);
    expect(spawnSync('bash', [entry, 'x', 'L6'], { encoding: 'utf8' }).status).toBe(64);
  });

  it('refuses a tampered file, an unlisted file and a bundle without manifest (exit 65)', async () => {
    const root = fixture();
    const r = await buildBundle(opts(root, ['--no-tar']));
    const bundle = r.bundle!;
    appendFileSync(join(bundle, 'tools/tesseract'), 'tampered\n');
    const tampered = run(bundle);
    expect(tampered.status).toBe(65);
    expect(tampered.stderr).toContain('bundle hash verification FAILED');

    const r2 = await buildBundle(opts(fixture(), ['--no-tar']));
    writeFileSync(join(r2.bundle!, 'repo/extra.mjs'), 'process.exit(0)\n');
    chmodSync(join(r2.bundle!, 'repo/extra.mjs'), 0o644);
    const unlisted = run(r2.bundle!);
    expect(unlisted.status).toBe(65);
    expect(unlisted.stderr).toContain('unlisted file: repo/extra.mjs');

    const r3 = await buildBundle(opts(fixture(), ['--no-tar']));
    rmSync(join(r3.bundle!, 'bundle.manifest.json'));
    expect(run(r3.bundle!).status).toBe(65);
  }, 60_000);
});
