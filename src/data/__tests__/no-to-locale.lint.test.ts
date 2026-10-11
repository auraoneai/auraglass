/** @jest-environment node */
// REQ-SURF-08 acceptance: "ESLint flags a planted toLocaleDateString in
// src/data". Runs the repo's real ESLint CLI (eslint.config.js + the
// auraglass plugin loader + lint/rules/surf/_strict.cjs) on planted source fed
// through --stdin with a src/data file name, so the result proves the
// escalation glob and the rule module are both wired, not just the rule in
// isolation. A child process keeps ESLint's ESM config loader out of the Jest
// VM.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');
const ESLINT = join(ROOT, 'node_modules/eslint/bin/eslint.js');

interface LintMessage { ruleId: string | null; severity: number; message: string; line: number }

function lint(code: string, filePath: string): LintMessage[] {
  const res = spawnSync(process.execPath, [ESLINT, '--format', 'json', '--stdin', '--stdin-filename', filePath], {
    cwd: ROOT,
    input: code,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  // exit 0 = clean, 1 = lint errors; anything else (2) is a config/load failure.
  if (res.status !== 0 && res.status !== 1) {
    throw new Error(`eslint exited ${res.status}: ${res.stderr || res.stdout}`);
  }
  const [report] = JSON.parse(res.stdout) as Array<{ messages: LintMessage[] }>;
  return report!.messages;
}

const toLocale = (msgs: LintMessage[]) =>
  msgs.filter((m) => m.ruleId === 'auraglass/no-to-locale').map((m) => ({ severity: m.severity, line: m.line }));

const PLANTED = [
  'export function Stamp({ at }: { at: Date }) {',
  '  return <time>{at.toLocaleDateString()}</time>;',
  '}',
  '',
].join('\n');

const CLEAN = [
  "const fmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });",
  'export function Stamp({ at }: { at: Date }) {',
  '  return <time>{fmt.format(at)}</time>;',
  '}',
  '',
].join('\n');

describe('auraglass/no-to-locale over SURF paths (REQ-SURF-08)', () => {
  it('flags a planted toLocaleDateString in src/data at error', () => {
    expect(toLocale(lint(PLANTED, 'src/data/stat-card/__planted__/Stamp.tsx'))).toEqual([{ severity: 2, line: 2 }]);
  }, 60_000);

  it('flags the same planted call in a SURF component dir (src/components/timeline)', () => {
    expect(toLocale(lint(PLANTED, 'src/components/timeline/__planted__/Stamp.tsx'))).toEqual([{ severity: 2, line: 2 }]);
  }, 60_000);

  it('passes pinned-locale Intl formatting in src/data', () => {
    expect(toLocale(lint(CLEAN, 'src/data/stat-card/__planted__/Stamp.tsx'))).toEqual([]);
  }, 60_000);

  it('does not escalate over paths SURF does not own (contract §4.11 rollout)', () => {
    expect(toLocale(lint(PLANTED, 'src/theme/__planted__/Stamp.tsx'))).toEqual([]);
  }, 60_000);
});
