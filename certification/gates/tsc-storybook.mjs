#!/usr/bin/env node
// certification/gates/tsc-storybook.mjs — L1 built-in (REQ-QUAL-56): the story typecheck,
// `tsc --noEmit -p tsconfig.storybook.json`, run with the repository's own TypeScript (never npx).
// Exit 0 when the Storybook config, preview, every story root .storybook/main.ts loads and the flow specs typecheck;
// 1 on any type error or when tsconfig.storybook.json / the TypeScript compiler is missing.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TSCONFIG = 'tsconfig.storybook.json';

/** The `tsc` invocation for `root`: node <root>/node_modules/typescript/bin/tsc --noEmit -p <root>/tsconfig.storybook.json. */
export function tscCommand(root) {
  return { cmd: process.execPath, args: [join(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '-p', join(root, TSCONFIG)] };
}

export function main(root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..')) {
  const tsc = join(root, 'node_modules/typescript/bin/tsc');
  if (!existsSync(join(root, TSCONFIG))) { console.error(`tsc-storybook: ${TSCONFIG} is missing`); return 1; }
  if (!existsSync(tsc)) { console.error('tsc-storybook: node_modules/typescript/bin/tsc is missing (run npm ci)'); return 1; }
  const { cmd, args } = tscCommand(root);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  if (r.error || r.signal) { console.error(`tsc-storybook: tsc crashed: ${r.error?.message ?? r.signal}`); return 1; }
  if (r.status !== 0) { console.error(`tsc-storybook: tsc --noEmit -p ${TSCONFIG} exited ${r.status}`); return 1; }
  console.log(`tsc-storybook: ${TSCONFIG} typechecks`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
