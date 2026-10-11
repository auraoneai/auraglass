/* Offline self-check for `device-farm-run.mjs --self-check` (REQ-QUAL-48 agent
   part). No network, no AWS, no browser: every check exercises the real code
   paths against in-memory fakes (an AWS CLI double that models Device Farm,
   EC2 and SSM state; a DOM/rAF double the serialised probe runs inside). */
import { createContext, runInContext } from 'node:vm';
import { gunzipSync } from 'node:zlib';
import { BUDGETS, S1_SHOWCASES, SUBJECTS, TARGETS } from './matrix.mjs';
import { evaluateCell, percentile, summarizeFrames, summarizeLoaf, verdict } from './gate.mjs';
import { assertInstanceRoleIdentity, buildTags, createAws, ec2TagSpecifications, FORBIDDEN_CREDENTIAL_ENV, TAG_KEYS } from './aws.mjs';
import { cdpExpression, webdriverAsyncScript } from './probe.mjs';
import { decodePlan, encodePlan, encodeResult, parseResultLine } from './device-entry.mjs';
import { DEVICE_FILES, deviceFarmPackage, deviceTarball, MAC_NODE, macCommands, testSpecYaml } from './package.mjs';
import { unzipStore } from './zip.mjs';
import { resolveStories, storyUrl } from './resolve.mjs';
import { createLedger, runAll } from './orchestrate.mjs';
import { cdpSession, webdriver } from './drivers.mjs';

