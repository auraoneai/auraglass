// Planning copy of the ordered file-ownership table in AURAGLASS_5_CONTRACTS.md §3.2
// (first match wins, picomatch syntax, dot: true). The C0 machine form is
// contracts/ownership.json; this module exists so the planning tools in this directory
// (build-tasklist.mjs, relocate-archived-paths.mjs) can check task fragments today.
// Rows apply on `next`. On `release/4.x` PLAT owns every path except other streams'
// fragments, CI fragments and row group H (contract §2.4.1).
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const picomatch = createRequire(join(repo, 'package.json'))('picomatch');

export const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
const S = (s) => s.toUpperCase();
const D02_KINDS = '{a11y/apg,a11y/manual/records,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}';
const D02_KINDS_DIRECT = '{a11y/apg,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}';

/** @type {[string, string | string[], string][]} [row, globs, owner] */
const ROWS = [
  ['A01', 'docs/auraglass-5/AURAGLASS_5_CONTRACTS.md', 'CONTRACT'],
  ['A02', 'src/contracts/**', 'CONTRACT'],
  ['A03', 'contracts/**', 'CONTRACT'],
  ['A04', 'tests/contract-doubles/**', 'CONTRACT'],
  ['A05', '.github/CODEOWNERS', 'CONTRACT'],
  ['A06', ['src/index.ts', 'src/compat/index.ts', 'src/root/index.ts'], 'CONTRACT'],
  ['A07', 'src/root/cmp.ts', 'CMP'],
  ['A07', 'src/root/surf.ts', 'SURF'],
  ['A07', 'src/root/mat.ts', 'MAT'],
  ...STREAMS.map((s) => ['A08-12', [`fragments/*/${s}.{ts,json}`, `fragments/*/${s}/**`], S(s)]),
  ['A13', '.changeset/config.json', 'CONTRACT'],
  ...STREAMS.map((s) => ['A14', `.changeset/${s}-*.md`, S(s)]),
  ...STREAMS.map((s) => ['A15', `lint/rules/${s}/**`, S(s)]),
  ...STREAMS.map((s) => ['A16', `stories/${s}/**`, S(s)]),
  ...STREAMS.map((s) => ['A17', `apps/docs/content/${s}/**`, S(s)]),
  ['A18', 'docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md', 'PLAT'],
  ['A18', 'docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md', 'MAT'],
  ['A18', 'docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md', 'CMP'],
  ['A18', 'docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md', 'SURF'],
  ['A18', 'docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md', 'QUAL'],
  ...['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL'].map((k) => ['A18', `docs/auraglass-5/tasks/${k}.json`, k]),
  ['A19', '.gitlab-ci.yml', 'PLAT'],
  ...STREAMS.map((s) => ['A20', [`ci/${s}.gitlab-ci.yml`, `ci/${s}/**`], S(s)]),
  ['B01', 'legacy/**', 'PLAT'],
  ['B02', ['package.json', 'package-lock.json'], 'PLAT'],
  ['B03', 'tsconfig.storybook.json', 'QUAL'],
  ['B04', ['tsconfig*.json', 'tsdown.config.ts', 'rollup.config.js', 'vite.config.ts', 'api-extractor.base.json', '.dependency-cruiser.js', '.npmignore', '.gitignore', '.prettierrc', '.husky/**', '.bundlesizerc', '.lighthouserc.js', '.dockerignore', '.env.example', '.eslintignore', 'patches/**'], 'PLAT'],
  ['B05', ['eslint.config.js', 'eslint-plugin-auraglass.js', '.eslintrc.js'], 'PLAT'],
  ['B06', 'stylelint.showcase.config.mjs', 'QUAL'],
  ['B07', ['stylelint.config.mjs', 'stylelint-plugin-auraglass/**'], 'MAT'],
  ['B08', ['jest.config.js', 'jest.*.config.js', 'jest.setup.js', 'playwright.config.ts', 'playwright.*.config.ts', 'vitest.storybook.config.ts', '__mocks__/**'], 'QUAL'],
  ['B09-10', '.storybook/**', 'QUAL'],
  ['B11', '.github/workflows/**', 'PLAT'],
  ['B12', '.github/**', 'PLAT'],
  ['B12a', '.gitlab/**', 'PLAT'],
  ['B13', 'deprecations.json', 'PLAT'],
  ['B14', ['CHANGELOG.md', 'README*.md', 'RELEASE_NOTES_*.md', 'SECURITY.md', 'INSTALLATION.md', 'CONTRIBUTING.md', 'LICENSE', 'llms.txt'], 'PLAT'],
  ['B15-16', 'build/**', 'PLAT'],
  ['B17-18', ['docs/dependency-allowlist.json', 'docs/size-budgets.json'], 'PLAT'],
  ['B19', 'docs/certification/**', 'QUAL'],
  ['B20', 'docs/{motion,design-tokens}.md', 'MAT'],
  ['B20a', ['docs/auraglass-5/capability-ledger.json', 'docs/auraglass-5/capability-ledger.schema.json'], 'SURF'],
  ['B21', 'docs/**', 'PLAT'],
  ['B22a', 'etc/api/{material,theme,tokens,motion}.{api.md,exports.json,css-api.json}', 'MAT'],
  ['B22a', 'etc/api/{primitives,icons,forms}.{api.md,exports.json,css-api.json}', 'CMP'],
  ['B22a', 'etc/api/{app-shell,data,date,ai,media,backdrops,three,charts}.{api.md,exports.json,css-api.json}', 'SURF'],
  ['B22a', 'etc/api/cli.{api.md,exports.json,css-api.json}', 'PLAT'],
  ...STREAMS.map((s) => ['B22a', [`etc/api/root.${s}.api.md`, `etc/api/compat.${s}.api.md`], S(s)]),
  ['B22', 'etc/api/**', 'PLAT'],
  ...STREAMS.map((s) => ['B23a', [`canaries/next16/app/${s}/**`, `canaries/vite/src/${s}/**`, `canaries/*/fixtures/${s}/**`], S(s)]),
  ['B23', 'canaries/**', 'PLAT'],
  ['B24-25', ['bin/**', 'server/**', 'Dockerfile', 'docker-compose*.yml', 'nginx.conf', '*.mjs', 'reports/**', 'visual-baselines/**', 'examples/**'], 'PLAT'],
  ['C01', ['src/material/**', 'src/tokens/**', 'src/theme/**', 'src/a11y/**', 'src/motion/**', 'src/styles/**', 'src/hooks/**'], 'MAT'],
  ['C02', 'src/compat/mat/**', 'MAT'],
  ['C03', ['src/foundation/**', 'src/primitives/**', 'src/icons/**', 'src/forms/**'], 'CMP'],
  ['C04', 'src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition,timeline}/**', 'SURF'],
  ['C05', 'src/components/**', 'CMP'],
  ['C06', 'src/compat/cmp/**', 'CMP'],
  ['C07', 'src/{app-shell,data,date,ai,media,backdrops,charts,three}/**', 'SURF'],
  ['C08', 'src/compat/surf/**', 'SURF'],
  ['C09', ['src/internal/**', 'src/compat/plat/**', 'src/compat/css/**'], 'PLAT'],
  ['C11', 'src/**', 'PLAT'],
  ['D01', ['tests/contract/**', 'tests/helpers/**', 'tests/a11y/apg/harness.ts', 'tests/a11y/apg/__selftest__/**', 'tests/a11y/browser/**', 'tests/storybook/**', 'tests/showcase/**'], 'QUAL'],
  ...STREAMS.map((s) => ['D02', `tests/${D02_KINDS}/${s}/**`, S(s)]),
  ['D02x', [`tests/${D02_KINDS}/*/**`, `tests/${D02_KINDS_DIRECT}/*`], 'NONE'],
  ...STREAMS.map((s) => ['D03', `tests/fixtures/consumer-4x/cases/${s}/**`, S(s)]),
  ['D04', 'tests/fixtures/consumer-4x/**', 'PLAT'],
  ['D05', ['tests/perf/**', 'tests/fixtures/**', 'tests/visual/**', 'tests/e2e/**'], 'QUAL'],
  ['D06', 'tests/{material,tokens,motion,theme,a11y}/**', 'MAT'],
  ['D07', 'tests/{controls,overlays,foundation,primitives,icons,compiler}/**', 'CMP'],
  ['D08', 'tests/{app-shell,data,date,ai,media,backdrops,charts,labs,capability}/**', 'SURF'],
  ['D09', 'tests/{release,build,deps,pack,ci,dx,exports,side-effects,react19,css,removal,registry,compat,deprecations,docs}/**', 'PLAT'],
  ['D10', 'tests/**', 'QUAL'],
  ['E01', 'scripts/tokens/**', 'MAT'],
  ['E02', ['scripts/storybook/**', 'scripts/audit/**'], 'QUAL'],
  ...['mat', 'cmp', 'surf', 'qual'].map((s) => ['E03', `scripts/${s}/**`, S(s)]),
  ['E04', 'scripts/**', 'PLAT'],
  ['F01', 'packages/qa/**', 'QUAL'],
  ['F02', 'packages/labs/**', 'SURF'],
  ['F03', 'packages/{cli,registry,mcp}/**', 'PLAT'],
  ['F04', 'apps/docs/**', 'PLAT'],
  ['F05', ['registry/blocks/{app-frame,ai-workspace,data-workspace,analytics-dashboard,media-viewer,support-inbox,mobile-settings,commerce-cart,commerce-checkout,pricing,audit-log,permissions-matrix}/**', 'registry/items/{ai-*,app-shell-workspace,backdrop-hero,comment-thread,faceted-search,presence-stack,query-builder,schema-viewer,tree-select,media-*}/**'], 'SURF'],
  ['F05', ['registry/blocks/overlay-flows/**', 'registry/items/{account-menu,confirm-dialog}/**'], 'CMP'],
  ['F06', 'registry/**', 'PLAT'],
  ['F07', 'showcase/**', 'QUAL'],
  ['F08', 'certification/**', 'QUAL'],
  ['F09', 'tokens/**', 'MAT'],
  ['Z01', '**', 'PLAT'],
];

