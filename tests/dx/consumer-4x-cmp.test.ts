/** REQ-CMP-135 / CMP-426 (FIN-322): consumer-4x cmp cases — run `migrate 4to5`
 * over each frozen 4.x case and assert 0 TODO(aura-glass 5) markers on
 * mechanically mappable props (G-08). A TODO is legitimate only when it traces
 * to an unmappable mapping row (`to: null`, a `todo` note, a dotted/structured
 * target or a dynamic value on a value-mapped prop) or to a compat-only
 * routing (aura-glass/compat is the designed deprecation path). The remote L11
 * leg (scripts/cmp/consumer-4x-l11.mjs) additionally compiles the same files on
 * the 4.x line and type-checks the migrated output; this jest leg is the
 * always-on half.
 *
 * The engine (packages/cli/src/migrate/4to5) is NodeNext source whose relative
 * imports carry `.js` specifiers, which the root Jest resolver does not map
 * (jest.config.js is contract-owned). As in codemod-canary.test.ts, the engine
 * is bundled with esbuild and run in a spawned node process; every engine
 * result is asserted here. Compiled mappings come from
 * packages/cli/scripts/gen-mappings.mjs (git-ignored output). */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Shared with the remote L11 driver (scripts/cmp/consumer-4x-l11.mjs).
import { isExcusedTodo } from '../../scripts/cmp/consumer-4x-todo-policy.mjs';

const REPO = path.resolve(__dirname, '..', '..');
const FIX = path.join(REPO, 'tests', 'fixtures', 'consumer-4x', 'cases', 'cmp');
const ENGINE = path.join(REPO, 'packages/cli/src/migrate/4to5');

/** The CMP-owned surface the cases must cover (REQ-CMP-135). */
const CMP_NAMES = [
  'GlassButton', 'GlassInput', 'GlassSelectCompound', 'GlassSwitch', 'GlassCheckbox',
  'GlassModal', 'GlassDrawer', 'GlassPopover', 'GlassTooltip', 'GlassDropdownMenu',
  'GlassToast', 'GlassCard', 'Typography',
] as const;

interface PropRow { component: string; from: string; to: string | null; values?: Record<string, unknown>; todo?: string }
interface Component { to?: string; compatOnly: boolean; props?: PropRow[] }
interface CaseResult {
  threw: string | null;
  todos: Array<{ transform: string; reason: string }>;
  final: string;
  final2: string;
  changes: number;
}
interface EngineRun { components: Record<string, Component>; results: Record<string, CaseResult> }

const RUNNER = `import fs from 'node:fs';
import { runOnSource, selectTransforms, loadCompiledMappings } from '%ENGINE%/index.js';
const [jobsFile, mappingsDir, outFile] = process.argv.slice(2);
const mappings = loadCompiledMappings(mappingsDir);
const all = selectTransforms(undefined);
const results = {};
for (const job of JSON.parse(fs.readFileSync(jobsFile, 'utf8'))) {
  const unit = { path: job.path, abs: job.abs, kind: 'code', source: job.source };
  try {
    const r = runOnSource(unit, all, { mappings, docBase: 'docs' });
    const r2 = runOnSource({ ...unit, source: r.final }, all, { mappings, docBase: 'docs' });
    results[job.path] = { threw: null, todos: r.todos.map((t) => ({ transform: t.transform, reason: t.reason })), final: r.final, final2: r2.final, changes: r.changes.length };
  } catch (e) {
    results[job.path] = { threw: String((e && e.message) || e), todos: [], final: '', final2: '', changes: 0 };
  }
}
fs.writeFileSync(outFile, JSON.stringify({ components: mappings.components, results }));`;

const cases = fs.readdirSync(FIX).filter((f) => f.endsWith('.tsx')).sort();

let work = '';
let run: EngineRun;

