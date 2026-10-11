#!/usr/bin/env node
// scripts/storybook/verify-material-lab.mjs — REQ-QUAL-53 (REQ-FIN-106, FIN-451): the Material Lab belongs to QUAL.
// Contract S-41 / PRD-QUAL §4.10: "Material Lab stories live under .storybook/lab/** (main.ts glob) and are QUAL's;
// they compose MAT's public Surface family only." This check reads the story index computed from source (the same ids
// as storybook-static/index.json) and reports, per owner:
//   lab-outside-harness  a story titled `Material Lab` / `Material Lab/*` or declaring kind `lab` outside .storybook/lab/**
//   lab-id-collision     a story outside .storybook/lab/** whose id equals a Material Lab id (the Storybook build rejects
//                        duplicate ids, so this blocks qual:build:storybook until the owner removes it)
// Pre-existing offenders in other streams' files are listed in the expiring baseline
// certification/baselines-gates/material-lab.json (PRD-F §4.3 rule 3): new offenders fail, stale rows fail, every row
// fails from RC-1. CLI: node scripts/storybook/verify-material-lab.mjs [--init-baseline | --prune-baseline]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, staticIndex } from './lib/story-static.mjs';
import { baselineExpired } from '../qual/lint-stories.mjs';

export const LAB_FILE = './.storybook/lab/MaterialLab.stories.tsx';
export const BASELINE = 'certification/baselines-gates/material-lab.json';
const REQ_FIN = { MAT: 'REQ-FIN-59', CMP: 'REQ-FIN-70', SURF: 'REQ-FIN-80', PLAT: 'REQ-FIN-43' };
const inHarness = (importPath) => importPath.startsWith('./.storybook/lab/');
const isLabTitle = (title) => title === 'Material Lab' || String(title).startsWith('Material Lab/');

export function labViolations(entries) {
  const labIds = new Set(entries.filter((e) => e.importPath === LAB_FILE).map((e) => e.id));
  const out = [];
  for (const e of entries) {
    if (inHarness(e.importPath)) continue;
    const file = e.importPath.replace(/^\.\//, '');
    if (labIds.has(e.id)) out.push({ rule: 'lab-id-collision', key: e.id, file, owner: e.owner, message: `${file} declares ${e.id}, a Material Lab id` });
    else if (isLabTitle(e.title) || e.kind === 'lab') {
      out.push({ rule: 'lab-outside-harness', key: e.id, file, owner: e.owner, message: `${file}: ${e.id} (${isLabTitle(e.title) ? `title "${e.title}"` : 'kind lab'}) is outside .storybook/lab/**` });
    }
  }
  return out;
}

const rowKey = (r) => `${r.rule}|${r.key}|${r.file}`;

export function loadBaseline(root = ROOT) {
  const abs = join(root, BASELINE);
  if (!existsSync(abs)) return { rows: [] };
  const b = JSON.parse(readFileSync(abs, 'utf8'));
  if (b.version !== 1 || b.gate !== 'material-lab' || b.expires !== 'RC-1' || !Array.isArray(b.rows)) throw new Error(`${BASELINE}: bad header`);
  for (const r of b.rows) {
    if (!['lab-id-collision', 'lab-outside-harness'].includes(r.rule) || typeof r.key !== 'string' || typeof r.file !== 'string'
      || typeof r.owner !== 'string' || r.owner === 'QUAL' || typeof r.reqFin !== 'string') throw new Error(`${BASELINE}: malformed row ${JSON.stringify(r)}`);
  }
  return b;
}

/** { introduced, baselined, stale } — QUAL offenders are never baselined; after RC-1 nothing is. */
export function compare(violations, baseline, version) {
  const expired = baselineExpired(version);
  const known = new Set(expired ? [] : baseline.rows.map(rowKey));
  const seen = new Set(violations.map(rowKey));
  return {
    expired,
    introduced: violations.filter((v) => !known.has(rowKey(v))),
    baselined: violations.filter((v) => known.has(rowKey(v))),
    stale: baseline.rows.filter((r) => !seen.has(rowKey(r))),
  };
}

export function main(argv = process.argv.slice(2), root = ROOT) {
  const v = labViolations(staticIndex(root).entries);
  const abs = join(root, BASELINE);
  if (argv.includes('--init-baseline')) {
    if (existsSync(abs)) throw new Error(`${BASELINE} exists; it only shrinks (--prune-baseline)`);
    mkdirSync(dirname(abs), { recursive: true });
    const rows = v.filter((x) => x.owner !== 'QUAL').map((x) => ({ rule: x.rule, key: x.key, file: x.file, owner: x.owner, reqFin: REQ_FIN[x.owner] ?? 'unassigned' }))
      .sort((a, b) => a.file.localeCompare(b.file) || a.key.localeCompare(b.key));
    writeFileSync(abs, `${JSON.stringify({
      $comment: 'Expiring baseline (PRD-F §4.3 rule 3) for scripts/storybook/verify-material-lab.mjs (REQ-QUAL-53, REQ-FIN-106): Material Lab stories outside .storybook/lab/**. Written by --init-baseline; shrinks only. lab-id-collision rows also break the Storybook build until the owner removes them. Empty at RC-1.',
      version: 1, gate: 'material-lab', reqFin: 'REQ-FIN-106', expires: 'RC-1', rows,
    }, null, 2)}\n`);
    console.log(`verify-material-lab: baseline written with ${rows.length} row(s)`);
    return 0;
  }
  const b = loadBaseline(root);
  if (argv.includes('--prune-baseline')) {
    const seen = new Set(v.map(rowKey));
    b.rows = b.rows.filter((r) => seen.has(rowKey(r)));
    writeFileSync(abs, `${JSON.stringify(b, null, 2)}\n`);
    return 0;
  }
  const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  const r = compare(v, b, version);
  for (const x of r.baselined) console.log(`  baselined [${x.rule}] ${x.message} (${x.owner})`);
  for (const x of r.introduced) console.error(`  FAIL [${x.rule}] ${x.message} (${x.owner})`);
  for (const s of r.stale) console.error(`  FAIL stale baseline row [${s.rule}] ${s.key} (${s.file}): delete it`);
  return r.introduced.length + r.stale.length ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main());
