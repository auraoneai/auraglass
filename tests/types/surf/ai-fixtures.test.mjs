/**
 * @jest-environment node
 */
/* gen-ai-fixtures (REQ-SURF-106, REQ-FIN-85): the fixture generator
 * typechecks the corpus against the pinned `ai` UIMessage types, so --check
 * fails when ui-messages.source.ts stops satisfying UIMessage[]. Each case runs
 * the real script on a mutated copy of the real source (in a temp dir) and
 * asserts the exit status and message. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../../..');
const GEN = join(ROOT, 'scripts/surf/gen-ai-fixtures.mjs');
const SOURCE = join(ROOT, 'src/ai/__fixtures__/ui-messages.source.ts');
const FIXTURE = join(ROOT, 'src/ai/__fixtures__/ui-messages.ai-sdk.json');
const TYPES = join(ROOT, 'src/ai/types');

const dir = mkdtempSync(join(tmpdir(), 'ag-ai-fixtures-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const original = readFileSync(SOURCE, 'utf8').replace("from '../types'", `from ${JSON.stringify(TYPES)}`);
let n = 0;
/** Writes a copy of the real corpus with `from` replaced by `to` (exactly once) and runs the generator on it. */
function run(from, to, extra = []) {
  if (from !== null && original.split(from).length !== 2) throw new Error(`mutation anchor not unique: ${from}`);
  const src = join(dir, `case-${++n}.ts`);
  writeFileSync(src, from === null ? original : original.replace(from, to));
  const out = join(dir, `case-${n}.json`);
  return spawnSync(process.execPath, [GEN, '--source', src, '--out', out, ...extra], { cwd: ROOT, encoding: 'utf8' });
}

describe('gen-ai-fixtures --check typechecks the corpus against the pinned ai types', () => {
  it('the committed fixture is fresh and the real corpus typechecks', () => {
    const r = spawnSync(process.execPath, [GEN, '--check'], { cwd: ROOT, encoding: 'utf8' });
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/typechecked against ai@5\.0\.29/);
  });

  it('records the pinned SDK version and the Ag-only extensions in the fixture', () => {
    const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(fixture.sdk).toBe(`ai@${pkg.devDependencies.ai}`);
    expect(fixture.agExtensions.map((e) => e.id)).toEqual(['msg-06', 'msg-07', 'msg-10', 'msg-17', 'msg-19', 'msg-20']);
    expect(fixture.messages).toHaveLength(21);
  });

  it('fails when an SDK message uses a state UIMessage v5 does not have', () => {
    const r = run("toolCallId: 'tc-input-streaming', state: 'input-streaming'", "toolCallId: 'tc-input-streaming', state: 'approval-requested'", ['--check']);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/no longer satisfies the pinned ai@5\.0\.29 UIMessage/);
  });

  it("fails when an SDK message uses the Ag-only 'tool' role", () => {
    const r = run("{ id: 'msg-01', role: 'user'", "{ id: 'msg-01', role: 'tool'");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/type error/);
  });

  it('fails when an SDK tool part drops a field UIMessage requires', () => {
    const r = run("input: { title: 'Rotate ingestion keys' }, ", '');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/type error/);
  });

  it('fails when an SDK-native message hides in AG_EXTENSION_MESSAGES', () => {
    const r = run("{ id: 'msg-17', role: 'tool'", "{ id: 'msg-17', role: 'user'");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/msg-17 is in AG_EXTENSION_MESSAGES but uses no AgMessage-only feature/);
  });

  it('fails when SDK_PIN no longer matches the installed ai version', () => {
    const r = run("SDK_PIN = 'ai@5.0.29'", "SDK_PIN = 'ai@6.0.0'");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/SDK_PIN is ai@6\.0\.0; the pinned SDK is ai@5\.0\.29/);
  });

  it('an unmodified copy generates the committed fixture byte-for-byte', () => {
    const r = run(null, null);
    expect(r.status).toBe(0);
    expect(readFileSync(join(dir, `case-${n}.json`), 'utf8')).toBe(readFileSync(FIXTURE, 'utf8'));
  });
});
