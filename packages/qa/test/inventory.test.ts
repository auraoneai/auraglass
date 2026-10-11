/* REQ-QUAL-02 Source-derived inventory — packages/qa/test/inventory.test.ts. */
import { describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import type { EntrySpec } from '../../../src/contracts/entries.ts';
import { readBaseline } from '../src/evidence/expiringBaseline.ts';
import { buildInventory, collectInventory, UnclassifiedExportError } from '../src/inventory/buildInventory.ts';
import { COUNT_LITERAL_RE, findCountLiterals } from '../src/inventory/countLiterals.ts';
import { checkSourceInventory, INVENTORY_BASELINE } from '../src/inventory/inventoryGate.ts';
import { loadComponentMetas } from '../src/resolve/componentMetas.ts';

const REPO = resolve(__dirname, '../../..');

const meta = (name: string, tier: string, entry: string) => `export default defineMeta({ name: '${name}', owner: 'CMP', entry: '${entry}', tier: '${tier}',
  rsc: 'client', parts: ['root'], states: [], variants: {}, migration: [] });
`;

function fixture(extraIndex = ''): { root: string; entries: EntrySpec[]; done: () => void } {
  const root = mkdtempSync(join(tmpdir(), 'qa-inventory-'));
  const put = (p: string, s: string) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), s); };
  put('src/button/Button.tsx', 'export const Button = (): null => null;\n');
  put('src/button/Button.meta.ts', meta('Button', 'T1', './kit'));
  put('src/panel/Panel.tsx', 'export const Panel = (): null => null;\n');
  put('src/panel/Panel.meta.ts', meta('Panel', 'preview', './kit'));
  put('src/hooks.ts', 'export function useThing(): number { return 1; }\n');
  put('src/provider.tsx', 'export const ThingProvider = (): null => null;\n');
  put('src/format.ts', '/** Formats a thing. @nonvisual */\nexport const formatThing = (n: number): string => String(n);\n');
  put('src/extra.ts', 'export const Mystery = (): null => null;\nexport const Panel2 = (): null => null;\n');
  put('src/types.ts', 'export interface ThingProps { a: string }\nexport type Mode = "a" | "b";\n');
  put('src/kit/index.ts', [
    "export { Button } from '../button/Button';",
    "export { Button as Btn } from '../button/Button';",
    "export { formatThing } from '../format';",
  ].join('\n'));
  put('src/index.ts', [
    "export { Button } from './button/Button';",
    "export { useThing } from './hooks';",
    "export { ThingProvider } from './provider';",
    "export type { ThingProps, Mode } from './types';",
    "export { type ThingProps as P2 } from './types';",
    extraIndex,
  ].join('\n'));
  const entries: EntrySpec[] = [
    { subpath: '.', source: 'src/index.ts', owner: 'PLAT', ga: '5.0', exports: [] },
    { subpath: './kit', source: 'src/kit/index.ts', owner: 'CMP', ga: '5.0', exports: [] },
    { subpath: './styles.css', source: 'build:css', owner: 'PLAT', ga: '5.0', exports: [] },
  ];
  return { root, entries, done: () => rmSync(root, { recursive: true, force: true }) };
}

describe('buildInventory', () => {
  it('classifies visual / alias / nonvisual and skips type-only exports and non-module entries', () => {
    const f = fixture();
    try {
      const inv = buildInventory({ root: f.root, entries: f.entries, metas: loadComponentMetas(f.root) });
      expect(inv.entries).toEqual(['.', './kit']);
      expect(inv.items.map((i) => [i.entry, i.name, i.class, i.reason, i.aliasOf ? `${i.aliasOf.entry} ${i.aliasOf.name}` : ''])).toEqual([
        ['.', 'Button', 'alias', 'alias', './kit Button'],
        ['.', 'ThingProvider', 'nonvisual', 'provider', ''],
        ['.', 'useThing', 'nonvisual', 'hook', ''],
        ['./kit', 'Btn', 'alias', 'alias', './kit Button'],
        ['./kit', 'Button', 'visual', 'meta', ''],
        ['./kit', 'formatThing', 'nonvisual', 'jsdoc', ''],
      ]);
      expect(inv.items.find((i) => i.class === 'visual')?.meta).toBe('src/button/Button.meta.ts');
    } finally { f.done(); }
  });

  it("throws 'unclassified-export' for an export with no meta and no @nonvisual", () => {
    const f = fixture("export { Mystery } from './extra';");
    try {
      expect(() => buildInventory({ root: f.root, entries: f.entries, metas: loadComponentMetas(f.root) }))
        .toThrow(/^unclassified-export: 1 value export\(s\).*\n {2}- \. Mystery \(src\/extra\.ts:1\)/);
    } finally { f.done(); }
  });

  it('a preview-tier meta does not make an export visual', () => {
    const f = fixture("export { Panel } from './panel/Panel';");
    try {
      let err: unknown;
      try { buildInventory({ root: f.root, entries: f.entries, metas: loadComponentMetas(f.root) }); } catch (e) { err = e; }
      expect(err).toBeInstanceOf(UnclassifiedExportError);
      expect((err as UnclassifiedExportError).exports.map((e) => e.name)).toEqual(['Panel']);
    } finally { f.done(); }
  });

  it('fails when an ENTRIES source file is missing', () => {
    const f = fixture();
    try {
      expect(() => collectInventory({ root: f.root, entries: [...f.entries, { subpath: './gone', source: 'src/gone/index.ts', owner: 'CMP', ga: '5.0', exports: [] }],
        metas: loadComponentMetas(f.root) })).toThrow(/^missing-entry-source: ENTRIES \.\/gone/);
    } finally { f.done(); }
  });
});

describe('inventory gate over this repository (expiring baseline, PRD-F §4.3 rule 3)', () => {
  it('every value export of every ENTRIES row is classified or in the baseline; no stale rows', () => {
    const inv = checkSourceInventory(REPO, readBaseline(join(REPO, INVENTORY_BASELINE)), process.env.AG_SCOPE);
    expect(inv.items.length).toBeGreaterThan(0);
    expect(inv.items.filter((i) => i.class === 'visual').every((i) => typeof i.meta === 'string')).toBe(true);
  });
});

describe('no count literals', () => {
  it('packages/qa/** and certification/** contain none of the archived totals', () => {
    expect(findCountLiterals(REPO, ['packages/qa', 'certification'])).toEqual([]);
  });
  it('detects an inserted total in a certification-like file', () => {
    const root = mkdtempSync(join(tmpdir(), 'qa-literal-'));
    try {
      const n = String(2 * 249);
      mkdirSync(join(root, 'certification'), { recursive: true });
      writeFileSync(join(root, 'certification/thresholds.json'), `{ "subjects": ${n} }\n`);
      writeFileSync(join(root, 'certification/ok.json'), `{ "subjects": ${n}0, "id": "x${n}" }\n`);
      expect(findCountLiterals(root, ['certification'])).toEqual([{ file: 'certification/thresholds.json', line: 1, text: `{ "subjects": ${n} }` }]);
      expect(COUNT_LITERAL_RE.test(`expect(total).toBe(${47 * 10})`)).toBe(true);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
