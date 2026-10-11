/* Real-run orchestration for `qual:certify:devices` (REQ-QUAL-48).
   AWS Device Farm (us-west-2) for the four phones, an EC2 mac1.metal Safari
   host for the Intel-Mac proxy. Every created resource is tagged
   attempt-id/sha/lane/ttl, recorded in the ledger, and torn down on exit,
   including on failure and on SIGTERM. All AWS access goes through `aws.call`
   (instance role only, never --profile). */
import { DEVICE_FARM_REGION, PROBE_WINDOW_MS } from './matrix.mjs';
import { buildTags, deviceFarmTags, ec2TagSpecifications } from './aws.mjs';
import { encodePlan, parseResultLine } from './device-entry.mjs';
import { deviceFarmPackage, deviceTarball, macCommands, testSpecYaml } from './package.mjs';
import { evaluateCell, summarizeFrames, summarizeLoaf, verdict } from './gate.mjs';
import { storyUrl } from './resolve.mjs';

const realSleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ledger of created resources; cleanup runs once, newest first, and records every outcome. */
export function createLedger(aws) {
  const resources = [];
  let cleaned = null;
  async function teardown(r) {
    switch (r.type) {
      case 'devicefarm-run':
        if (!r.completed) await aws.call('devicefarm', 'stop-run', ['--arn', r.id], { region: DEVICE_FARM_REGION });
        return r.completed ? 'completed' : 'stopped';
      case 'devicefarm-upload':
        await aws.call('devicefarm', 'delete-upload', ['--arn', r.id], { region: DEVICE_FARM_REGION });
        return 'deleted';
      case 'ec2-instance':
        await aws.call('ec2', 'terminate-instances', ['--instance-ids', r.id], { region: r.region });
        await aws.call('ec2', 'wait', ['instance-terminated', '--instance-ids', r.id], { region: r.region });
        return 'terminated';
      case 'ec2-dedicated-host': {
        const res = await aws.call('ec2', 'release-hosts', ['--host-ids', r.id], { region: r.region });
        /* mac hosts have a 24 h minimum allocation; an early release is refused and left to the ttl sweeper. */
        return (res.Unsuccessful ?? []).length ? 'deferred-ttl' : 'released';
      }
      default:
        throw new Error(`ledger: unknown resource type ${r.type}`);
    }
  }
  return {
    resources,
    add(r) {
      resources.push({ ...r, cleanup: 'pending' });
      return resources[resources.length - 1];
    },
    cleanup() {
      cleaned ??= (async () => {
        for (const r of [...resources].reverse()) {
          try {
            r.cleanup = await teardown(r);
          } catch (e) {
            r.cleanup = `failed: ${e.message}`;
          }
        }
        return resources.every((r) => !String(r.cleanup).startsWith('failed'));
      })();
      return cleaned;
    },
  };
}

async function poll(fn, { timeoutMs, intervalMs, sleep, label }) {
  const until = Date.now() + timeoutMs;
  for (let i = 0; ; i++) {
    const v = await fn();
    if (v !== undefined) return v;
    if (Date.now() > until) throw new Error(`${label}: timed out after ${Math.round(timeoutMs / 1000)} s`);
    await sleep(intervalMs);
  }
}

/** Required configuration; a missing value is an owner/infra prerequisite (OD-11), never defaulted. */
export function readConfig(env) {
  const need = (k) => {
    if (!env[k]) missing.push(k);
    return env[k];
  };
  const missing = [];
  const cfg = {
    sha: need('CI_COMMIT_SHA'),
    storybookUrl: need('AG_STORYBOOK_URL'),
    projectArn: need('AG_DEVICE_FARM_PROJECT_ARN'),
    mac: {
      region: env.AG_MAC_REGION || DEVICE_FARM_REGION,
      subnetId: need('AG_MAC_SUBNET_ID'),
      instanceProfile: need('AG_MAC_INSTANCE_PROFILE'),
      hostId: env.AG_MAC_HOST_ID || null,
      availabilityZone: env.AG_MAC_HOST_ID ? null : need('AG_MAC_AZ'),
      amiId: env.AG_MAC_AMI_ID || null,
      amiParam: env.AG_MAC_AMI_PARAM || '/aws/service/ec2-macos/sonoma/x86_64_mac/latest/image_id',
      securityGroupIds: env.AG_MAC_SECURITY_GROUP_IDS ? env.AG_MAC_SECURITY_GROUP_IDS.split(',') : [],
    },
    ttlMinutes: Number(env.AG_DEVICE_TTL_MINUTES || 180),
    windowMs: PROBE_WINDOW_MS,
  };
  return { cfg, missing };
}

