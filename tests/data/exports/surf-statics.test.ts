/** @jest-environment node */
// SURF-141 — REQ-SURF-02 (REQ-FIN-80): the 11 SURF contract statics.
//   ./data       FilterBar.useModel / serialize / parse
//   ./ai         Message.Parts / getText, Thread.RenderersProvider, ToolCall.displayState
//   ./app-shell  AppShell.parseCookie
//   . (root)     Pagination.getRange, Command.score, SourceTransition.start
// Statics ride on their namespace: none of them is an extra named export of
// its entry.
//
// Acceptance subject is the PACKED artifact: AURAGLASS_TARBALL=<path>.tgz is
// installed into a scratch project (plus every declared peer) and each entry
// is imported in a plain node process. Runs remotely in
// surf:package:packed-entries (build + npm pack). Without AURAGLASS_TARBALL
// the packed suite fails closed and names that job. The source suite below it
// exercises the same table through the src entries so a local narrow run
// still checks behaviour.
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import * as data from '../../../src/data';
import * as ai from '../../../src/ai';
import * as appShell from '../../../src/app-shell';
import * as rootSurf from '../../../src/root/surf';
import type { FilterField } from '../../../src/data/filter-bar/filter-model';

jest.setTimeout(300_000);

const ROOT = join(__dirname, '..', '..', '..');
const REMOTE =
  'GitLab job surf:package:packed-entries (npm run build && npm pack, then AURAGLASS_TARBALL=<tgz> npm test -- tests/data/exports/surf-statics.test.ts)';

/** entry -> namespace -> statics. 11 statics total. */
const STATICS: Record<string, Record<string, string[]>> = {
  './data': { FilterBar: ['useModel', 'serialize', 'parse'] },
  './ai': {
    Message: ['Parts', 'getText'],
    Thread: ['RenderersProvider'],
    ToolCall: ['displayState'],
  },
  './app-shell': { AppShell: ['parseCookie'] },
  '.': {
    Pagination: ['getRange'],
    Command: ['score'],
    SourceTransition: ['start'],
  },
};

const ALL_STATIC_NAMES = Object.values(STATICS).flatMap((ns) => Object.values(ns).flat());

/** { 'Ns.static': 'function' } for every static of an entry. */
const expected = (ns: Record<string, string[]>) =>
  Object.fromEntries(Object.entries(ns).flatMap(([n, ss]) => ss.map((s) => [`${n}.${s}`, 'function'])));

/** { 'Ns.static': typeof } as observed on a module namespace object. */
const report = (mod: Record<string, unknown>, ns: Record<string, string[]>) => {
  const out: Record<string, string> = {};
  for (const [name, statics] of Object.entries(ns)) {
    const target = mod[name] as Record<string, unknown> | undefined;
    for (const s of statics) out[`${name}.${s}`] = typeof target?.[s];
  }
  return out;
};

it('the contract table lists exactly 11 statics', () => {
  expect(ALL_STATIC_NAMES.length).toBe(11);
});

type EntryProbe = { statics?: Record<string, string>; leaked?: string[]; error?: string };
let probe: Record<string, EntryProbe>;

