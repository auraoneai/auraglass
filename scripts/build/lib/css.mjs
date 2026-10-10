/* CSS assembly library (PLAT-275, REQ-PLAT-74).
   Deterministic: layer order is the contract constant; fragments sort by (order, file).
   REQ-PLAT-74 hardening:
     - fragments must be self-layered: every top-level statement is an @layer
       at-rule over ag.* names; a style rule outside @layer fails the build.
     - no !important anywhere in a fragment.
     - color-mix() declarations are hoisted into @supports (color: color-mix(...))
       guards at assembly time; shipped css never carries an unguarded color-mix.
     - lowerCss lowers AND minifies to CSS_TARGETS.
     - fragments outside FIN-C that break those two rules ship only while
       they hold a row in REQ-FIN-14's expiring baseline
       (scripts/integration/baselines/css-files.json, FIN-A); the build
       prints them as BASELINED. Any other offender fails the build.
     - tokens.css / material.css / compat/tokens.css are MAT-owned outputs,
       copied through (material.css also guarded + minified), never
       reassembled; dist/material.css falls back to MAT's fragments/css/mat.ts
       rows, reported pending, until MAT's tokens:build emits it.
     - build/css-ownership.json: {selectors: {prefix: bundle}, a11y: {prefix}} —
       a selector emitted into a bundle it does not own fails the build. */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { transform as esbuildTransform } from 'esbuild';
import { ROOT, SRC, DIST, walk } from './graph.mjs';
import { loadFragments } from '../../../src/contracts/load-fragments.mjs';

export const CSS_LAYERS = ['ag.compat', 'ag.reset', 'ag.tokens', 'ag.material', 'ag.components', 'ag.a11y'];
export const LAYER_ORDER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';
export const TAILWIND_BRIDGE_ORDER = '@layer theme, base, ag, components, utilities;';

/** LAYER_CONTENT_OWNER (§4.3): where each layer's non-fragment content comes from. */
export const LAYER_CONTENT_OWNER = {
  'ag.compat': 'src/compat/css/** (PLAT-authored compat css)',
  'ag.reset': 'css fragments with layer ag.reset',
  'ag.tokens': 'scripts/tokens/build.mjs output (MAT)',
  'ag.material': 'src/material/css/generated/*.css (MAT, emitted by tokens build)',
  'ag.components': 'css fragments with layer ag.components',
  'ag.a11y': 'css fragments with layer ag.a11y (QUAL)',
};

/** Bundles MAT emits directly during tokens:build — never assembled here. */
export const MAT_BUNDLES = new Set(['tokens.css', 'material.css', 'compat/tokens.css']);

export const CSS_TARGETS = 'chrome99, edge99, firefox103, safari15.4';

export const COLOR_MIX_SUPPORTS = '@supports (color: color-mix(in srgb, red, red))';

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/* ---------- tiny css structure scanner (shared by validation, guards, ownership) ---------- */

/** Top-level statement headers of a stylesheet ('@layer x' / '.a, .b' / '@media ...'). */
export function topLevelHeaders(css) {
  css = stripComments(css);
  const out = [];
  let i = 0, buf = '';
  while (i < css.length) {
    const ch = css[i];
    if (ch === '{') {
      const head = buf.trim(); buf = '';
      let d = 1; i++;
      while (d > 0 && i < css.length) { if (css[i] === '{') d++; else if (css[i] === '}') d--; i++; }
      if (head) out.push(head);
    } else if (ch === ';') {
      const t = buf.trim(); buf = ''; i++;
      if (t) out.push(t + ';');
    } else if (ch === '}') { i++; } else { buf += ch; i++; }
  }
  const t = buf.trim(); if (t) out.push(t);
  return out;
}

/** Split a rule body into top-level declarations (paren/string-aware, keeps nested blocks whole). */
function splitDecls(body) {
  const out = []; let i = 0, buf = '', par = 0;
  while (i < body.length) {
    const ch = body[i];
    if (ch === '(' ) par++;
    else if (ch === ')') par = Math.max(0, par - 1);
    else if (ch === "'" || ch === '"') { const q = ch; buf += ch; i++; while (i < body.length && body[i] !== q) { buf += body[i++]; } if (i < body.length) { buf += body[i++]; } continue; }
    if (ch === '{') { let d = 1; buf += ch; i++; while (d > 0 && i < body.length) { if (body[i] === '{') d++; else if (body[i] === '}') d--; buf += body[i++]; } continue; }
    if (ch === ';' && par === 0) { const t = buf.trim(); buf = ''; i++; if (t) out.push(t); continue; }
    buf += ch; i++;
  }
  const t = buf.trim(); if (t) out.push(t);
  return out;
}