async function uploadTo(aws, ledger, { fetchImpl, sleep }, projectArn, name, type, body, contentType) {
  const { upload } = await aws.call('devicefarm', 'create-upload', ['--project-arn', projectArn, '--name', name, '--type', type, '--content-type', contentType], { region: DEVICE_FARM_REGION });
  ledger.add({ type: 'devicefarm-upload', id: upload.arn });
  const put = await fetchImpl(upload.url, { method: 'PUT', headers: { 'content-type': contentType }, body });
  if (!put.ok) throw new Error(`upload ${name}: PUT ${put.status}`);
  await poll(
    async () => {
      const { upload: u } = await aws.call('devicefarm', 'get-upload', ['--arn', upload.arn], { region: DEVICE_FARM_REGION });
      if (u.status === 'FAILED') throw new Error(`upload ${name}: ${u.metadata ?? u.message ?? 'FAILED'}`);
      return u.status === 'SUCCEEDED' ? u : undefined;
    },
    { timeoutMs: 10 * 60_000, intervalMs: 5000, sleep, label: `upload ${name}` },
  );
  return upload.arn;
}

async function runDeviceFarmTarget(ctx, target, plan) {
  const { aws, ledger, cfg, tags, fetchImpl, sleep } = ctx;
  const planB64 = encodePlan(plan);
  const pkgArn = await uploadTo(aws, ledger, ctx, cfg.projectArn, 'ag-device-probe.zip', 'APPIUM_WEB_NODE_TEST_PACKAGE', ctx.packageZip, 'application/octet-stream');
  const specArn = await uploadTo(aws, ledger, ctx, cfg.projectArn, `ag-${target.id}.yml`, 'APPIUM_WEB_NODE_TEST_SPEC', testSpecYaml(target, planB64), 'application/x-yaml');
  const { run } = await aws.call(
    'devicefarm',
    'schedule-run',
    [
      '--project-arn', cfg.projectArn,
      '--name', `ag-devices-${target.id}-${tags['attempt-id']}`,
      '--device-selection-configuration', JSON.stringify({ filters: target.filters, maxDevices: 1 }),
      '--test', JSON.stringify({ type: 'APPIUM_WEB_NODE', testPackageArn: pkgArn, testSpecArn: specArn }),
      '--execution-configuration', JSON.stringify({ jobTimeoutMinutes: 30 }),
    ],
    { region: DEVICE_FARM_REGION },
  );
  const rec = ledger.add({ type: 'devicefarm-run', id: run.arn, target: target.id });
  await aws.call('devicefarm', 'tag-resource', ['--resource-arn', run.arn, '--tags', deviceFarmTags(tags)], { region: DEVICE_FARM_REGION });
  const done = await poll(
    async () => {
      const { run: r } = await aws.call('devicefarm', 'get-run', ['--arn', run.arn], { region: DEVICE_FARM_REGION });
      return r.status === 'COMPLETED' ? r : undefined;
    },
    { timeoutMs: 60 * 60_000, intervalMs: 15_000, sleep, label: `device farm run ${target.id}` },
  );
  rec.completed = true;
  if (done.counters && done.counters.total === 0) throw new Error(`device farm run ${target.id}: no device matched the selection filters`);
  const { artifacts = [] } = await aws.call('devicefarm', 'list-artifacts', ['--arn', run.arn, '--type', 'FILE'], { region: DEVICE_FARM_REGION });
  const out = artifacts.filter((a) => a.type === 'TESTSPEC_OUTPUT');
  if (!out.length) throw new Error(`device farm run ${target.id}: no TESTSPEC_OUTPUT artifact (result ${done.result})`);
  let text = '';
  for (const a of out) text += `${await (await fetchImpl(a.url)).text()}\n`;
  return parseResultLine(text);
}

