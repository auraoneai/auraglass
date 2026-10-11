#!/usr/bin/env node
/* REQ-PLAT-71: after a canary installs the aura-glass tarball, assert the
   singleton packages resolve to exactly ONE version each and that no
   node_modules nests under node_modules/aura-glass (a nested copy would
   double-mount context providers / theme bridges). Usage:
     node scripts/ci/single-instance-check.mjs <canary-dir> */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SINGLETONS = ['react', 'react-dom', '@base-ui/react'];

/** Resolved versions of each singleton in an `npm ls --all --json` tree. */
export function singletonVersions(tree) {
  const versions = {};
  const visit = (n) => {
    if (!n?.dependencies) return;
    for (const [name, dep] of Object.entries(n.dependencies)) {
      if (SINGLETONS.includes(name) && dep.version) {
        (versions[name] ??= new Set()).add(dep.version);
      }
      visit(dep);
    }
  };
  visit(tree);
  return Object.fromEntries(SINGLETONS.map((name) => [name, [...(versions[name] ?? [])].sort()]));
}

/** Problems in a tree: a singleton resolved to more than one version, or not at all. */
export function treeProblems(tree) {
  const problems = [];
  for (const [name, vs] of Object.entries(singletonVersions(tree))) {
    if (vs.length === 0) problems.push(`${name} is not installed`);
    if (vs.length > 1) problems.push(`${name} resolved to ${vs.length} versions: ${vs.join(', ')}`);
  }
  return problems;
}

export function check(dir) {
  const problems = [];
  const ls = spawnSync('npm', ['ls', ...SINGLETONS, '--all', '--json'], { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20 });
  let tree = null;
  try { tree = JSON.parse(ls.stdout); } catch { /* unresolved peers exit nonzero but still print JSON */ }
  if (!tree) problems.push(`npm ls produced no JSON in ${dir}`);
  else {
    problems.push(...treeProblems(tree));
    for (const [name, vs] of Object.entries(singletonVersions(tree))) console.log(`single-instance: ${name} ${vs.join(', ') || '(none)'}`);
  }
  const nested = join(dir, 'node_modules', 'aura-glass', 'node_modules');
  if (existsSync(nested) && readdirSync(nested).filter(d => !d.startsWith('.')).length) {
    problems.push(`nested node_modules under aura-glass in ${dir}: ${readdirSync(nested).join(', ')}`);
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = resolve(process.argv[2] ?? '.');
  const problems = check(dir);
  for (const p of problems) console.error(`single-instance: ${p}`);
  if (problems.length) process.exit(1);
  console.log(`single-instance: ${dir} OK (react/react-dom/@base-ui single-version)`);
}
