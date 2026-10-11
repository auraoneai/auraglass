/**
 * REQ-FIN-09 (was PLAT-338/339 + CMP-134): every fixture case under
 * fragments/codemods/<every stream>/fixtures/<id>/<case>/ and
 * packages/cli/src/migrate/4to5/__fixtures__/ is discovered and run with
 * byte-equality + idempotence.
 *
 * Pending states (contract §6.1 / PRD-F §4.3 rule 2-3: a codemod gap is
 * reported `pending`, never blocking, never silently skipped):
 *   - a fixture id that maps to no registered transform is `pending` with the
 *     reason;
 *   - a case the owning stream declares in its own `<case>/pending.txt`;
 *   - a case listed in the expiring cross-stream baseline
 *     scripts/integration/baselines/codemod-fixtures.json
 *     ({file, owner, reqFin, expires: 'RC-1'}; emptied by FIN-464).
 * A pending case with a registered transform is still executed: once the
 * transform produces the golden output the test fails until the pending
 * marker / baseline row is deleted (stale-row check). A baseline row naming
 * no discovered case also fails.
 */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { TRANSFORM_ORDER } from '../src/migrate/4to5/index.js';

const here = __dirname;
const repoRoot = path.resolve(here, '..', '..', '..');
const fixturesBase = path.join(repoRoot, 'fragments', 'codemods');
const cliFixturesBase = path.join(repoRoot, 'packages', 'cli', 'src', 'migrate', '4to5', '__fixtures__');
const baselinePath = path.join(repoRoot, 'scripts', 'integration', 'baselines', 'codemod-fixtures.json');

// Fixture ids whose owning transform has a different registry name.
const DIR_TO_TRANSFORM: Record<string, string> = {
  'ai-chat-imports': 'ai-chat',
  'data-canonical-names': 'canonical-names',
};

const KNOWN_TRANSFORMS = new Set<string>(TRANSFORM_ORDER);

interface BaselineRow { file: string; owner: string; reqFin: string; expires: string }

interface FixtureCase {
  base: 'fragments' | 'cli';
  stream: string;
  group: string;
  name: string;
  /** repo-relative case directory, the key used by the baseline */
  dir: string;
  input: string;
  output: string;
  transform: string;
  /** the case is not expected to match yet; `runnable` = the transform exists */
  pending?: { reason: string; runnable: boolean };
}

const INPUT_NAMES = ['input.tsx', 'input.ts', 'input.css', 'input.json'];
const OUTPUT_NAMES = ['output.tsx', 'expected.tsx', 'output.ts', 'expected.ts', 'output.css', 'expected.css', 'output.json', 'expected.json'];

export function loadBaseline(): BaselineRow[] {
  if (!fs.existsSync(baselinePath)) return [];
  return JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as BaselineRow[];
}

/** Structural problems of baseline rows against the discovered case dirs. */
export function baselineProblems(rows: BaselineRow[], dirs: Set<string>): string[] {
  const problems: string[] = [];
  for (const r of rows) {
    const stream = /^fragments\/codemods\/([^/]+)\/fixtures\//.exec(r.file)?.[1];
    if (!dirs.has(r.file)) problems.push(`${r.file}: no such fixture case (delete the row)`);
    if (!stream || r.owner !== stream.toUpperCase()) problems.push(`${r.file}: owner '${r.owner}' is not the case's stream`);
    if (!/^REQ-FIN-\d+$/.test(r.reqFin)) problems.push(`${r.file}: reqFin '${r.reqFin}' is not a REQ-FIN id`);
    if (r.expires !== 'RC-1') problems.push(`${r.file}: expires must be 'RC-1'`);
  }
  return problems;
}

function scanDir(base: 'fragments' | 'cli', stream: string, fxDir: string, baseline: Map<string, BaselineRow>, cases: FixtureCase[]) {
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
      const dir = path.relative(repoRoot, cDir).split(path.sep).join('/');
      const pendingFile = path.join(cDir, 'pending.txt');
      const row = baseline.get(dir);
      let pending: FixtureCase['pending'];
      if (!KNOWN_TRANSFORMS.has(transform)) {
        pending = { reason: `unknown transform id '${transform}': no registered codemod (pending until the stream's REQ lands)`, runnable: false };
      } else if (fs.existsSync(pendingFile)) {
        pending = { reason: fs.readFileSync(pendingFile, 'utf8').trim() || 'pending.txt', runnable: true };
      } else if (row) {
        pending = { reason: `baseline ${row.owner} ${row.reqFin} expires ${row.expires}`, runnable: true };
      }
      cases.push({ base, stream, group, name, dir, input, output, transform, ...(pending ? { pending } : {}) });
    }
  }
}

