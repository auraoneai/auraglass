/* Device-host entry (runs on the AWS Device Farm test host or the mac1.metal
   instance, never on the orchestrating runner). Reads the plan from
   AG_DEVICE_PLAN (base64 JSON), drives the browser, and prints exactly one
   `AG_DEVICE_RESULT <json>` line with the raw probe data per cell. The
   orchestrator computes statistics and the gate from that line. */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { gunzipSync, gzipSync } from 'node:zlib';
import { cdpConnect, webdriver } from './drivers.mjs';
import { cdpExpression, webdriverAsyncScript } from './probe.mjs';

const run = promisify(execFile);
export const RESULT_MARKER = 'AG_DEVICE_RESULT ';

export function decodePlan(b64) {
  if (!b64) throw new Error('device-entry: AG_DEVICE_PLAN is not set');
  const plan = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  if (!plan.target || !Array.isArray(plan.cells) || !plan.cells.length) throw new Error('device-entry: plan has no target or cells');
  return plan;
}

export function encodePlan(plan) {
  return Buffer.from(JSON.stringify(plan), 'utf8').toString('base64');
}

/* The result travels gzip+base64 so it fits SSM's 24,000-character stdout window. */
export function encodeResult(obj) {
  return `${RESULT_MARKER}gz:${gzipSync(Buffer.from(JSON.stringify(obj))).toString('base64')}`;
}

/** Parse the result line out of a host log (Device Farm test-spec output, SSM stdout). */
export function parseResultLine(text) {
  const lines = String(text ?? '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith(RESULT_MARKER));
  if (lines.length !== 1) throw new Error(`expected exactly one ${RESULT_MARKER.trim()} line, found ${lines.length}`);
  const body = lines[0].slice(RESULT_MARKER.length);
  if (!body.startsWith('gz:')) throw new Error('result line is not gz:<base64>');
  return JSON.parse(gunzipSync(Buffer.from(body.slice(3), 'base64')).toString('utf8'));
}

const r2 = (n) => Math.round(n * 100) / 100;
function compact(raw) {
  if (!raw || !Array.isArray(raw.timestamps)) return raw;
  return { ...raw, timestamps: raw.timestamps.map(r2) };
}

async function probeWebdriver(plan, baseUrl, caps) {
  const wd = webdriver(baseUrl);
  const cells = [];
  await wd.newSession(caps);
  try {
    await wd.setTimeouts({ script: plan.windowMs + 30_000, pageLoad: 60_000 });
    for (const cell of plan.cells) {
      try {
        await wd.navigate(cell.url);
        const raw = await wd.executeAsync(webdriverAsyncScript(), [{ windowMs: plan.windowMs, interaction: cell.interaction }]);
        cells.push({ ...cell, raw: compact(raw) });
      } catch (e) {
        cells.push({ ...cell, raw: null, error: `driver:${e.message}` });
      }
    }
  } finally {
    await wd.deleteSession().catch(() => {});
  }
  return cells;
}

async function waitFor(fn, timeoutMs, label) {
  const until = Date.now() + timeoutMs;
  let last;
  while (Date.now() < until) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`${label}: ${last?.message ?? 'timeout'}`);
}

async function probeAndroid(plan, env) {
  const udid = env.DEVICEFARM_DEVICE_UDID;
  if (!udid) throw new Error('device-entry: DEVICEFARM_DEVICE_UDID is not set');
  const adb = (...a) => run('adb', ['-s', udid, ...a]);
  /* Skip Chrome's first-run UI (honoured where command-line flags are enabled for the build). */
  await adb('shell', 'echo "_ --disable-fre --no-default-browser-check --no-first-run" > /data/local/tmp/chrome-command-line').catch(() => {});
  await adb('shell', 'am', 'force-stop', 'com.android.chrome');
  await adb('shell', 'am', 'start', '-n', 'com.android.chrome/com.google.android.apps.chrome.Main', '-a', 'android.intent.action.VIEW', '-d', 'about:blank');
  await adb('forward', 'tcp:9222', 'localabstract:chrome_devtools_remote');
  const http = 'http://127.0.0.1:9222';
  await waitFor(async () => (await fetch(`${http}/json/version`)).json(), 30_000, 'chrome devtools endpoint');
  const cdp = await cdpConnect(http);
  const cells = [];
  try {
    await cdp.send('Page.enable');
    for (const cell of plan.cells) {
      try {
        const loaded = cdp.once('Page.loadEventFired', 60_000);
        await cdp.send('Page.navigate', { url: cell.url });
        await loaded;
        const res = await cdp.send('Runtime.evaluate', {
          expression: cdpExpression({ windowMs: plan.windowMs, interaction: cell.interaction }),
          awaitPromise: true,
          returnByValue: true,
          timeout: plan.windowMs + 30_000,
        });
        if (res.exceptionDetails) throw new Error(res.exceptionDetails.text || 'evaluate threw');
        cells.push({ ...cell, raw: compact(res.result.value) });
      } catch (e) {
        cells.push({ ...cell, raw: null, error: `driver:${e.message}` });
      }
    }
  } finally {
    cdp.close();
    await adb('forward', '--remove', 'tcp:9222').catch(() => {});
  }
  return cells;
}

export async function deviceEntry(platform, env = process.env) {
  const plan = decodePlan(env.AG_DEVICE_PLAN);
  let cells;
  if (platform === 'android') cells = await probeAndroid(plan, env);
  else if (platform === 'ios') cells = await probeWebdriver(plan, 'http://127.0.0.1:4723/wd/hub', { platformName: 'iOS', browserName: 'Safari' });
  else if (platform === 'macos') cells = await probeWebdriver(plan, 'http://127.0.0.1:4444', { browserName: 'safari' });
  else throw new Error(`device-entry: unknown platform ${platform}`);
  const out = { version: 1, target: plan.target, attemptId: plan.attemptId, host: { platform, device: env.DEVICEFARM_DEVICE_NAME ?? null, os: env.DEVICEFARM_DEVICE_OS_VERSION ?? null }, cells };
  process.stdout.write(`${encodeResult(out)}\n`);
  return out;
}
