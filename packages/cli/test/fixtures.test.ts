/**
 * REQ-FIN-09 (was PLAT-338/339 + CMP-134): every fixture case under
 * fragments/codemods/<every stream>/fixtures/<id>/<case>/ and
 * packages/cli/src/migrate/4to5/__fixtures__/ is discovered and run with
 * byte-equality + idempotence. 'pending.txt' declares expected gaps; a
 * fixture id that maps to no registered transform is reported 'pending'
 * with the reason — never silently skipped.
 */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { TRANSFORM_ORDER } from '../src/migrate/4to5/index.js';

const here = __dirname;
const repoRoot = path.resolve(here, '..', '..', '..');
const fixturesBase = path.join(repoRoot, 'fragments', 'codemods');
const cliFixturesBase = path.join(repoRoot, 'packages', 'cli', 'src', 'migrate', '4to5', '__fixtures__');

// Fixture ids whose owning transform has a different registry name.
const DIR_TO_TRANSFORM: Record<string, string> = {
  'ai-chat-imports': 'ai-chat',
  'data-canonical-names': 'canonical-names',
  'canonical-names': 'canonical-names',
};

const KNOWN_TRANSFORMS = new Set<string>(TRANSFORM_ORDER);

interface FixtureCase {
  base: 'fragments' | 'cli';
  stream: string;
  group: string;
  name: string;
  input: string;
  output: string;
  transform: string;
  pending?: string;
}

const INPUT_NAMES = ['input.tsx', 'input.ts', 'input.css', 'input.json'];
const OUTPUT_NAMES = ['output.tsx', 'expected.tsx', 'output.ts', 'expected.ts', 'output.css', 'expected.css', 'output.json', 'expected.json'];

function scanDir(base: 'fragments' | 'cli', stream: string, fxDir: string, cases: FixtureCase[]) {
  for (const group of fs.readdirSync(fxDir).sort()) {
    const gDir = path.join(fxDir, group);
    if (!fs.statSync(gDir).isDirectory()) continue;
    const transform = DIR_TO_TRANSFORM[group] ?? group;
    for (const name of fs.readdirSync(gDir).sort()) {
      const cDir = path.join(gDir, name);
      if (!fs.statSync(cDir).isDirectory()) continue;
      const input = INPUT_NAMES.map((f) => path.join(cDir, f)).find(fs.existsSync);
      const output = OUTPUT_NAMES.map((f) => path.join(cDir, f)).find(fs.existsSync);
      if (!input || !output) continue;
      const pendingFile = path.join(cDir, 'pending.txt');
      const pending = fs.existsSync(pendingFile)
        ? fs.readFileSync(pendingFile, 'utf8').trim()
        : KNOWN_TRANSFORMS.has(transform)
          ? undefined
          : `unknown transform id '${transform}' — no registered codemod (pending until the stream's REQ lands)`;
      cases.push({ base, stream, group, name, input, output, transform, ...(pending ? { pending } : {}) });
    }
  }
}

export function discoverFixtures(): FixtureCase[] {
  const cases: FixtureCase[] = [];
  // every stream directory under fragments/codemods/ (plat, cmp, mat, surf, qual, …)
  if (fs.existsSync(fixturesBase)) {
    for (const stream of fs.readdirSync(fixturesBase).sort()) {
      const fxDir = path.join(fixturesBase, stream, 'fixtures');
      if (!fs.existsSync(fxDir) || !fs.statSync(fxDir).isDirectory()) continue;
      scanDir('fragments', stream, fxDir, cases);
    }
  }
  // engine-private fixtures shipped inside the cli package
  if (fs.existsSync(cliFixturesBase) && fs.statSync(cliFixturesBase).isDirectory()) {
    scanDir('cli', 'cli', cliFixturesBase, cases);
  }
  return cases;
}

describe('codemod fixtures (all streams)', () => {
  const cases = discoverFixtures();
  const streams = [...new Set(cases.map((c) => c.stream))].sort();
  it('discovers >=120 cases across every codemod stream', () => {
    expect(cases.length).toBeGreaterThanOrEqual(120);
    expect(streams).toContain('plat');
    expect(streams).toContain('cmp');
    expect(streams).toContain('mat');
  });
  const pending = cases.filter((c) => c.pending);
  if (pending.length) {
    it(`reports ${pending.length} pending fixture(s) with reasons`, () => {
      for (const c of pending) {
        // each pending case carries a human-readable reason (pending.txt or unknown transform)
        expect(typeof c.pending).toBe('string');
        expect(c.pending!.length).toBeGreaterThan(0);
        expect(fs.existsSync(c.input)).toBe(true);
      }
    });
  }
  for (const c of cases.filter((c) => !c.pending)) {
    const label = `${c.stream}/${c.group}/${c.name}`;
    it(label, async () => {
      const { runOnSource, selectTransforms, loadCompiledMappings } = await import('../src/migrate/4to5/index.js');
      const mappings = loadCompiledMappings();
      const source = fs.readFileSync(c.input, 'utf8');
      const kind = c.input.endsWith('.css') ? 'css' : c.input.endsWith('.json') ? 'json' : 'code';
      const r = runOnSource(
        { path: path.basename(c.input), abs: c.input, kind, source },
        selectTransforms([c.transform]),
        { mappings, docBase: 'docs' },
      );
      const gold = fs.readFileSync(c.output, 'utf8');
      // idempotence: transform(output) === output
      const r2 = runOnSource(
        { path: path.basename(c.output), abs: c.output, kind, source: gold },
        selectTransforms([c.transform]),
        { mappings, docBase: 'docs' },
      );
      expect(r2.final).toBe(gold);
      expect(r.final).toBe(gold);
    });
  }
});
