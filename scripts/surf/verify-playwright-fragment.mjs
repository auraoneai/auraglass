#!/usr/bin/env node
// scripts/surf/verify-playwright-fragment.mjs — REQ-SURF-194 / REQ-FIN-90
// (AC-FIN-90) gate over the Playwright project fragments (contract S-45 row
// `playwright`: each fragments/playwright/<stream>.json is a
// PlaywrightProjectFragment[] spread verbatim into playwright.config.ts and,
// for `<stream>:cert-*` names, certification/playwright.cert.config.ts).
//
// Fails (exit 1) with one line per finding when:
//   - any stream's fragment is not a JSON array (a keyed object is spread into
//     playwright.config.ts as a single unnamed project);
//   - a project name is not unique across all fragments/playwright/*.json;
//   - a declared testDir is missing or is not a directory;
//   - a SURF project has no testDir, or its name is not `surf:<id>`;
//   - a SURF project's testMatch matches no file under its testDir.
// Foreign projects without a testDir are printed as `note:` lines (their
// owning stream fixes them; QUAL's tests/contract/fragments.test.ts is the
// cross-stream assertion) and do not fail this SURF gate.
//
// Usage: node scripts/surf/verify-playwright-fragment.mjs [--root <dir>]
// Registered on L1 through fragments/lanes/surf.ts (W5 block).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Playwright prefixes a string testMatch with `**\/` unless it already starts with it. */
function testMatchFiles(picomatch, absDir, pattern) {
  const glob = pattern.startsWith('**/') ? pattern : `**/${pattern}`;
  const isMatch = picomatch(glob, { dot: false });
  return walk(absDir).filter((f) => isMatch(relative(absDir, f).split(sep).join('/')));
}

export function verifyPlaywrightFragments(root) {
  const picomatch = createRequire(import.meta.url)('picomatch');
  const errors = [];
  const notes = [];
  const owners = new Map();
  let projects = 0;
  for (const stream of STREAMS) {
    const file = `fragments/playwright/${stream}.json`;
    const abs = join(root, file);
    if (!existsSync(abs)) continue;
    let value;
    try {
      value = JSON.parse(readFileSync(abs, 'utf8'));
    } catch (e) {
      errors.push(`${file}: invalid JSON (${e.message})`);
      continue;
    }
    if (!Array.isArray(value)) {
      errors.push(`${file}: must be a PlaywrightProjectFragment[] (got ${value === null ? 'null' : typeof value} with keys ${Object.keys(value ?? {}).join(',')})`);
      continue;
    }
    for (const p of value) {
      projects++;
      const name = typeof p?.name === 'string' ? p.name : null;
      if (!name) {
        errors.push(`${file}: project without a string name: ${JSON.stringify(p)}`);
        continue;
      }
      if (owners.has(name)) errors.push(`${file}: duplicate project name ${name} (also in ${owners.get(name)})`);
      else owners.set(name, file);
      if (stream === 'surf' && !name.startsWith('surf:')) errors.push(`${file}: ${name} is not named surf:<id>`);
      if (typeof p.testDir !== 'string') {
        if (stream === 'surf') errors.push(`${file}: ${name} has no testDir`);
        else notes.push(`${file}: ${name} has no testDir (owner: ${stream})`);
        continue;
      }
      const dir = join(root, p.testDir);
      if (!existsSync(dir)) {
        errors.push(`${file}: ${name} testDir ${p.testDir} does not exist`);
        continue;
      }
      if (!statSync(dir).isDirectory()) {
        errors.push(`${file}: ${name} testDir ${p.testDir} is not a directory`);
        continue;
      }
      if (stream === 'surf' && p.testMatch !== undefined) {
        if (typeof p.testMatch !== 'string') errors.push(`${file}: ${name} testMatch must be a string`);
        else if (!testMatchFiles(picomatch, dir, p.testMatch).length) errors.push(`${file}: ${name} testMatch ${p.testMatch} matches no file under ${p.testDir}`);
      }
    }
  }
  return { errors, notes, projects };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const i = process.argv.indexOf('--root');
  const root = i >= 0 ? process.argv[i + 1] : fileURLToPath(new URL('../../', import.meta.url));
  const { errors, notes, projects } = verifyPlaywrightFragments(root);
  for (const n of notes) console.log(`note: ${n}`);
  for (const e of errors) console.error(`error: ${e}`);
  console.log(`verify-playwright-fragment: ${projects} projects, ${errors.length} errors, ${notes.length} notes`);
  process.exit(errors.length ? 1 : 0);
}
