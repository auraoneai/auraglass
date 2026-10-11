/**
 * @jest-environment node
 */
/* REQ-QUAL-48 agent part (REQ-FIN-105, FIN-447): the device-farm runner's
   offline self-check passes, the runner refuses to run off the AWS remote
   runner, and the generated Device Farm test specs are valid YAML whose shell
   commands carry the plan and the right device-host entry. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'yaml';

const ROOT = process.cwd();
const RUNNER = join(ROOT, 'scripts/qual/devices/device-farm-run.mjs');

/* A clean environment: no CI markers, no AWS credentials, no runner tags. */
function cleanEnv(extra = {}) {
  const env = { PATH: process.env.PATH, HOME: process.env.HOME };
  return { ...env, ...extra };
}
const run = (args, env) => spawnSync(process.execPath, [RUNNER, ...args], { cwd: ROOT, env, encoding: 'utf8', timeout: 60_000 });

describe('device-farm-run --self-check (REQ-QUAL-48)', () => {
  it('passes offline with every check reported', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-devices-'));
    try {
      const out = join(dir, 'self-check.json');
      /* An unroutable proxy makes any accidental network call fail loudly. */
      const r = run(['--self-check', '--out', out], cleanEnv({ HTTPS_PROXY: 'http://127.0.0.1:9', HTTP_PROXY: 'http://127.0.0.1:9' }));
      expect(r.stderr).toBe('');
      expect(r.status).toBe(0);
      const doc = JSON.parse(readFileSync(out, 'utf8'));
      expect(doc.ok).toBe(true);
      expect(doc.checks.length).toBeGreaterThanOrEqual(14);
      expect(doc.checks.filter((c) => !c.ok)).toEqual([]);
      const names = doc.checks.map((c) => c.name).join('\n');
      for (const topic of ['matrix', 'gate', 'probe', 'tags', 'credentials', 'bundle', 'orchestrator: full run', 'orchestrator: a failing target', 'cleanup failure']) {
        expect(names).toContain(topic);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('exits 2 (remote-only) off the runner and 78 when the OD-11 prerequisites are missing', () => {
    const local = run([], cleanEnv());
    expect(local.status).toBe(2);
    expect(local.stderr).toContain('remote-only');
    expect(local.stderr).toContain('qual:certify:devices');

    const wrongRunner = run([], cleanEnv({ CI: 'true', CI_RUNNER_TAGS: '["saas-linux-large-amd64"]' }));
    expect(wrongRunner.status).toBe(78);
    expect(wrongRunner.stderr).toContain('OD-11');

    const noConfig = run([], cleanEnv({ CI: 'true', CI_RUNNER_TAGS: '["auraglass-aws-remote"]' }));
    expect(noConfig.status).toBe(78);
    expect(noConfig.stderr).toContain('AG_DEVICE_FARM_PROJECT_ARN');
  });

  it('refuses static or profile credentials even on the runner', () => {
    const r = run([], cleanEnv({
      CI: 'true',
      CI_RUNNER_TAGS: 'auraglass-aws-remote',
      CI_COMMIT_SHA: '0123456789abcdef0123456789abcdef01234567',
      AG_STORYBOOK_URL: 'https://storybook.example.test/',
      AG_DEVICE_FARM_PROJECT_ARN: 'arn:aws:devicefarm:us-west-2:123456789012:project:x',
      AG_MAC_SUBNET_ID: 'subnet-0', AG_MAC_INSTANCE_PROFILE: 'p', AG_MAC_AZ: 'us-west-2a',
      AWS_PROFILE: 'someone',
      AG_AWS_BIN: '/nonexistent/aws',
    }));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('instance role only');
    expect(r.stderr).toContain('AWS_PROFILE');
  });
});

describe('Device Farm test spec', () => {
  it('is valid YAML for every phone target and inlines the plan', async () => {
    const { TARGETS } = await import('../../../scripts/qual/devices/lib/matrix.mjs');
    const { testSpecYaml } = await import('../../../scripts/qual/devices/lib/package.mjs');
    const { encodePlan, decodePlan } = await import('../../../scripts/qual/devices/lib/device-entry.mjs');
    const plan = encodePlan({ target: 't', attemptId: 'a', windowMs: 5000, cells: [{ subject: 'Dialog', storyId: 'cmp-dialog--default', interaction: 'open-close', url: 'https://sb.test/iframe.html?id=cmp-dialog--default' }] });
    for (const t of TARGETS.filter((x) => x.provider === 'device-farm')) {
      const spec = yaml.parse(testSpecYaml(t, plan));
      expect(spec.version).toBe(0.1);
      const test = spec.phases.test.commands;
      expect(test).toHaveLength(1);
      const m = /^AG_DEVICE_PLAN=([A-Za-z0-9+/=]+) node "\$DEVICEFARM_TEST_PACKAGE_PATH\/package\/device-host\.mjs" (ios|android)$/.exec(test[0]);
      expect(m).not.toBeNull();
      expect(m[2]).toBe(t.platform);
      expect(decodePlan(m[1]).cells[0].storyId).toBe('cmp-dialog--default');
      const appium = spec.phases.pre_test.commands.find((c) => c.startsWith('appium '));
      if (t.platform === 'ios') {
        /* After YAML decoding the capabilities are a shell double-quoted JSON object. */
        const capsShell = /--default-capabilities "(.*)" >>/.exec(appium)[1];
        const caps = JSON.parse(capsShell.replace(/\\"/g, '"'));
        expect(caps.browserName).toBe('Safari');
        expect(caps['appium:automationName']).toBe('XCUITest');
      } else {
        expect(appium).toBeUndefined();
      }
    }
  });
});