beforeAll(() => {
  execFileSync(process.execPath, [path.join(REPO, 'packages/cli/scripts/gen-mappings.mjs')], { cwd: REPO, stdio: 'pipe', timeout: 120_000 });
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-consumer4x-'));
  const src = path.join(work, 'runner.src.ts');
  const runner = path.join(work, 'runner.mjs');
  const jobs = path.join(work, 'jobs.json');
  const out = path.join(work, 'out.json');
  fs.writeFileSync(src, RUNNER.replace('%ENGINE%', ENGINE.replace(/\\/g, '\\\\')));
  fs.writeFileSync(jobs, JSON.stringify(cases.map((f) => ({ path: f, abs: path.join(FIX, f), source: fs.readFileSync(path.join(FIX, f), 'utf8') }))));
  execFileSync(path.join(REPO, 'node_modules', '.bin', 'esbuild'), [src, '--bundle', '--platform=node', '--format=esm', `--outfile=${runner}`, '--log-level=error', `--banner:js=import{createRequire as __agcr}from'node:module';import{fileURLToPath as __agfutp}from'node:url';const require=__agcr(import.meta.url);const __filename=__agfutp(import.meta.url);const __dirname=import.meta.dirname;`], { timeout: 60_000 });
  execFileSync(process.execPath, [runner, jobs, path.join(ENGINE, 'mappings'), out], { encoding: 'utf8', timeout: 120_000 });
  run = JSON.parse(fs.readFileSync(out, 'utf8')) as EngineRun;
}, 300_000);

afterAll(() => {
  if (work) fs.rmSync(work, { recursive: true, force: true });
});

describe('consumer-4x cmp cases', () => {
  it('manifest lists exactly the case files and covers all 13 CMP names', () => {
    const m = JSON.parse(fs.readFileSync(path.join(FIX, 'manifest.json'), 'utf8')) as { cases: Array<{ id: string; covers: string[] }> };
    expect(m.cases.map((c) => `${c.id}.tsx`).sort()).toEqual(cases);
    expect(cases).toHaveLength(3);
    const covered = new Set(m.cases.flatMap((c) => c.covers));
    expect(CMP_NAMES.filter((n) => !covered.has(n))).toEqual([]);
  });

  it('every name a case claims to cover is actually used by that case', () => {
    const m = JSON.parse(fs.readFileSync(path.join(FIX, 'manifest.json'), 'utf8')) as { cases: Array<{ id: string; covers: string[] }> };
    // A 4.x name whose root export IS another 4.x export counts through it:
    // root `GlassToast` resolves to the `useToast` hook (rename row
    // GlassToast -> useToast), which detail-panel imports.
    const uses = (src: string, n: string): boolean => {
      if (new RegExp(`\\b${n}\\b`).test(src)) return true;
      const alias = run.components[n]?.to;
      return alias !== undefined && alias !== n && run.components[alias] !== undefined && new RegExp(`\\b${alias}\\b`).test(src);
    };
    const missing = m.cases.flatMap((c) => {
      const src = fs.readFileSync(path.join(FIX, `${c.id}.tsx`), 'utf8');
      return c.covers.filter((n) => !uses(src, n)).map((n) => `${c.id}: ${n}`);
    });
    expect(missing).toEqual([]);
  });

  for (const f of cases) {
    describe(f, () => {
      it('migrates without throwing and rewrites the 4.x surface', () => {
        const r = run.results[f]!;
        expect(r.threw).toBeNull();
        expect(r.changes).toBeGreaterThan(0);
        // No 4.x CMP name survives outside aura-glass/compat imports.
        const leftovers = CMP_NAMES.filter((n) => {
          if (run.components[n]?.compatOnly) return false;
          const outsideCompat = r.final
            .split('\n')
            .filter((l) => !/from 'aura-glass\/compat'/.test(l) && !l.startsWith('//'))
            .join('\n');
          return new RegExp(`<${n}[\\s/>]`).test(outsideCompat);
        });
        expect(leftovers).toEqual([]);
      });

      it('leaves 0 TODOs on mechanically mappable props', () => {
        const r = run.results[f]!;
        expect(r.todos.filter((t) => !isExcusedTodo(t, run.components)).map((t) => `${t.transform}: ${t.reason}`)).toEqual([]);
      });

      it('is idempotent: a second run changes nothing', () => {
        const r = run.results[f]!;
        expect(r.final2).toBe(r.final);
      });
    });
  }
});