const compiled = ROWS.map(([row, globs, owner]) => ({ row, owner, test: picomatch([].concat(globs), { dot: true }) }));

/** Owner of a concrete repo-relative path (directories may end with "/"). */
export function ownerOf(path) {
  let p = path.replace(/^\.\//, '');
  if (p.endsWith('/')) p += '__dir__';
  for (const r of compiled) if (r.test(p)) return { owner: r.owner, row: r.row };
  return { owner: 'PLAT', row: 'Z01' };
}

/** Expand `{a,b}` braces (nested allowed) into concrete strings. */
export function expandBraces(s) {
  const m = s.match(/\{([^{}]*)\}/);
  if (!m) return [s];
  return m[1].split(',').flatMap((alt) => expandBraces(s.slice(0, m.index) + alt + s.slice(m.index + m[0].length)));
}

/** Split a task `file` field into path entries (NEW: prefix and trailing notes removed). */
export function filesOf(field) {
  return String(field ?? '')
    .split(/;\s*|,\s+(?![^{]*\})|\n/)
    .map((f) => f.replace(/^\s*(NEW|MODIFY|DELETE|REMOVE)\s*:\s*/i, '').replace(/\s+\(.*$/, '').replace(/`/g, '').trim())
    .filter((f) => f && f !== 'n/a' && !/\s/.test(f));
}

/** Owners of every concrete expansion of a file entry (globs resolved by their literal prefix). */
export function ownersOfEntry(entry) {
  return [...new Set(expandBraces(entry).map((p) => ownerOf(p.replace(/\*\*.*$/, '__any__/__any__').replace(/\*/g, '__any__')).owner))];
}