const SHA = '0123456789abcdef0123456789abcdef01234567';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
const eq = (a, b, msg) => assert(JSON.stringify(a) === JSON.stringify(b), `${msg}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
async function throws(fn, re, msg) {
  try {
    await fn();
  } catch (e) {
    assert(re.test(e.message), `${msg}: wrong error "${e.message}"`);
    return;
  }
  throw new Error(`${msg}: did not throw`);
}

/** Synthetic rAF timestamps: `n` frames at `periodMs`, with `janks` frames of `jankMs` spread evenly. */
export function syntheticTimestamps({ n = 300, periodMs = 1000 / 60, janks = 0, jankMs = 50 } = {}) {
  const ts = [0];
  const every = janks ? Math.floor(n / janks) : Infinity;
  for (let i = 1; i <= n; i++) ts.push(ts[i - 1] + (i % every === 0 ? jankMs : periodMs));
  return ts;
}

/* ---------- DOM + rAF double for the serialised probe ---------- */
function fakePage({ scrollable = true, trigger = true, loaf = true, frameMs = 1000 / 60, jankEvery = 0, jankMs = 0 } = {}) {
  let now = 0;
  let frameNo = 0;
  const timers = [];
  const rafs = [];
  let dialogOpen = false;
  const events = [];
  const scroller = { scrollHeight: 4000, clientHeight: scrollable ? 800 : 4000, scrollTop: 0 };
  const triggerEl = { click: () => { dialogOpen = true; events.push('open'); } };
  const body = { dispatchEvent: (e) => { if (e.type === 'keydown' && e.key === 'Escape' && dialogOpen) { dialogOpen = false; events.push('close'); } } };
  let observer = null;
  const document = {
    scrollingElement: scroller,
    body,
    activeElement: body,
    fonts: { ready: Promise.resolve() },
    querySelector: (sel) => (sel.includes('aria-haspopup') && trigger ? triggerEl : sel.includes('data-ag-cert-ready') ? {} : null),
    querySelectorAll: (sel) => (sel === '*' ? [scroller] : dialogOpen ? [{}] : []),
  };
  class PerformanceObserver {
    constructor(cb) { this.cb = cb; observer = this; }
    observe() {}
    disconnect() { observer = null; }
  }
  PerformanceObserver.supportedEntryTypes = loaf ? ['long-animation-frame', 'longtask'] : ['longtask'];
  class KeyboardEvent { constructor(type, init) { this.type = type; Object.assign(this, init); } }
  const window = {
    document,
    navigator: { userAgent: 'self-check' },
    devicePixelRatio: 3,
    innerWidth: 390,
    innerHeight: 844,
    PerformanceObserver,
    getComputedStyle: () => ({ overflowY: 'auto' }),
    requestAnimationFrame: (cb) => rafs.push(cb),
  };
  const sandbox = {
    window,
    document,
    KeyboardEvent,
    Promise,
    JSON,
    Math,
    setTimeout: (fn, ms) => timers.push({ at: now + ms, fn }),
  };
  window.window = window;
  const ctx = createContext(sandbox);
  /* Drive the virtual clock: run due timers, then one rAF batch per frame. */
  async function pump(promise) {
    let settled = false;
    let value;
    promise.then((v) => { settled = true; value = v; });
    for (let guard = 0; guard < 100_000 && !settled; guard++) {
      await null;
      await null;
      const due = timers.filter((t) => t.at <= now);
      for (const t of due) { timers.splice(timers.indexOf(t), 1); t.fn(); }
      if (due.length) continue;
      if (rafs.length) {
        frameNo++;
        const dt = jankEvery && frameNo % jankEvery === 0 ? jankMs : frameMs;
        now += dt;
        if (observer && dt > 50) observer.cb({ getEntries: () => [{ startTime: now - dt, duration: dt, blockingDuration: dt - 50 }] });
        const batch = rafs.splice(0);
        for (const cb of batch) cb(now);
      } else if (timers.length) {
        now = Math.min(...timers.map((t) => t.at));
      }
    }
    assert(settled, 'probe did not settle under the virtual clock');
    return value;
  }
  return { ctx, pump, scroller, events };
}

/* ---------- AWS CLI double ---------- */
export function fakeAws({ failGetRunFor = null, failTerminate = false, releaseRefused = true } = {}) {
  const state = { uploads: new Map(), runs: new Map(), tagsByArn: new Map(), instances: new Map(), hosts: new Map(), commands: new Map(), puts: new Map(), artifacts: new Map() };
  let seq = 0;
  const id = (p) => `${p}${(++seq).toString(16).padStart(8, '0')}`;
  const arg = (argv, k) => argv[argv.indexOf(k) + 1];
  const deviceOutput = (plan, label) => {
    const n = 300;
    /* The mid-tier fixture renders at 50 fps (20 ms), inside its 25 ms budget. */
    const periodMs = label === 'moto-g-power-chrome' ? 20 : 1000 / 60;
    return encodeResult({
      version: 1,
      target: plan.target,
      attemptId: plan.attemptId,
      cells: plan.cells.map((c) => ({
        ...c,
        raw: { timestamps: syntheticTimestamps({ n, periodMs }), loaf: /chrome/.test(label) ? [] : null, driven: 300, error: null, interaction: c.interaction },
      })),
    });
  };
  const fetchImpl = async (url, init = {}) => {
    if (init.method === 'PUT') {
      state.puts.set(url, typeof init.body === 'string' ? init.body : Buffer.from(init.body));
      return { ok: true, status: 200 };
    }
    if (state.artifacts.has(url)) return { ok: true, status: 200, text: async () => `log line\n${state.artifacts.get(url)}\nmore log` };
    throw new Error(`fake fetch: unexpected ${url}`);
  };
  const exec = async (argv) => {
    const op = `${argv[0]} ${argv[1]}`;
    const J = (o) => JSON.stringify(o);
    switch (op) {
      case 'sts get-caller-identity':
        return J({ Arn: 'arn:aws:sts::123456789012:assumed-role/auraglass-aws-remote/i-0abc12345def67890' });
      case 'devicefarm create-upload': {
        const arn = id('arn:aws:devicefarm:us-west-2:123456789012:upload:');
        state.uploads.set(arn, { name: arg(argv, '--name'), type: arg(argv, '--type'), url: `https://fake-upload/${arn}` });
        return J({ upload: { arn, url: `https://fake-upload/${arn}` } });
      }
      case 'devicefarm get-upload':
        return J({ upload: { arn: arg(argv, '--arn'), status: 'SUCCEEDED' } });
      case 'devicefarm schedule-run': {
        const arn = id('arn:aws:devicefarm:us-west-2:123456789012:run:');
        const test = JSON.parse(arg(argv, '--test'));
        const spec = state.puts.get(state.uploads.get(test.testSpecArn).url).toString();
        const b64 = /AG_DEVICE_PLAN=([A-Za-z0-9+/=]+)/.exec(spec)[1];
        const plan = decodePlan(b64);
        state.runs.set(arn, { plan, status: 'RUNNING', name: arg(argv, '--name'), selection: JSON.parse(arg(argv, '--device-selection-configuration')), test });
        return J({ run: { arn, status: 'SCHEDULING' } });
      }
      case 'devicefarm tag-resource':
        state.tagsByArn.set(arg(argv, '--resource-arn'), JSON.parse(arg(argv, '--tags')));
        return J({});
      case 'devicefarm get-run': {
        const r = state.runs.get(arg(argv, '--arn'));
        if (failGetRunFor && r.plan.target === failGetRunFor) throw new Error('aws devicefarm get-run exited 254: ServiceUnavailable');
        r.status = 'COMPLETED';
        return J({ run: { arn: arg(argv, '--arn'), status: 'COMPLETED', result: 'PASSED', counters: { total: 1 } } });
      }
      case 'devicefarm list-artifacts': {
        const r = state.runs.get(arg(argv, '--arn'));
        const url = `https://fake-artifact/${arg(argv, '--arn')}`;
        state.artifacts.set(url, deviceOutput(r.plan, r.plan.target));
        return J({ artifacts: [{ type: 'TESTSPEC_OUTPUT', url }, { type: 'DEVICE_LOG', url: 'https://unused' }] });
      }
      case 'devicefarm stop-run':
        state.runs.get(arg(argv, '--arn')).status = 'STOPPING';
        return J({});
      case 'devicefarm delete-upload':
        state.uploads.delete(arg(argv, '--arn'));
        return J({});
      case 'ec2 allocate-hosts': {
        const h = id('h-');
        state.hosts.set(h, { tags: JSON.parse(arg(argv, '--tag-specifications')), state: 'available' });
        return J({ HostIds: [h] });
      }
      case 'ssm get-parameter':
        return J({ Parameter: { Value: 'ami-0123456789abcdef0' } });
      case 'ec2 run-instances': {
        const i = id('i-0');
        state.instances.set(i, { tags: JSON.parse(arg(argv, '--tag-specifications')), state: 'running', placement: JSON.parse(arg(argv, '--placement')) });
        return J({ Instances: [{ InstanceId: i }] });
      }
      case 'ec2 wait':
        return '';
      case 'ssm describe-instance-information':
        return J({ InstanceInformationList: [{ PingStatus: 'Online' }] });
      case 'ssm send-command': {
        const c = id('cmd-');
        const params = JSON.parse(arg(argv, '--parameters'));
        const b64 = /AG_DEVICE_PLAN=([A-Za-z0-9+/=]+)/.exec(params.commands.join('\n'))[1];
        state.commands.set(c, { plan: decodePlan(b64), params });
        return J({ Command: { CommandId: c } });
      }
      case 'ssm get-command-invocation': {
        const c = state.commands.get(arg(argv, '--command-id'));
        return J({ Status: 'Success', StandardOutputContent: `boot\n${deviceOutput(c.plan, c.plan.target)}\n` });
      }
      case 'ec2 terminate-instances':
        if (failTerminate) throw new Error('aws ec2 terminate-instances exited 254: UnauthorizedOperation');
        state.instances.get(arg(argv, '--instance-ids')).state = 'terminated';
        return J({});
      case 'ec2 release-hosts':
        if (releaseRefused) return J({ Successful: [], Unsuccessful: [{ ResourceId: arg(argv, '--host-ids'), Error: { Code: 'Client.InvalidHost.Occupied' } }] });
        state.hosts.get(arg(argv, '--host-ids')).state = 'released';
        return J({ Successful: [arg(argv, '--host-ids')], Unsuccessful: [] });
      default:
        throw new Error(`fake aws: unexpected ${op}`);
    }
  };
  return { exec, fetchImpl, state };
}

