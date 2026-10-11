/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): layers.test.ts — seams S-04 and S-45 (css).
   Every CSS file starts with LAYER_ORDER_STATEMENT, has zero !important, and (source files) puts
   all its rules inside exactly one `@layer <name> { … }` block equal to its fragments/css
   declaration. Checked on every src/**\/*.css (contract §4.3: every source sheet is self-layered)
   and on every shipped dist/**\/*.css when a build is present. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CssFragment } from '../../src/contracts/fragments';
import { CSS_LAYERS, LAYER_ORDER_STATEMENT } from '../../src/contracts/tokens';
import { ROOT, conform, distDir, rel, walk, type Violation } from './_conformance';
import { checkLayerFile, topLevelLayerBlocks } from './_checks';

const SUITE = 'layers';
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;

function cssDeclarations(): { rows: Map<string, { layer: string; stream: string }>; dupes: Violation[] } {
  const rows = new Map<string, { layer: string; stream: string }>();
  const dupes: Violation[] = [];
  for (const s of STREAMS) {
    const frag = (require(join(ROOT, 'fragments', 'css', `${s}.ts`)) as { default: CssFragment[] }).default;
    for (const row of frag) {
      if (rows.has(row.file)) dupes.push({ seam: 'S-45', file: `fragments/css/${s}.ts`, detail: `${row.file} is declared twice (also in fragments/css/${rows.get(row.file)!.stream}.ts)` });
      rows.set(row.file, { layer: row.layer, stream: s });
    }
  }
  return { rows, dupes };
}

describe('S-04 layer statement', () => {
  it('the frozen statement lists CSS_LAYERS in order', () => {
    expect(LAYER_ORDER_STATEMENT).toBe(`@layer ${CSS_LAYERS.join(', ')};`);
  });

  it('topLevelLayerBlocks parses nested rules', () => {
    expect(topLevelLayerBlocks('@layer ag.components { .a { color: red } @media (x) { .b { c: d } } }')).toEqual({ blocks: ['ag.components'], outside: '' });
    expect(topLevelLayerBlocks('.x { a: b } @layer ag.a11y { .y { c: d } }')).toEqual({ blocks: ['ag.a11y'], outside: '.x  ' });
  });
});

describe('S-04 source CSS (src/**/*.css)', () => {
  const files = walk(join(ROOT, 'src'), (n) => n.endsWith('.css')).map(rel);
  const { rows, dupes } = cssDeclarations();

  it('discovers source CSS and fragments/css rows', () => {
    expect(files.length).toBeGreaterThan(20);
    expect(rows.size).toBeGreaterThan(20);
  });

  it('fragments/css declares each file once and only existing files', () => {
    const violations: Violation[] = [...dupes];
    for (const [file, { stream }] of rows) {
      if (!files.includes(file)) violations.push({ seam: 'S-45', file: `fragments/css/${stream}.ts`, detail: `declares ${file}, which does not exist under src/` });
    }
    conform(SUITE, 'fragment-rows', violations);
  });

  it('every source CSS file starts with the statement, has no !important and one declared @layer block', () => {
    const violations: Violation[] = [];
    for (const f of files) violations.push(...checkLayerFile(f, readFileSync(join(ROOT, f), 'utf8'), rows.get(f)?.layer));
    conform(SUITE, 'source', violations);
  });
});

describe('S-04 shipped CSS (dist/**/*.css)', () => {
  it('every shipped CSS file starts with the statement and has no !important', () => {
    const dist = distDir();
    if (dist === null) {
      const pending = conform(SUITE, 'dist', [{ seam: 'S-04', file: 'dist/', owner: 'PLAT',
        detail: 'dist/ is not built in this job (set AURAGLASS_DIST_DIR or run with plat:build:dist artifacts)' }]);
      expect(pending).toHaveLength(1);
      return;
    }
    const files = walk(dist, (n) => n.endsWith('.css'));
    expect(files.length).toBeGreaterThan(0);
    const violations: Violation[] = [];
    for (const f of files) violations.push(...checkLayerFile(rel(f), readFileSync(f, 'utf8'), undefined, { shipped: true }));
    conform(SUITE, 'dist', violations);
  });
});
