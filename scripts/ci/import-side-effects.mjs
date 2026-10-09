#!/usr/bin/env node
/* REQ-PLAT-41 — import side-effect gate.
 *
 * Imports the built package entry inside a fresh jsdom and records every
 * global side effect the import performs: document/window listeners,
 * timers, DOM attribute writes, and style writes. The emitted effect set is
 * compared against a SHRINK-ONLY baseline — a new {symbol,kind} row fails
 * the gate; a row disappearing only shrinks the baseline and passes.
 *
 *   node scripts/ci/import-side-effects.mjs --dist dist/index.mjs \
 *     [--baseline scripts/ci/import-effects-baseline.json] [--update] [--json]
 *
 * Effect kinds: listener | timer | attribute | style.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const DIST = arg('dist', 'dist/index.mjs');
const BASELINE = arg('baseline', 'scripts/ci/import-effects-baseline.json');
const UPDATE = argv.includes('--update');
const JSON_OUT = argv.includes('--json');
const MODULE_ARG = arg('module', null); // test hook: import an arbitrary file instead

export function effectKey(e) { return `${e.kind}:${e.symbol}`; }

/** Import `modPath` inside an instrumented jsdom; return the sorted effects. */
export async function collectEffects(modPath) {
  const req = createRequire(import.meta.url);
  const { JSDOM } = req('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const effects = new Map();
  const add = (kind, symbol) => effects.set(`${kind}:${symbol}`, { kind, symbol });

  // Listeners on document + window + common targets.
  const listenerTargets = [
    ['document', window.document],
    ['window', window],
    ['documentElement', window.document.documentElement],
  ];
  const wrap = (obj, name, kind, label) => {
    const orig = obj[name];
    if (typeof orig !== 'function') return;
    obj[name] = function (...args) {
      add(kind, `${label}.${name}(${String(args[0])})`);
      return orig.apply(this, args);
    };
  };
  for (const [label, obj] of listenerTargets) {
    wrap(obj, 'addEventListener', 'listener', label);
    wrap(obj, 'appendChild', 'attribute', label);
  }
  wrap(window.document.documentElement, 'setAttribute', 'attribute', 'documentElement');
  wrap(window.document.body, 'setAttribute', 'attribute', 'body');
  if (window.document.head) wrap(window.document.head, 'setAttribute', 'attribute', 'head');
  // Stylesheets adopted or injected through style elements.
  const origCreate = window.document.createElement.bind(window.document);
  window.document.createElement = function (tag, ...rest) {
    const el = origCreate(tag, ...rest);
    if (String(tag).toLowerCase() === 'style') add('style', 'document.createElement(style)');
    return el;
  };
  // Timers.
  // Timers: do NOT patch window.* — jsdom calls window.setTimeout internally
  // (recursion). The module sees instrumented copies through the injected
  // globals below instead.
  const timerGlobals = {};
  for (const t of ['setInterval', 'setTimeout', 'requestAnimationFrame', 'queueMicrotask']) {
    // Underlying impl = Node's real timer (captured before we overwrite
    // globals); jsdom's Window.setTimeout recurses into itself when wrapped.
    const orig = globalThis[t] ?? ((...a) => 0);
    timerGlobals[t] = (...a) => { add('timer', `window.${t}`); return orig(...a); };
  }
  // Globals the module may write.
  const globalWrites = ['__AURAGLASS__', 'AuraGlass'];
  for (const g of globalWrites) {
    if (g in window) add('attribute', `window.${g}`);
  }

  // Make the jsdom globals visible to the imported module, like a browser.
  const prevGlobals = {};
  const NAMES = ['window', 'document', 'navigator', 'HTMLElement', 'requestAnimationFrame', 'cancelAnimationFrame', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'queueMicrotask', 'getComputedStyle', 'MutationObserver', 'ResizeObserver', 'IntersectionObserver'];
  for (const n of NAMES) {
    prevGlobals[n] = globalThis[n];
    if (timerGlobals[n]) globalThis[n] = timerGlobals[n];
    else if (n in window) globalThis[n] = window[n];
  }
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.navigator = window.navigator;
  // Bundled output keeps esbuild's __require shim for optional peers — provide
  // a require so `typeof require !== 'undefined'` resolves; missing optional
  // peers resolve to a permissive stub so the import still measures the rest
  // of the bundle (CI never installs optional peers).
  const realRequire = createRequire(join(ROOT, 'package.json'));
  const stub = new Proxy(function () {}, {
    get: (t, p) => (p === '__esModule' ? true : stub),
    apply: () => stub,
    construct: () => stub,
  });
  globalThis.require = (name, ...rest) => {
    try { return realRequire(name, ...rest); }
    catch (e) {
      if (e && (e.code === 'MODULE_NOT_FOUND' || e.code === 'ERR_MODULE_NOT_FOUND')) return stub;
      throw e;
    }
  };

  let importError = null;
  try {
    await import(pathToFileURL(resolve(modPath)).href);
  } catch (e) {
    importError = e;
  }
  for (const n of NAMES) {
    if (prevGlobals[n] === undefined) delete globalThis[n];
    else globalThis[n] = prevGlobals[n];
  }
  dom.window.close();
  if (importError) throw importError;
  return [...effects.values()].sort((a, b) => effectKey(a).localeCompare(effectKey(b)));
}

export function diffBaseline(effects, baseline) {
  const have = new Set(effects.map(effectKey));
  const allowed = new Set((baseline.effects ?? []).map(effectKey));
  const added = effects.filter((e) => !allowed.has(effectKey(e)));
  const removed = (baseline.effects ?? []).filter((e) => !have.has(effectKey(e)));
  return { added, removed };
}

async function main() {
  const target = MODULE_ARG ?? join(ROOT, DIST);
  if (!existsSync(target)) {
    console.error(`import-side-effects: ${target} missing — build dist first`);
    return 2;
  }
  const effects = await collectEffects(target);
  const report = { effects };
  const baselinePath = resolve(ROOT, BASELINE);
  const baseline = existsSync(baselinePath)
    ? JSON.parse(readFileSync(baselinePath, 'utf8'))
    : { effects: [] };
  const { added, removed } = diffBaseline(effects, baseline);

  if (UPDATE) {
    writeFileSync(baselinePath, JSON.stringify(report, null, 2) + '\n');
    console.log(`import-side-effects: baseline updated (${effects.length} effects)`);
    return 0;
  }
  if (JSON_OUT) console.log(JSON.stringify(report, null, 2));
  for (const e of added) {
    console.error(`FAIL import-side-effects: new ${e.kind} effect '${e.symbol}' — add it to the baseline only if intended`);
  }
  if (removed.length) {
    console.log(`import-side-effects: baseline shrank by ${removed.length} (ok)`);
  }
  if (added.length) return 1;
  console.log(`import-side-effects: ${effects.length} effects, baseline clean`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().then((code) => process.exit(code ?? 0)).catch((e) => { console.error(e); process.exit(2); });
}
