/* PLAT-265: worker for verify-side-effects. Installs a jsdom realm, wraps the
   watched globals, imports every emitted dist js, then prints the observed
   calls (module = the dist file being imported when the call happened). */
import { readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

const { JSDOM } = await import('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
const { window } = dom;

const observed = [];
/* spec: record only calls whose stack includes an aura-glass dist frame —
   third-party import-time work (e.g. react-aria focus tracking) is not ours. */
const agFrame = () => {
  const line = (new Error().stack ?? '').split('\n').find(l => l.includes('/dist/') && !l.includes('node_modules') && !l.includes('trap.mjs'));
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
  if (orig) obj[name] = record(`${label}`, orig);
};
for (const name of ['addEventListener', 'setInterval', 'setTimeout', 'requestAnimationFrame', 'requestIdleCallback', 'queueMicrotask', 'fetch']) wrap(window, name, `window.${name}`);
for (const name of ['MutationObserver', 'ResizeObserver', 'IntersectionObserver', 'Worker', 'AudioContext']) {
  const Orig = window[name];
  if (Orig) window[name] = new Proxy(Orig, { construct: (t, a) => { const m = agFrame(); if (m) observed.push({ api: `new ${name}`, module: m }); return new t(...a); } });
}
for (const name of ['log', 'warn', 'error', 'info', 'debug']) {
  const orig = console[name].bind(console);
  console[name] = record(`console.${name}`, orig);
}
const proto = window.Storage?.prototype;
if (proto?.setItem) proto.setItem = record('Storage.prototype.setItem', proto.setItem.bind(proto));

const setGlobal = (name, value) => {
  try { Object.defineProperty(globalThis, name, { value, configurable: true, writable: true }); } catch { /* read-only global */ }
};
for (const [k, v] of [['window', window], ['document', window.document], ['navigator', window.navigator],
  ['localStorage', window.localStorage], ['sessionStorage', window.sessionStorage],
  ['requestAnimationFrame', window.requestAnimationFrame], ['customElements', window.customElements],
  ['HTMLElement', window.HTMLElement]]) setGlobal(k, v);

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
