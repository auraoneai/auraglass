/* @jest-environment node */
/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): fragments.test.ts — seams S-38, S-39, S-43..S-45, S-50.
   Every fragment loads through loadFragments and satisfies its type; deprecation ids are unique
   and use the stream's prefix; codemod ids are in the catalogue.
   loadFragments (an .mjs CONTRACT module) runs in a child `node` process: under
   --experimental-vm-modules Jest evaluates .mjs as native ESM, while the repo transform emits
   CommonJS ("exports is not defined"). The child runs the loader unmodified, exactly as the
   build and lane scripts do. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { relative } from 'node:path';
import { CORE_CODEMODS, AREA_CODEMODS } from '../../src/contracts/fragments';
import type { CodemodMappingFragment, DeprecationFragment } from '../../src/contracts/fragments';
import { ROOT, conform, type Violation } from './_conformance';

const SUITE = 'fragments';
const KINDS = ['deprecations', 'codemods', 'size-budgets', 'perf-budgets', 'lanes',
  'playwright', 'css', 'side-effects', 'review', 'literals-baseline', 'a11y-baseline'] as const;
const PREFIX = { plat: 'DEP-P', mat: 'DEP-M', cmp: 'DEP-C', surf: 'DEP-S', qual: 'DEP-Q' } as const;
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;

type Loaded = Array<{ stream: string; file: string; value: unknown }>;
const script = `import { loadFragments } from './src/contracts/load-fragments.mjs';
const kinds = ${JSON.stringify(KINDS)}; const out = {};
for (const k of kinds) out[k] = await loadFragments(k);
process.stdout.write(JSON.stringify(out));`;
const loaded = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })) as Record<string, Loaded>;
const relFile = (f: string) => relative(ROOT, f).split('\\').join('/');

describe('loadFragments', () => {
  for (const kind of KINDS) {
    it(`loads every stream's ${kind} fragment, sorted by stream order`, () => {
      expect(loaded[kind]!.map((f) => f.stream)).toEqual([...STREAMS]);
    });
  }

  it('array-kind fragments are arrays; object-kind fragments are objects', () => {
    const v: Violation[] = [];
    const OBJECT_KINDS = new Set(['codemods', 'literals-baseline', 'a11y-baseline']);
    for (const kind of KINDS) {
      for (const f of loaded[kind]!) {
        const ok = OBJECT_KINDS.has(kind) ? f.value !== null && typeof f.value === 'object' : Array.isArray(f.value);
        if (!ok) v.push({ seam: 'S-45', file: relFile(f.file), detail: `${kind} fragment default export has the wrong shape (${Array.isArray(f.value) ? 'array' : typeof f.value})` });
      }
    }
    conform(SUITE, 'shape', v);
  });

  it('deprecation ids are unique and prefixed by stream', () => {
    const ids = new Map<string, string>();
    const v: Violation[] = [];
    for (const { stream, file, value } of loaded.deprecations!) {
      for (const e of value as DeprecationFragment) {
        if (!e.id.startsWith(PREFIX[stream as keyof typeof PREFIX])) v.push({ seam: 'S-38', file: relFile(file), detail: `${e.id} does not use the ${PREFIX[stream as keyof typeof PREFIX]} prefix` });
        if (ids.has(e.id)) v.push({ seam: 'S-38', file: relFile(file), detail: `${e.id} also declared in ${ids.get(e.id)}` });
        ids.set(e.id, relFile(file));
      }
    }
    conform(SUITE, 'deprecation-ids', v);
  });

  it('codemod ids are in the catalogue; renames name a target', () => {
    const catalog = new Set<string>([...CORE_CODEMODS, ...Object.keys(AREA_CODEMODS)]);
    const v: Violation[] = [];
    for (const { file, value } of loaded.codemods!) {
      const frag = value as CodemodMappingFragment;
      for (const a of frag.areaTransforms ?? []) if (!catalog.has(a.id)) v.push({ seam: 'S-39', file: relFile(file), detail: `area transform ${a.id} is not in the codemod catalogue` });
      for (const r of frag.renames ?? []) if (!r.to) v.push({ seam: 'S-39', file: relFile(file), detail: `rename of ${r.from} has no target` });
    }
    conform(SUITE, 'codemod-ids', v);
  });
});