export function discoverFixtures(baselineRows: BaselineRow[] = loadBaseline()): FixtureCase[] {
  const baseline = new Map(baselineRows.map((r) => [r.file, r]));
  const cases: FixtureCase[] = [];
  // every stream directory under fragments/codemods/ (plat, cmp, mat, surf, qual, …)
  if (fs.existsSync(fixturesBase)) {
    for (const stream of fs.readdirSync(fixturesBase).sort()) {
      const fxDir = path.join(fixturesBase, stream, 'fixtures');
      if (!fs.existsSync(fxDir) || !fs.statSync(fxDir).isDirectory()) continue;
      scanDir('fragments', stream, fxDir, baseline, cases);
    }
  }
  // engine-private fixtures shipped inside the cli package
  if (fs.existsSync(cliFixturesBase) && fs.statSync(cliFixturesBase).isDirectory()) {
    scanDir('cli', 'cli', cliFixturesBase, baseline, cases);
  }
  return cases;
}

/** Runs the case's transform on input and on the golden output (idempotence). */
async function runCase(c: FixtureCase): Promise<{ gold: string; final: string; reapplied: string }> {
  const { runOnSource, selectTransforms, loadCompiledMappings } = await import('../src/migrate/4to5/index.js');
  const mappings = loadCompiledMappings();
  const kind = c.input.endsWith('.css') ? 'css' : c.input.endsWith('.json') ? 'json' : 'code';
  const gold = fs.readFileSync(c.output, 'utf8');
  const r = runOnSource(
    { path: path.basename(c.input), abs: c.input, kind, source: fs.readFileSync(c.input, 'utf8') },
    selectTransforms([c.transform]),
    { mappings, docBase: 'docs' },
  );
  const r2 = runOnSource(
    { path: path.basename(c.output), abs: c.output, kind, source: gold },
    selectTransforms([c.transform]),
    { mappings, docBase: 'docs' },
  );
  return { gold, final: r.final, reapplied: r2.final };
}

describe('codemod fixtures (all streams)', () => {
  const baselineRows = loadBaseline();
  const cases = discoverFixtures(baselineRows);
  const streams = [...new Set(cases.map((c) => c.stream))].sort();

  it('discovers >=120 cases across every codemod stream', () => {
    expect(cases.length).toBeGreaterThanOrEqual(120);
    for (const s of ['plat', 'cmp', 'mat', 'surf']) expect(streams).toContain(s);
  });

  it('every codemod-fixtures baseline row is well-formed and names a discovered case', () => {
    expect(baselineProblems(baselineRows, new Set(cases.map((c) => c.dir)))).toEqual([]);
  });

  it('the baseline check rejects orphan, mis-owned and non-expiring rows (failing fixture)', () => {
    const dirs = new Set(['fragments/codemods/cmp/fixtures/g/a']);
    expect(baselineProblems([
      { file: 'fragments/codemods/cmp/fixtures/g/gone', owner: 'CMP', reqFin: 'REQ-FIN-76', expires: 'RC-1' },
      { file: 'fragments/codemods/cmp/fixtures/g/a', owner: 'MAT', reqFin: 'REQ-FIN-76', expires: 'RC-1' },
      { file: 'fragments/codemods/cmp/fixtures/g/a', owner: 'CMP', reqFin: 'CMP-134', expires: '2099-01-01' },
    ], dirs)).toEqual([
      'fragments/codemods/cmp/fixtures/g/gone: no such fixture case (delete the row)',
      "fragments/codemods/cmp/fixtures/g/a: owner 'MAT' is not the case's stream",
      "fragments/codemods/cmp/fixtures/g/a: reqFin 'CMP-134' is not a REQ-FIN id",
      "fragments/codemods/cmp/fixtures/g/a: expires must be 'RC-1'",
    ]);
  });

  const pending = cases.filter((c) => c.pending);
  if (pending.length) {
    it(`reports ${pending.length} pending fixture(s) with reasons`, () => {
      const byOwner: Record<string, number> = {};
      for (const c of pending) {
        expect(c.pending!.reason.length).toBeGreaterThan(0);
        expect(fs.existsSync(c.input)).toBe(true);
        byOwner[c.stream] = (byOwner[c.stream] ?? 0) + 1;
      }
      // the lane log line the CI job surfaces as the `pending` state
      console.log(`PENDING codemod fixtures: ${pending.length} of ${cases.length} ${JSON.stringify(byOwner)}`);
    });
  }

  for (const c of cases.filter((x) => x.pending?.runnable)) {
    it(`pending ${c.stream}/${c.group}/${c.name}: gap still present (else delete its pending marker)`, async () => {
      let matches = false;
      try {
        const { gold, final, reapplied } = await runCase(c);
        matches = final === gold && reapplied === gold;
      } catch {
        matches = false; // the transform throwing is a gap too
      }
      expect({ case: c.dir, matchesGolden: matches }).toEqual({ case: c.dir, matchesGolden: false });
    });
  }

  for (const c of cases.filter((x) => !x.pending)) {
    it(`${c.stream}/${c.group}/${c.name}`, async () => {
      const { gold, final, reapplied } = await runCase(c);
      // idempotence: transform(output) === output
      expect(reapplied).toBe(gold);
      expect(final).toBe(gold);
    });
  }
});
