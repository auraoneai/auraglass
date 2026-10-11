/* Fixture repositories for the lane-runner tests (REQ-QUAL-05/-06/-27/-28). Each fixture is a throwaway directory
   with its own certification/lanes.config.ts, fragments/lanes/*.ts, the real lane-manifest schema and the real
   contracts/ownership.json, so runLanes() runs end to end against it. Fake jest/playwright CLIs stand in for the
   tools only where a test exercises the runner's classification of their output (no report, 0 tests, …). */
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { runLanes, type MainResult, type Tools } from '../../src/evidence/laneRunner.ts';

export const REPO = resolve(__dirname, '../../../..');

export interface FixtureSpec {
  /** source of the BUILTINS array literal */
  builtins?: string;
  /** source of the PENDING_BUILTINS array literal */
  pending?: string;
  /** stream → source of its fragments/lanes/<stream>.ts default-export array literal */
  fragments?: Record<string, string>;
  /** extra files, path → content */
  files?: Record<string, string>;
  /** copy certification/matrix.config.ts (sentinel set) */
  matrix?: boolean;
}

const made: string[] = [];

export function makeRepo(spec: FixtureSpec = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'ag-lane-'));
  made.push(root);
  const write = (rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
  write('certification/lanes.config.ts', `export const BUILTINS = ${spec.builtins ?? '[]'};\nexport const PENDING_BUILTINS = ${spec.pending ?? '[]'};\nexport default BUILTINS;\n`);
  write('certification/schemas/lane-manifest.schema.json', readFileSync(join(REPO, 'certification/schemas/lane-manifest.schema.json'), 'utf8'));
  mkdirSync(join(root, 'contracts'), { recursive: true });
  copyFileSync(join(REPO, 'contracts/ownership.json'), join(root, 'contracts/ownership.json'));
  if (spec.matrix) write('certification/matrix.config.ts', readFileSync(join(REPO, 'certification/matrix.config.ts'), 'utf8'));
  for (const [stream, src] of Object.entries(spec.fragments ?? {})) write(`fragments/lanes/${stream}.ts`, `export default ${src};\n`);
  for (const [rel, text] of Object.entries(spec.files ?? {})) write(rel, text);
  return root;
}

export function cleanupRepos(): void {
  for (const r of made.splice(0)) rmSync(r, { recursive: true, force: true });
}

export const row = (o: Record<string, unknown>) => JSON.stringify({ scope: 'pr', remote: false, failClosed: true, ...o });

export interface RunOpts { scope?: string; lane?: string; branch?: string; env?: Record<string, string>; tools?: Partial<Tools>; extraArgs?: string[] }

export async function runFixture(root: string, o: RunOpts = {}): Promise<MainResult> {
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH, HOME: process.env.HOME, AG_CERT_ALLOW_LOCAL: '1', CI_JOB_NAME_SLUG: 'fixture',
    ...(o.branch ? { CI_COMMIT_BRANCH: o.branch } : {}), ...o.env,
  };
  return runLanes(['--lane', o.lane ?? 'L1', '--scope', o.scope ?? 'pr', ...(o.extraArgs ?? [])], { root, env, ...(o.tools ? { tools: o.tools } : {}) });
}

export const results = (r: MainResult) => (r.manifest?.results ?? []) as Array<Record<string, unknown>>;

/** A fake CLI (node script) that writes `report` as the jest/playwright JSON report and exits with `code`. */
export function fakeTool(root: string, name: string, body: string): string {
  const p = join(root, `.tools/${name}.cjs`);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
  return p;
}

/** Fake jest: reads --outputFile=<f> and writes the given report (or nothing when report is null). */
export function fakeJest(root: string, report: unknown, code = 0): string {
  return fakeTool(root, 'jest', `const a = process.argv.find((x) => x.startsWith('--outputFile='));
const r = ${JSON.stringify(report)};
if (r && a) require('node:fs').writeFileSync(a.slice('--outputFile='.length), JSON.stringify(r));
process.exit(${code});\n`);
}

/** Fake playwright: writes the given report to $PLAYWRIGHT_JSON_OUTPUT_NAME (or nothing when report is null). */
export function fakePlaywright(root: string, report: unknown, code = 0): string {
  return fakeTool(root, 'playwright', `const r = ${JSON.stringify(report)};
if (r && process.env.PLAYWRIGHT_JSON_OUTPUT_NAME) require('node:fs').writeFileSync(process.env.PLAYWRIGHT_JSON_OUTPUT_NAME, JSON.stringify(r));
process.exit(${code});\n`);
}
