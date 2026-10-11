/**
 * @jest-environment node
 */
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): check-build-log.mjs and build.mjs's dist fallback, on fixture trees. */
import { describe, expect, it, afterEach } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { budgetProblems, checkBuild, logProblems, missingStoryFiles } from '../../scripts/storybook/check-build-log.mjs';
import { ensureDist, missingRuntimeExports } from '../../scripts/storybook/build.mjs';
import { BUDGET, parseStoryGlob, storyFiles, STORY_GLOBS } from '../../scripts/storybook/lib/storybook-build.mjs';

const tmps = [];
const tmp = () => { const d = mkdtempSync(join(tmpdir(), 'ag-sb-build-')); tmps.push(d); return d; };
const put = (root, rel, text = '') => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
afterEach(() => { while (tmps.length) rmSync(tmps.pop(), { recursive: true, force: true }); });

const entry = (id, importPath, type = 'story') => ({ id, type, title: id, name: id, importPath });

function fixtureRepo() {
  const root = tmp();
  put(root, 'src/components/button/Button.stories.tsx', 'export default {};');
  put(root, 'src/components/button/Button.mdx', '# Button');
  put(root, 'src/components/button/Button.tsx', 'export {};');
  put(root, 'showcase/ops-console/OpsConsole.stories.tsx', 'export default {};');
  put(root, '.storybook/lab/MaterialLab.stories.tsx', 'export default {};');
  put(root, 'node_modules/x/y.stories.tsx', '');
  return root;
}

function fixtureBuild(root, { entries, log = 'info => Output directory: storybook-static\n', exitCode = 0, durationMs = 90_000 } = {}) {
  const dir = join(root, 'storybook-static');
  const report = join(root, '.artifacts', 'qual', 'qual-build-storybook');
  put(root, 'storybook-static/index.json', JSON.stringify({ v: 5, entries: Object.fromEntries(entries.map((e) => [e.id, e])) }));
  put(root, 'storybook-static/iframe.html', '<html></html>');
  put(root, '.artifacts/qual/qual-build-storybook/storybook-build.log', log);
  put(root, '.artifacts/qual/qual-build-storybook/storybook-build.json', JSON.stringify({ version: 1, out: 'storybook-static', distSource: 'artifact', durationMs, exitCode }));
  return { dir, reportDir: report };
}

const ALL = [
  entry('button--playground', './src/components/button/Button.stories.tsx'),
  entry('button--docs', './src/components/button/Button.mdx', 'docs'),
  entry('showcases-ops-console--full-page', './showcase/ops-console/OpsConsole.stories.tsx'),
  entry('material-lab--regular', './.storybook/lab/MaterialLab.stories.tsx'),
];

describe('story globs (main.ts verbatim)', () => {
  it('parses every main.ts glob and matches only story/MDX files outside node_modules', () => {
    for (const g of STORY_GLOBS) expect(() => parseStoryGlob(g)).not.toThrow();
    expect([...storyFiles(fixtureRepo()).keys()].sort()).toEqual([
      './.storybook/lab/MaterialLab.stories.tsx', './showcase/ops-console/OpsConsole.stories.tsx',
      './src/components/button/Button.mdx', './src/components/button/Button.stories.tsx',
    ]);
  });
});

