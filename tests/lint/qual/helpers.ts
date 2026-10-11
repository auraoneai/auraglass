// tests/lint/qual/helpers.ts — shared helpers for the QUAL perf-lint suites (REQ-QUAL-45).
// Severity is resolved by the real `eslint --print-config <file>` (the AC-FIN-105 /
// REQ-QUAL-45 acceptance command) in a child process, so the repo's ESM
// eslint.config.js and the eslint-plugin-auraglass.js loader run unmodified
// outside Jest's module transform.
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const ROOT = path.resolve(__dirname, '../../..');
const ESLINT_BIN = path.join(ROOT, 'node_modules', 'eslint', 'bin', 'eslint.js');

const cache = new Map<string, Record<string, unknown>>();

export function printConfig(file: string): Record<string, unknown> {
  let rules = cache.get(file);
  if (!rules) {
    const out = execFileSync(process.execPath, [ESLINT_BIN, '--print-config', file], { cwd: ROOT, encoding: 'utf8' });
    rules = (JSON.parse(out).rules ?? {}) as Record<string, unknown>;
    cache.set(file, rules);
  }
  return rules;
}

/** Numeric severity (0 off, 1 warn, 2 error) of auraglass/<name> for a repo-relative file. */
export function ruleConfig(file: string, name: string): number {
  const entry = printConfig(file)[`auraglass/${name}`];
  if (entry === undefined) return 0;
  const sev = Array.isArray(entry) ? entry[0] : entry;
  if (typeof sev === 'number') return sev;
  const named = ({ off: 0, warn: 1, error: 2 } as Record<string, number>)[String(sev)];
  if (named === undefined) throw new Error(`auraglass/${name}: unexpected severity ${String(sev)} for ${file}`);
  return named;
}
