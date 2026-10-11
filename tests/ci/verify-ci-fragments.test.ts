/* @jest-environment node */
// PLAT-009: one failing fixture per §4.13.4 rule + one passing fixture equal
// to the C0 seeds. Fixtures live under tests/ci/fixtures/ci-fragments/<case>/.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), 'scripts/ci/verify-ci-fragments.mjs');
const FIXTURES = 'tests/ci/fixtures/ci-fragments';

function run(root: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT, '--root', root], {
      encoding: 'utf8',
      env: { ...process.env, GITLAB_CI: undefined, CI: undefined },
    });
    return { code: 0, out };
  } catch (e: unknown) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

describe('verify-ci-fragments fixtures', () => {
  it('on the live tree, every failure names a ci/mat.gitlab-ci.yml job (until REQ-FIN-53 fixes the fragment)', () => {
    const r = run('.');
    if (r.code === 0) {
      expect(r.out).toContain('contract:ci-fragments OK');
    } else {
      const lines = r.out.split('\n').filter((l) => l.startsWith('ci/'));
      expect(lines.length).toBeGreaterThan(0);
      expect(lines.every((l) => l.startsWith('ci/mat.gitlab-ci.yml'))).toBe(true);
    }
  });

  // each fixture asserts its rule's specific message (REQ-FIN-21)
  const EXPECTED: Record<string, string> = {
    'rule1-reserved-key': 'reserved',
    'rule2-no-stage': 'stage',
    'rule3-empty-rules': 'rules',
    'rule4-foreign-needs': 'foreign',
    'rule5-evidence-when': 'when: always',
    'rule6-missing-required': 'not defined',
    'rule7-foreign-certify': 'outside ci/qual.gitlab-ci.yml',
    'rule8-credential': 'credential',
    'rule9-browser-template': 'playwright',
    'gha-token': 'GitHub Actions',
    'gha-workflow-present': 'must not exist',
    'activation-pending': 'allow_failure',
    'taskgraph-missing': 'verify-task-graph.mjs absent',
    'evidence-outside': '.artifacts/',
    'flipped-required-true': 'main scope',
    'foreign-job-name': 'must be named',
    'merge-request-event': 'merge_request_event',
    'missing-rules': 'rules',
    'needs-no-optional': 'optional: true',
    'top-level-variables': 'reserved',
    // contract C-item: package precedes certify (qual:certify:* need plat:package:pack)
    'stage-order-legacy': 'root stages must equal contract,build,test,package,certify,deploy,publish',
  };
  const cases = existsSync(FIXTURES) ? readdirSync(FIXTURES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !['passing', 'taskgraph-missing'].includes(d.name)).map((d) => d.name) : [];
  it.each(cases)('rejects fixture %s', (name) => {
    const r = run(join(FIXTURES, name));
    expect(r.code).toBe(1);
    expect(r.out).toContain('contract:ci-fragments FAIL');
    if (EXPECTED[name]) expect(r.out).toContain(EXPECTED[name]);
  });
  it('passes the passing/ fixture', () => {
    const r = run(join(FIXTURES, 'passing'));
    expect(r.code).toBe(0);
    expect(r.out).toContain('contract:ci-fragments OK');
  });
  it('taskgraph fixture fails only when a tasks file changed (--files hook)', () => {
    // --files points the hook at the fixture's changed file
    const r = (() => {
      try {
        const out = execFileSync('node', [SCRIPT, '--root', join(FIXTURES, 'taskgraph-missing'), '--files', 'docs/auraglass-5/tasks/FIN.json'], { encoding: 'utf8' });
        return { code: 0, out };
      } catch (e: any) {
        return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
      }
    })();
    expect(r.code).toBe(1);
    expect(r.out).toContain('verify-task-graph.mjs absent');
  });
});
