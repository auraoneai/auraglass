#!/usr/bin/env node
// scripts/surf/verify-prop-grammar.mjs — REQ-SURF-11 / REQ-FIN-80 lane step
// (run by surf:test:types in ci/surf.gitlab-ci.yml).
//
// 1. tsc over ci/surf/types/tsconfig.json: every tests/types/surf/*.test-d.ts,
//    including prop-grammar.test-d.ts (S-30 grammar over the real SURF surface,
//    with planted violations that must fail).
// 2. prop-grammar.app-shell.test-d.ts (AppShell.Root = 5 contract props) is
//    compiled once its producer (#349, SURF-20) is on the line; until then it is
//    reported `pending` with the reason — never compiled-and-ignored.
// 3. Reports whether CMP's auraglass/prop-grammar rule has shipped, and so
//    whether lint/rules/surf/_strict.cjs escalates it (pending until it has).
//
// Exit 0 when every non-pending check passed; 1 otherwise. Evidence goes to
// .artifacts/surf/types/summary.json.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);
const OUT = join(ROOT, '.artifacts/surf/types');
const TSC = join(ROOT, 'node_modules/typescript/bin/tsc');
const APP_SHELL_TEST = 'tests/types/surf/prop-grammar.app-shell.test-d.ts';

function tsc(args) {
  const r = spawnSync(process.execPath, [TSC, ...args], { cwd: ROOT, encoding: 'utf8' });
  return { status: r.status ?? 1, output: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

/** Producer check for SURF-20: AppShellRootProps no longer declares density/backdrop. */
export function appShellProducerLanded(source) {
  const m = /export type AppShellRootProps\s*=([\s\S]*?)\n\};/.exec(source);
  if (!m) return false;
  return !/\b(density|backdrop)\?:/.test(m[1]);
}

function main() {
  mkdirSync(OUT, { recursive: true });
  const checks = [];

  const main = tsc(['-p', 'ci/surf/types/tsconfig.json', '--noErrorTruncation']);
  checks.push({ id: 'types:surf', status: main.status === 0 ? 'pass' : 'fail', output: main.output });

  const shellSrc = readFileSync(join(ROOT, 'src/app-shell/AppShell.tsx'), 'utf8');
  if (appShellProducerLanded(shellSrc)) {
    const cfg = join(OUT, 'tsconfig.app-shell.json');
    writeFileSync(cfg, JSON.stringify({
      extends: join(ROOT, 'ci/surf/types/tsconfig.json'),
      include: [join(ROOT, APP_SHELL_TEST)],
      exclude: [],
    }, null, 2));
    const r = tsc(['-p', cfg, '--noErrorTruncation']);
    checks.push({ id: 'types:surf:app-shell-root', status: r.status === 0 ? 'pass' : 'fail', output: r.output });
  } else {
    checks.push({
      id: 'types:surf:app-shell-root',
      status: 'pending',
      reason: 'AppShellRootProps still declares density/backdrop; producer #349 (REQ-SURF-20) not on this line',
    });
  }

  const ruleShipped = existsSync(join(ROOT, 'lint/rules/cmp/prop-grammar.cjs'));
  const strict = require(join(ROOT, 'lint/rules/surf/_strict.cjs')).strict ?? {};
  const escalated = Object.prototype.hasOwnProperty.call(strict, 'prop-grammar');
  if (!ruleShipped) {
    checks.push({
      id: 'lint:surf:prop-grammar-strict',
      status: escalated ? 'fail' : 'pending',
      reason: escalated
        ? '_strict.cjs escalates prop-grammar but lint/rules/cmp/prop-grammar.cjs is absent'
        : 'CMP (FIN-E) has not shipped lint/rules/cmp/prop-grammar.cjs',
    });
  } else {
    checks.push({
      id: 'lint:surf:prop-grammar-strict',
      status: escalated ? 'pass' : 'fail',
      reason: escalated ? 'escalated over SURF_OWNED' : 'rule shipped but _strict.cjs does not escalate it',
    });
  }

  writeFileSync(join(OUT, 'summary.json'), `${JSON.stringify({ checks }, null, 2)}\n`);
  for (const c of checks) {
    console.log(`${c.status.padEnd(7)} ${c.id}${c.reason ? ` — ${c.reason}` : ''}`);
    if (c.status === 'fail' && c.output) console.log(c.output);
  }
  process.exit(checks.some((c) => c.status === 'fail') ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