export function fixtureIndex() {
  return {
    version: 1,
    stories: [
      ...S1_SHOWCASES.map((s) => ({ id: `showcases-${s}--fullscreen`, subject: s, kind: 'showcase', tags: ['showcase'], owner: 'QUAL' })),
      ...S1_SHOWCASES.map((s) => ({ id: `showcases-${s}--fragment`, subject: s, kind: 'showcase', tags: ['showcase'], owner: 'QUAL' })),
      { id: 'cmp-dialog--playground', subject: 'Dialog', kind: 'component', tags: [], owner: 'CMP' },
      { id: 'cmp-dialog--default', subject: 'Dialog', kind: 'component', tags: ['flagship'], owner: 'CMP' },
      { id: 'surf-appshell--default', subject: 'AppShell', kind: 'component', tags: ['flagship'], owner: 'SURF' },
    ],
  };
}

const baseCfg = (mac = {}) => ({
  sha: SHA,
  storybookUrl: 'https://storybook.example.test/sb/',
  projectArn: 'arn:aws:devicefarm:us-west-2:123456789012:project:fixture',
  mac: { region: 'us-west-2', subnetId: 'subnet-0fixture', instanceProfile: 'ag-mac-ssm', hostId: null, availabilityZone: 'us-west-2a', amiId: null, amiParam: '/aws/service/ec2-macos/sonoma/x86_64_mac/latest/image_id', securityGroupIds: [], ...mac },
  ttlMinutes: 120,
  windowMs: 5000,
});

