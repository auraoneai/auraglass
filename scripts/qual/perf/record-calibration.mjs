#!/usr/bin/env node
/* scripts/qual/perf/record-calibration.mjs — REQ-QUAL-39 (QUAL). The only writer of certification/calibration.json.
   Refuses unless: the tag is a 5.x pre-release; every thresholds.json#perf.calibration.seedFreeSubjects meta directory
   (Button, Dialog) carries no seed marker at the tag's commit; both evidence URLs (the qual:certify:l10 and qual:certify:l2
   job artifacts that drove the Perf-Budget-Raise window) are https URLs. Calibration is recorded once: an existing sha is
   never overwritten.

   Usage: node scripts/qual/perf/record-calibration.mjs --tag v5.0.0-alpha.1 --l10 <job artifact URL> --l2 <job artifact URL> */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT, git, loadQa, readMetas, seedMarkersAt } from './lib.mjs';

export async function recordCli(argv = process.argv.slice(2), log = (s) => process.stdout.write(`${s}\n`), root = ROOT) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) o[String(argv[i]).replace(/^--/, '')] = argv[i + 1];
  if (!o.tag || !o.l10 || !o.l2) { log('usage: --tag <v5 pre-release> --l10 <url> --l2 <url>'); return 64; }
  const file = join(root, 'certification/calibration.json');
  const cur = JSON.parse(readFileSync(file, 'utf8'));
  if (cur.sha !== null) { log(`calibration already recorded at ${cur.sha} (${cur.tag}); it is recorded once`); return 1; }
  if (!/^v5\.\d+\.\d+-[0-9A-Za-z.-]+$/.test(o.tag)) { log(`${o.tag} is not a 5.x pre-release tag`); return 1; }
  const sha = git(['rev-list', '-n', '1', o.tag], root);
  const { perf } = (await loadQa('budgets')).loadPerfThresholds(root);
  const metas = await readMetas(root);
  const dirs = perf.calibration.seedFreeSubjects.map((s) => metas.find((m) => m.name === s)?.dir ?? null);
  if (dirs.includes(null)) { log(`no ComponentMeta for ${perf.calibration.seedFreeSubjects.filter((_, i) => !dirs[i]).join(', ')}`); return 1; }
  const seeds = seedMarkersAt(sha, dirs, root);
  if (seeds.length) { log(`not calibrating: seed markers at ${o.tag}: ${seeds.join(', ')}`); return 1; }
  const doc = { $comment: cur.$comment, sha, tag: o.tag, recordedAt: new Date().toISOString(), evidence: { l10: o.l10, l2: o.l2 } };
  (await loadQa('freeze')).parseCalibration(doc);
  writeFileSync(file, `${JSON.stringify(doc, null, 2)}\n`);
  log(`calibration recorded: ${o.tag} ${sha}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  recordCli().then((c) => { process.exitCode = c; }, (e) => { process.stderr.write(`${e?.stack ?? e}\n`); process.exitCode = 1; });
}