async function runMacTarget(ctx, target, plan) {
  const { aws, ledger, cfg, tags, sleep } = ctx;
  const m = cfg.mac;
  const region = m.region;
  let hostId = m.hostId;
  if (!hostId) {
    /* Hosts are tagged with a 24 h ttl: AWS refuses to release a mac host earlier. */
    const hostTags = { ...tags, ttl: buildTags({ attemptId: tags['attempt-id'], sha: tags.sha, ttlMinutes: 24 * 60 }).ttl };
    const res = await aws.call('ec2', 'allocate-hosts', ['--instance-type', target.instanceType, '--availability-zone', m.availabilityZone, '--quantity', '1', '--tag-specifications', ec2TagSpecifications(hostTags, ['dedicated-host'])], { region });
    hostId = res.HostIds[0];
    ledger.add({ type: 'ec2-dedicated-host', id: hostId, region });
  }
  const ami = m.amiId ?? (await aws.call('ssm', 'get-parameter', ['--name', m.amiParam], { region })).Parameter.Value;
  const res = await aws.call(
    'ec2',
    'run-instances',
    [
      '--instance-type', target.instanceType,
      '--image-id', ami,
      '--placement', JSON.stringify({ Tenancy: 'host', HostId: hostId }),
      '--subnet-id', m.subnetId,
      ...(m.securityGroupIds.length ? ['--security-group-ids', ...m.securityGroupIds] : []),
      '--iam-instance-profile', JSON.stringify({ Name: m.instanceProfile }),
      '--metadata-options', JSON.stringify({ HttpTokens: 'required' }),
      '--instance-initiated-shutdown-behavior', 'terminate',
      '--tag-specifications', ec2TagSpecifications(tags, ['instance', 'volume']),
      '--count', '1',
    ],
    { region },
  );
  const instanceId = res.Instances[0].InstanceId;
  ledger.add({ type: 'ec2-instance', id: instanceId, region });
  await aws.call('ec2', 'wait', ['instance-running', '--instance-ids', instanceId], { region });
  await poll(
    async () => {
      const r = await aws.call('ssm', 'describe-instance-information', ['--filters', JSON.stringify([{ Key: 'InstanceIds', Values: [instanceId] }])], { region });
      return (r.InstanceInformationList ?? []).some((i) => i.PingStatus === 'Online') ? true : undefined;
    },
    { timeoutMs: 60 * 60_000, intervalMs: 30_000, sleep, label: `ssm agent on ${instanceId}` },
  );
  const sent = await aws.call(
    'ssm',
    'send-command',
    ['--instance-ids', instanceId, '--document-name', 'AWS-RunShellScript', '--timeout-seconds', '600', '--parameters', JSON.stringify({ commands: macCommands(encodePlan(plan), ctx.tarball), executionTimeout: ['3600'] })],
    { region },
  );
  const commandId = sent.Command.CommandId;
  const inv = await poll(
    async () => {
      const r = await aws.call('ssm', 'get-command-invocation', ['--command-id', commandId, '--instance-id', instanceId], { region }).catch((e) => {
        if (/InvocationDoesNotExist/.test(e.message)) return { Status: 'Pending' };
        throw e;
      });
      return ['Success', 'Failed', 'TimedOut', 'Cancelled'].includes(r.Status) ? r : undefined;
    },
    { timeoutMs: 70 * 60_000, intervalMs: 15_000, sleep, label: `ssm command on ${instanceId}` },
  );
  return parseResultLine(inv.StandardOutputContent);
}

