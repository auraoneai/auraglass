#!/usr/bin/env node
// certification/gates/stylelint-showcase.mjs — L1 built-in (REQ-QUAL-27): stylelint with stylelint.showcase.config.mjs
// over the tracked showcase/**/*.css. No showcase CSS yet → exit 75 (pending, producer G-26) — never a vacuous pass.
import { execFileSync, spawnSync } from 'node:child_process';

const PENDING_EXIT = 75;
const files = execFileSync('git', ['ls-files', '-z', '--', ':(glob)showcase/**/*.css'], { encoding: 'utf8' }).split('\0').filter(Boolean);
if (!files.length) {
  console.log('stylelint-showcase: pending — no tracked showcase/**/*.css yet (producer G-26, REQ-QUAL-58)');
  process.exit(PENDING_EXIT);
}
console.log(`stylelint-showcase: ${files.length} file(s)`);
const r = spawnSync(process.execPath, ['node_modules/stylelint/bin/stylelint.mjs', '--config', 'stylelint.showcase.config.mjs', '--max-warnings', '0', ...files], { stdio: 'inherit' });
process.exit(r.status ?? 1);