/** Every style rule with its enclosing at-rule stack: [{selector, headers:[…], body}]. */
export function styleRules(css) {
  css = stripComments(css);
  const out = [];
  const RECURSIVE = /^@(layer|media|supports|container|scope|starting-style)\b/;
  const walkBlock = (text, stack) => {
    let i = 0, buf = '';
    while (i < text.length) {
      const ch = text[i];
      if (ch === '{') {
        const head = buf.trim(); buf = ''; i++;
        let d = 1; const start = i;
        while (d > 0 && i < text.length) { if (text[i] === '{') d++; else if (text[i] === '}') d--; i++; }
        const body = text.slice(start, i - 1);
        if (head.startsWith('@')) {
          if (RECURSIVE.test(head)) walkBlock(body, [...stack, head]);
          // non-recursive at-rules (@keyframes, @font-face, @property…) have no style selectors
        } else if (head) {
          out.push({ selector: head, headers: stack, body });
          // css nesting: a style rule may contain nested style rules
          walkBlock(body, stack);
        }
      } else if (ch === ';') { buf = ''; i++; } else { buf += ch; i++; }
    }
  };
  walkBlock(css, []);
  return out;
}


/** Split a selector list on top-level commas only (paren/bracket/string-aware). */
export function splitSelectors(list) {
  const out = []; let i = 0, buf = '', par = 0, brk = 0;
  while (i < list.length) {
    const ch = list[i];
    if (ch === '(') par++;
    else if (ch === ')') par = Math.max(0, par - 1);
    else if (ch === '[') brk++;
    else if (ch === ']') brk = Math.max(0, brk - 1);
    else if (ch === "'" || ch === '"') { const q = ch; buf += ch; i++; while (i < list.length && list[i] !== q) buf += list[i++]; if (i < list.length) buf += list[i++]; continue; }
    if (ch === ',' && par === 0 && brk === 0) { const s = buf.trim(); if (s) out.push(s); buf = ''; i++; continue; }
    buf += ch; i++;
  }
  const s = buf.trim(); if (s) out.push(s);
  return out;
}

/** First simple-selector token of a selector — the ownership prefix. */
export function selectorPrefix(selector) {
  const m = /(:where\([^)]*\)|\[[^\]]+\]|[.#][\w-]+|[a-zA-Z*][\w-]*)/.exec(selector.trim());
  return m ? m[0] : selector.trim();
}

/* ---------- fragment loading + REQ-PLAT-74 validation ---------- */

/** REQ-FIN-14's expiring cross-stream baseline (FIN-A, PRD-F §4.3 rule 3).
    Its gate (scripts/build/verify-css-files.mjs) checks the same two rules
    this validator enforces (no !important, nothing outside @layer ag.*), so
    the assembly honours the same rows instead of keeping a second list:
    offenders in other WPs' files are fixed by their owners, never here. */
export const CSS_FILES_BASELINE = 'scripts/integration/baselines/css-files.json';
const BASELINE_EXPIRY_LIB = 'scripts/integration/lib/baseline-expiry.mjs';

/** Map file → {file, owner, reqFin, expires} from the REQ-FIN-14 baseline; an
    empty map when the baseline is absent (strict: every offender fails). A
    malformed or expired row fails the build (same rule as the baseline's gate). */
export async function loadCssFilesBaseline(root = ROOT) {
  const p = join(root, CSS_FILES_BASELINE);
  const rows = new Map();
  if (!existsSync(p)) return rows;
  const parsed = JSON.parse(readFileSync(p, 'utf8'));
  const lib = join(root, BASELINE_EXPIRY_LIB);
  if (!existsSync(lib)) throw new Error(`${CSS_FILES_BASELINE} exists but ${BASELINE_EXPIRY_LIB} (its expiry rule) is missing`);
  const { rowProblems } = await import(pathToFileURL(lib).href);
  const problems = rowProblems(parsed, { gate: 'css assembly (REQ-PLAT-74)' });
  if (problems.length) throw new Error(problems.join('\n'));
  for (const r of parsed) rows.set(r.file, r);
  return rows;
}

