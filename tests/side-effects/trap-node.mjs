/* REQ-PLAT-70: Node realm trap — import every emitted dist js in plain Node
   (no jsdom) and record calls into Node-global APIs whose stack includes an
   aura-glass dist frame: timers, console, process listeners, fs writes,
   child processes, worker threads. */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

const observed = [];
const agFrame = () => {
  const line = (new Error().stack ?? '').split('\n').find(l => l.includes('/dist/') && !l.includes('node_modules') && !l.includes('trap-node.mjs'));
  const m = line?.match(/dist[/\\]([^:()]+\.(?:js|mjs))/);
  return m ? `dist/${m[1]}` : null;
};
const record = (api, orig) => (...args) => {
  const module = agFrame();
  if (module) observed.push({ api, module });
  return typeof orig === 'function' ? orig(...args) : undefined;
};
const wrap = (obj, name, label = name) => {
  const orig = obj?.[name]?.bind(obj);
  if (orig) obj[name] = record(label, orig);
};

for (const name of ['setTimeout', 'setInterval', 'setImmediate', 'queueMicrotask', 'queueTask']) {
  if (typeof globalThis[name] === 'function') wrap(globalThis, name);
}
for (const name of ['log', 'warn', 'error', 'info', 'debug']) wrap(console, name, `console.${name}`);
for (const name of ['on', 'once', 'prependListener', 'prependOnceListener']) wrap(process, name, `process.${name}`);

/* builtin namespace objects are frozen — the mutable CJS surface lives on
   the default export (what `require('fs')` returns). */
const cjs = async (spec) => (await import(spec)).default ?? null;
const fs = await cjs('node:fs');
for (const name of ['writeFile', 'writeFileSync', 'appendFile', 'appendFileSync', 'mkdir', 'mkdirSync', 'rm', 'rmSync', 'unlink', 'unlinkSync', 'createWriteStream']) {
  if (typeof fs?.[name] === 'function') wrap(fs, name, `fs.${name}`);
}
const cp = await cjs('node:child_process');
for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
  if (typeof cp?.[name] === 'function') wrap(cp, name, `child_process.${name}`);
}
const wt = await cjs('node:worker_threads').catch(() => null);
if (wt?.Worker) {
  const W = wt.Worker;
  wt.Worker = new Proxy(W, { construct: (t, a) => { const m = agFrame(); if (m) observed.push({ api: 'new worker_threads.Worker', module: m }); return new t(...a); } });
}
const net = await cjs('node:net').catch(() => null);
if (net) for (const name of ['createConnection', 'connect', 'createServer']) {
  if (typeof net[name] === 'function') wrap(net, name, `net.${name}`);
}

const files = [];
const visit = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) visit(p);
    else if (e.name.endsWith('.js')) files.push(p);
  }
};
if (existsSync(DIST)) visit(DIST);

for (const f of files) {
  try { await import(pathToFileURL(f).href); } catch { /* init errors are not side-effect signals */ }
}
process.stdout.write(`\n${JSON.stringify(observed)}\n`);
