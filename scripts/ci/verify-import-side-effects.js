#!/usr/bin/env node
/* REQ-PLAT-41 — 4.x import side-effect gate.

   Imports the built entry (dist/index.mjs) inside a fresh jsdom and records
   every global side effect performed while the import runs:

     listener   document.addEventListener / window.addEventListener
     timer      setInterval (any delay), setTimeout with delay > 0
     attribute  document.documentElement.setAttribute
     style      CSSStyleDeclaration.prototype.setProperty

   Each effect is named by the code that performed it, derived from the call
   stack: the first frame inside the imported file, mapped through its
   sourcemap when one exists, as `<source file>#<function>` (`<module>` for
   top-level code). Effects are compared with
   scripts/ci/import-side-effects-baseline.json ({ effects: [{ symbol, kind }] }):

   - an effect not in the baseline fails;
   - a baseline row no longer observed fails (stale; the baseline only shrinks);
   - adaptiveAI may never have an import effect, in the baseline or not.

     node scripts/ci/verify-import-side-effects.js [--dist dist/index.mjs]
          [--baseline scripts/ci/import-side-effects-baseline.json]
          [--json <report.json>] [--write-baseline]

   --write-baseline rewrites the baseline to the observed set only when that
   removes rows and adds none (shrink-only); it never adds an entry.
   Exit 0 clean, 1 gate failure, 2 usage / missing dist / import crash. */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { pathToFileURL, fileURLToPath } = require('node:url');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_BASELINE = 'scripts/ci/import-side-effects-baseline.json';
const KINDS = new Set(['listener', 'timer', 'attribute', 'style']);
const FORBIDDEN = /adaptiveAI/i; // REQ-PLAT-41: adaptiveAI is never allowed an import effect

const key = (e) => `${e.kind} ${e.symbol}`;

/* ------------------------------------------------------------ sourcemaps */

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_INDEX = new Map([...B64].map((c, i) => [c, i]));

function decodeVlq(str, pos) {
  let result = 0;
  let shift = 0;
  let i = pos;
  for (;;) {
    const digit = B64_INDEX.get(str[i++]);
    if (digit === undefined) throw new Error('bad VLQ in sourcemap');
    result += (digit & 31) << shift;
    if (!(digit & 32)) break;
    shift += 5;
  }
  const value = result & 1 ? -(result >>> 1) : result >>> 1;
  return [value, i];
}

/** Lazily maps generated (1-based line, 1-based column) to a source index. */
function sourceMapper(mapFile) {
  if (!fs.existsSync(mapFile)) return null;
  const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  if (typeof map.mappings !== 'string' || !Array.isArray(map.sources)) return null;
  const lines = map.mappings.split(';');
  const decoded = []; // per generated line: [[genCol, srcIdx], ...]
  let srcIdx = 0;
  let srcLine = 0;
  let srcCol = 0;
  let nameIdx = 0;
  const decodeUpTo = (line) => {
    while (decoded.length <= line && decoded.length < lines.length) {
      const segs = [];
      let genCol = 0;
      const text = lines[decoded.length];
      let i = 0;
      while (i < text.length) {
        if (text[i] === ',') { i++; continue; }
        const fields = [];
        while (i < text.length && text[i] !== ',') {
          const [v, next] = decodeVlq(text, i);
          fields.push(v);
          i = next;
        }
        genCol += fields[0];
        if (fields.length >= 4) {
          srcIdx += fields[1];
          srcLine += fields[2];
          srcCol += fields[3];
          if (fields.length >= 5) nameIdx += fields[4];
          segs.push([genCol, srcIdx]);
        }
      }
      decoded.push(segs);
    }
  };
  const base = path.dirname(mapFile);
  const root = map.sourceRoot ? path.resolve(base, map.sourceRoot) : base;
  return (line, column) => {
    const l = line - 1;
    const c = column - 1;
    decodeUpTo(l);
    const segs = decoded[l];
    if (!segs || !segs.length) return null;
    let hit = null;
    for (const s of segs) {
      if (s[0] <= c) hit = s;
      else break;
    }
    if (!hit) hit = segs[0];
    const src = map.sources[hit[1]];
    return src == null ? null : path.resolve(root, src);
  };
}

/* ------------------------------------------------------------ stacks */

const FRAME = /^\s*at (?:(.+?) \()?(.+?):(\d+):(\d+)\)?$/;