/** Load every stream's css fragments → [{stream, layer, bundle, order, file, content, baselined?}]
    sorted deterministically. With validate, a fragment that breaks validateFragment
    fails unless its file has a REQ-FIN-14 baseline row; then the violation is
    carried on entry.baselined (reported by assembleAllCss) and the file still ships. */
export async function collectCssFragments(root = ROOT, { validate = true } = {}) {
  const frags = await loadFragments('css', root);
  const baseline = validate ? await loadCssFilesBaseline(root) : new Map();
  const out = [];
  for (const { stream, file, value } of frags) {
    for (const f of value) {
      const abs = join(root, f.file);
      if (!existsSync(abs)) throw new Error(`css fragment file missing: ${f.file} (stream ${stream}, ${file})`);
      if (!CSS_LAYERS.includes(f.layer)) throw new Error(`css fragment ${f.file}: unknown layer ${f.layer}`);
      const entry = { stream, layer: f.layer, bundle: f.bundle, order: f.order ?? 0, file: f.file, content: readFileSync(abs, 'utf8') };
      // MAT-bundle fragments are MAT's output inputs (MAT emits material.css);
      // assembly-side validation applies to everything PLAT emits.
      if (validate && !MAT_BUNDLES.has(f.bundle)) {
        try {
          validateFragment(entry);
        } catch (err) {
          const row = baseline.get(f.file);
          if (!row) throw err;
          entry.baselined = `${err.message} [BASELINED ${row.owner} ${row.reqFin}, expires ${row.expires}]`;
        }
      }
      out.push(entry);
    }
  }
  out.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  return out;
}

/** At-rules whose blocks hold declarations or keyframe selectors, never style
    rules — they are registrations and stay legal outside @layer. */
const NON_STYLE_AT = /^@(charset|property|keyframes|font-face|page|font-feature-values|counter-style|position-try|viewport|layer)\b/;

/** REQ-PLAT-74: a fragment may contain ONLY @layer at-rules (over contract layer
    names) and registration at-rules at top level; no style rule may sit outside
    an @layer ag.* block, and no !important anywhere. */
