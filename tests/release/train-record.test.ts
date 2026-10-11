/* REQ-FIN-45 / REQ-PLAT-36 (FIN-C.3 C.3-15): train-record.mjs writes a
   train-checklist stop's `record` from the tag pipeline's own evidence and
   fails closed on every missing or contrary input. */
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const SCRIPT = join(ROOT, 'scripts/release/train-record.mjs');
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e', `const m = await import('${SCRIPT}'); ${body}`],
    { cwd: ROOT, encoding: 'utf8' });

const CI = {
  CI_PIPELINE_URL: 'https://gitlab.example/p/-/pipelines/1',
  CI_JOB_URL: 'https://gitlab.example/p/-/jobs/9',
  CI_COMMIT_SHA: '0123456789abcdef0123456789abcdef01234567',
  CI_COMMIT_TAG: 'v4.1.1',
};
const NEEDS = 'plat:gate:change-class,plat:tag:release-ledger';
const LEDGER_OK = 'verify-release-ledger: all >= 4.1.1 versions agree across CHANGELOG/tag/GitLab/npm\n';
const TP_CONFIGURED = '## Status\n\n| Row | Status |\n|---|---|\n| npmjs.com trusted-publisher entries | configured 2026-10-12 |\n';

type Fixture = { version?: string; changeClass?: object | null; ledger?: string | null; tp?: string };
function fixture({ version = '4.1.1', changeClass = { class: 'C-I', errors: [], deprecationsAdded: [] },
  ledger = LEDGER_OK, tp = TP_CONFIGURED }: Fixture = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-train-record-'));
  const put = (rel: string, text: string) => {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
  };
  mkdirSync(join(dir, 'docs/release'), { recursive: true });
  copyFileSync(join(ROOT, 'docs/release/train-checklist.json'), join(dir, 'docs/release/train-checklist.json'));
  put('package.json', JSON.stringify({ name: 'aura-glass', version }));
  if (changeClass) put('.artifacts/plat/change-class/change-class.json', JSON.stringify(changeClass));
  if (ledger != null) put('.artifacts/plat/plat-tag-release-ledger/release-ledger.log', ledger);
  put('docs/release/decisions/npm-trusted-publishing.md', tp);
  return dir;
}
/** The CLI entry point itself (repo root); used for the not-in-CI exit. */
function runCli(env: Record<string, string>) {
  return spawnSync('node', [SCRIPT, '--needs', NEEDS], {
    cwd: ROOT, encoding: 'utf8', env: { PATH: process.env.PATH ?? '', ...env },
  });
}
/** main() against a fixture root. */
function runIn(dir: string, env: Record<string, string> = CI, needs = NEEDS) {
  const out = EVAL(`const code = m.main(['--needs', ${JSON.stringify(needs)}],
    { root: ${JSON.stringify(dir)}, env: ${JSON.stringify(env)} });
    console.log('CODE=' + code);`);
  const code = Number(/CODE=(\d+)/.exec(out)?.[1]);
  const outPath = join(dir, '.artifacts/plat/train-checklist.json');
  const written = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : null;
  const stop = written?.stops.find((s: { id: string }) => s.id === '4.1.1');
  return { code, written, record: stop?.record };
}

const committed = JSON.parse(readFileSync('docs/release/train-checklist.json', 'utf8')) as {
  stops: { id: string; gates: string[]; recordInputs?: { gate: string }[]; record?: unknown }[];
};

describe('train-checklist.json record inputs', () => {
  it('4.1.1 maps every gate to exactly one record input and has no hand-filled record', () => {
    const s = committed.stops.find((x) => x.id === '4.1.1')!;
    expect(s.record).toBeNull();
    for (const g of s.gates) expect(s.recordInputs!.filter((i) => i.gate === g)).toHaveLength(1);
    expect(s.recordInputs!.every((i) => s.gates.includes(i.gate))).toBe(true);
  });
  it('the committed file is in the job output format (record commits are diff-only)', () => {
    const text = readFileSync('docs/release/train-checklist.json', 'utf8');
    expect(EVAL(`process.stdout.write(m.serialize(${text.trim()}))`)).toBe(text);
  });
});