function frameFile(loc) {
  if (loc.startsWith('file://')) {
    try {
      return fileURLToPath(loc);
    } catch {
      return null;
    }
  }
  return path.isAbsolute(loc) ? loc : null;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

/* A sourcemap source outside the repo (dist built elsewhere) is named from
   its last node_modules/ or first src/ segment, so symbols stay stable. */
function sourceName(file) {
  const r = rel(file);
  if (!r.startsWith('..')) return r;
  const posix = file.split(path.sep).join('/');
  const nm = posix.lastIndexOf('/node_modules/');
  if (nm >= 0) return posix.slice(nm + 1);
  const src = posix.indexOf('/src/');
  return src >= 0 ? posix.slice(src + 1) : r;
}

/** True when some frame of the stack runs inside an installed package. */
function hasPackageFrame(stack) {
  return String(stack)
    .split('\n')
    .slice(1)
    .some((line) => {
      const m = FRAME.exec(line);
      const file = m && frameFile(m[2]);
      return Boolean(file && file.split(path.sep).includes('node_modules') && !/[\\/]jsdom[\\/]/.test(file));
    });
}

/* jsdom and its own dependencies perform effects on behalf of DOM calls
   (nwsapi registers document listeners on the first selector query). */
const DOM_IMPL = /[\\/]node_modules[\\/](?:jsdom|nwsapi|cssstyle|whatwg-url|parse5|tough-cookie)[\\/]/;

/** True when the code that called the patched API is jsdom itself. */
function calledByDomImpl(stack) {
  for (const line of String(stack).split('\n').slice(1)) {
    const m = FRAME.exec(line);
    const file = m && frameFile(m[2]);
    if (!file || file === __filename) continue;
    return DOM_IMPL.test(file);
  }
  return false;
}

/** `<source>#<function>` of the first stack frame inside `target`. */
function symbolFor(stack, target, mapper) {
  for (const line of String(stack).split('\n').slice(1)) {
    const m = FRAME.exec(line);
    if (!m) continue;
    const file = frameFile(m[2]);
    if (file !== target) continue;
    const fn = (m[1] || '').replace(/^async /, '').replace(/^new /, '').trim();
    const name = !fn || fn === '<anonymous>' || fn === 'Object.<anonymous>' ? '<module>' : fn;
    const source = mapper ? mapper(Number(m[3]), Number(m[4])) : null;
    return `${source ? sourceName(source) : rel(file)}#${name}`;
  }
  return null;
}

/* ------------------------------------------------------------ collection */

/** Imports `target` in an instrumented jsdom; returns the sorted effect list. */
async function collectEffects(entry) {
  // stack frames carry the real path (macOS /tmp -> /private/tmp)
  const target = fs.realpathSync(entry);
  const req = createRequire(path.join(ROOT, 'package.json'));
  const { JSDOM } = req('jsdom');
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const mapper = sourceMapper(`${target}.map`);
  const effects = new Map();
  const unattributed = [];
  const peer = []; // effects of installed peer packages' own evaluation (react-dom, ...), not of the entry
  let recording = false;
  let inside = false; // re-entrancy guard (jsdom timers call node timers)

  const record = (kind, detail) => {
    if (!recording || inside) return;
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 100;
    const stack = new Error().stack;
    Error.stackTraceLimit = prevLimit;
    if (calledByDomImpl(stack)) return;
    const symbol = symbolFor(stack, target, mapper);
    if (!symbol) {
      (hasPackageFrame(stack) ? peer : unattributed).push(`${kind} ${detail}`);
      return;
    }
    effects.set(`${kind} ${symbol}`, { symbol, kind });
  };
  const guarded = (fn, self, args) => {
    const was = inside;
    inside = true;
    try {
      return fn.apply(self, args);
    } finally {
      inside = was;
    }
  };

  // listeners on document / window
  for (const [label, obj] of [['document', window.document], ['window', window]]) {
    const orig = obj.addEventListener;
    Object.defineProperty(obj, 'addEventListener', {
      configurable: true,
      writable: true,
      value: function addEventListener(...args) {
        record('listener', `${label}.addEventListener(${String(args[0])})`);
        return guarded(orig, this, args);
      },
    });
  }
  // <html> attributes
  const html = window.document.documentElement;
  const origSetAttribute = html.setAttribute;
  Object.defineProperty(html, 'setAttribute', {
    configurable: true,
    writable: true,
    value: function setAttribute(...args) {
      record('attribute', `documentElement.setAttribute(${String(args[0])})`);
      return guarded(origSetAttribute, this, args);
    },
  });
  // style.setProperty
  const styleProto = window.CSSStyleDeclaration.prototype;
  const origSetProperty = styleProto.setProperty;
  styleProto.setProperty = function setProperty(...args) {
    record('style', `style.setProperty(${String(args[0])})`);
    return guarded(origSetProperty, this, args);
  };
  // timers (global and window.*); the global versions run node's real timers
  const nodeTimers = { setInterval: globalThis.setInterval, setTimeout: globalThis.setTimeout };
  const nodeClear = { setInterval: globalThis.clearInterval, setTimeout: globalThis.clearTimeout };
  const winClear = { setInterval: window.clearInterval.bind(window), setTimeout: window.clearTimeout.bind(window) };
  const scheduled = []; // [clear, id]: everything scheduled during import is cancelled afterwards
  const timer = (name, impl, clear) =>
    function (...args) {
      const delay = Number(args[1] ?? 0);
      if (name === 'setInterval' || delay > 0) record('timer', `${name}(${delay})`);
      const id = guarded(impl, this, args);
      if (recording) scheduled.push([clear, id]);
      return id;
    };
  window.setInterval = timer('setInterval', window.setInterval, winClear.setInterval);
  window.setTimeout = timer('setTimeout', window.setTimeout, winClear.setTimeout);

  // Expose the jsdom globals to the imported module like a browser would.
  // Node >= 21 defines some globals (navigator) as getter-only accessors, so
  // install through descriptors; restore everything afterwards.
  const prev = new Map();
  const setGlobal = (n, value) => {
    if (!prev.has(n)) prev.set(n, Object.getOwnPropertyDescriptor(globalThis, n));
    Object.defineProperty(globalThis, n, { value, writable: true, configurable: true, enumerable: true });
  };
  for (const n of Object.getOwnPropertyNames(window)) {
    if (n in globalThis || n.startsWith('_')) continue;
    try {
      setGlobal(n, window[n]);
    } catch {
      /* non-readable jsdom internals */
    }
  }
  for (const n of ['window', 'self', 'document', 'navigator', 'location', 'HTMLElement', 'Element', 'Node',
    'Event', 'CustomEvent', 'EventTarget', 'getComputedStyle', 'MutationObserver', 'requestAnimationFrame',
    'cancelAnimationFrame', 'localStorage', 'sessionStorage', 'CSSStyleDeclaration']) {
    if (n === 'window' || n === 'self') setGlobal(n, window);
    else if (n in window) setGlobal(n, window[n]);
  }
  setGlobal('setInterval', timer('setInterval', nodeTimers.setInterval, nodeClear.setInterval));
  setGlobal('setTimeout', timer('setTimeout', nodeTimers.setTimeout, nodeClear.setTimeout));
  // esbuild's __require shim for optional peers: resolve real modules, stub missing ones.
  const realRequire = createRequire(target);
  const stub = new Proxy(function () {}, {
    get: (t, p) => (p === '__esModule' ? true : p === Symbol.toPrimitive ? () => '' : stub),
    apply: () => stub,
    construct: () => stub,
  });
  if (!('require' in globalThis)) {
    setGlobal('require', (name) => {
      try {
        return realRequire(name);
      } catch (e) {
        if (e && (e.code === 'MODULE_NOT_FOUND' || e.code === 'ERR_MODULE_NOT_FOUND')) return stub;
        throw e;
      }
    });
  }

  // Warm jsdom's lazy selector engine so its own setup is not observed.
  window.document.querySelector('html');
  // jsdom registers its own load handling on a later tick; let it settle first.
  if (window.document.readyState !== 'complete') {
    await new Promise((r) => window.addEventListener('load', r, { once: true }));
  }
  let importError = null;
  recording = true;
  try {
    await import(pathToFileURL(target).href);
  } catch (e) {
    importError = e;
  }
  recording = false;

  for (const [clear, id] of scheduled) {
    try {
      clear(id);
    } catch {
      /* already fired */
    }
  }
  for (const [n, desc] of prev) {
    if (desc === undefined) delete globalThis[n];
    else Object.defineProperty(globalThis, n, desc);
  }
  if (importError) throw importError;
  window.close();
  return {
    effects: [...effects.values()].sort((a, b) => key(a).localeCompare(key(b))),
    unattributed,
    peer,
  };
}

/* ------------------------------------------------------------ baseline */

function readBaseline(file) {
  if (!fs.existsSync(file)) return { error: `${rel(file)} missing` };
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return { error: `${rel(file)}: ${e.message}` };
  }
  if (!data || !Array.isArray(data.effects)) return { error: `${rel(file)}: expected { effects: [{ symbol, kind }] }` };
  for (const e of data.effects) {
    if (!e || typeof e.symbol !== 'string' || !e.symbol || !KINDS.has(e.kind) || Object.keys(e).length !== 2) {
      return { error: `${rel(file)}: malformed row ${JSON.stringify(e)} (want { symbol, kind: ${[...KINDS].join('|')} })` };
    }
  }
  return { effects: data.effects };
}

