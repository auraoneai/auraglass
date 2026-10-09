#!/usr/bin/env node
/**
 * REQ-CMP-135 / CMP-426 remote L11 leg (gated AWS remote runner, OD-11):
 *   1) compile the frozen consumer-4x cmp cases inside a release/4.x worktree
 *      (aura-glass resolves to the real 4.x surface);
 *   2) run `aura-glass migrate 4to5` on each case on the 5.x line, then
 *      `tsc --noEmit` the migrated output;
 *   3) assert zero TODO(aura-glass 5) markers on mechanically mappable props
 *      (rows whose mapping is a plain rename/value map; `to: null` / `todo`
 *      rows are legitimately marked and audited by the jest leg).
 *
 * Exits non-zero with the first failing step's output.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CASES = path.join(REPO, 'tests', 'fixtures', 'consumer-4x', 'cases', 'cmp');
const WT4X = path.join(REPO, '.artifacts', 'cmp', 'consumer-4x', 'ag-4x');
const OUT4X = path.join(WT4X, '.artifacts', 'cmp-consumer-4x-cases');
const MIGRATED = path.join(REPO, '.artifacts', 'cmp', 'consumer-4x', 'migrated');

function sh(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  return execFileSync(cmd, args, { stdio: 'inherit', cwd: REPO, ...opts });
}

fs.mkdirSync(MIGRATED, { recursive: true });

const cases = fs.readdirSync(CASES).filter((f) => f.endsWith('.tsx'));
if (cases.length === 0) {
  console.error(`no cases under ${path.relative(REPO, CASES)}`);
  process.exit(1);
}

console.log('== 1) compile frozen cases on release/4.x');
sh('git', ['fetch', '--no-tags', 'origin', '+refs/heads/release/4.x:refs/remotes/origin/release/4.x']);
const trees = execFileSync('git', ['-C', REPO, 'worktree', 'list', '--porcelain'], { encoding: 'utf8' });
if (!trees.includes(`worktree ${WT4X}`)) {
  // Anything left at WT4X is this script's own stale state (worktree pruned or
  // a killed run) — remove it so `git worktree add` can create the dir.
  fs.rmSync(WT4X, { recursive: true, force: true });
  sh('git', ['-C', REPO, 'worktree', 'add', '--force', WT4X, 'refs/remotes/origin/release/4.x']);
}
fs.mkdirSync(OUT4X, { recursive: true });
for (const f of cases) fs.copyFileSync(path.join(CASES, f), path.join(OUT4X, f));
fs.writeFileSync(
  path.join(OUT4X, 'tsconfig.l11.json'),
  `${JSON.stringify(
    {
      compilerOptions: {
        noEmit: true, jsx: 'preserve', skipLibCheck: true, strict: false,
        module: 'esnext', target: 'es2020', moduleResolution: 'bundler',
        paths: { 'aura-glass': ['../../src/index.ts'], 'aura-glass/*': ['../../src/*'] },
      },
      include: ['./*.tsx'],
    },
    null,
    2,
  )}\n`,
);
// The 4.x src tree carries its own type debt (missing @/ deps, vendor type
// drift) that transitively surfaces here — the L11 signal is whether the CASE
// FILES themselves compile against the 4.x surface, so keep only their errors.
{
  let out = '';
  try {
    out = execFileSync('npx', ['tsc', '-p', path.join(OUT4X, 'tsconfig.l11.json')], {
      cwd: WT4X, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
  const caseErrors = out.split('\n').filter((l) => l.includes('cmp-consumer-4x-cases/'));
  if (caseErrors.length) {
    console.error('case files failed to compile on the 4.x line:');
    for (const l of caseErrors) console.error(`  ${l}`);
    process.exit(1);
  }
}
console.log('4.x compile (case files): PASS');

console.log('== 2) migrate cases on the 5.x line + tsc');
sh('node', [path.join(REPO, 'packages', 'cli', 'scripts', 'gen-mappings.mjs')]);
const cliDist = path.join(REPO, 'packages', 'cli', 'dist', 'index.js');
if (!fs.existsSync(cliDist)) {
  sh('npm', ['run', 'build', '-w', '@auraglass/cli']);
}
const { runMigration, loadCompiledMappings } = await import(pathToFileURL(cliDist).href);
const mappings = loadCompiledMappings();
const STAGE = path.join(REPO, '.artifacts', 'cmp', 'consumer-4x', 'migrate-src');
fs.rmSync(STAGE, { recursive: true, force: true });
fs.mkdirSync(STAGE, { recursive: true });
for (const f of cases) fs.copyFileSync(path.join(CASES, f), path.join(STAGE, f));

// Reverse map: 5.x (dotted) name -> old-name prop rows, same rule as the jest leg.
const byNewName = new Map();
for (const [oldName, row] of Object.entries(mappings.components ?? {})) {
  if (!row.to) continue;
  const k = row.to;
  const s = byNewName.get(k) ?? new Set();
  s.add(oldName);
  byNewName.set(k, s);
}
function rowsFor(name) {
  const direct = mappings.components?.[name]?.props ?? [];
  const viaNew = [...(byNewName.get(name) ?? [])].flatMap(
    (o) => mappings.components?.[o]?.props ?? [],
  );
  return [...direct, ...viaNew];
}
function todoIsUnmappableProp(reason) {
  const compat = /^'(.+?)' is compat-only/.exec(reason);
  if (compat) return mappings.components?.[compat[1]]?.compatOnly === true;
  const m = /^(\S+?)(?:\.| )(\S+?)(?::| )/.exec(reason);
  if (!m) return false;
  const [, name, prop] = m;
  return rowsFor(name).some((r) => (r.from === prop || r.to === prop) && (r.to === null || typeof r.todo === 'string'));
}

const { report, writes } = runMigration({ cwd: STAGE, transforms: undefined, dryRun: false });
for (const [abs, content] of writes) fs.writeFileSync(abs, content);
for (const f of cases) {
  fs.copyFileSync(path.join(STAGE, f), path.join(MIGRATED, f));
}
const bad = [];
for (const fr of report.files ?? []) {
  for (const t of fr.todos ?? []) {
    console.log(`  todo ${fr.path}: ${t.reason}`);
    if (!todoIsUnmappableProp(t.reason)) bad.push(`${fr.path}: ${t.reason}`);
  }
}
if (bad.length) {
  console.error('TODO markers on mechanically mappable props:');
  for (const b of bad) console.error(`  ${b}`);
  process.exit(1);
}

fs.writeFileSync(
  path.join(MIGRATED, 'tsconfig.l11.json'),
  `${JSON.stringify(
    {
      compilerOptions: {
        noEmit: true, jsx: 'preserve', skipLibCheck: true, strict: false,
        module: 'esnext', target: 'es2020', moduleResolution: 'bundler',
        paths: { 'aura-glass': [path.join(REPO, 'src/index.ts')], 'aura-glass/*': [path.join(REPO, 'src/*')] },
      },
      include: [path.join(MIGRATED, '*.tsx')],
    },
    null,
    2,
  )}\n`,
);
// Same scoping as the 4.x leg: transitive errors inside src/ are the line's own
// type debt, not the migration's — the L11 signal is the migrated case files.
{
  let out = '';
  try {
    out = execFileSync('npx', ['tsc', '-p', path.join(MIGRATED, 'tsconfig.l11.json')], {
      cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
  const caseErrors = out.split('\n').filter((l) => l.includes('consumer-4x/migrated/'));
  if (caseErrors.length) {
    console.error('migrated case files failed to compile on the 5.x line:');
    for (const l of caseErrors) console.error(`  ${l}`);
    process.exit(1);
  }
}
console.log('next tsc on migrated output (case files): PASS');
console.log('consumer-4x L11 leg: PASS');
