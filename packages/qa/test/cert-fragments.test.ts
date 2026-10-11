/* G-12 / REQ-QUAL-12 (FIN-429): the cert config's fragment loader (certification/lanes/_fixtures/fragments.ts) validates
   PlaywrightProjectFragment shape, loads wave-keyed files (SURF) instead of dropping them, resolves testDir from the repo
   root, disambiguates duplicate cert names, and fails on a malformed cert project. */
import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CERT_RE, loadCertProjects, projectShapeErrors } from '../../../certification/lanes/_fixtures/fragments';

let root: string;
const write = (stream: string, value: unknown) => writeFileSync(join(root, 'fragments/playwright', `${stream}.json`), JSON.stringify(value));

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'ag-cert-fragments-'));
  mkdirSync(join(root, 'fragments/playwright'), { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

test('array files: only <stream>:cert-* projects are appended, testDir resolved from the repo root', () => {
  write('mat', [
    { name: 'mat:cert-motion-chromium', testDir: './tests/motion', testMatch: '**/*.spec.ts', use: { defaultBrowserType: 'chromium' } },
    { name: 'mat:material-chromium', testDir: 'tests/material' },
  ]);
  const { projects, issues } = loadCertProjects(root);
  expect(projects).toEqual([{ name: 'mat:cert-motion-chromium', testDir: join(root, 'tests/motion'), testMatch: '**/*.spec.ts', use: { defaultBrowserType: 'chromium' } }]);
  expect(issues).toEqual([]);
});

test('wave-keyed files (SURF) are flattened, not dropped; duplicate cert names keep both entries', () => {
  write('surf', {
    W1: [{ name: 'surf:app-shell', testDir: 'tests/e2e/surf/app-shell' }],
    W2: [{ name: 'surf:cert-media-sampling', testDir: 'tests/e2e/surf' }, { name: 'surf:cert-rtl', testDir: 'tests/a11y/apg/surf' }],
    W4: [{ name: 'surf:cert-media-sampling', testDir: 'tests/e2e/surf/media' }],
  });
  const { projects, issues } = loadCertProjects(root);
  expect(projects.map((p) => [p.name, p.testDir])).toEqual([
    ['surf:cert-media-sampling', join(root, 'tests/e2e/surf')],
    ['surf:cert-rtl', join(root, 'tests/a11y/apg/surf')],
    ['surf:cert-media-sampling@W4', join(root, 'tests/e2e/surf/media')],
  ]);
  expect(projects.every((p) => CERT_RE.test(p.name))).toBe(true);
  expect(issues).toEqual([expect.objectContaining({ stream: 'surf', code: 'duplicate-cert-project', project: 'surf:cert-media-sampling' })]);
});

test('malformed non-cert projects are reported against the owning stream', () => {
  write('cmp', [{ name: 'overlays-chromium', testMatch: 'tests/overlays/**/*.spec.ts', use: { browserName: 'chromium' } }]);
  const { projects, issues } = loadCertProjects(root);
  expect(projects).toEqual([]);
  expect(issues).toEqual([expect.objectContaining({ stream: 'cmp', project: 'overlays-chromium', code: 'fragment-shape' })]);
  expect(issues[0]!.message).toMatch(/must start with 'cmp:'/);
  expect(issues[0]!.message).toMatch(/testDir must be a non-empty string/);
});

test('a malformed cert project throws instead of silently not running', () => {
  write('cmp', [{ name: 'cmp:cert-overlays', testMatch: 'tests/overlays/**/*.spec.ts' }]);
  expect(() => loadCertProjects(root)).toThrow(/cert project 'cmp:cert-overlays' is malformed: testDir must be a non-empty string/);
  write('cmp', [{ name: 'cmp:cert-overlays', testDir: '../outside' }]);
  expect(() => loadCertProjects(root)).toThrow(/must be repo-relative/);
  write('cmp', [{ name: 'cmp:cert-overlays', testDir: 'tests/overlays', retries: 3 }]);
  expect(() => loadCertProjects(root)).toThrow(/unknown key 'retries'/);
});

test('a cert name from another stream is rejected', () => {
  expect(projectShapeErrors({ name: 'mat:cert-x', testDir: 't' }, 'surf')).toEqual([`name 'mat:cert-x' must start with 'surf:' (PlaywrightProjectFragment.name)`]);
});

test('unsupported file shapes and invalid JSON throw', () => {
  write('qual', 'nope');
  expect(() => loadCertProjects(root)).toThrow(/must be an array/);
  writeFileSync(join(root, 'fragments/playwright/qual.json'), '{');
  expect(() => loadCertProjects(root)).toThrow(/invalid JSON/);
});

test('the repository fragments load: SURF cert projects are present, every appended project is a cert project', () => {
  const repo = join(__dirname, '../../..');
  const { projects } = loadCertProjects(repo);
  expect(projects.length).toBeGreaterThan(0);
  expect(projects.every((p) => CERT_RE.test(p.name) && p.testDir.startsWith(repo))).toBe(true);
  expect(projects.some((p) => p.name.startsWith('surf:cert-'))).toBe(true);
});
