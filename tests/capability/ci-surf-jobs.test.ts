/** @jest-environment node */
// tests/capability/ci-surf-jobs.test.ts — REQ-SURF-195 job bodies in
// ci/surf.gitlab-ci.yml and the surf:test:doubles runner (ci/surf/doubles/run.mjs).

import { afterAll, describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const RUNNER = join(ROOT, 'ci/surf/doubles/run.mjs');
const fragment = readFileSync(join(ROOT, 'ci/surf.gitlab-ci.yml'), 'utf8');

// Body of one top-level job: from `<name>:` to the next top-level key.
function jobBody(name: string): string {
  const start = fragment.indexOf(`\n${name}:\n`);
  expect(start).toBeGreaterThanOrEqual(0);
  const rest = fragment.slice(start + name.length + 3);
  const end = rest.search(/\n[^\s#]/);
  return end < 0 ? rest : rest.slice(0, end);
}

const AREAS = ['app-shell', 'data', 'ai', 'media', 'capability'];
const tmpRoots: string[] = [];
afterAll(() => {
  for (const d of tmpRoots) rmSync(d, { recursive: true, force: true });
});

function dryRun(root: string, area: string) {
  return JSON.parse(execFileSync('node', [RUNNER, area, '--root', root, '--dry-run'], { encoding: 'utf8' }));
}

describe('surf:test:doubles runner', () => {
  it('runs the area preset while tests/<area>/jest.doubles.cjs exists', () => {
    const root = mkdtempSync(join(tmpdir(), 'surf-doubles-'));
    tmpRoots.push(root);
    for (const area of AREAS) {
      mkdirSync(join(root, 'tests', area), { recursive: true });
      writeFileSync(join(root, 'tests', area, 'jest.doubles.cjs'), 'module.exports = {};\n');
      const plan = dryRun(root, area);
      expect(plan.mode).toBe('preset');
      expect(plan.command).toEqual(['npx', 'jest', '-c', `tests/${area}/jest.doubles.cjs`, '--ci']);
    }
  });

  it('falls back to the root jest config on the area paths once the preset is retired', () => {
    const root = mkdtempSync(join(tmpdir(), 'surf-doubles-'));
    tmpRoots.push(root);
    const plan = dryRun(root, 'capability');
    expect(plan.mode).toBe('root');
    expect(plan.command).toEqual(['npm', 'test', '--', '--ci', 'tests/capability']);
    for (const area of AREAS) {
      const p = dryRun(root, area);
      expect(p.mode).toBe('root');
      expect(p.paths.length).toBeGreaterThan(0);
      expect(p.command).not.toContain('--passWithNoTests');
    }
  });

  it('exits 2 on an unknown area', () => {
    const r = spawnSync('node', [RUNNER, 'nope', '--dry-run'], { encoding: 'utf8' });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('unknown area: nope');
  });

  it('the job delegates to the runner and never echoes pending', () => {
    const body = jobBody('surf:test:doubles');
    expect(body).toContain('node ci/surf/doubles/run.mjs "$DOUBLES_AREA"');
    expect(body).not.toMatch(/pending/i);
    expect(body).not.toContain('jest.doubles.cjs');
  });
});

describe('surf:test:ai-sdk and surf:test:ledger', () => {
  it('ai-sdk runs the root tsc and root jest with no scratch install', () => {
    const body = jobBody('surf:test:ai-sdk');
    expect(body).not.toMatch(/npm install|ci\/surf\/ai-sdk/);
    expect(body).toContain('npx tsc -p tsconfig.json');
    expect(body).toMatch(/npm test -- --ci tests\/types\/surf registry\/items\/ai-sdk-adapter registry\/blocks\/ai-workspace/);
    expect(body).toContain('set -o pipefail');
  });

  it('the ai-sdk comment names the pinned major, not v6', () => {
    const comment = fragment.slice(fragment.indexOf('# SURF-637'), fragment.indexOf('\nsurf:test:ai-sdk:'));
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const aiMajor = String(pkg.devDependencies?.ai ?? pkg.dependencies?.ai).split('.')[0];
    expect(comment).toContain(`ai@${pkg.devDependencies?.ai ?? pkg.dependencies?.ai}`);
    expect(comment).toMatch(new RegExp(`AI SDK[\\s#]*v${aiMajor}\\b`));
    expect(comment).not.toMatch(/v6 devDeps/);
  });

  it('ledger tees both verifier runs into .artifacts/surf/ledger/ under pipefail', () => {
    const body = jobBody('surf:test:ledger');
    expect(body).toContain('set -o pipefail');
    expect(body).toMatch(/verify-capability-ledger\.mjs 2>&1 \| tee \.artifacts\/surf\/ledger\/verify\.log/);
    expect(body).toMatch(/--diff .* 2>&1 \| tee \.artifacts\/surf\/ledger\/diff\.log/);
  });
});