/** Turn one target's raw device result into evaluated cells. */
export function evaluateTarget(target, resolved, deviceResult, targetError) {
  return resolved.map((s) => {
    const base = { target: target.id, tier: target.tier, subject: s.subject, storyId: s.storyId, interaction: s.interaction };
    const raw = deviceResult?.cells?.find((c) => c.subject === s.subject);
    let measured;
    if (s.error) measured = { frames: 0, error: s.error };
    else if (targetError) measured = { frames: 0, error: `target:${targetError}` };
    else if (!raw) measured = { frames: 0, error: 'no-device-result' };
    else {
      measured = { ...summarizeFrames(raw.raw?.timestamps), loaf: summarizeLoaf(raw.raw?.loaf ?? null), driven: raw.raw?.driven ?? 0 };
      measured.error = raw.error || raw.raw?.error || null;
      if (!measured.error && !measured.driven) measured.error = 'interaction-not-driven';
      if (!measured.error && target.platform === 'android' && measured.loaf == null) measured.error = 'loaf-unavailable';
      measured.host = { userAgent: raw.raw?.userAgent ?? null, devicePixelRatio: raw.raw?.devicePixelRatio ?? null, viewport: raw.raw?.viewport ?? null, certReady: raw.raw?.certReady ?? null };
    }
    const g = evaluateCell(target, measured);
    return { ...base, ...measured, budgetMs: g.budgetMs, status: g.status, reason: g.reason };
  });
}

/**
 * Run every target, always tearing down. Returns the results document.
 * ctx: { aws, cfg, targets, resolved, attemptId, fetchImpl, sleep, ledger? }
 */
export async function runAll(ctx) {
  const sleep = ctx.sleep ?? realSleep;
  const tags = buildTags({ attemptId: ctx.attemptId, sha: ctx.cfg.sha, ttlMinutes: ctx.cfg.ttlMinutes });
  const ledger = ctx.ledger ?? createLedger(ctx.aws);
  const tarball = deviceTarball(ctx.readDeviceFile);
  const full = { ...ctx, sleep, tags, ledger, tarball, packageZip: deviceFarmPackage(tarball) };
  const cells = [];
  const targetErrors = [];
  try {
    const playable = ctx.resolved.filter((s) => !s.error);
    const plan = (target) => ({
      target: target.id,
      attemptId: tags['attempt-id'],
      windowMs: ctx.cfg.windowMs,
      cells: playable.map((s) => ({ subject: s.subject, storyId: s.storyId, interaction: s.interaction, url: storyUrl(ctx.cfg.storybookUrl, s.storyId) })),
    });
    const jobs = ctx.targets.map(async (target) => {
      let result = null;
      let err = null;
      if (!playable.length) err = 'no-resolvable-subjects';
      else {
        try {
          result = target.provider === 'ec2-mac' ? await runMacTarget(full, target, plan(target)) : await runDeviceFarmTarget(full, target, plan(target));
        } catch (e) {
          err = e.message;
          targetErrors.push({ target: target.id, error: e.message });
        }
      }
      cells.push(...evaluateTarget(target, ctx.resolved, result, err));
    });
    await Promise.all(jobs);
  } finally {
    full.cleanupOk = await ledger.cleanup();
  }
  const v = verdict(cells, { targets: ctx.targets, subjects: ctx.resolved });
  if (!full.cleanupOk) v.failures.push({ target: '*', subject: '*', reason: 'cleanup-failed' });
  if (v.failures.length) v.status = 'fail';
  return {
    version: 1,
    lane: tags.lane,
    sha: tags.sha,
    attemptId: tags['attempt-id'],
    generatedAt: new Date().toISOString(),
    storybookUrl: ctx.cfg.storybookUrl,
    runnerTags: ctx.runnerTags ?? null,
    tags,
    cells: cells.sort((a, b) => `${a.target}|${a.subject}`.localeCompare(`${b.target}|${b.subject}`)),
    targetErrors,
    resources: ledger.resources.map(({ type, id, region, cleanup }) => ({ type, id, region: region ?? DEVICE_FARM_REGION, cleanup })),
    verdict: v,
  };
}
