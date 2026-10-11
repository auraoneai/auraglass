#!/usr/bin/env node
/* ci/surf/doubles/run.mjs — runner for the surf:test:doubles matrix (REQ-SURF-195).

   Usage: node ci/surf/doubles/run.mjs <area> [--root <dir>] [--dry-run]

   Each matrix cell used to require tests/<area>/jest.doubles.cjs and printed
   "pending" when it was missing, so a cell whose preset had been retired
   (REQ-FIN-08/09 deletes tests/capability/jest.doubles.cjs once the root
   jest.config.js maps `aura-glass`) went green without running a test. The
   cell now always runs real tests:

   - preset mode: tests/<area>/jest.doubles.cjs exists -> `jest -c <preset> --ci`
     (the CMP doubles mapping still applies);
   - root mode: the preset has been retired -> the root jest config on the
     area's test paths (`npm test -- --ci <paths>`), i.e. against the real
     modules.

   Either way jest's own exit code is the cell's exit code; "no tests found"
   fails (no --passWithNoTests). Output is teed to
   .artifacts/surf/doubles/<area>.log and the resolved mode is written to
   .artifacts/surf/doubles/<area>.json. --dry-run prints the resolution as JSON
   and runs nothing. An unknown area exits 2. */
import { spawn } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Root-mode paths mirror the testMatch of each area's preset, so retiring a
// preset keeps the same tests in the cell.
const AREAS = {
  'app-shell': ['tests/app-shell', 'src/app-shell'],
  data: ['tests/data'],
  ai: ['tests/ai', 'src/ai', 'tests/capability/registry/ai-'],
  media: [
    'tests/media',
    'tests/backdrops',
    'src/media',
    'src/backdrops',
    'tests/capability/registry/media-',
    'registry/items/media-',
    'registry/blocks/media-',
    'registry/items/backdrop-',
  ],
  capability: ['tests/capability'],
};

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};
const ROOT = resolve(opt('root') ?? '.');
const dryRun = args.includes('--dry-run');
const area = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--root');

if (!area || !Object.hasOwn(AREAS, area)) {
  console.error(`usage: node ci/surf/doubles/run.mjs <${Object.keys(AREAS).join('|')}> [--dry-run]`);
  console.error(`unknown area: ${area ?? '(none)'}`);
  process.exit(2);
}

const preset = `tests/${area}/jest.doubles.cjs`;
const plan = existsSync(join(ROOT, preset))
  ? { area, mode: 'preset', config: preset, command: ['npx', 'jest', '-c', preset, '--ci'] }
  : { area, mode: 'root', config: 'jest.config.js', paths: AREAS[area], command: ['npm', 'test', '--', '--ci', ...AREAS[area]] };

if (dryRun) {
  console.log(JSON.stringify(plan));
  process.exit(0);
}

const outDir = join(ROOT, '.artifacts/surf/doubles');
mkdirSync(outDir, { recursive: true });
const log = createWriteStream(join(outDir, `${area}.log`));
const header = `surf:test:doubles [${area}] ${plan.mode} mode: ${plan.command.join(' ')}\n`;
process.stdout.write(header);
log.write(header);

const child = spawn(plan.command[0], plan.command.slice(1), { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
for (const [src, dst] of [
  [child.stdout, process.stdout],
  [child.stderr, process.stderr],
]) {
  src.on('data', (chunk) => {
    dst.write(chunk);
    log.write(chunk);
  });
}
child.on('error', (err) => {
  console.error(`surf:test:doubles [${area}] could not start: ${err.message}`);
  process.exitCode = 1;
});
child.on('close', (code, signal) => {
  const exitCode = code ?? 1;
  writeFileSync(join(outDir, `${area}.json`), `${JSON.stringify({ ...plan, exitCode, signal }, null, 2)}\n`);
  log.end(() => process.exit(exitCode));
});
