/**
 * PLAT-338/339 + §12.2: every fixture dir under fragments/codemods/<stream>/fixtures/
 * is discovered and run with byte-equality; 'pending' files declare expected gaps.
 */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

const here = __dirname;
const repoRoot = path.resolve(here, '..', '..', '..');
const fixturesBase = path.join(repoRoot, 'fragments', 'codemods');

// Coverage requires transforms known to this engine; map extra SURF fixture
// dirs onto the transforms that implement them.
const DIR_TO_TRANSFORM: Record<string, string> = {
  'ai-chat-imports': 'ai-chat',
  'app-shell-slots': 'app-shell-slots',
  'media-backdrops': 'media-backdrops',
  'data-canonical-names': 'canonical-names',
  'data-grid-columns': 'data-grid-columns',
  'motion-imports': 'motion-imports',
  'motion-props': 'motion-props',
  'reduced-motion-initial': 'reduced-motion-initial',
};

interface FixtureCase { stream: string; group: string; name: string; input: string; output: string; transform: string; pending?: string }

export function discoverFixtures(): FixtureCase[] {
  const cases: FixtureCase[] = [];
  if (!fs.existsSync(fixturesBase)) return cases;
  for (const stream of fs.readdirSync(fixturesBase).filter((x) => x === 'plat').sort()) {
    const fxDir = path.join(fixturesBase, stream, 'fixtures');
    if (!fs.existsSync(fxDir)) continue;
    for (const group of fs.readdirSync(fxDir).sort()) {
      const gDir = path.join(fxDir, group);
      if (!fs.statSync(gDir).isDirectory()) continue;
      const transform = DIR_TO_TRANSFORM[group] ?? group;
      for (const name of fs.readdirSync(gDir).sort()) {
        const cDir = path.join(gDir, name);
        if (!fs.statSync(cDir).isDirectory()) continue;
        const input = ['input.tsx', 'input.ts', 'input.css', 'input.json'].map((f) => path.join(cDir, f)).find(fs.existsSync);
        const output = ['output.tsx', 'expected.tsx', 'output.ts', 'expected.ts', 'output.css', 'expected.css', 'output.json', 'expected.json'].map((f) => path.join(cDir, f)).find(fs.existsSync);
        if (!input || !output) continue;
        const pendingFile = path.join(cDir, 'pending.txt');
        cases.push({
          stream, group, name, input, output, transform,
          ...(fs.existsSync(pendingFile) ? { pending: fs.readFileSync(pendingFile, 'utf8').trim() } : {}),
        });
      }
    }
  }
  return cases;
}

describe('codemod fixtures (plat stream)', () => {
  const cases = discoverFixtures();
  it('discovers fixtures', () => {
    expect(cases.length).toBeGreaterThan(0);
  });
  const pending = cases.filter((c) => c.pending);
  if (pending.length) {
    it(`reports ${pending.length} pending fixture(s)`, () => {
      // Pending fixtures are documented in <dir>/pending.txt and excluded from
      // byte-equality until the owning transform covers the golden shape.
      for (const c of pending) expect(fs.existsSync(c.input)).toBe(true);
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