describe('check-build-log.mjs (REQ-QUAL-56)', () => {
  it('passes a complete build within budget', () => {
    const root = fixtureRepo();
    const { dir, reportDir } = fixtureBuild(root, { entries: ALL });
    const { problems, summary } = checkBuild({ root, dir, reportDir });
    expect(problems).toEqual([]);
    expect(summary.missingStoryFiles).toEqual([]);
  });

  it('fails on a story file the index does not contain (missing story ids)', () => {
    const root = fixtureRepo();
    const { dir, reportDir } = fixtureBuild(root, { entries: ALL.filter((e) => !e.importPath.includes('OpsConsole')) });
    expect(missingStoryFiles(root, { entries: Object.fromEntries(ALL.slice(0, 2).map((e) => [e.id, e])) })).toContain('./showcase/ops-console/OpsConsole.stories.tsx');
    expect(checkBuild({ root, dir, reportDir }).problems).toEqual([
      'missing-story-id: ./showcase/ops-console/OpsConsole.stories.tsx matches a main.ts glob but has no index.json entry',
    ]);
  });

  it('fails on unresolved imports, duplicate story ids and unindexed files in the log (ANSI stripped)', () => {
    const log = [
      '\x1b[31m[vite]: Rollup failed to resolve import "aura-glass/nope" from "/b/showcase/x.tsx".\x1b[39m',
      'WARN Duplicate stories with id: button--playground',
      'Unable to index ./stories/cmp/Broken.stories.tsx',
      'error: Failed to resolve import "../src/missing" from "stories/mat/A.stories.tsx". Does the file exist?',
      'info => Copying static files',
    ].join('\n');
    const ids = logProblems(log).map((p) => p.split(':')[0]);
    expect(ids).toEqual(['unresolved-import', 'duplicate-story-id', 'unindexed-story-file', 'unresolved-import']);
    const root = fixtureRepo();
    const { dir, reportDir } = fixtureBuild(root, { entries: ALL, log });
    expect(checkBuild({ root, dir, reportDir }).problems).toHaveLength(4);
  });

  it('fails a non-zero build exit and missing build reports', () => {
    const root = fixtureRepo();
    const { dir, reportDir } = fixtureBuild(root, { entries: ALL, exitCode: 1 });
    expect(checkBuild({ root, dir, reportDir }).problems).toEqual(['storybook build exited 1']);
    expect(checkBuild({ root, dir, reportDir: join(root, 'nowhere') }).problems[0]).toMatch(/run scripts\/storybook\/build\.mjs first/);
  });

  it('enforces 60 MB excluding maps and 6 minutes', () => {
    expect(budgetProblems({ durationMs: BUDGET.maxBuildMs, bytes: BUDGET.maxBytesExcludingMaps })).toEqual([]);
    expect(budgetProblems({ durationMs: BUDGET.maxBuildMs + 1, bytes: 0 })[0]).toMatch(/budget 6 min/);
    expect(budgetProblems({ durationMs: 0, bytes: BUDGET.maxBytesExcludingMaps + 1 })[0]).toMatch(/budget 60 MB/);
    const root = fixtureRepo();
    const { dir, reportDir } = fixtureBuild(root, { entries: ALL, durationMs: 7 * 60_000 });
    put(root, 'storybook-static/big.js.map', 'x'.repeat(1024)); // maps never count
    const { problems, summary } = checkBuild({ root, dir, reportDir });
    expect(problems).toEqual(['storybook build took 7.00 min (budget 6 min)']);
    expect(summary.bytesExcludingMaps).toBeLessThan(1024);
  });
});

describe('build.mjs dist fallback (REQ-QUAL-56)', () => {
  const pkgRoot = () => {
    const root = tmp();
    put(root, 'package.json', JSON.stringify({ name: 'aura-glass', exports: {
      '.': { types: './dist/index.d.ts', default: './dist/index.js', css: './dist/styles.css' },
      './ai': { types: './dist/ai/index.d.ts', default: './dist/ai/index.js' },
      './styles.css': './dist/styles.css', './package.json': './package.json',
    } }));
    return root;
  };

  it('uses the plat:build:dist artifact when every runtime export exists', () => {
    const root = pkgRoot();
    put(root, 'dist/index.js'); put(root, 'dist/ai/index.js');
    let built = 0;
    expect(ensureDist(root, () => { built++; return 0; })).toBe('artifact');
    expect(built).toBe(0);
  });

  it('runs npm run build when the artifact is absent, and fails if exports are still missing', () => {
    const root = pkgRoot();
    expect(missingRuntimeExports(root)).toEqual(['. → ./dist/index.js', './ai → ./dist/ai/index.js']);
    expect(ensureDist(root, () => { put(root, 'dist/index.js'); put(root, 'dist/ai/index.js'); return 0; })).toBe('built');
    const broken = pkgRoot();
    expect(() => ensureDist(broken, () => { put(broken, 'dist/index.js'); return 0; })).toThrow(/still lacks runtime exports after npm run build: \.\/ai/);
    expect(() => ensureDist(pkgRoot(), () => 2)).toThrow(/npm run build exited 2/);
  });
});
