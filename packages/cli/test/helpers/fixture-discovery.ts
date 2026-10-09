/** Shared fixture discovery (REQ-PLAT-91): fragments/codemods/<stream>/fixtures/
 *  <id>/<case>/ for every stream + packages/cli/src/migrate/4to5/__fixtures__/. */
import fs from 'node:fs';
import path from 'node:path';
const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
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

export interface FixtureCase { stream: string; group: string; name: string; input: string; output: string; transform: string; pending?: string }

const CLI_FIXTURES = path.resolve(__dirname, '..', '..', 'src', 'migrate', '4to5', '__fixtures__');
// Transforms the engine actually ships; unknown ids are reported pending, not
// silently re-targeted (REQ-PLAT-91).
const KNOWN_TRANSFORMS = new Set<string>([
  'imports-subpaths', 'providers', 'canonical-names', 'prop-grammar',
  'ai-chat', 'app-shell-slots', 'media-backdrops',
  'reduced-motion-initial', 'motion-imports', 'motion-props',
  'dead-optical-props', 'css-vars', 'deps', 'removed',
]);

function collect(cases: FixtureCase[], stream: string, fxDir: string): void {
  if (!fs.existsSync(fxDir)) return;
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
      const pending = fs.existsSync(pendingFile)
        ? fs.readFileSync(pendingFile, 'utf8').trim()
        : (!KNOWN_TRANSFORMS.has(transform) ? `unknown transform id '${transform}' (fixture group '${group}')` : undefined);
      cases.push({
        stream, group, name, input, output, transform,
        ...(pending ? { pending } : {}),
      });
    }
  }
}

export function discoverFixtures(): FixtureCase[] {
  const cases: FixtureCase[] = [];
  // packages/cli-owned fixtures: src/migrate/4to5/__fixtures__/<id>/<case>/
  collect(cases, 'cli', CLI_FIXTURES);
  if (!fs.existsSync(fixturesBase)) return cases;
  for (const stream of fs.readdirSync(fixturesBase).filter((x) => fs.statSync(path.join(fixturesBase, x)).isDirectory()).sort()) {
    collect(cases, stream, path.join(fixturesBase, stream, 'fixtures'));
  }
  return cases;
}
