#!/usr/bin/env node
/* PLAT-272: run babel-plugin-react-compiler@1.0.0 (compilationMode 'infer',
   panicThreshold 'none') over every .js file under dist/ and fail on any
   CompileError/CompileSkip event recorded by its logger.
   OI-4 verified 2026-10-08 (react.dev/learn/react-compiler + the 1.0.0
   babel-plugin README): the plugin emits logger events via
   `logger.logEvent(filename, event)` where event.kind is one of
   'CompileError' | 'CompileSuccess' | 'CompileSkip' | 'PipelineError' —
   names asserted by canaries/vite-compiler's smoke run. The plugin resolves
   from the canary's node_modules (it is never a dep of aura-glass itself —
   dependency sets are frozen). */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { DIST, ROOT, walk } from '../build/lib/graph.mjs';

const resolvePlugin = () => {
  for (const base of [join(ROOT, 'canaries', 'vite-compiler'), ROOT]) {
    try { return createRequire(join(base, 'package.json')).resolve('babel-plugin-react-compiler'); }
    catch { /* keep looking */ }
  }
  return null;
};

export async function run() {
  if (!existsSync(DIST)) { console.error('verify-compiler: dist missing — build first'); return 1; }
  const pluginPath = resolvePlugin();
  if (!pluginPath) {
    console.error('verify-compiler: babel-plugin-react-compiler not installed — run npm install in canaries/vite-compiler first (it owns the dep; the package may not).');
    return 1;
  }
  const babel = await import('@babel/core');
  const plugin = (await import(pathToFileURL(pluginPath).href)).default;
  const events = [];
  const logger = { logEvent: (filename, event) => events.push({ filename, kind: event?.kind, detail: event?.detail }) };
  const files = walk(DIST).filter(p => p.endsWith('.js') && !p.endsWith('.map'));
  for (const f of files) {
    try {
      babel.transformSync(readFileSync(f, 'utf8'), {
        filename: f, babelrc: false, configFile: false,
        plugins: [[plugin, { compilationMode: 'infer', panicThreshold: 'none', logger }]],
      });
    } catch (e) { events.push({ filename: f, kind: 'PipelineError', detail: String(e).slice(0, 200) }); }
  }
  const bad = events.filter(e => e.kind !== 'CompileSuccess');
  for (const e of bad.slice(0, 30)) console.error(`verify-compiler: ${e.kind} ${e.filename?.replace(ROOT + '/', '')} ${e.detail ?? ''}`);
  if (bad.length) { console.error(`verify-compiler: ${bad.length} non-success event(s) across ${files.length} files`); return 1; }
  console.log(`verify-compiler: ${files.length} dist files, ${events.length} events, all CompileSuccess`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(await run());
