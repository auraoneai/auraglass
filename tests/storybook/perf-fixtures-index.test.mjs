/** @jest-environment node */
/* tests/storybook/perf-fixtures-index.test.mjs — REQ-QUAL-35: the Storybook index contains the six perf fixture ids.
   Index source: storybook-static/index.json when a Storybook build is present (qual:certify:l10 runs after
   qual:build:storybook and sets AG_STORYBOOK_STATIC); otherwise Storybook's own index generator (buildIndex over
   .storybook/main.ts), which is the code `storybook build` uses to write index.json. When AG_STORYBOOK_STATIC is set
   the built index is mandatory. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';

const ROOT = process.cwd();
export const PERF_FIXTURE_IDS = [
  'perf-harness-blank--default', 'perf-nesting--nest-4', 'perf-budget--budget-7',
  'perf-lens--lens-3', 'perf-webgl--webgl-3', 'perf-mount-cycle--default',
];

async function loadIndex() {
  const staticDir = process.env.AG_STORYBOOK_STATIC ?? join(ROOT, 'storybook-static');
  const file = join(staticDir, 'index.json');
  if (process.env.AG_STORYBOOK_STATIC && !existsSync(file)) {
    throw new Error(`AG_STORYBOOK_STATIC=${process.env.AG_STORYBOOK_STATIC} but ${file} does not exist (qual:build:storybook artifact missing)`);
  }
  if (existsSync(file)) return { source: file, index: JSON.parse(readFileSync(file, 'utf8')) };
  /* storybook/internal/core-server registers test hooks when loaded inside jest, so the indexer runs in a child node. */
  const script = `require(${JSON.stringify(createRequire(join(ROOT, 'package.json')).resolve('storybook/internal/core-server'))})
    .buildIndex({ configDir: ${JSON.stringify(join(ROOT, '.storybook'))} })
    .then((i) => process.stdout.write(JSON.stringify(i)), (e) => { console.error(e); process.exit(1); });`;
  const r = spawnSync(process.execPath, ['-e', script], { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`Storybook buildIndex failed (exit ${r.status}):\n${r.stderr}`);
  return { source: 'buildIndex(.storybook)', index: JSON.parse(r.stdout) };
}

describe('perf fixtures in the Storybook index (REQ-QUAL-35)', () => {
  it('contains all six stable fixture ids as stories from stories/qual/perf/PerfFixtures.stories.tsx', async () => {
    const { source, index } = await loadIndex();
    const entries = index.entries ?? {};
    const found = PERF_FIXTURE_IDS.map((id) => ({ id, entry: entries[id] }));
    const missing = found.filter((f) => !f.entry).map((f) => f.id);
    expect({ source, missing }).toEqual({ source, missing: [] });
    for (const { id, entry } of found) {
      expect({ id, type: entry.type }).toEqual({ id, type: 'story' });
      expect(entry.importPath).toBe('./stories/qual/perf/PerfFixtures.stories.tsx');
      expect(entry.tags).toEqual(expect.arrayContaining(['lab', 'no-cert']));
    }
  }, 120_000);

  it('the fixture file defines no story outside the six ids (a rename is a schema bump)', async () => {
    const { index } = await loadIndex();
    const fromFile = Object.values(index.entries ?? {})
      .filter((e) => e.type === 'story' && e.importPath === './stories/qual/perf/PerfFixtures.stories.tsx')
      .map((e) => e.id)
      .sort();
    expect(fromFile).toEqual([...PERF_FIXTURE_IDS].sort());
    const schema = JSON.parse(readFileSync(join(ROOT, 'tests/perf/harness/perf-results.schema.json'), 'utf8'));
    expect([...schema.$defs.fixtureId.enum].sort()).toEqual([...PERF_FIXTURE_IDS].sort());
  }, 120_000);
});
