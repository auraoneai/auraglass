/**
 * @jest-environment node
 */
/* tests/docs/docs-imports.test.ts — REQ-PLAT-102 (PLAT-384 / DX-108). No docs
   snippet (apps/docs/examples/**, ts/tsx/jsx fences in apps/docs/content/**,
   docs/quickstart/**, docs/guides/**, README.md) imports `@/…`, a relative
   `src/` path, `@aura/glass` or an `aura-glass` subpath absent from the
   package.json exports map. Current offenders are excused only by the PRD-F
   §4.3 rule 3 expiring baseline scripts/integration/baselines/docs-imports.json. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { banReason, exportedSpecifiers, findViolations, importsOf } from '../../scripts/docs/check-docs-imports.mjs';
import { applyBaseline, loadBaseline, packageVersion } from '../../scripts/docs/lib/baseline.mjs';
import type { Snippet } from '../../scripts/docs/compile-snippets.mjs';

const REPO = join(__dirname, '..', '..');
const pkg = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')) as { name: string; exports: Record<string, unknown> };
const exported = exportedSpecifiers(pkg);

describe('ban rules', () => {
  it('derives specifiers from the real exports map', () => {
    expect(exported.has('aura-glass')).toBe(true);
    expect(exported.has('aura-glass/theme')).toBe(true);
    expect(exported.has('aura-glass/styles.css')).toBe(true);
    expect(exported.has('aura-glass/src')).toBe(false);
  });
  it.each([
    ['@/primitives', /path alias/],
    ['@/utils/focus', /path alias/],
    ['../src', /relative `src\/`/],
    ['../../src/components/button', /relative `src\/`/],
    ['./src/index', /relative `src\/`/],
    ['@aura/glass', /@aura\/glass/],
    ['@aura/glass/theme', /@aura\/glass/],
    ['aura-glass/styles', /not in the aura-glass exports map/],
    ['aura-glass/dist/index.js', /not in the aura-glass exports map/],
    ['aura-glass/internal', /not in the aura-glass exports map/],
  ])('bans %s', (spec, reason) => {
    expect(banReason(spec, exported, pkg.name)).toMatch(reason);
  });
  it.each(['aura-glass', 'aura-glass/theme', 'aura-glass/styles.css', 'react', '@auraglass/registry', './Button', '../example/data'])('allows %s', (spec) => {
    expect(banReason(spec, exported, pkg.name)).toBeNull();
  });
  it('honours export-map patterns', () => {
    const withPattern = exportedSpecifiers({ name: 'aura-glass', exports: { '.': './i.js', './icons/*': './icons/*.js' } });
    expect(banReason('aura-glass/icons/Check', withPattern)).toBeNull();
    expect(banReason('aura-glass/iconsX', withPattern)).toMatch(/exports map/);
  });
  it('reads static, re-export, dynamic and require imports', () => {
    expect(importsOf("import a from 'x';\nexport { b } from 'y';\nconst c = await import('z');\nconst d = require('w');").sort()).toEqual(['w', 'x', 'y', 'z']);
  });
});

describe('findViolations', () => {
  it('reports each banned import of a seeded snippet set with file and line', () => {
    const snippets: Snippet[] = [
      { source: 'docs/guides/a.md', line: 4, lang: 'tsx', fragment: false, code: "import { Button } from '@/components';\nimport { theme } from 'aura-glass/theme';" },
      { source: 'apps/docs/examples/button/basic.tsx', line: 1, lang: 'tsx', fragment: false, code: "import x from '../../../src/index';", example: true },
      { source: 'README.md', line: 9, lang: 'tsx', fragment: true, code: "import { Glass } from '@aura/glass';\n<Glass />" },
    ];
    expect(findViolations({ root: REPO, snippets, pkg }).map((v) => `${v.file}:${v.line} ${v.specifier}`)).toEqual([
      'docs/guides/a.md:4 @/components',
      'apps/docs/examples/button/basic.tsx:1 ../../../src/index',
      'README.md:9 @aura/glass',
    ]);
  });
});

describe('repository', () => {
  it('has 0 banned imports outside unexpired baseline rows, and no stale or expired row', () => {
    const found = findViolations({ root: REPO });
    const { rows } = loadBaseline(REPO, 'docs-imports');
    const { blocking, errors } = applyBaseline(found, rows, packageVersion(REPO));
    expect(errors).toEqual([]);
    expect(blocking.map((v) => `${v.file}:${v.line} '${v.specifier}' — ${v.reason}`)).toEqual([]);
  });
});
