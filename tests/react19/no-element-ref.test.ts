/* @jest-environment node */
/* REQ-PLAT-72 (PLAT-271): 0 reads of `element.ref` (the React ≤18 element
   field) in all of src/ — React 19 moves ref onto props (`el.props.ref`).
   Type-checked: a `.ref` / `['ref']` read counts when its object is a React
   element or untyped (any/unknown); plain objects that carry a `ref` field
   (props bags, react-hook-form fields, data chunks) are not element reads. */
import { describe, expect, it } from '@jest/globals';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../build/helpers';
import { elementRefReads, srcFiles } from '../../scripts/ci/lib/react19-gate.mjs';

describe('react 19: no element.ref reads (PLAT-271)', () => {
  it('flags element.ref reads on elements and untyped values, not props.ref or data fields', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-react19-elref-'));
    try {
      const file = join(dir, 'fixture.tsx');
      writeFileSync(file, [
        "import * as React from 'react';",
        'declare const el: React.ReactElement<{ ref?: React.Ref<HTMLDivElement> }>;',
        'declare const loose: any;',
        '// @ts-expect-error React 19 types have no ReactElement.ref — the read is what the gate catches',
        'const a = el.ref;',
        'const b = loose.ref;',
        "const c = loose['ref'];",
        'const d = el.props.ref;',
        'const chunk = { ref: "x" }; const e = chunk.ref;',
        'const props: { ref?: unknown } = {}; props.ref = null;',
        'export { a, b, c, d, e };',
      ].join('\n'));
      const hits = elementRefReads(dir, [file], {
        jsx: 4 /* react-jsx */, strict: true, noEmit: true, skipLibCheck: true, types: [],
        baseUrl: ROOT, paths: { react: [join(ROOT, 'node_modules/@types/react/index.d.ts')] },
      });
      expect(hits).toEqual(['fixture.tsx:5 el.ref', 'fixture.tsx:6 loose.ref', "fixture.tsx:7 loose['ref']"]);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);

  it('0 element.ref reads in all of src/', () => {
    expect(elementRefReads(ROOT, srcFiles(ROOT))).toEqual([]);
  }, 120_000);
});