export function validateFragment(f) {
  const css = stripComments(f.content);
  if (/!important/i.test(css)) throw new Error(`css fragment ${f.file}: !important is forbidden`);
  for (const head of topLevelHeaders(css)) {
    const m = /^@layer\s+([^{;]+?)\s*[{;]?$/.exec(head);
    if (m) {
      for (const name of m[1].split(',').map((x) => x.trim()))
        if (!CSS_LAYERS.includes(name)) throw new Error(`css fragment ${f.file}: @layer ${name} is not a contract layer`);
      continue;
    }
    if (head.startsWith('@') && NON_STYLE_AT.test(head)) continue;
    throw new Error(`css fragment ${f.file}: statement outside an @layer ag.* block: ${head.slice(0, 80)}`);
  }
}

/* ---------- color-mix @supports guards ---------- */

/** Hoist every declaration containing color-mix( into a same-position
    @supports (color: color-mix(in srgb, red, red)) clone of its rule. Rules
    already inside such a guard (or inside @keyframes/@font-face, which never
    reach this function's recursion) are left alone. */
export function guardColorMix(css) {
  css = stripComments(css);
  const RECURSIVE = /^@(layer|media|supports|container|scope|starting-style)\b/;
  const walkBlock = (text, inColorMixSupports) => {
    let out = '', i = 0, buf = '';
    while (i < text.length) {
      const ch = text[i];
      if (ch === '{') {
        const head = buf.trim(); buf = ''; i++;
        let d = 1; const start = i;
        while (d > 0 && i < text.length) { if (text[i] === '{') d++; else if (text[i] === '}') d--; i++; }
        const body = text.slice(start, i - 1);
        if (head.startsWith('@')) {
          if (RECURSIVE.test(head)) {
            const guarded = head.startsWith('@supports') && /color-mix\s*\(/.test(head);
            out += `${head}{${walkBlock(body, inColorMixSupports || guarded)}}`;
          } else out += `${head}{${body}}`;
        } else if (head) {
          out += guardStyleRule(head, body, inColorMixSupports);
        }
      } else if (ch === ';') { out += `${buf};`; buf = ''; i++; } else { buf += ch; i++; }
    }
    return out + buf;
  };
  const guardStyleRule = (selector, body, inGuard) => {
    if (inGuard || !body.includes('color-mix(')) return `${selector}{${body}}`;
    const parts = splitDecls(body);
    const norm = [], cm = [];
    for (const p of parts) (p.includes('color-mix(') ? cm : norm).push(p);
    if (!cm.length) return `${selector}{${body}}`;
    const base = norm.length ? `${selector}{${norm.join(';')}}` : '';
    return `${base}${COLOR_MIX_SUPPORTS}{${selector}{${cm.join(';')}}}`;
  };
  return walkBlock(css, false);
}

/** Count @container rules (source-vs-shipped parity check). */
export function containerCount(css) {
  return (stripComments(css).match(/@container\b/g) || []).length;
}

/** Non-fragment layer sources that exist on the tree right now (pending sources are skipped). */
function layerSupplements(layer, root) {
  const out = [];
  // ag.compat content arrives via css fragments (PLAT's own fragment rows).
  if (layer === 'ag.tokens') { const f = join(root, 'dist/tokens.css'); if (existsSync(f)) out.push(f); }
  if (layer === 'ag.material') {
    const dir = join(root, 'src/material/css/generated');
    if (existsSync(dir)) for (const n of readdirSync(dir).sort()) if (n.endsWith('.css')) out.push(join(dir, n));
  }
  return out;
}

/** Assemble one css bundle file. Returns the css text. */
export async function assembleBundle(bundle, fragments, root = ROOT) {
  let body = LAYER_ORDER_STATEMENT + '\n\n';
  for (const layer of CSS_LAYERS) {
    const fragChunks = fragments.filter(f => f.bundle === bundle && f.layer === layer).map(f => `/* ${f.file} (${f.stream}) */\n${f.content.trim()}`);
    const supChunks = bundle === 'styles.css' ? layerSupplements(layer, root).map(f => readFileSync(f, 'utf8').trim()) : [];
    const chunks = [...fragChunks, ...supChunks].filter(Boolean);
    if (!chunks.length) continue;
    // Supplementary token/material css may be raw (generated); emit it inside its layer.
    const wrapped = chunks.map(c => c.includes('@layer') ? c : `@layer ${layer} {\n${indent(c)}\n}`).join('\n\n');
    body += wrapped + '\n\n';
  }
  return body.trimEnd() + '\n';
}

function indent(css) { return css.split('\n').map(l => (l.trim() ? '  ' + l : l)).join('\n'); }

/** Guard color-mix then lower+minify to the contract browser targets via esbuild. */
export async function lowerCss(css, targets = CSS_TARGETS) {
  const res = await esbuildTransform(guardColorMix(css), { loader: 'css', target: targets.split(', '), minify: true });
  return res.code;
}

/** Selector-prefix ownership map from fragment metadata:
    {selectors: {prefix: [bundles]}, a11y: {prefix: 'paired' | 'none'}}.
    Ownership is enforced for component class prefixes (.ag-* / .glass-*) and
    [data-ag-part] selectors; attribute selectors like [data-ag-contrast] are
    cross-cutting state hooks that legitimately appear in several bundles.
    A prefix may be declared for more than one bundle (e.g. a chip class used
    by both the core and the data stream) — it is wrong only when it lands in
    a bundle no fragment declares. */
export function computeOwnership(fragments) {
  const selectors = {};
  const a11yPrefixes = new Set();
  const componentPrefixes = new Set();
  const ownedPrefix = (p) => /^\.(?:ag|glass)-[\w-]+/.test(p) || /^\[data-ag-part/.test(p);
  for (const f of fragments) {
    const rules = styleRules(stripComments(f.content));
    const prefixes = new Set();
    for (const r of rules) for (const sel of splitSelectors(r.selector)) prefixes.add(selectorPrefix(sel));
    for (const p of prefixes) {
      if (f.layer === 'ag.a11y') a11yPrefixes.add(p);
      if (f.layer === 'ag.components') componentPrefixes.add(p);
      if (!ownedPrefix(p)) continue;
      (selectors[p] ??= new Set()).add(f.bundle);
    }
  }
  const out = {};
  for (const [p, bs] of Object.entries(selectors)) out[p] = [...bs].sort();
  const a11y = {};
  for (const p of componentPrefixes) a11y[p] = a11yPrefixes.has(p) ? 'paired' : 'none';
  return { selectors: out, a11y };
}

/** Fail when a shipped bundle emits a selector prefix no fragment declares for it.
    Supplement-injected content (tokens/material css inside styles.css) has no
    declaring fragment by design; only ag.* component prefixes are checked. */
export function checkOwnership(bundle, css, ownership) {
  const owned = ownership.selectors;
  for (const r of styleRules(stripComments(css))) {
    for (const sel of splitSelectors(r.selector)) {
      const p = selectorPrefix(sel);
      const owners = owned[p];
      if (owners && !owners.includes(bundle) && !(owners.includes('compat/globals.css') && bundle === 'styles.css'))
        throw new Error(`css ownership: '${p}' (${sel.trim()}) emitted in dist/${bundle} but declared for ${owners.map(o => 'dist/' + o).join(', ')}`);
    }
  }
}

/** git-ignored marker: dist/material.css came from the fragment fallback below. */
const MATERIAL_FALLBACK_MARKER = 'build/.material-css.from-fragments';

/** Write every bundle the fragments + supplements produce. Returns {written, pending, baselined, ownership}. */
export async function assembleAllCss(root = ROOT, { lower = false } = {}) {
  const fragments = await collectCssFragments(root);
  const ownership = computeOwnership(fragments);
  const bundles = new Set(['styles.css', 'compat/globals.css']);
  for (const f of fragments) if (!MAT_BUNDLES.has(f.bundle)) bundles.add(f.bundle);
  const written = [];
  const pending = [];
  const baselined = fragments.filter((f) => f.baselined).map((f) => f.baselined);
  mkdirSync(DIST, { recursive: true });
  // Read before any write below. A dist/material.css this function assembled in
  // an earlier run (marker present) is not a MAT output.
  const assembledMarker = join(root, MATERIAL_FALLBACK_MARKER);
  const matEmitted = new Set([...MAT_BUNDLES].filter((spec) =>
    existsSync(join(DIST, spec)) && !(spec === 'material.css' && existsSync(assembledMarker))));
  rmSync(assembledMarker, { force: true });
  for (const b of [...bundles].sort()) {
    let css = await assembleBundle(b, fragments, root);
    checkOwnership(b, css, ownership);
    if (lower) css = await lowerCss(css);
    const dest = join(DIST, b);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, css);
    written.push(`dist/${b}`);
  }
  // MAT-owned standalone artifacts are emitted by MAT's tokens:build and copied
  // through, never reassembled: PLAT only checks ownership and (with lower)
  // applies the same color-mix guard + minify every shipped bundle gets.
  for (const spec of MAT_BUNDLES) {
    const dest = join(DIST, spec);
    if (matEmitted.has(spec)) {
      if (spec === 'material.css') {
        let css = readFileSync(dest, 'utf8');
        checkOwnership(spec, css, ownership);
        if (lower) { css = await lowerCss(css); writeFileSync(dest, css); }
      }
      written.push(`dist/${spec} (MAT)`);
    } else if (spec === 'material.css') {
      // dist/material.css is a public export (./material.css). Until MAT's
      // tokens:build emits it (the scripts/tokens/build.mjs hunk handed from
      // #175 to FIN-A), it is assembled from MAT's own fragments/css/mat.ts
      // rows in their contract order, and reported as pending so the
      // transition stays visible.
      let css = await assembleBundle(spec, fragments, root);
      checkOwnership(spec, css, ownership);
      if (lower) css = await lowerCss(css);
      writeFileSync(dest, css);
      mkdirSync(dirname(assembledMarker), { recursive: true });
      writeFileSync(assembledMarker, `${spec}\n`);
      written.push(`dist/${spec} (from fragments/css/mat.ts)`);
      pending.push(`dist/${spec}: MAT tokens:build output pending — assembled from fragments/css/mat.ts rows`);
    } else {
      pending.push(`dist/${spec} (MAT tokens:build output pending)`);
    }
  }
  return { written, pending, baselined, ownership };
}
