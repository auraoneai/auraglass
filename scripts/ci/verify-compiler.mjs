#!/usr/bin/env node
/* PLAT-272 / REQ-PLAT-72 (REQ-FIN-37): run babel-plugin-react-compiler@1.0.0
   (compilationMode 'infer', panicThreshold 'none') over the sources of every
   emitted dist js file and fail on any non-success event (CompileError,
   CompileSkip, PipelineError, …) recorded by its logger.
   OI-4 verified 2026-10-08 (react.dev/learn/react-compiler + the 1.0.0
   babel-plugin README): the plugin emits logger events via
   `logger.logEvent(filename, event)` where event.kind is one of
   'CompileError' | 'CompileSuccess' | 'CompileSkip' | 'PipelineError'. The
   plugin resolves from the canary's node_modules first (it is never a
   runtime dep of aura-glass).
   Input: tsdown runs unbundled, so each dist/<rel>.js has a src/<rel>.tsx|ts
   counterpart; the compiler is fed that source (JSX intact). In emitted
   `jsx('div', { ref })` calls a ref object is an ordinary call argument, so
   compiling dist would report 'Cannot access refs during render' for every
   ref pass. A dist file with no src counterpart is compiled as emitted.
   Cross-stream offenders: source files other WPs still have to make
   compiler-clean are rows of the expiring baseline
   scripts/integration/baselines/react19.json (rule "compiler", count = the
   number of non-success events; PRD-F §4.3 rule 3). New offenders, raised
   counts, stale rows and malformed rows fail.
   --rows prints the current offender rows as JSON (tool output for the
   baseline owner) and exits 0. */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { DIST, ROOT, walk } from '../build/lib/graph.mjs';
import { BASELINE_REL, diffBaseline, loadBaseline, rowsFor, srcCounterpart } from './lib/react19-gate.mjs';

const relPath = (f) => relative(ROOT, f).split(sep).join('/');

const resolvePlugin = () => {
  for (const base of [join(ROOT, 'canaries', 'vite-compiler'), ROOT]) {
    try { return createRequire(join(base, 'package.json')).resolve('babel-plugin-react-compiler'); }
    catch { /* keep looking */ }
  }
  return null;
};

export async function run(argv = process.argv.slice(2)) {
  const printRows = argv.includes('--rows');
  if (!existsSync(DIST)) { console.error('verify-compiler: dist missing — build first'); return 1; }
  const pluginPath = resolvePlugin();
  if (!pluginPath) {
    console.error('verify-compiler: babel-plugin-react-compiler not installed — run npm install in canaries/vite-compiler first (it owns the dep; the package may not).');
    return 1;
  }
  const babel = await import('@babel/core');
  const tsPreset = createRequire(join(ROOT, 'package.json')).resolve('@babel/preset-typescript');
  const plugin = (await import(pathToFileURL(pluginPath).href)).default;
  const events = [];
  let current = null;
  const logger = { logEvent: (filename, event) => events.push({ filename: filename ?? current, kind: event?.kind, detail: event?.detail }) };
  const files = walk(DIST).filter(p => p.endsWith('.js') && !p.endsWith('.map'));
  const inputs = [...new Set(files.map(f => srcCounterpart(ROOT, f) ?? f))];
  for (const input of inputs) {
    current = input;
    const isTs = /\.(tsx?|mts|cts)$/.test(input);
    try {
      babel.transformSync(readFileSync(input, 'utf8'), {
        filename: input, babelrc: false, configFile: false,
        presets: isTs ? [[tsPreset, { isTSX: input.endsWith('.tsx'), allExtensions: true, allowDeclareFields: true }]] : [],
        plugins: [[plugin, { compilationMode: 'infer', panicThreshold: 'none', logger }]],
      });
    } catch (e) { events.push({ filename: input, kind: 'PipelineError', detail: String(e).slice(0, 200) }); }
  }

  const bad = events.filter(e => e.kind !== 'CompileSuccess');
  const offenders = new Map();
  for (const e of bad) {
    const file = relPath(e.filename ?? '');
    offenders.set(file, (offenders.get(file) ?? 0) + 1);
  }
  if (printRows) { console.log(JSON.stringify(rowsFor('compiler', offenders), null, 2)); return 0; }

  const { fresh, stale, malformed } = diffBaseline('compiler', offenders, loadBaseline(ROOT));
  const freshFiles = new Set(fresh.map(s => s.split(' ')[0]));
  for (const e of bad.filter(x => freshFiles.has(relPath(x.filename ?? ''))).slice(0, 50)) {
    const d = e.detail;
    const reason = d?.reason ?? d?.options?.reason ?? (typeof d === 'string' ? d : JSON.stringify(d)?.slice(0, 200));
    console.error(`verify-compiler: ${e.kind} ${relPath(e.filename ?? '')} ${reason ?? ''}`);
  }
  for (const m of malformed) console.error(`verify-compiler: malformed ${BASELINE_REL} row ${m}`);
  for (const f of fresh) console.error(`verify-compiler: new offender ${f}`);
  for (const s of stale) console.error(`verify-compiler: stale ${BASELINE_REL} row ${s} — lower or remove it`);
  const success = events.filter(e => e.kind === 'CompileSuccess').length;
  console.log(`verify-compiler: ${inputs.length} sources for ${files.length} dist files, ${success} CompileSuccess, ${bad.length} non-success (${offenders.size} files; baselined unless listed above)`);
  return fresh.length || stale.length || malformed.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(await run());