describe('packed SURF statics (SURF-141, REQ-SURF-02)', () => {
  beforeAll(() => {
    const tarball = process.env.AURAGLASS_TARBALL;
    if (tarball === undefined || tarball === '') {
      throw new Error(`AURAGLASS_TARBALL is not set — this suite asserts the packed artifact only. Run it in ${REMOTE}.`);
    }
    const tgz = resolve(tarball);
    if (!existsSync(tgz)) throw new Error(`AURAGLASS_TARBALL=${tgz} does not exist`);

    const dir = mkdtempSync(join(tmpdir(), 'surf-statics-pkg-'));
    writeFileSync(join(dir, 'package.json'), '{"name":"surf-statics-probe","private":true,"type":"module"}');
    const peers = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).peerDependencies ?? {});
    execFileSync('npm', ['install', '--ignore-scripts', '--no-save', '--no-audit', '--no-fund', '--legacy-peer-deps', tgz, ...peers], {
      cwd: dir,
      stdio: 'pipe',
      env: { ...process.env, npm_config_loglevel: 'error' },
    });

    writeFileSync(
      join(dir, 'probe.mjs'),
      `
const table = ${JSON.stringify(STATICS)};
const out = {};
for (const [entry, ns] of Object.entries(table)) {
  const spec = entry === '.' ? 'aura-glass' : 'aura-glass/' + entry.slice(2);
  try {
    const m = await import(spec);
    const keys = Object.keys(m);
    const statics = {};
    for (const [n, ss] of Object.entries(ns)) for (const s of ss) statics[n + '.' + s] = typeof (m[n] && m[n][s]);
    out[entry] = { statics, leaked: Object.values(ns).flat().filter((s) => keys.includes(s)) };
  } catch (e) { out[entry] = { error: String((e && e.stack) || e) }; }
}
process.stdout.write(JSON.stringify(out));
`,
    );
    probe = JSON.parse(execSync('node probe.mjs', { cwd: dir, encoding: 'utf8' })) as Record<string, EntryProbe>;
  });

  it.each(Object.entries(STATICS))('%s: every static is a function on its packed namespace', (entry, ns) => {
    expect({ entry, ...probe[entry] }).toEqual({ entry, statics: expected(ns), leaked: [] });
  });

  it('the packed entries carry all 11 statics in total', () => {
    const fns = Object.values(probe).flatMap((p) => Object.values(p.statics ?? {}).filter((t) => t === 'function'));
    expect(fns.length).toBe(11);
  });
});

describe('SURF statics through the src entries (SURF-141, REQ-SURF-02)', () => {
  const SOURCE: Record<string, Record<string, unknown>> = {
    './data': data,
    './ai': ai,
    './app-shell': appShell,
    '.': rootSurf,
  };
  const ROWS = Object.entries(STATICS).map(([entry, ns]) => [entry, ns, SOURCE[entry] ?? {}] as const);

  it.each(ROWS)('%s: namespaces carry their statics, none leaks as a named export', (_entry, ns, mod) => {
    const keys = Object.keys(mod);
    expect({ statics: report(mod, ns), leaked: ALL_STATIC_NAMES.filter((s) => keys.includes(s)) }).toEqual({
      statics: expected(ns),
      leaked: [],
    });
  });

  it('FilterBar.serialize/parse round-trip a populated group', () => {
    const FIELDS: FilterField[] = [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'age', label: 'Age', type: 'number' },
    ];
    const group = {
      kind: 'group' as const,
      id: 'g1',
      combinator: 'and' as const,
      children: [
        { kind: 'rule' as const, id: 'r1', fieldId: 'name', operator: 'contains' as const, value: 'ada' },
        { kind: 'rule' as const, id: 'r2', fieldId: 'age', operator: '>=' as const, value: 30 },
      ],
    };
    const back = data.FilterBar.parse(FIELDS, data.FilterBar.serialize(group));
    expect(back.children).toEqual([
      expect.objectContaining({ fieldId: 'name', operator: 'contains', value: 'ada' }),
      expect.objectContaining({ fieldId: 'age', operator: '>=', value: 30 }),
    ]);
  });

  it('Pagination.getRange builds a boundary/sibling range', () => {
    const r = rootSurf.Pagination.getRange({ page: 10, pageCount: 20, siblingCount: 1, boundaryCount: 1 });
    expect(r).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });

  it('Command.score ranks a fuzzy hit above a miss', () => {
    const hit = rootSurf.Command.score('strm', 'streaming text');
    const miss = rootSurf.Command.score('zzz', 'streaming text');
    expect(hit).toBeGreaterThan(0);
    expect(hit).toBeGreaterThan(miss);
  });

  it('AppShell.parseCookie reads the persisted shell state', () => {
    expect(appShell.AppShell.parseCookie('sidebar:rail;inspector:closed')).toEqual({ sidebar: 'rail', inspector: 'closed' });
    expect(appShell.AppShell.parseCookie('sidebar:bogus;other:x')).toEqual({});
  });
});
