#!/usr/bin/env node
/* scripts/qual/deliverables/check.ts — CLI for REQ-QUAL-71 (G-04 flagship deliverables), registered on L1.
 *
 *   node --experimental-strip-types scripts/qual/deliverables/check.ts [--phase pre-rc|rc] [--artifacts <dir>]
 *        [--json <file>] [--write-baseline] [--quiet]
 *
 * (Node ≥ 22.18 strips types without the flag; the flag keeps Node 22.6–22.17 working.)
 * Phase: `--phase`, else CI_COMMIT_TAG (`v5.x.y-rc.N` or a stable 5.x tag → rc), else pre-rc.
 * Exit 0 when no flagship item is `fail`, 1 otherwise, 2 on usage error. `--write-baseline` rewrites
 * certification/deliverables-baseline.json from the current offenders (each row `expires: "RC-1"`) and exits 0;
 * it is refused at rc, where the baseline no longer applies.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BASELINE_FILE, baselineFrom, collectInputs, evaluate, readBaseline,
} from '../../../packages/qa/src/deliverables/check.ts';
import type { Phase } from '../../../packages/qa/src/deliverables/check.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

function phaseFromEnv(env: NodeJS.ProcessEnv): Phase {
  const tag = env.CI_COMMIT_TAG ?? '';
  return /^v?5\.\d+\.\d+(-rc\.\d+)?$/.test(tag) ? 'rc' : 'pre-rc';
}

function main(argv: string[]): number {
  let phase: Phase = phaseFromEnv(process.env);
  let artifacts = ROOT;
  let json = join(process.env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG || 'local', 'deliverables.json');
  let writeBaseline = false;
  let quiet = false;
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--phase') {
      const v = argv[++i];
      if (v !== 'rc' && v !== 'pre-rc') { console.error(`deliverables: --phase must be rc|pre-rc, got ${v}`); return 2; }
      phase = v;
    } else if (a === '--artifacts') { const v = argv[++i]; if (!v) { console.error('deliverables: --artifacts needs a dir'); return 2; } artifacts = resolve(v); }
    else if (a === '--json') { const v = argv[++i]; if (!v) { console.error('deliverables: --json needs a path'); return 2; } json = v; }
    else if (a === '--write-baseline') writeBaseline = true;
    else if (a === '--quiet') quiet = true;
    else { console.error(`deliverables: unknown argument ${a}`); return 2; }
  }
  const inputs = collectInputs(ROOT, { artifactsDir: artifacts });
  if (writeBaseline) {
    if (phase === 'rc') { console.error('deliverables: the offender baseline expires at RC-1; refusing --write-baseline at rc'); return 2; }
    const b = baselineFrom(inputs.metas);
    writeFileSync(join(ROOT, BASELINE_FILE), `${JSON.stringify(b, null, 2)}\n`);
    console.log(`deliverables: wrote ${BASELINE_FILE} (${b.rows.length} offender row(s), expires RC-1)`);
    return 0;
  }
  const report = evaluate(inputs, { phase, baseline: readBaseline(ROOT) });
  const out = resolve(ROOT, json);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  if (!quiet) {
    for (const f of report.flagships) {
      const open = Object.entries(f.items).filter(([, r]) => r.status !== 'pass').map(([id, r]) => `${id}=${r.status}`);
      console.log(`${String(f.flagship).padStart(2)} ${f.owner.padEnd(4)} ${f.status.padEnd(7)} ${(f.subjects.join('/') || '(none)').padEnd(40)} ${open.join(' ')}`);
    }
    for (const o of report.offenders) {
      console.log(`offender ${o.status.padEnd(7)} [${o.owner}] ${o.kind} flagship ${o.flagship}${o.metas.length ? `: ${o.metas.join(', ')}` : ''}${o.baselined ? ' (baselined, expires RC-1)' : ''}`);
    }
    for (const r of report.staleBaselineRows) console.log(`stale baseline row (offender fixed; remove with --write-baseline): ${r.kind} flagship ${r.flagship} [${r.owner}]`);
  }
  console.log(`deliverables (REQ-QUAL-71, phase ${phase}): ${report.flagshipCount} flagships — ${Object.entries(report.byOwner).map(([o, c]) => `${o} pass ${c.pass}/pending ${c.pending}/fail ${c.fail}/offenders ${c.offenders}`).join('; ')}`);
  console.log(`  report: ${json}`);
  return report.ok ? 0 : 1;
}

process.exitCode = main(process.argv.slice(2));
