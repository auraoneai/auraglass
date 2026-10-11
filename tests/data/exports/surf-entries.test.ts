/** @jest-environment node */
// SURF-140 — REQ-SURF-01 (REQ-FIN-80): the PACKED artifact is the subject.
// AURAGLASS_TARBALL=<path>.tgz is installed into a scratch project (plus every
// declared peer) and each SURF subpath is imported in a plain node process:
//   - Object.keys(import('aura-glass/<sub>')) equals its contract ENTRIES list
//     exactly, for every SURF-owned row (./app-shell is the 7 flagship names);
//   - the root entry carries the nine SURF flagship names and does NOT export
//     formatTimestamp — it ships as Timeline.formatTimestamp;
//   - the compounds dropped from the ./app-shell barrel are reachable on the
//     namespaces (AppShell.parseCookie / SidebarToggle / InspectorToggle /
//     Controller).
// Runs remotely in surf:package:packed-entries (build + npm pack). Without
// AURAGLASS_TARBALL it fails closed and names that job; it never reads src/.
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ENTRIES } from '../../../src/contracts/entries';

jest.setTimeout(300_000);

const ROOT = join(__dirname, '..', '..', '..');
const REMOTE = 'GitLab job surf:package:packed-entries (npm run build && npm pack, then AURAGLASS_TARBALL=<tgz> npm test -- tests/data/exports)';
const SURF_ROWS = ENTRIES.filter((e) => e.owner === 'SURF');
const ROOT_SURF = ['ActivityFeed', 'Breadcrumbs', 'Command', 'CommandPalette', 'Pagination', 'SourceTransition', 'TabBar', 'Tabs', 'Timeline'];

type Probe = {
  entries: Record<string, { keys?: string[]; error?: string }>;
  root: { keys?: string[]; error?: string; timelineFormatTimestamp?: string };
  appShell: Record<string, string>;
};

let probe: Probe;

beforeAll(() => {
  const tarball = process.env.AURAGLASS_TARBALL;
  if (tarball === undefined || tarball === '') {
    throw new Error(`AURAGLASS_TARBALL is not set — this suite asserts the packed artifact only. Run it in ${REMOTE}.`);
  }
  const tgz = resolve(tarball);
  if (!existsSync(tgz)) throw new Error(`AURAGLASS_TARBALL=${tgz} does not exist`);

  const dir = mkdtempSync(join(tmpdir(), 'surf-pkg-'));
  writeFileSync(join(dir, 'package.json'), '{"name":"surf-entries-probe","private":true,"type":"module"}');
  const peers = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).peerDependencies ?? {});
  execFileSync('npm', ['install', '--ignore-scripts', '--no-save', '--no-audit', '--no-fund', '--legacy-peer-deps', tgz, ...peers], {
    cwd: dir, stdio: 'pipe', env: { ...process.env, npm_config_loglevel: 'error' },
  });

  const subs = SURF_ROWS.map((e) => e.subpath.slice(2));
  writeFileSync(join(dir, 'probe.mjs'), `
const out = { entries: {}, root: {}, appShell: {} };
for (const sub of ${JSON.stringify(subs)}) {
  try { out.entries['./' + sub] = { keys: Object.keys(await import('aura-glass/' + sub)).sort() }; }
  catch (e) { out.entries['./' + sub] = { error: String(e && e.stack || e) }; }
}
try {
  const m = await import('aura-glass');
  out.root = { keys: Object.keys(m).sort(), timelineFormatTimestamp: typeof (m.Timeline && m.Timeline.formatTimestamp) };
} catch (e) { out.root = { error: String(e && e.stack || e) }; }
try {
  const { AppShell } = await import('aura-glass/app-shell');
  for (const k of ['parseCookie', 'SidebarToggle', 'InspectorToggle', 'Controller']) out.appShell[k] = typeof AppShell[k];
} catch (e) { out.appShell.error = String(e && e.stack || e); }
process.stdout.write(JSON.stringify(out));
`);
  probe = JSON.parse(execSync('node probe.mjs', { cwd: dir, encoding: 'utf8' })) as Probe;
});

describe('packed SURF entries (SURF-140, REQ-SURF-01)', () => {
  it.each(SURF_ROWS.map((e) => [e.subpath, [...e.exports].sort()] as const))(
    'Object.keys(import("aura-glass/%s")) equals the contract list exactly',
    (subpath, expected) => {
      expect({ subpath, ...probe.entries[subpath] }).toEqual({ subpath, keys: expected });
    },
  );

  it('./app-shell is exactly the 7 flagship names', () => {
    expect(probe.entries['./app-shell']).toEqual({
      keys: ['AppShell', 'Inspector', 'MobileShell', 'ResizablePanels', 'Sidebar', 'StatusBar', 'TopBar'],
    });
  });

  it('root carries the nine SURF flagship names and no formatTimestamp; the formatter ships on Timeline', () => {
    expect(probe.root.error).toBeUndefined();
    const keys = probe.root.keys ?? [];
    expect(ROOT_SURF.filter((n) => !keys.includes(n))).toEqual([]);
    expect(keys).not.toContain('formatTimestamp');
    expect(probe.root.timelineFormatTimestamp).toBe('function');
  });

  it('compounds dropped from the ./app-shell barrel are on the AppShell namespace', () => {
    expect(probe.appShell).toEqual({
      parseCookie: 'function', SidebarToggle: 'function', InspectorToggle: 'function', Controller: 'function',
    });
  });
});
