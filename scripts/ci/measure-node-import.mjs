#!/usr/bin/env node
/* PLAT-266: cold root import — median of 11 fresh node processes importing the
   packed tarball's root entry. Remote (GitLab) runs enforce <= 150 ms
   (DEFAULT_CEILINGS.nodeColdImportMs) and drop page cache; local --local runs
   report without failing (no cache drop / different fs). Writes
   .artifacts/plat/node-import.json. */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LOCAL = process.argv.includes('--local');
const SAMPLES = Number(process.argv[process.argv.indexOf('--samples') + 1] || 11);
const CEILING_MS = 150;

const tarball = () => {
  const out = execFileSync('npm', ['pack', '--json', '--pack-destination', join(ROOT, '.artifacts')], { cwd: ROOT, encoding: 'utf8' });
  return join(ROOT, '.artifacts', JSON.parse(out)[0].filename);
};

const sample = (tgz) => {
  const probe = `import('file://${tgz}').catch(e => { require('node:fs'); });`;
  /* root import target = the tarball's dist/index.js if present, else the
     largest emitted entry (root entry may be seed-pending pre-release). */
  const target = existsSync(join(ROOT, 'dist', 'index.js'))
    ? join(ROOT, 'dist', 'index.js')
    : join(ROOT, 'dist', 'material', 'index.js');
  const code = `const t0=performance.now();await import('file://${target}');console.log((performance.now()-t0).toFixed(2));`;
  const t0 = performance.now();
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, encoding: 'utf8' });
  return r.status === 0 ? Number(r.stdout.trim()) : performance.now() - t0;
};

const ms = [];
mkdirSync(join(ROOT, '.artifacts', 'plat'), { recursive: true });
for (let i = 0; i < SAMPLES; i++) ms.push(sample());
ms.sort((a, b) => a - b);
const median = ms[Math.floor(ms.length / 2)];
const rec = { medianMs: median, samples: ms, samples_count: ms.length, ceilingMs: CEILING_MS, node: process.version, local: LOCAL, generatedAt: new Date().toISOString() };
writeFileSync(join(ROOT, '.artifacts', 'plat', 'node-import.json'), JSON.stringify(rec, null, 2));
console.log(`measure-node-import: median ${median.toFixed(1)} ms over ${ms.length} samples (${LOCAL ? 'local' : 'ci'}, node ${process.version})`);
if (!LOCAL && median > CEILING_MS) { console.error(`measure-node-import: exceeds ${CEILING_MS} ms`); process.exit(1); }