describe('train-record.mjs', () => {
  it('outside CI exits 2 and writes nothing', () => {
    const dir = fixture();
    const r = runCli({});
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('remote only');
    expect(runIn(dir, {}).code).toBe(2);
    expect(existsSync(join(dir, '.artifacts/plat/train-checklist.json'))).toBe(false);
  });

  it('maps tags to stops, alpha N included', () => {
    const out = JSON.parse(EVAL(`const c = ${JSON.stringify(committed)};
      console.log(JSON.stringify(['v4.1.1', 'v5.0.0-alpha.7', 'v4.1.2', 'v5.0.0-alpha.x']
        .map((t) => m.stopForTag(c, t)?.id ?? null)))`));
    expect(out).toEqual(['4.1.1', '5.0.0-alpha.N', null, null]);
  });

  it('all evidence present → exit 0, gates-green record bound to the pipeline', () => {
    const { code, record } = runIn(fixture());
    expect(code).toBe(0);
    expect(record.status).toBe('gates-green');
    expect(record).toMatchObject({ tag: 'v4.1.1', version: '4.1.1', sha: CI.CI_COMMIT_SHA,
      pipelineUrl: CI.CI_PIPELINE_URL, jobUrl: CI.CI_JOB_URL, failures: [] });
    expect(record.gates.map((g: { status: string }) => g.status)).toEqual(['pass', 'pass', 'pass']);
  });

  it('a C-D of exception-only entries is patch scope; a mixed C-D is not', () => {
    const ok = runIn(fixture({ changeClass: { class: 'C-D', errors: [],
      deprecationsAdded: [{ id: 'DEP-P0001', exception: 'honesty' }] } }));
    expect(ok.code).toBe(0);
    const bad = runIn(fixture({ changeClass: { class: 'C-D', errors: [],
      deprecationsAdded: [{ id: 'DEP-P0001', exception: 'honesty' }, { id: 'DEP-P0099' }] } }));
    expect(bad.code).toBe(1);
    expect(bad.record.gates[0]).toMatchObject({ gate: 'patch-scope only (C-I/C-I-VF)', status: 'fail' });
  });

  it.each([
    ['change class C-E', { changeClass: { class: 'C-E', errors: [], deprecationsAdded: [] } }, 'patch-scope only'],
    ['classifier errors', { changeClass: { class: 'C-I', errors: ['x'], deprecationsAdded: [] } }, 'patch-scope only'],
    ['change-class artifact missing', { changeClass: null }, 'change-class.json missing'],
    ['ledger log without the agree line', { ledger: 'FAIL 4.1.1 missing from npm\n' }, 'lacks'],
    ['ledger log missing', { ledger: null }, 'release-ledger.log missing'],
    ['trusted publishing still missing', { tp: '| npmjs.com trusted-publisher entries | missing — **owner decision OD-10** |\n' }, 'missing — **owner'],
    ['trusted publishing row absent', { tp: '# nothing\n' }, 'not found'],
    ['package.json version differs from the tag', { version: '4.1.2' }, 'package.json version 4.1.2'],
  ] as const)('%s → exit 1, gates-red, record still written', (_n, fx, why) => {
    const { code, record } = runIn(fixture(fx as Fixture));
    expect(code).toBe(1);
    expect(record.status).toBe('gates-red');
    expect(record.failures.join('\n')).toContain(why);
  });

  it('a gate job missing from --needs fails (the job only proves what it needs)', () => {
    const { code, record } = runIn(fixture(), CI, 'plat:tag:release-ledger');
    expect(code).toBe(1);
    expect(record.failures.join('\n')).toContain('plat:gate:change-class is not in this job\'s needs');
  });

  it('a tag with no train stop exits 1 without writing', () => {
    const dir = fixture();
    expect(runIn(dir, { ...CI, CI_COMMIT_TAG: 'v4.1.2' }).code).toBe(1);
    expect(existsSync(join(dir, '.artifacts/plat/train-checklist.json'))).toBe(false);
  });

  it('a gate without exactly one record input fails closed', () => {
    const out = JSON.parse(EVAL(`const r = m.evaluateStop({
      stop: { id: '9.9.9', gates: ['a', 'b'], recordInputs: [{ gate: 'a', job: 'j' }, { gate: 'c', job: 'j' }] },
      needs: ['j'], readFile: () => null, env: { CI_COMMIT_TAG: 'v9.9.9', CI_PIPELINE_URL: 'u' }, version: '9.9.9' });
      console.log(JSON.stringify(r.failures))`));
    expect(out).toEqual(expect.arrayContaining([
      "gate 'b' has 0 recordInputs entries (need exactly 1)",
      "recordInputs entry for unknown gate 'c'",
    ]));
  });
});
