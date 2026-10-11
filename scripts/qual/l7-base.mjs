#!/usr/bin/env node
/* scripts/qual/l7-base.mjs — QUAL (REQ-QUAL-26, G-14). Prepares the merge-base Storybook for the L7 visual-class report.
   Usage: node scripts/qual/l7-base.mjs --scope <pr|main|nightly|release> --dir <scratch dir> --out <base.json>

   Base commit: pr → `git merge-base origin/next HEAD` (the 5x line base); main / nightly / release → `HEAD^1` (what the
   commit under test changed). The base is checked out into <dir> as a detached worktree and built with the same command as
   qual:build:storybook (`npm ci`, `npm run storybook:build`). <out> records { sha, storybookStatic } on success or
   { sha, error } when the base cannot be built — regression.spec.ts then reports the visual-class report `pending`
   (a failure at release scope). This script never invents a base and never writes the report itself.
   CI / gated remote runner only: elsewhere it exits 2 with the remote command (machine policy). */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function parseArgs(argv) {
  const out = { scope: null, dir: null, out: null };
  for (let i = 0; i < argv.length; i += 2) {
    const [k, v] = [argv[i], argv[i + 1]];
    if (k === '--scope') out.scope = v;
    else if (k === '--dir') out.dir = v;
    else if (k === '--out') out.out = v;
    else throw new Error(`unknown argument ${k}`);
  }
  if (!['pr', 'main', 'nightly', 'release'].includes(out.scope)) throw new Error(`--scope must be pr|main|nightly|release (got ${out.scope})`);
  if (!out.dir || !out.out) throw new Error('--dir and --out are required');
  return out;
}

/** git arguments that name the base commit for a scope. */
export function baseRevArgs(scope, lineBase = 'origin/next') {
  return scope === 'pr' ? ['merge-base', lineBase, 'HEAD'] : ['rev-parse', 'HEAD^1'];
}

function sh(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
  process.stdout.write(r.stdout ?? '');
  process.stderr.write(r.stderr ?? '');
  return { ok: r.status === 0 && !r.error, status: r.status, out: (r.stdout ?? '').trim(), err: r.error?.message ?? (r.stderr ?? '').trim().split('\n').slice(-3).join(' ') };
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  let args;
  try { args = parseArgs(argv); } catch (e) { console.error(`l7-base: ${e.message}`); return 64; }
  if (!(env.CI === 'true' || env.AG_REMOTE_RUNNER === '1')) {
    console.error(`l7-base: runs only on GitLab CI or the gated remote runner.\nRemote command: node scripts/qual/l7-base.mjs ${argv.join(' ')}`);
    return 2;
  }
  const out = resolve(ROOT, args.out);
  const dir = resolve(ROOT, args.dir);
  mkdirSync(dirname(out), { recursive: true });
  const write = (body) => { writeFileSync(out, `${JSON.stringify({ version: 1, scope: args.scope, ...body }, null, 2)}\n`); console.log(`l7-base: ${JSON.stringify(body)}`); };

  const rev = sh('git', baseRevArgs(args.scope), ROOT);
  const head = sh('git', ['rev-parse', 'HEAD'], ROOT);
  if (!rev.ok || !/^[0-9a-f]{40}$/.test(rev.out)) { write({ sha: null, error: `cannot resolve the base commit (git ${baseRevArgs(args.scope).join(' ')}): ${rev.err}` }); return 0; }
  if (rev.out === head.out) { write({ sha: rev.out, error: 'base commit equals HEAD' }); return 0; }
  if (existsSync(dir)) { write({ sha: rev.out, error: `scratch dir ${args.dir} already exists` }); return 0; }
  const wt = sh('git', ['worktree', 'add', '--detach', dir, rev.out], ROOT);
  if (!wt.ok) { write({ sha: rev.out, error: `git worktree add failed: ${wt.err}` }); return 0; }
  const ci = sh('npm', ['ci', '--cache', join(ROOT, '.npm'), '--prefer-offline', '--no-audit', '--no-fund'], dir);
  if (!ci.ok) { write({ sha: rev.out, error: `npm ci at the base failed (exit ${ci.status}): ${ci.err}` }); return 0; }
  const sb = sh('npm', ['run', 'storybook:build'], dir);
  const staticDir = join(dir, 'storybook-static');
  if (!sb.ok || !existsSync(join(staticDir, 'index.json'))) { write({ sha: rev.out, error: `storybook:build at the base failed (exit ${sb.status}): ${sb.err}` }); return 0; }
  write({ sha: rev.out, storybookStatic: staticDir });
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
}