const CHECKS = [
  ['matrix: 5 targets, 8 subjects, PRD budgets', () => {
    eq(TARGETS.map((t) => t.id), ['iphone13-ios18-safari', 'iphone13-ios26-safari', 'pixel7-chrome', 'moto-g-power-chrome', 'mac1-metal-safari'], 'targets');
    eq(TARGETS.filter((t) => t.tier === 'mid').map((t) => t.platform), ['android'], 'only mid-tier Android has the 25 ms budget');
    eq(SUBJECTS.map((s) => s.subject), [...S1_SHOWCASES, 'Dialog', 'AppShell'], 'subjects');
    eq(SUBJECTS.find((s) => s.subject === 'Dialog').interaction, 'open-close', 'Dialog interaction');
    eq(SUBJECTS.find((s) => s.subject === 'AppShell').interaction, 'scroll', 'AppShell interaction');
    eq([BUDGETS.flagshipMs, BUDGETS.midMs, BUDGETS.midExceptionMaxMs, BUDGETS.maxSignedExceptions], [16.7, 25, 33, 1], 'budgets');
  }],
  ['stats: p95 from rAF intervals', () => {
    eq(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 95), 10, 'nearest rank');
    const clean = summarizeFrames(syntheticTimestamps({ n: 300 }));
    eq([clean.frames, clean.p95, clean.dropped], [300, 16.67, 0], 'clean 60 Hz');
    const few = summarizeFrames(syntheticTimestamps({ n: 300, janks: 10, jankMs: 50 }));
    eq([few.p95, few.dropped, few.maxMs], [16.67, 20, 50], '3% jank stays out of p95, counted as dropped');
    const many = summarizeFrames(syntheticTimestamps({ n: 300, janks: 30, jankMs: 40 }));
    eq(many.p95, 40, '10% jank sets p95');
    eq(summarizeFrames([5]).frames, 0, 'single timestamp has no frames');
    eq(summarizeFrames([]).p95, null, 'empty');
    eq(summarizeLoaf([{ duration: 120, blockingDuration: 70 }, { duration: 60, blockingDuration: 10 }]), { count: 2, over100ms: 1, maxMs: 120, blockingMs: 80 }, 'loaf');
    eq(summarizeLoaf(null), null, 'no loaf support');
  }],
  ['gate: budget boundaries, zero frames, exceptions', () => {
    const flag = TARGETS[2];
    const mid = TARGETS[3];
    const st = (t, p95, frames = 300) => evaluateCell(t, { frames, p95 }).status;
    eq([st(flag, 16.7), st(flag, 16.71), st(flag, 10, 0)], ['pass', 'fail', 'fail'], 'flagship');
    eq([st(mid, 25), st(mid, 25.01), st(mid, 33), st(mid, 33.01)], ['pass', 'exception-required', 'exception-required', 'fail'], 'mid');
    eq(evaluateCell(flag, { frames: 300, p95: 10, error: 'no-dialog-trigger' }).status, 'fail', 'probe error fails');
    const targets = [mid];
    const subjects = [{ subject: 'A' }, { subject: 'B' }];
    const cell = (subject, status) => ({ target: mid.id, subject, status, p95: 30 });
    eq(verdict([cell('A', 'pass'), cell('B', 'pass')], { targets, subjects }).status, 'measured-awaiting-signoff', 'clean run still awaits human sign-off');
    const one = verdict([cell('A', 'exception-required'), cell('B', 'pass')], { targets, subjects });
    eq([one.status, one.exceptions.length], ['measured-awaiting-signoff', 1], 'one exception allowed');
    eq(verdict([cell('A', 'exception-required'), cell('B', 'exception-required')], { targets, subjects }).status, 'fail', 'two exceptions fail');
    eq(verdict([cell('A', 'pass')], { targets, subjects }).failures[0].reason, 'missing-cell', 'missing cell fails closed');
  }],
  ['probe: serialised source runs in a page (scroll, LoAF)', async () => {
    const page = fakePage({ jankEvery: 50, jankMs: 120 });
    const raw = await page.pump(runInContext(cdpExpression({ windowMs: 5000, interaction: 'scroll' }), page.ctx));
    assert(raw.error === null, `error ${raw.error}`);
    const s = summarizeFrames(raw.timestamps);
    const span = raw.timestamps[raw.timestamps.length - 1] - raw.timestamps[0];
    assert(span >= 5000 && span < 5000 + 120, `probe window ${span} ms`);
    eq([s.p95, s.maxMs], [16.67, 120], 'p95 and the injected 120 ms frames');
    assert(s.frames === raw.timestamps.length - 1, `frames ${s.frames}`);
    assert(raw.driven === raw.timestamps.length, 'every frame drove a scroll step');
    assert(page.scroller.scrollTop > 0, 'scroller moved');
    assert(raw.loaf.length >= 4 && raw.loaf.every((e) => e.duration === 120), `loaf ${JSON.stringify(raw.loaf)}`);
    eq([raw.certReady, raw.devicePixelRatio], [true, 3], 'host metadata');
  }],
  ['probe: Dialog open/close drive, missing trigger / scroll range fail', async () => {
    const page = fakePage({ loaf: false });
    const raw = await page.pump(runInContext(cdpExpression({ windowMs: 5000, interaction: 'open-close' }), page.ctx));
    assert(raw.error === null && raw.loaf === null, 'no error, no loaf support');
    assert(page.events.filter((e) => e === 'open').length >= 2 && page.events.includes('close'), `events ${page.events}`);
    const noTrig = fakePage({ trigger: false });
    eq((await noTrig.pump(runInContext(cdpExpression({ interaction: 'open-close' }), noTrig.ctx))).error, 'no-dialog-trigger', 'no trigger');
    const flat = fakePage({ scrollable: false });
    eq((await flat.pump(runInContext(cdpExpression({ interaction: 'scroll' }), flat.ctx))).error, 'no-scroll-range', 'no scroll range');
    assert(webdriverAsyncScript().includes('arguments[arguments.length - 1]'), 'webdriver async callback');
  }],
  ['tags: attempt-id, sha, lane, ttl on every resource type', () => {
    const tags = buildTags({ attemptId: 'p1-j2-abcd', sha: SHA, ttlMinutes: 60, now: Date.parse('2026-10-10T00:00:00Z') });
    eq(Object.keys(tags), TAG_KEYS, 'keys');
    eq([tags.lane, tags.ttl], ['qual:certify:devices', '2026-10-10T01:00:00.000Z'], 'lane and ttl');
    const spec = JSON.parse(ec2TagSpecifications(tags, ['instance', 'volume']));
    eq(spec.map((s) => [s.ResourceType, s.Tags.map((t) => t.Key)]), [['instance', TAG_KEYS], ['volume', TAG_KEYS]], 'ec2 tag specs');
    for (const bad of [{ sha: 'HEAD' }, { ttlMinutes: 0 }, { attemptId: '' }]) {
      let threw = false;
      try { buildTags({ attemptId: 'a', sha: SHA, ...bad }); } catch { threw = true; }
      assert(threw, `buildTags accepted ${JSON.stringify(bad)}`);
    }
  }],
  ['credentials: instance role only, never --profile', async () => {
    for (const k of FORBIDDEN_CREDENTIAL_ENV) await throws(() => createAws({ exec: async () => '{}', env: { [k]: 'x' } }), /instance role only/, k);
    const aws = createAws({ exec: async () => '{}', env: {} });
    await throws(() => aws.call('ec2', 'describe-hosts', ['--profile', 'x']), /--profile/, '--profile');
    assertInstanceRoleIdentity({ Arn: 'arn:aws:sts::123456789012:assumed-role/auraglass-aws-remote/i-0abc12345def67890' });
    await throws(() => assertInstanceRoleIdentity({ Arn: 'arn:aws:iam::123456789012:user/someone' }), /not an EC2 instance-role/, 'iam user');
    await throws(() => assertInstanceRoleIdentity({ Arn: 'arn:aws:sts::123456789012:assumed-role/admin/person@example.com' }), /not an EC2 instance-role/, 'human session');
  }],
  ['bundle: tarball, Device Farm zip, test spec, mac SSM commands', () => {
    const tgz = deviceTarball();
    const tar = gunzipSync(tgz);
    const names = [];
    for (let p = 0; p + 512 <= tar.length; ) {
      const name = tar.subarray(p, p + 100).toString('utf8').replace(/\0.*$/s, '');
      if (!name) break;
      const size = parseInt(tar.subarray(p + 124, p + 136).toString('utf8'), 8);
      names.push(name);
      p += 512 + Math.ceil(size / 512) * 512;
    }
    eq(names, ['package/package.json', ...DEVICE_FILES.map((f) => `package/${f}`)], 'tarball entries');
    const zip = unzipStore(deviceFarmPackage(tgz));
    eq([zip.length, zip[0].name, zip[0].data.equals(tgz)], [1, 'ag-device-probe-1.0.0.tgz', true], 'zip round-trip');
    const plan = encodePlan({ target: 'x', cells: [{ subject: 'Dialog' }] });
    const ios = testSpecYaml(TARGETS[0], plan);
    const android = testSpecYaml(TARGETS[2], plan);
    assert(ios.includes(`AG_DEVICE_PLAN=${plan}`) && ios.includes('device-host.mjs\\" ios') && ios.includes('appium --base-path=/wd/hub'), 'ios spec');
    assert(android.includes('device-host.mjs\\" android') && !android.includes('appium'), 'android spec');
    const cmds = macCommands(plan, tgz).join('\n');
    assert(cmds.includes(MAC_NODE.sha256) && cmds.includes('shasum -a 256 -c -') && cmds.includes('safaridriver --enable') && cmds.includes(`AG_DEVICE_PLAN=${plan}`), 'mac commands');
  }],
  ['result line: gzip+base64 round-trip, exactly one line', async () => {
    const doc = { version: 1, target: 't', cells: [{ subject: 'Dialog', raw: { timestamps: syntheticTimestamps() } }] };
    const line = encodeResult(doc);
    assert(line.length < 24_000, 'fits the SSM stdout window');
    eq(parseResultLine(`noise\n${line}\nnoise`), doc, 'round-trip');
    await throws(() => parseResultLine(`${line}\n${line}`), /exactly one/, 'duplicate line');
    await throws(() => parseResultLine('nothing'), /exactly one/, 'no line');
  }],
  ['resolve: SubjectIndex → story ids, unresolved fails closed', async () => {
    const r = resolveStories(fixtureIndex(), SUBJECTS);
    eq(r.find((s) => s.subject === 'Dialog').storyId, 'cmp-dialog--default', 'flagship story preferred');
    eq(r.find((s) => s.subject === 'ops-console').storyId, 'showcases-ops-console--fullscreen', 'fullscreen showcase');
    const missing = resolveStories({ version: 1, stories: [] }, SUBJECTS.slice(-1));
    eq(missing[0].error, 'unresolved-subject:component:AppShell', 'unresolved');
    await throws(() => resolveStories({}, SUBJECTS), /SubjectIndex/, 'bad index');
    eq(storyUrl('https://sb.test/x', 'a--b'), 'https://sb.test/x/iframe.html?id=a--b&viewMode=story&ag-cert=1', 'story url');
  }],
  ['drivers: WebDriver and CDP clients speak the protocols', async () => {
    const seen = [];
    const wd = webdriver('http://127.0.0.1:4444/', {
      fetchImpl: async (url, init) => {
        seen.push(`${init.method} ${url.replace('http://127.0.0.1:4444', '')}`);
        const value = url.endsWith('/session') ? { sessionId: 's1' } : url.endsWith('/execute/async') ? { ok: JSON.parse(init.body).args[0] } : null;
        return { ok: true, status: 200, json: async () => ({ value }) };
      },
    });
    await wd.newSession({ browserName: 'safari' });
    await wd.navigate('https://x');
    eq(await wd.executeAsync('s', [1]), { ok: 1 }, 'execute async value');
    await wd.deleteSession();
    eq(seen, ['POST /session', 'POST /session/s1/url', 'POST /session/s1/execute/async', 'DELETE /session/s1'], 'webdriver calls');
    const listeners = {};
    const sent = [];
    const sock = { addEventListener: (t, f) => (listeners[t] = f), send: (m) => sent.push(JSON.parse(m)), close() {} };
    const cdp = cdpSession(sock);
    const p = cdp.send('Runtime.evaluate', { expression: '1' });
    const ev = cdp.once('Page.loadEventFired');
    listeners.message({ data: JSON.stringify({ method: 'Page.loadEventFired', params: { timestamp: 1 } }) });
    listeners.message({ data: JSON.stringify({ id: sent[0].id, result: { result: { value: 7 } } }) });
    eq([(await p).result.value, (await ev).timestamp, sent[0].method], [7, 1, 'Runtime.evaluate'], 'cdp');
  }],
  ['orchestrator: full run tags, measures and tears down every resource', async () => {
    const fake = fakeAws();
    const aws = createAws({ exec: fake.exec, env: {} });
    const doc = await runAll({ aws, cfg: baseCfg(), targets: TARGETS, resolved: resolveStories(fixtureIndex(), SUBJECTS), attemptId: 'p1-j2-self', fetchImpl: fake.fetchImpl, sleep: async () => {} });
    assert(!aws.calls.some((c) => c.includes('--profile')), 'no --profile anywhere');
    eq(doc.cells.length, TARGETS.length * SUBJECTS.length, 'one cell per target × subject');
    const moto = doc.cells.filter((c) => c.target === 'moto-g-power-chrome');
    assert(moto.every((c) => c.status === 'pass' && c.p95 === 20 && c.loaf), 'moto cells pass at 20 ms with loaf');
    eq(doc.verdict.status, 'measured-awaiting-signoff', 'verdict');
    eq(fake.state.runs.size, 4, 'one Device Farm run per phone');
    for (const [arn, run] of fake.state.runs) {
      eq((fake.state.tagsByArn.get(arn) ?? []).map((t) => t.Key), TAG_KEYS, `run ${run.plan.target} tags`);
      eq(run.test.type, 'APPIUM_WEB_NODE', 'web test type');
      eq(run.selection.maxDevices, 1, 'one device per run');
      eq(run.status, 'COMPLETED', 'completed runs are not stopped');
    }
    eq(fake.state.uploads.size, 0, 'every upload deleted');
    for (const [, inst] of fake.state.instances) {
      eq(inst.state, 'terminated', 'mac instance terminated');
      eq(inst.tags.map((t) => [t.ResourceType, t.Tags.map((x) => x.Key)]), [['instance', TAG_KEYS], ['volume', TAG_KEYS]], 'instance tags');
      eq(inst.placement.Tenancy, 'host', 'dedicated host placement');
    }
    for (const [, host] of fake.state.hosts) {
      eq(host.tags[0].Tags.map((t) => t.Key), TAG_KEYS, 'host tags');
      const ttlH = (Date.parse(host.tags[0].Tags.find((t) => t.Key === 'ttl').Value) - Date.now()) / 3.6e6;
      assert(ttlH > 23.9 && ttlH <= 24, `host ttl ${ttlH} h covers the 24 h minimum allocation`);
    }
    eq(doc.resources.find((r) => r.type === 'ec2-dedicated-host').cleanup, 'deferred-ttl', 'early host release refused → ttl sweeper');
    assert(doc.resources.every((r) => !r.cleanup.startsWith('failed') && r.cleanup !== 'pending'), 'all resources cleaned');
  }],
  ['orchestrator: a failing target fails its cells and still tears everything down', async () => {
    const fake = fakeAws({ failGetRunFor: 'pixel7-chrome' });
    const aws = createAws({ exec: fake.exec, env: {} });
    const doc = await runAll({ aws, cfg: baseCfg({ hostId: 'h-existing' }), targets: TARGETS, resolved: resolveStories(fixtureIndex(), SUBJECTS), attemptId: 'p1-j2-fail', fetchImpl: fake.fetchImpl, sleep: async () => {} });
    eq(doc.verdict.status, 'fail', 'verdict fails');
    assert(doc.cells.filter((c) => c.target === 'pixel7-chrome').every((c) => c.status === 'fail' && /ServiceUnavailable/.test(c.error)), 'pixel cells fail with the cause');
    const pixelRun = [...fake.state.runs.values()].find((r) => r.plan.target === 'pixel7-chrome');
    eq(pixelRun.status, 'STOPPING', 'unfinished run stopped');
    eq(fake.state.hosts.size, 0, 'existing host reused, none allocated');
    assert(!aws.calls.some((c) => c[1] === 'release-hosts'), 'a reused host is never released');
    eq(fake.state.uploads.size, 0, 'uploads deleted on failure');
  }],
  ['orchestrator: cleanup failure and unresolved subjects fail the run', async () => {
    const fake = fakeAws({ failTerminate: true, releaseRefused: false });
    const aws = createAws({ exec: fake.exec, env: {} });
    const resolved = resolveStories({ version: 1, stories: fixtureIndex().stories.filter((s) => s.subject !== 'AppShell') }, SUBJECTS);
    const doc = await runAll({ aws, cfg: baseCfg(), targets: TARGETS, resolved, attemptId: 'p1-j2-clean', fetchImpl: fake.fetchImpl, sleep: async () => {} });
    assert(doc.verdict.failures.some((f) => f.reason === 'cleanup-failed'), 'cleanup failure recorded');
    assert(doc.resources.some((r) => r.type === 'ec2-instance' && r.cleanup.startsWith('failed: ')), 'failed teardown kept with its error');
    eq(doc.cells.filter((c) => c.subject === 'AppShell').map((c) => c.reason), TARGETS.map(() => 'unresolved-subject:component:AppShell'), 'unresolved subject fails on every target');
    const ledger = createLedger(aws);
    eq(await ledger.cleanup(), await ledger.cleanup(), 'cleanup is idempotent');
  }],
];

export async function selfCheck() {
  const results = [];
  for (const [name, fn] of CHECKS) {
    try {
      await fn();
      results.push({ name, ok: true });
    } catch (e) {
      results.push({ name, ok: false, detail: e.message });
    }
  }
  return { ok: results.every((r) => r.ok), checks: results };
}
