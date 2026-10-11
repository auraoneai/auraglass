// SURF-140 — REQ-SURF-01: every SURF subpath barrel exports exactly its
// contract ENTRIES list; the app-shell entry carries exactly the 7 flagship
// names with compounds on the namespaces; the root surf slice carries the
// nine flagship names with formatTimestamp on Timeline (not a named export).
// When AURAGLASS_TARBALL is set, the same assertion runs against the packed
// artifact's real JS — the packed-surface acceptance.
import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ENTRIES } from '../../../src/contracts/entries';
import * as appShell from '../../../src/app-shell';
import * as data from '../../../src/data';
import * as date from '../../../src/date';
import * as ai from '../../../src/ai';
import * as media from '../../../src/media';
import * as backdrops from '../../../src/backdrops';
import * as charts from '../../../src/charts';
import * as rootSurf from '../../../src/root/surf';
import { Timeline } from '../../../src/components/timeline/Timeline';
import { AppShell } from '../../../src/app-shell/AppShell';

const ROOT = join(__dirname, '..', '..', '..');
const surf = (subpath: string) => {
  const e = ENTRIES.find((x) => x.subpath === subpath);
  if (e === undefined) throw new Error(`no ENTRIES row for ${subpath}`);
  return [...e.exports].sort();
};
const names = (m: Record<string, unknown>) => Object.keys(m).sort();

describe('SURF entry value exports (SURF-140)', () => {
  it('./app-shell exports exactly the 7 contract names', () => {
    expect(names(appShell)).toEqual(
      ['AppShell', 'Sidebar', 'TopBar', 'StatusBar', 'Inspector', 'ResizablePanels', 'MobileShell'].sort()
    );
  });
  it('./data exports exactly the contract list', () => {
    expect(names(data)).toEqual(surf('./data'));
  });
  it('./date exports exactly the contract list', () => {
    expect(names(date)).toEqual(surf('./date'));
  });
  it('./ai exports exactly the contract list', () => {
    expect(names(ai)).toEqual(surf('./ai'));
  });
  it('./media exports exactly the contract list', () => {
    expect(names(media)).toEqual(surf('./media'));
  });
  it('./backdrops exports exactly the contract list', () => {
    expect(names(backdrops)).toEqual(surf('./backdrops'));
  });
  it('./charts exports exactly the contract list', () => {
    expect(names(charts)).toEqual(surf('./charts'));
  });
  it('root surf slice carries only flagship names — no formatTimestamp export', () => {
    expect(Object.keys(rootSurf)).not.toContain('formatTimestamp');
    expect(Object.keys(rootSurf).sort()).toEqual([
      'ActivityFeed', 'Breadcrumbs', 'Command', 'CommandPalette', 'Pagination',
      'SourceTransition', 'TabBar', 'Tabs', 'Timeline',
    ].sort());
  });
  it('compounds carry the helpers dropped from the barrel', () => {
    expect(typeof AppShell.parseCookie).toBe('function');
    expect(typeof AppShell.SidebarToggle).toBe('function');
    expect(typeof AppShell.InspectorToggle).toBe('function');
    expect(typeof AppShell.Controller).toBe('function');
    expect(typeof (Timeline as unknown as { formatTimestamp?: unknown }).formatTimestamp).toBe('function');
  });
});

/* Packed-tarball acceptance: AURAGLASS_TARBALL=<path>.tgz installs the
   artifact into a scratch dir and dynamic-imports each SURF subpath in a
   plain node process — Object.keys equality is the acceptance. */
const tarball = process.env.AURAGLASS_TARBALL;
const itTgz = tarball === undefined ? it.skip : it;
describe('packed SURF surface (AURAGLASS_TARBALL)', () => {
  itTgz('Object.keys(import("aura-glass/<sub>")) equal the contract lists', () => {
    const dir = mkdtempSync(join(tmpdir(), 'surf-pkg-'));
    writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
    const peers = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).peerDependencies ?? {}).join(' ');
    execSync(`npm install --ignore-scripts --no-save --legacy-peer-deps "${tarball}" ${peers}`, { cwd: dir, stdio: 'pipe' });
    for (const sub of ['./app-shell', './data', './date', './ai', './media', './backdrops']) {
      const out = execSync(
        `node -e "import('aura-glass/${sub.slice(2)}').then(m=>console.log(JSON.stringify(Object.keys(m).sort())))"`,
        { cwd: dir, stdio: 'pipe' },
      ).toString().trim();
      expect({ sub, keys: JSON.parse(out) }).toEqual({ sub, keys: surf(sub) });
    }
  });
});
