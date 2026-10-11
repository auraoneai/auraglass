/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// REQ-MAT-04 (MAT-003, D.2-02): --ag-* namespace and manifest.
// - the set of public --ag-* names DECLARED by MAT outputs (dist/tokens.css,
//   src/material/css/**, src/a11y/css/**, src/motion/css/**) equals the --ag-*
//   members of PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS: 0 extra, 0 missing, no whitelist
// - every var(--ag-*) READ by those outputs is a contract name
// - every --ag-* name referenced in src/** is a contract name (or a template
//   prefix such as `--ag-color-${k}` that prefixes contract names)
// - every --_ag-* name referenced in src/** is not manifest-public and is defined
//   in generated css (privates stay private and actually exist)
// - dist/tokens/manifest.json satisfies TokenManifest: one entry per public
//   variable, each `type` in the contract union, `ref` tier never present
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, walkFiles } from '../../scripts/tokens/gates/_util.mjs';
import { MANIFEST_TYPES } from '../../scripts/tokens/formats/manifest.mjs';
import { PUBLIC_CSS_VARS, type TokenManifestEntry } from '../../src/contracts/tokens';
import { MOTION_CSS_VARS } from '../../src/contracts/motion';

const NAME_RE = /--_?ag-[a-z0-9-]+/g;
const rel = (f: string): string => f.replace(`${ROOT}/`, '');

// Compile-time proof that MANIFEST_TYPES is exactly the contract union (both directions).
type ContractType = TokenManifestEntry['type'];
type Listed = (typeof MANIFEST_TYPES)[number];
const listedInUnion: [Exclude<Listed, ContractType>] extends [never] ? true : false = true;
const unionListed: [Exclude<ContractType, Listed>] extends [never] ? true : false = true;
// Runtime witness of the contract union: Record<> forces every member, excess-property checks forbid extras.
const UNION_WITNESS: Record<ContractType, true> = {
  color: true, dimension: true, number: true, duration: true, cubicBezier: true, 'motion-spring': true,
  shadow: true, 'glass-material': true, fontFamily: true, fontWeight: true,
};

/** Public --ag-* names of the contract (PUBLIC_CSS_VARS also lists --_ag-* readouts and shadcn names). */
const CONTRACT_AG = new Set<string>(
  [...Object.values(PUBLIC_CSS_VARS).flat(), ...MOTION_CSS_VARS].filter((v) => v.startsWith('--ag-')),
);

/** MAT output corpus named by the REQ-MAT-04 acceptance. */
const corpus = (): string[] => [
  join(ROOT, 'dist/tokens.css'),
  ...['src/material/css', 'src/a11y/css', 'src/motion/css'].flatMap((d) => walkFiles(join(ROOT, d), ['.css'])),
];

const manifest = (): { version: number; tokens: Array<{ cssVar: string; type: string; tier: string }> } =>
  JSON.parse(readFileSync(join(ROOT, 'dist/tokens/manifest.json'), 'utf8'));

const generatedVars = (): Set<string> => {
  const defined = new Set<string>();
  for (const f of [
    'dist/css/tokens.css',
    'dist/css/tailwind.css',
    'src/material/css/generated/ladders.css',
    'src/material/css/generated/floors.css',
    'src/material/css/generated/properties.css',
  ]) {
    const text = readFileSync(join(ROOT, f), 'utf8');
    for (const m of text.matchAll(/(--_?ag-[a-z0-9-]+)\s*:/g)) defined.add(m[1]!);
    for (const m of text.matchAll(/@property\s+(--_?ag-[a-z0-9-]+)/g)) defined.add(m[1]!);
  }
  return defined;
};

