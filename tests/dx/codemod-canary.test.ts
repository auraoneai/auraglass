/** Jest leg of REQ-PLAT-92: recipes-4x frozen fixtures through the migrate
 *  engine — expected-todos.json per recipe + idempotent second pass.
 *
 *  The engine (packages/cli/src/migrate/4to5) is NodeNext source: its relative
 *  imports carry `.js` specifiers for `.ts` files, which the root Jest resolver
 *  does not map (jest.config.js is contract-owned; packages/ has its own Jest
 *  config). As in codemod-perf.test.ts, the engine is bundled with esbuild and
 *  run in a spawned node process; every engine result is asserted here. The
 *  compiled mappings come from packages/cli/scripts/gen-mappings.mjs (the CLI
 *  package's pretest step; git-ignored output). */
import { beforeAll, afterAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO = path.resolve(__dirname, '..', '..');
const FIX = path.join(__dirname, 'fixtures', 'recipes-4x');
const ENGINE = path.join(REPO, 'packages/cli/src/migrate/4to5');
const MANUAL = '__manual__source-parse-failure';

interface Job { name: string; path: string; kind: 'css' | 'json' | 'code'; source: string }
interface JobResult { threw: boolean; todos: string[]; final: string; final2: string }
interface EngineRun { transformOrder: number; results: Record<string, JobResult> }

/* Runs each job through runOnSource twice (second pass over the migrated output). */
const RUNNER = `import fs from 'node:fs';
import { runOnSource, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '%ENGINE%/index.js';
const [jobsFile, mappingsDir, outFile] = process.argv.slice(2);
const mappings = loadCompiledMappings(mappingsDir);
const all = selectTransforms(undefined);
const results = {};
for (const job of JSON.parse(fs.readFileSync(jobsFile, 'utf8'))) {
  const unit = { path: job.path, abs: 'x', kind: job.kind, source: job.source };
  try {
    const r = runOnSource(unit, all, { mappings, docBase: 'docs' });
    const r2 = runOnSource({ ...unit, source: r.final }, all, { mappings, docBase: 'docs' });
    results[job.name] = { threw: false, todos: r.todos.map((t) => t.reason), final: r.final, final2: r2.final };
  } catch {
    results[job.name] = { threw: true, todos: [], final: '', final2: '' };
  }
}
fs.writeFileSync(outFile, JSON.stringify({ transformOrder: TRANSFORM_ORDER.length, results }));`;

function recipeDirs(): string[] {
  return fs.readdirSync(FIX).filter((d) => fs.existsSync(path.join(FIX, d, 'expected-todos.json'))).sort();
}

function jobFor(name: string): Job {
  const dir = path.join(FIX, name);
  const input = ['input.tsx', 'input.ts', 'input.css', 'input.json'].find((f) => fs.existsSync(path.join(dir, f)))!;
  const kind = input.endsWith('.css') ? 'css' : input.endsWith('.json') ? 'json' : 'code';
  return { name, path: input, kind, source: fs.readFileSync(path.join(dir, input), 'utf8') };
}

let work = '';
let run: EngineRun;

beforeAll(() => {
  execFileSync(process.execPath, [path.join(REPO, 'packages/cli/scripts/gen-mappings.mjs')], { cwd: REPO, stdio: 'pipe', timeout: 120_000 });
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-canary-'));
  const src = path.join(work, 'runner.src.ts');
  const runner = path.join(work, 'runner.mjs');
  const jobs = path.join(work, 'jobs.json');
  const out = path.join(work, 'out.json');
  fs.writeFileSync(src, RUNNER.replace('%ENGINE%', ENGINE.replace(/\\/g, '\\\\')));
  fs.writeFileSync(jobs, JSON.stringify(recipeDirs().map(jobFor)));
  execFileSync(path.join(REPO, 'node_modules', '.bin', 'esbuild'), [src, '--bundle', '--platform=node', '--format=esm', `--outfile=${runner}`, '--log-level=error', `--banner:js=import{createRequire as __agcr}from'node:module';import{fileURLToPath as __agfutp}from'node:url';const require=__agcr(import.meta.url);const __filename=__agfutp(import.meta.url);const __dirname=import.meta.dirname;`], { timeout: 60_000 });
  execFileSync(process.execPath, [runner, jobs, path.join(ENGINE, 'mappings'), out], { encoding: 'utf8', timeout: 120_000 });
  run = JSON.parse(fs.readFileSync(out, 'utf8')) as EngineRun;
}, 300_000);

afterAll(() => {
  if (work) fs.rmSync(work, { recursive: true, force: true });
});

describe('codemod canary (recipes-4x, engine leg)', () => {
  it('14 transforms, frozen order', () => {
    expect(run.transformOrder).toBe(14);
  });
  it('28 recipe fixtures discovered (files.json marker)', () => {
    expect(fs.readdirSync(FIX).filter((d) => fs.existsSync(path.join(FIX, d, 'files.json'))).length).toBe(28);
  });
  for (const name of recipeDirs()) {
    it(`recipe ${name}: output matches expected-todos.json`, () => {
      const expected = JSON.parse(fs.readFileSync(path.join(FIX, name, 'expected-todos.json'), 'utf8')) as string[];
      const r = run.results[name]!;
      if (expected[0] === MANUAL) {
        expect(r.threw).toBe(true);
        return;
      }
      expect(r.threw).toBe(false);
      expect(r.todos).toEqual(expected);
      /* second pass over the migrated output must change nothing */
      expect(r.final2).toBe(r.final);
    });
  }
  it('flagship subset: 0 unexpected TODOs', () => {
    const subsetPath = path.join(FIX, 'flagship-subset.json');
    const ids = JSON.parse(fs.readFileSync(subsetPath, 'utf8')) as string[];
    expect(ids.length).toBeGreaterThan(0);
    const offenders = ids.filter((id) => {
      const e = JSON.parse(fs.readFileSync(path.join(FIX, id, 'expected-todos.json'), 'utf8')) as string[];
      return e.length > 0;
    });
    expect(offenders).toEqual([]);
  });
});
