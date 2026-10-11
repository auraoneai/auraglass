/** @jest-environment jsdom */
// SURF-141 — REQ-SURF-02: all 11 SURF contract statics exist on their
// namespaces as reached through the public entries, and work without
// rendering. Rows: FilterBar.useModel/serialize/parse (./data),
// Message.Parts/getText, Thread.RenderersProvider, ToolCall.displayState
// (./ai), AppShell.parseCookie (./app-shell), Pagination.getRange,
// Command.score, SourceTransition.start (root). Statics ride on the
// namespace — none of them is an extra named export of its entry.
// When AURAGLASS_TARBALL is set the same assertion runs against the packed
// artifact's real JS.
import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as data from '../../../src/data';
import * as ai from '../../../src/ai';
import * as appShell from '../../../src/app-shell';
import * as rootSurf from '../../../src/root/surf';
import type { FilterField } from '../../../src/data/filter-bar/filter-model';

const ROOT = join(__dirname, '..', '..', '..');

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

const SOURCE: Record<string, Record<string, unknown>> = {
  './data': data,
  './ai': ai,
  './app-shell': appShell,
  '.': rootSurf,
};

/** Shape report: { 'Ns.static': typeof } — compared against all-'function'. */
const report = (mod: Record<string, unknown>, ns: Record<string, string[]>) => {
  const out: Record<string, string> = {};
  for (const [name, statics] of Object.entries(ns)) {
    const target = mod[name] as Record<string, unknown> | undefined;
    for (const s of statics) out[`${name}.${s}`] = typeof target?.[s];
  }
  return out;
};
const expected = (ns: Record<string, string[]>) =>
  Object.fromEntries(Object.entries(ns).flatMap(([n, ss]) => ss.map((s) => [`${n}.${s}`, 'function'])));

describe('SURF contract statics (SURF-141, REQ-SURF-02)', () => {
  it('lists exactly 11 statics', () => {
    expect(ALL_STATIC_NAMES.length).toBe(11);
  });
  for (const [entry, ns] of Object.entries(STATICS)) {
    it(`${entry} namespaces carry their statics`, () => {
      expect(report(SOURCE[entry], ns)).toEqual(expected(ns));
    });
    it(`${entry} exposes no static as an extra named export`, () => {
      const keys = Object.keys(SOURCE[entry]);
      const leaked = Object.values(ns).flat().filter((s) => keys.includes(s));
      expect(leaked).toEqual([]);
    });
  }
});

describe('SURF statics behave without rendering', () => {
  const FIELDS: FilterField[] = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'age', label: 'Age', type: 'number' },
  ];
  it('FilterBar.serialize/parse round-trip a populated group', () => {
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
    expect(back.children.length).toBe(2);
  });
  it('Pagination.getRange returns the range shape', () => {
    const r = rootSurf.Pagination.getRange({ page: 5, pageCount: 20, siblingCount: 1, boundaryCount: 1 });
    expect(Array.isArray(r)).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });
  it('Command.score ranks fuzzy hits', () => {
    const hit = rootSurf.Command.score('strm', 'streaming text');
    const miss = rootSurf.Command.score('zzz', 'streaming text');
    expect(hit).toBeGreaterThan(0);
    expect(miss).toBeLessThanOrEqual(hit);
  });
});

/* Packed-tarball acceptance: AURAGLASS_TARBALL=<path>.tgz installs the
   artifact into a scratch dir and dynamic-imports each entry in a plain node
   process; every static must be a function on its packed namespace. */
const tarball = process.env.AURAGLASS_TARBALL;
const itTgz = tarball === undefined ? it.skip : it;
describe('packed SURF statics (AURAGLASS_TARBALL)', () => {
  itTgz('all 11 statics are functions on the packed namespaces', () => {
    const dir = mkdtempSync(join(tmpdir(), 'surf-statics-pkg-'));
    writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
    const peers = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).peerDependencies ?? {}).join(' ');
    execSync(`npm install --ignore-scripts --no-save --legacy-peer-deps "${tarball}" ${peers}`, { cwd: dir, stdio: 'pipe' });
    for (const [entry, ns] of Object.entries(STATICS)) {
      const spec = entry === '.' ? 'aura-glass' : `aura-glass/${entry.slice(2)}`;
      const script =
        `const ns=${JSON.stringify(ns)};import('${spec}').then(m=>{const o={},k=Object.keys(m);` +
        `for(const[n,ss]of Object.entries(ns))for(const s of ss)o[n+'.'+s]=typeof (m[n]&&m[n][s]);` +
        `console.log(JSON.stringify({o,leaked:Object.values(ns).flat().filter(s=>k.includes(s))}))})`;
      writeFileSync(join(dir, 'probe.mjs'), script);
      const out = JSON.parse(execSync('node probe.mjs', { cwd: dir, stdio: 'pipe' }).toString().trim());
      expect({ entry, ...out }).toEqual({ entry, o: expected(ns), leaked: [] });
    }
  });
});
