#!/usr/bin/env node
/* REQ-QUAL-46 Dist JS scans (REQ-FIN-105, FIN-446). QUAL-owned.

   Usage:
     node scripts/qual/verify-dist-perf.mjs [--pkg <dir> | --tarball <file.tgz>] [--mode scan|bytes|all]
       [--out <file>] [--baseline <file> | --no-baseline] [--write-baseline]

   Input (first that applies): --pkg <dir> (a package root holding package.json + dist/), --tarball <tgz>,
   $AURAGLASS_TARBALL (EVIDENCE.tarballEnv, exported by plat:package:pack), else the repository root (dist/
   from plat:build:dist). A missing dist/ is a failure (fail-closed); "pending" is reported only by the lane runner.

   Mode: --mode wins; otherwise $LANE=L1 → scan (static dist scans), $LANE=L2 → all, unset → all.

   1. scan — every every .js/.mjs/.cjs file under dist/ is parsed with the TypeScript compiler (JS script kind) and walked:
        chartjs-register      `ChartJS.register`
        chart-defaults        `Chart.defaults`
        defaults-plugins      `defaults.plugins` / `<x>.defaults.plugins`
        window-global-write   module-scope assignment to `window.<x>` (outside every function / method / class)
        animate-banned-prop   `.animate(keyframes)` whose keyframes name backdropFilter, filter, --_ag-blur or a layout property
        transition-banned-prop inline `style.transition` (assignment, `style.setProperty('transition', …)`, or a `transition`
                              key inside a `style: {…}` object) naming backdrop-filter, filter, --_ag-blur or a layout property
        elements-from-point   any `elementsFromPoint`
        mutation-observer     `new MutationObserver(` outside the allowlist (primitives/DismissableLayer, @base-ui internals)
        fe-turbulence         any `feTurbulence` (string, template or identifier)
   2. bytes — for every value export X of `.` (read from the built entry, never a count literal) an esbuild 0.28.2
      metafile bundle of `export { X } from 'aura-glass'` (bundle + minify, esm, browser, React and peers external,
      gzip level 9). The bundle must contain no module from chart.js, react-chartjs-2, date-fns, three, @react-three/*,
      motion, framer-motion, d3-* (rule banned-module); the min+gzip byte count per export is a measurement for the L2
      lane manifest (REQ-QUAL-34/-37/-39/-62), never a size gate (byte gates are PLAT's).

   Offenders in other streams' files are carried by the shrink-only expiring baseline
   scripts/qual/baselines/dist-perf.json (PRD-F §4.3 rule 3: {file, rule, owner, reqFin, expires}). The gate fails on
   any offender not in the baseline, on a stale baseline row, and on every row once `expires` has passed ('RC-1' is
   passed when package.json version is an -rc.N or a stable 5.x version; an ISO date is passed after that day).

   Output: $AURAGLASS_EVIDENCE_DIR (default .artifacts)/qual/<CI_JOB_NAME_SLUG|local>/dist-perf.json with
   `bytes` (map keyed by export name), `violations`, `bundles`, `method`, `input`. Exit 0 pass, 1 fail, 64 usage. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { ROOT, DEFAULT_BASELINE, run, baselineRows } = require('./lib/dist-perf.cjs');

function outPath(opt) {
  if (opt) return resolve(opt);
  const base = process.env.AURAGLASS_EVIDENCE_DIR ?? join(ROOT, '.artifacts');
  return join(base, 'qual', process.env.CI_JOB_NAME_SLUG || 'local', 'dist-perf.json');
}

async function main(argv) {
  const opt = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
  const opts = { pkg: opt('pkg'), tarball: opt('tarball'), mode: opt('mode'), baseline: argv.includes('--no-baseline') ? false : opt('baseline') };
  let report;
  try { report = await run(opts); } catch (e) { console.error(String(e.message ?? e)); return e.code === 64 ? 64 : 1; }
  if (argv.includes('--write-baseline')) {
    if (report.problems.some((p) => p.kind === 'missing-dist')) { console.error('verify-dist-perf: no dist/ to baseline'); return 1; }
    const file = opts.baseline || DEFAULT_BASELINE;
    const rows = baselineRows(report.violations);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `[\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n]\n`);
    console.log(`verify-dist-perf: wrote ${rows.length} baseline rows to ${relative(ROOT, file)}`);
  }
  const out = outPath(opt('out'));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
  for (const p of report.problems) {
    const r = p.row ?? {};
    console.error(`verify-dist-perf: ${p.kind}: ${r.rule ?? ''} ${r.file ?? r.path ?? ''}${r.dist ? ` (${r.dist}:${r.line})` : ''}${r.detail ? ` [${r.detail}]` : ''}${r.owner ? ` owner=${r.owner} ${r.reqFin}` : ''}${r.expires ? ` expires=${r.expires}` : ''}`);
  }
  const exp = Object.keys(report.bytes).length;
  console.log(`verify-dist-perf: mode=${report.mode} files=${report.scanned.files} violations=${report.violations.length} (baselined ${report.violations.filter((v) => v.baselined).length}) exports-measured=${exp} → ${report.status} (${relative(ROOT, out)})`);
  return report.status === 'pass' ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).then((code) => process.exit(code));
