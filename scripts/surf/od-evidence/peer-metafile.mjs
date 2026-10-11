#!/usr/bin/env node
// scripts/surf/od-evidence/peer-metafile.mjs — OD-17 evidence probe (FIN-F.3.0 (a), REQ-SURF-04).
//
// Runs against the BUILT dist (the plat:build:dist artifact) and writes, under
// .artifacts/surf/od-17/:
//   <leg>.metafile.json   full esbuild metafile for each consumer import leg
//   summary.json          per leg: surviving output inputs, banned-peer hits,
//                         SURF-tree hits, output bytes; plus the
//                         "date peers absent" bundle and Node-import results
//
// Every number in summary.json is produced by esbuild / Node in this run;
// nothing is hand-entered. The probe asserts nothing about which OD-17 option
// is right; it records what each option has to change. It exits non-zero only
// when dist is missing or a measurement itself crashes.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const OUT = join(ROOT, '.artifacts', 'surf', 'od-17');
const DATE_PEERS = ['@internationalized/date', 'react-aria-components'];
const BANNED = /react-aria-components|@internationalized[\\/]date|[\\/]d3-/;
const SURF_TREES = /[\\/]dist[\\/](?:data|date|ai|media|charts)[\\/]/;
const EXTERNAL = ['react', 'react-dom', 'react/*', 'react-dom/*'];

const LEGS = [
  { id: 'root-Button', spec: 'aura-glass', named: 'Button' },
  { id: 'data-Table', spec: 'aura-glass/data', named: 'Table' },
  { id: 'compat-GlassHeader', spec: 'aura-glass/compat', named: 'GlassHeader' },
  { id: 'compat-GlassDatePicker', spec: 'aura-glass/compat', named: 'GlassDatePicker' },
];

for (const f of ['dist/index.js', 'dist/data/index.js', 'dist/compat/index.js']) {
  if (!existsSync(join(ROOT, f))) {
    console.error(`[od-17] ${f} missing: run in CI after plat:build:dist (needs its dist/ artifact).`);
    process.exit(2);
  }
}
mkdirSync(OUT, { recursive: true });

/* A throwaway consumer project whose node_modules/aura-glass symlinks the repo
   root, so resolution goes through the real package.json exports map. */
const consumer = (spec, named) => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-od17-'));
  writeFileSync(join(dir, 'in.js'), `import { ${named} } from '${spec}';\nconsole.log(${named});\n`);
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
  mkdirSync(join(dir, 'node_modules'));
  symlinkSync(ROOT, join(dir, 'node_modules', 'aura-glass'));
  return dir;
};

/* esbuild plugin that makes the optional date peers unresolvable, i.e. a
   consumer that did not install them. */
const hideDatePeers = {
  name: 'hide-date-peers',
  setup(b) {
    const re = new RegExp(`^(?:${DATE_PEERS.map((p) => p.replace(/[/.]/g, '\\$&')).join('|')})(?:/.*)?$`);
    b.onResolve({ filter: re }, (a) => ({ errors: [{ text: `peer not installed: ${a.path} (imported by ${a.importer})` }] }));
  },
};

const bundle = async (leg, { plugins = [] } = {}) => {
  const dir = consumer(leg.spec, leg.named);
  const r = await build({
    entryPoints: [join(dir, 'in.js')],
    absWorkingDir: dir,
    bundle: true,
    metafile: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    mainFields: ['exports', 'module', 'main'],
    loader: { '.css': 'empty' },
    external: EXTERNAL,
    outfile: join(dir, 'out.js'),
    logLevel: 'silent',
    plugins,
  });
  return r;
};

const summary = { generatedBy: 'scripts/surf/od-evidence/peer-metafile.mjs', commit: process.env.CI_COMMIT_SHA ?? null, job: process.env.CI_JOB_URL ?? null, legs: [], datePeersAbsent: [], nodeImport: [] };

for (const leg of LEGS) {
  const r = await bundle(leg);
  writeFileSync(join(OUT, `${leg.id}.metafile.json`), JSON.stringify(r.metafile, null, 1));
  const [outName, out] = Object.entries(r.metafile.outputs).find(([k]) => k.endsWith('out.js'));
  const rel = (i) => i.replace(/^(?:\.\.\/)+/, '/').replace(ROOT + '/', '');
  const surviving = Object.keys(out.inputs).map(rel);
  summary.legs.push({
    id: leg.id,
    import: `import { ${leg.named} } from '${leg.spec}'`,
    output: outName.split(/[\\/]/).pop(),
    outputBytes: out.bytes,
    scannedInputs: Object.keys(r.metafile.inputs).length,
    survivingInputs: surviving.length,
    bannedPeerHits: surviving.filter((i) => BANNED.test(i)),
    surfTreeHits: surviving.filter((i) => SURF_TREES.test(i)),
    scannedDatePeerFiles: Object.keys(r.metafile.inputs).filter((i) => BANNED.test(i)).length,
  });
}

/* Bundler consumer without the optional date peers installed. */
for (const leg of LEGS.filter((l) => l.spec === 'aura-glass/compat')) {
  try {
    const r = await bundle(leg, { plugins: [hideDatePeers] });
    summary.datePeersAbsent.push({ id: leg.id, ok: true, errors: [], outputBytes: Object.values(r.metafile.outputs)[0].bytes });
  } catch (e) {
    summary.datePeersAbsent.push({ id: leg.id, ok: false, errors: (e.errors ?? [{ text: String(e.message) }]).map((x) => x.text.replaceAll(ROOT + '/', '')) });
  }
}

/* Unbundled Node ESM consumer: `import('aura-glass/compat')` with and without
   the date peers. A loader hook stubs CSS imports and (in the "absent" run)
   throws ERR_MODULE_NOT_FOUND for the date peers. */
const hooks = (hide) => `
const PEERS = ${JSON.stringify(hide ? DATE_PEERS : [])};
export async function resolve(s, c, next) {
  if (PEERS.some((p) => s === p || s.startsWith(p + '/'))) {
    const e = new Error("Cannot find package '" + s + "' imported from " + c.parentURL); e.code = 'ERR_MODULE_NOT_FOUND'; throw e;
  }
  if (s.endsWith('.css')) return { url: 'data:text/javascript,export default {}', shortCircuit: true };
  return next(s, c);
}`;
for (const hide of [false, true]) {
  const dir = consumer('aura-glass/compat', 'GlassHeader');
  writeFileSync(join(dir, 'hooks.mjs'), hooks(hide));
  writeFileSync(join(dir, 'reg.mjs'), "import { register } from 'node:module'; register('./hooks.mjs', import.meta.url);");
  writeFileSync(join(dir, 'probe.mjs'), "const m = await import('aura-glass/compat'); console.log(JSON.stringify({ GlassHeader: typeof m.GlassHeader, GlassDatePicker: typeof m.GlassDatePicker }));");
  const p = spawnSync(process.execPath, ['--import', './reg.mjs', 'probe.mjs'], { cwd: dir, encoding: 'utf8' });
  summary.nodeImport.push({
    datePeers: hide ? 'absent' : 'installed',
    exitCode: p.status,
    stdout: p.stdout.trim().slice(0, 400),
    stderr: (p.stderr.match(/^\w*Error.*$/m) ?? [p.stderr.trim().split('\n')[0] ?? ''])[0].slice(0, 400),
  });
}

writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