describe('--ag-* namespace (REQ-MAT-04)', () => {
  const srcFiles = walkFiles(join(ROOT, 'src'), ['.ts', '.tsx', '.css', '.mts', '.mjs'])
    // generated files legitimately contain emitted names; they are covered by the corpus checks
    .filter((f: string) => !f.includes('/generated/'))
    // the contract modules define the lists under test
    .filter((f: string) => !f.includes('/src/contracts/'));

  test('declared --ag-* set over MAT outputs equals PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS', () => {
    const declared = new Map<string, Set<string>>();
    for (const f of corpus()) {
      for (const m of readFileSync(f, 'utf8').matchAll(/(?<![\w-])(--ag-[a-z0-9-]+)\s*:/g)) {
        if (!declared.has(m[1]!)) declared.set(m[1]!, new Set());
        declared.get(m[1]!)!.add(rel(f));
      }
    }
    const extra = [...declared].filter(([n]) => !CONTRACT_AG.has(n)).map(([n, fs]) => `${n} (${[...fs].join(', ')})`).sort();
    const missing = [...CONTRACT_AG].filter((n) => !declared.has(n)).sort();
    expect({ extra, missing }).toEqual({ extra: [], missing: [] });
  });

  test('every var(--ag-*) read by MAT outputs is a contract name', () => {
    const bad: string[] = [];
    for (const f of corpus()) {
      for (const m of readFileSync(f, 'utf8').matchAll(/var\(\s*(--ag-[a-z0-9-]+)/g))
        if (!CONTRACT_AG.has(m[1]!)) bad.push(`${rel(f)}: ${m[1]}`);
    }
    expect([...new Set(bad)].sort()).toEqual([]);
  });

  test('public --ag-* names in src are all contract names', () => {
    const isContract = (name: string): boolean => {
      if (CONTRACT_AG.has(name)) return true;
      // template prefix (e.g. `--ag-color-${k}`): valid only when it prefixes a contract name
      if (!name.endsWith('-')) return false;
      for (const v of CONTRACT_AG) if (v.startsWith(name)) return true;
      return false;
    };
    const bad: string[] = [];
    for (const f of srcFiles) {
      for (const m of readFileSync(f, 'utf8').matchAll(NAME_RE)) {
        const name = m[0];
        if (name.startsWith('--_ag-')) continue;
        if (!isContract(name)) bad.push(`${rel(f)}: ${name}`);
      }
    }
    expect([...new Set(bad)].sort()).toEqual([]);
  });

  test('--_ag-* names in src are defined in generated css and not public', () => {
    const pub = new Set(manifest().tokens.map((t) => t.cssVar));
    const gen = generatedVars();
    const leaked: string[] = [];
    const missing: string[] = [];
    for (const f of srcFiles) {
      for (const m of readFileSync(f, 'utf8').matchAll(NAME_RE)) {
        const name = m[0];
        if (!name.startsWith('--_ag-')) continue;
        if (pub.has(name)) leaked.push(`${rel(f)}: ${name}`);
        else if (!gen.has(name)) missing.push(`${rel(f)}: ${name}`);
      }
    }
    expect({ leaked, missing }).toEqual({ leaked: [], missing: [] });
  });
});

describe('dist/tokens/manifest.json satisfies TokenManifest (REQ-MAT-04, S-11)', () => {
  test('MANIFEST_TYPES is the contract union', () => {
    expect([listedInUnion, unionListed]).toEqual([true, true]);
    expect(new Set(MANIFEST_TYPES).size).toBe(MANIFEST_TYPES.length);
    expect([...MANIFEST_TYPES].sort()).toEqual(Object.keys(UNION_WITNESS).sort());
  });

  test('every entry type is in the contract union and no entry is ref-tier', () => {
    const m = manifest();
    expect(m.version).toBe(1);
    const union = new Set<string>(MANIFEST_TYPES);
    const badType = m.tokens.filter((t) => !union.has(t.type)).map((t) => `${t.cssVar}: ${t.type}`);
    const badTier = m.tokens.filter((t) => !['sys', 'material', 'comp'].includes(t.tier)).map((t) => `${t.cssVar}: ${t.tier}`);
    expect({ badType, badTier }).toEqual({ badType: [], badTier: [] });
  });

  test('one manifest entry per public variable', () => {
    const vars = manifest().tokens.map((t) => t.cssVar);
    const dupes = vars.filter((v, i) => vars.indexOf(v) !== i);
    const extra = vars.filter((v) => !CONTRACT_AG.has(v)).sort();
    const missing = [...CONTRACT_AG].filter((v) => !vars.includes(v)).sort();
    expect({ dupes, extra, missing }).toEqual({ dupes: [], extra: [], missing: [] });
  });
});