function compare(effects, baseline) {
  const have = new Set(effects.map(key));
  const allowed = new Set(baseline.map(key));
  return {
    added: effects.filter((e) => !allowed.has(key(e))),
    stale: baseline.filter((e) => !have.has(key(e))),
    forbidden: [...effects, ...baseline].filter((e) => FORBIDDEN.test(e.symbol)),
    duplicate: baseline.filter((e, i) => baseline.findIndex((x) => key(x) === key(e)) !== i),
  };
}

/* ------------------------------------------------------------ main */

async function main(argv) {
  const opt = (n, d) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 ? argv[i + 1] : d;
  };
  const target = path.resolve(ROOT, opt('dist', 'dist/index.mjs'));
  const baselinePath = path.resolve(ROOT, opt('baseline', DEFAULT_BASELINE));
  const jsonOut = opt('json', null);
  const write = argv.includes('--write-baseline');

  if (!fs.existsSync(target)) {
    console.error(`import-side-effects: ${rel(target)} missing — build dist first (plat:build:dist)`);
    return 2;
  }
  const base = readBaseline(baselinePath);
  if (base.error) {
    console.error(`import-side-effects: ${base.error}`);
    return 2;
  }
  let result;
  try {
    result = await collectEffects(target);
  } catch (e) {
    console.error(`import-side-effects: importing ${rel(target)} threw: ${e && e.stack ? e.stack : e}`);
    return 2;
  }
  const { effects, unattributed, peer } = result;
  for (const p of peer) console.log(`import-side-effects: note: ${p} from an installed peer package (not counted)`);
  if (jsonOut) {
    fs.mkdirSync(path.dirname(path.resolve(ROOT, jsonOut)), { recursive: true });
    fs.writeFileSync(path.resolve(ROOT, jsonOut), JSON.stringify({ effects, unattributed, peer }, null, 2) + '\n');
  }
  const { added, stale, forbidden, duplicate } = compare(effects, base.effects);
  let failed = false;
  for (const e of forbidden) {
    console.error(`FAIL import-side-effects: adaptiveAI ${e.kind} effect '${e.symbol}' — adaptiveAI must have no import effect`);
    failed = true;
  }
  for (const u of unattributed) {
    console.error(`FAIL import-side-effects: ${u} during import from outside ${rel(target)} (no attributable frame)`);
    failed = true;
  }
  for (const e of duplicate) {
    console.error(`FAIL import-side-effects: duplicate baseline row ${e.kind} '${e.symbol}'`);
    failed = true;
  }
  for (const e of added) {
    console.error(`FAIL import-side-effects: new ${e.kind} effect '${e.symbol}' during import (baseline is shrink-only)`);
    failed = true;
  }
  if (write && !failed) {
    fs.writeFileSync(baselinePath, JSON.stringify({ effects }, null, 2) + '\n');
    console.log(`import-side-effects: baseline shrunk to ${effects.length} effect(s) (-${stale.length})`);
    return 0;
  }
  for (const e of stale) {
    console.error(`FAIL import-side-effects: stale baseline row ${e.kind} '${e.symbol}' — no longer observed; delete it (--write-baseline)`);
    failed = true;
  }
  if (failed) return 1;
  console.log(`import-side-effects: OK (${effects.length} baselined effect(s), 0 new, 0 stale)`);
  return 0;
}

module.exports = { collectEffects, compare, readBaseline, symbolFor, sourceMapper };

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(e);
      process.exit(2);
    },
  );
}
