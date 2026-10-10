#!/usr/bin/env node
/* scripts/surf/verify-registry.mjs — REQ-SURF-170 (REQ-FIN-88, AC-FIN-88).
   SURF registry lint over every source file of every S-46 SURF block and
   item directory (contract §3.3). Independent of PLAT's
   scripts/registry/lint.mjs (REQ-SURF-170: never imported).

   Usage: node scripts/surf/verify-registry.mjs [--root <dir>] [--json <path>] [--count]
     --root   registry tree to lint (default: repo root). The verbatim shadcn
              schema and src/contracts/entries.ts are always read from the repo.
     --json   write { violations, counts } to <path>.
     --count  print, per SURF id, the source-file count and how many of them
              files[] lists (AC: every source file appears in files[]).
   Exit 0 when clean, 1 on any violation, 2 on bad usage.

   Rules (one id per violation):
     schema               registry-item.json fails the verbatim shadcn v4 registry-item schema
     s46                  S-46 SURF id missing, wrong kind/type, name != dir, meta.auraglass not SURF-owned
     meta-components      meta.auraglass.components != the PascalCase aura-glass value imports
     files-exist          files[] path missing on disk or escaping the item dir
     files-complete       a source file is not listed in files[] (or a test/story is listed)
     relative-escape      a relative import resolves outside the item dir (use @/registry/<kind>/<id>)
     literal              #hex, !important, blur(, rgb(a)(, oklch( outside fixtures
     public-import        aura-glass import that is not a public 5.0 entry, or a value name
                          the entry does not export (ENTRIES / ROOT_EXPORTS)
     registry-deps        registryDependencies != {auraglass if aura-glass is imported}
                          ∪ {every @/registry/<kind>/<id> imported}, or names an id that does not exist
     npm-deps             a bare package import not in dependencies, or a declared dependency never
                          imported (aura-glass may be listed; registry id auraglass also provides it)
     fixtures             fixtures.ts missing, or Math.random / Date.now / new Date( / fetch( /
                          crypto.randomUUID in a fixture file
     stories              a required story export (Default, Empty, RTL, ReducedTransparency,
                          ForcedColors, plus Loading for async items) is missing */
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(fileURLToPath(import.meta.url), '../../..');
export const SCHEMA_PATH = 'tests/capability/registry/__fixtures__/registry-item.schema.json';

/* S-46 SURF namespace (contract §3.3). PLAT/CMP ids are linted by their owners. */
export const SURF_BLOCKS = [
  'app-frame', 'ai-workspace', 'data-workspace', 'analytics-dashboard', 'media-viewer', 'support-inbox',
  'mobile-settings', 'commerce-cart', 'commerce-checkout', 'pricing', 'audit-log', 'permissions-matrix',
];
/* 5.x blocks (contract §3.3 "5.x:"); everything else in the SURF namespace is GA. */
export const SURF_5X_BLOCKS = ['commerce-cart', 'commerce-checkout', 'pricing', 'audit-log', 'permissions-matrix'];
export const SURF_ITEMS = [
  'app-shell-workspace', 'backdrop-hero', 'comment-thread', 'faceted-search', 'presence-stack',
  'query-builder', 'schema-viewer', 'tree-select',
  'ai-artifact-panel', 'ai-eval-dashboard', 'ai-markdown', 'ai-model-picker', 'ai-sdk-adapter',
  'ai-trace-tree', 'ai-voice-input',
  'media-audio-player', 'media-gallery', 'media-now-playing', 'media-transcript', 'media-video-player',
];
/* Registry id the aura-glass package and its exports map to: registry/base/auraglass
   declares `aura-glass@^5` as its npm dependency, so every aura-glass import is
   satisfied through that one registry id. */
export const BASE_ID = 'auraglass';
export const STORY_STATES = ['Default', 'Empty', 'RTL', 'ReducedTransparency', 'ForcedColors'];

export const LITERAL = /#[0-9a-f]{3,8}\b|!important|blur\(|rgba?\(|oklch\(/i;
const CODE_FILE = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const SOURCE_FILE = /\.(?:ts|tsx|js|jsx|mjs|cjs|css|json)$/;
const isTest = (rel) => /(^|\/)__tests__\//.test(rel) || /\.(?:test|spec)\.[jt]sx?$/.test(rel);
const isStory = (rel) => /\.stories\.[jt]sx?$/.test(rel);
const isFixture = (rel) => /(^|\/)fixtures(?:\.[jt]sx?|\/)/.test(rel);
const isDev = (rel) => isTest(rel) || isStory(rel);
/* Harness toolchain available to stories/tests only (never shipped). */
const DEV_PKG = /^(?:node:|@storybook\/|@jest\/|@testing-library\/|jest-axe$)/;
/* Satisfied by the JSX runtime: a declared react dependency need not be imported by name. */
const IMPLICIT = new Set(['react', 'react-dom']);

/* ---------- verbatim-schema validator (draft-07 keywords the schema uses) ---------- */
const SUPPORTED = new Set(['$schema', '$id', '$ref', 'title', 'description', 'type', 'enum', 'const', 'properties',
  'additionalProperties', 'required', 'items', 'if', 'then', 'else', 'allOf', 'anyOf', 'oneOf', 'not', 'definitions', 'pattern']);

/** Every keyword in the schema must be one this validator implements — an unknown keyword is an error, never ignored. */
export function unsupportedKeywords(schema, path = '$', out = []) {
  if (typeof schema !== 'object' || schema === null) return out;
  for (const [k, v] of Object.entries(schema)) {
    if (!SUPPORTED.has(k)) out.push(`${path}.${k}`);
    if (k === 'properties' || k === 'definitions') for (const [pk, pv] of Object.entries(v)) unsupportedKeywords(pv, `${path}.${k}.${pk}`, out);
    else if (k === 'allOf' || k === 'anyOf' || k === 'oneOf') v.forEach((s, i) => unsupportedKeywords(s, `${path}.${k}[${i}]`, out));
    else if (['items', 'if', 'then', 'else', 'not', 'additionalProperties'].includes(k)) unsupportedKeywords(v, `${path}.${k}`, out);
  }
  return out;
}

function typeOk(t, v) {
  if (t === 'object') return v !== null && typeof v === 'object' && !Array.isArray(v);
  if (t === 'array') return Array.isArray(v);
  if (t === 'null') return v === null;
  if (t === 'integer') return Number.isInteger(v);
  return typeof v === t;
}

export function validate(schema, value, root = schema, path = '$') {
  if (schema === true) return [];
  if (schema === false) return [`${path}: not allowed`];
  const errs = [];
  if (schema.$ref) {
    const m = /^#\/definitions\/(.+)$/.exec(schema.$ref);
    if (!m || !root.definitions?.[m[1]]) return [`${path}: unresolvable $ref ${schema.$ref}`];
    errs.push(...validate(root.definitions[m[1]], value, root, path));
  }
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeOk(t, value))) return [...errs, `${path}: expected ${types.join('|')}`];
  }
  if (schema.enum && !schema.enum.some((e) => e === value)) errs.push(`${path}: ${JSON.stringify(value)} not in enum`);
  if ('const' in schema && schema.const !== value) errs.push(`${path}: expected ${JSON.stringify(schema.const)}`);
  if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value)) errs.push(`${path}: fails ${schema.pattern}`);
  if (typeOk('object', value)) {
    for (const k of schema.required ?? []) if (!(k in value)) errs.push(`${path}: missing ${k}`);
    const props = schema.properties ?? {};
    for (const [k, v] of Object.entries(value)) {
      if (k in props) errs.push(...validate(props[k], v, root, `${path}.${k}`));
      else if (schema.additionalProperties !== undefined) errs.push(...validate(schema.additionalProperties, v, root, `${path}.${k}`));
    }
  }
  if (Array.isArray(value) && schema.items !== undefined) value.forEach((v, i) => errs.push(...validate(schema.items, v, root, `${path}[${i}]`)));
  if (schema.if !== undefined) {
    const branch = validate(schema.if, value, root, path).length === 0 ? schema.then : schema.else;
    if (branch !== undefined) errs.push(...validate(branch, value, root, path));
  }
  for (const s of schema.allOf ?? []) errs.push(...validate(s, value, root, path));
  if (schema.anyOf && !schema.anyOf.some((s) => validate(s, value, root, path).length === 0)) errs.push(`${path}: matches no anyOf branch`);
  if (schema.oneOf && schema.oneOf.filter((s) => validate(s, value, root, path).length === 0).length !== 1) errs.push(`${path}: must match exactly one oneOf branch`);
  if (schema.not !== undefined && validate(schema.not, value, root, path).length === 0) errs.push(`${path}: matches a "not" schema`);
  return errs;
}

/* ---------- public entries (src/contracts/entries.ts, CONTRACT-owned) ---------- */
/** Parses ENTRIES / ROOT_EXPORTS from the contract source: subpath → value-export names (null = pattern/opaque). */
export function readEntries(repo = REPO) {
  const src = readFileSync(join(repo, 'src/contracts/entries.ts'), 'utf8');
  const list = (s) => [...s.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const root = new Set();
  const rootBlock = /export const ROOT_EXPORTS = \{([\s\S]*?)\}\s*as const/.exec(src);
  if (!rootBlock) throw new Error('entries.ts: ROOT_EXPORTS not found');
  for (const m of rootBlock[1].matchAll(/\w+:\s*\[([\s\S]*?)\]/g)) for (const n of list(m[1])) root.add(n);
  const entries = new Map();
  for (const m of src.matchAll(/\{\s*subpath:\s*'([^']+)'([\s\S]*?)\}/g)) {
    const [, subpath, rest] = m;
    const ex = /exports:\s*\[([\s\S]*?)\]/.exec(rest);
    const names = ex ? list(ex[1]) : [];
    const spec = subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.slice(2)}`;
    entries.set(spec, subpath === '.' ? root : names.some((n) => n.startsWith('@')) ? null : new Set(names));
  }
  if (!entries.has('aura-glass')) throw new Error('entries.ts: root entry not found');
  /* './icons/<name>' pattern entry (comment in ENTRIES). */
  entries.set('aura-glass/icons/*', null);
  /* Registry code never composes through compat (REQ-SURF-170: no aura-glass/compat). */
  for (const k of [...entries.keys()]) if (k === 'aura-glass/compat' || k.startsWith('aura-glass/compat/')) entries.delete(k);
  return entries;
}

/* ---------- source scanning ---------- */
/** Line-preserving strip of comments (string-aware) so imports in comments are ignored. */
export function stripComments(src) {
  let out = '', i = 0, mode = 'code', q = '';
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (mode === 'code') {
      if (c === '/' && n === '/') { mode = 'line'; i += 2; out += '  '; continue; }
      if (c === '/' && n === '*') { mode = 'block'; i += 2; out += '  '; continue; }
      if (c === '"' || c === "'" || c === '`') { mode = 'str'; q = c; }
      out += c; i += 1; continue;
    }
    if (mode === 'str') {
      if (c === '\\') { out += c + (n ?? ''); i += 2; continue; }
      if (c === q) mode = 'code';
      out += c; i += 1; continue;
    }
    if (mode === 'line') { if (c === '\n') { mode = 'code'; out += c; } else out += ' '; i += 1; continue; }
    if (c === '*' && n === '/') { mode = 'code'; out += '  '; i += 2; continue; }
    out += c === '\n' ? '\n' : ' '; i += 1;
  }
  return out;
}

const IMPORT_RE = /\b(import|export)\s+(type\s+)?([^'"`;]*?)\s*from\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]|\brequire\s*\(\s*['"]([^'"]+)['"]/g;

/** Imports of one file: { spec, typeOnly, names: [{ name, type }], line }. */
export function importsOf(src) {
  const code = stripComments(src);
  const out = [];
  for (const m of code.matchAll(IMPORT_RE)) {
    const line = code.slice(0, m.index).split('\n').length;
    if (m[4]) {
      const clause = m[3] ?? '';
      const names = [];
      const brace = /\{([\s\S]*)\}/.exec(clause);
      if (brace) {
        for (const part of brace[1].split(',')) {
          const p = part.trim();
          if (!p) continue;
          const type = /^type\s+/.test(p);
          names.push({ name: p.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim(), type });
        }
      }
      const def = /^\s*([A-Za-z_$][\w$]*)\s*(?:,|$)/.exec(clause.replace(/^type\s+/, ''));
      if (def && !clause.trim().startsWith('{') && !clause.trim().startsWith('*')) names.push({ name: 'default', type: false });
      out.push({ spec: m[4], typeOnly: !!m[2], names, line });
    } else {
      out.push({ spec: m[5] ?? m[6] ?? m[7], typeOnly: false, names: [], line });
    }
  }
  return out;
}

const pkgOf = (spec) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);
const bareDep = (d) => d.replace(/(?<=.)@[^@/]*$/, '');

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else out.push(relative(base, p).split(sep).join('/'));
  }
  return out;
}

/** An item is async when its content arrives asynchronously: a Suspense/lazy
 * boundary, a loading/streaming status it renders, or an exported async data
 * loader. Such items need a Loading story. (A user-triggered await inside an
 * event handler, or a type-position `import('x').T`, is not content loading.) */
export const ASYNC_SOURCE = /\bSuspense\b|\blazy\s*\(|status\s*===?\s*['"](?:loading|submitted|streaming|pending)['"]|\bisLoading\b|\bloading\s*\?\s*:|export\s+async\s+function/;
export const isAsyncSource = (code) => ASYNC_SOURCE.test(code);
/** First statement is the 'use client' directive. */
const USE_CLIENT = /^\s*(?:(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)\s*)*['"]use client['"]/;

/* ---------- the lint ---------- */
export function lintRegistry({ root = REPO, repo = REPO } = {}) {
  const schema = JSON.parse(readFileSync(join(repo, SCHEMA_PATH), 'utf8'));
  const entries = readEntries(repo);
  const violations = [];
  const counts = [];
  const v = (id, rule, msg, file = null, line = null) => violations.push({ id, rule, file, line, msg });

  const unknownKw = unsupportedKeywords(schema);
  if (unknownKw.length) v('*', 'schema', `vendored schema uses keywords the validator does not implement: ${unknownKw.join(', ')}`);

  const registryIds = new Set();
  for (const kind of ['base', 'blocks', 'items']) {
    const d = join(root, 'registry', kind);
    if (existsSync(d)) for (const id of readdirSync(d)) if (existsSync(join(d, id, 'registry-item.json'))) registryIds.add(`${kind}/${id}`);
  }
  const idExists = (id) => ['base', 'blocks', 'items'].some((k) => registryIds.has(`${k}/${id}`));

  const targets = [...SURF_BLOCKS.map((id) => ['blocks', id]), ...SURF_ITEMS.map((id) => ['items', id])];
  for (const [kind, id] of targets) {
    const dir = join(root, 'registry', kind, id);
    const metaPath = join(dir, 'registry-item.json');
    const relMeta = `registry/${kind}/${id}/registry-item.json`;
    if (!existsSync(metaPath)) { v(id, 's46', `S-46 SURF ${kind === 'blocks' ? 'block' : 'item'} ${id} has no ${relMeta}`); continue; }
    let item;
    try { item = JSON.parse(readFileSync(metaPath, 'utf8')); } catch (e) { v(id, 'schema', `invalid JSON: ${e.message}`, relMeta); continue; }

    /* schema + S-46 */
    for (const e of validate(schema, item)) v(id, 'schema', e, relMeta);
    const wantType = kind === 'blocks' ? 'registry:block' : 'registry:item';
    if (item.name !== id) v(id, 's46', `name ${JSON.stringify(item.name)} != directory id ${id}`, relMeta);
    if (item.type !== wantType) v(id, 's46', `type ${JSON.stringify(item.type)} != ${wantType}`, relMeta);
    const meta = item.meta?.auraglass;
    if (!meta) v(id, 's46', 'meta.auraglass missing (S-46 RegistryItemOwner)', relMeta);
    else {
      if (meta.owner !== 'SURF') v(id, 's46', `meta.auraglass.owner ${JSON.stringify(meta.owner)} != "SURF" (contract §3.3)`, relMeta);
      const surface = kind === 'blocks' ? 'block' : 'item';
      if (meta.surface !== surface) v(id, 's46', `meta.auraglass.surface ${JSON.stringify(meta.surface)} != "${surface}"`, relMeta);
      if (typeof meta.client !== 'boolean') v(id, 's46', 'meta.auraglass.client must be boolean', relMeta);
      const ga = !SURF_5X_BLOCKS.includes(id);
      if (meta.ga !== ga) v(id, 's46', `meta.auraglass.ga ${JSON.stringify(meta.ga)} != ${ga} (contract §3.3 ${ga ? 'GA' : '5.x'} row)`, relMeta);
    }

    /* files */
    const all = walk(dir).filter((f) => f !== 'registry-item.json');
    const sources = all.filter((f) => SOURCE_FILE.test(f) && !isDev(f));
    const listed = new Set();
    for (const f of item.files ?? []) {
      const p = typeof f?.path === 'string' ? f.path : '';
      const abs = resolve(dir, p);
      if (!p || !abs.startsWith(dir + sep)) { v(id, 'files-exist', `files[] path ${JSON.stringify(p)} escapes the item dir`, relMeta); continue; }
      if (!existsSync(abs)) v(id, 'files-exist', `files[] path ${p} does not exist`, relMeta);
      if (isDev(p)) v(id, 'files-complete', `files[] lists harness file ${p} (stories/tests never ship)`, relMeta);
      listed.add(p);
    }
    for (const f of sources) if (!listed.has(f)) v(id, 'files-complete', `source file ${f} is not listed in files[]`, relMeta);
    counts.push({ id, kind, sources: sources.length, listed: sources.filter((f) => listed.has(f)).length });

    /* fixtures */
    if (!all.includes('fixtures.ts')) v(id, 'fixtures', 'fixtures.ts missing (deterministic sample data, contract §3.3)');
    for (const f of all.filter((x) => isFixture(x) && CODE_FILE.test(x))) {
      const code = stripComments(readFileSync(join(dir, f), 'utf8'));
      const m = /Math\.random|Date\.now|new Date\(|fetch\s*\(|crypto\.randomUUID/.exec(code);
      if (m) v(id, 'fixtures', `non-deterministic ${m[0]} in fixture`, `registry/${kind}/${id}/${f}`);
    }

    /* per-file scan */
    const wantRegistry = new Set();
    const importedPkgs = new Set();
    const componentNames = new Set();
    let shippedAsync = false;
    let auraShipped = false;
    let usesClient = false;
    for (const f of all.filter((x) => CODE_FILE.test(x) || x.endsWith('.css'))) {
      const rel = `registry/${kind}/${id}/${f}`;
      const raw = readFileSync(join(dir, f), 'utf8');
      const code = f.endsWith('.css') ? raw : stripComments(raw);
      if (!isFixture(f)) {
        /* Comments are prose, not styling: scan code only (lines preserved). */
        (f.endsWith('.css') ? raw.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')) : code).split('\n').forEach((text, i) => {
          const m = LITERAL.exec(text);
          if (m) v(id, 'literal', `${m[0]} literal outside fixtures`, rel, i + 1);
        });
      }
      if (f.endsWith('.css')) continue;
      const dev = isDev(f);
      if (!dev && USE_CLIENT.test(raw)) usesClient = true;
      if (!dev && isAsyncSource(code)) shippedAsync = true;
      for (const imp of importsOf(raw)) {
        const { spec, line } = imp;
        if (!spec) continue;
        if (spec.startsWith('.')) {
          const target = resolve(dirname(join(dir, f)), spec);
          if (!(target === dir || target.startsWith(dir + sep))) {
            v(id, 'relative-escape', `relative import '${spec}' leaves the item dir (import a sibling as '@/registry/<kind>/<id>/...' and list it in registryDependencies)`, rel, line);
          }
          continue;
        }
        const reg = /^@\/registry\/(base|blocks|items)\/([a-z0-9-]+)(?:\/.*)?$/.exec(spec);
        if (reg) {
          if (!registryIds.has(`${reg[1]}/${reg[2]}`)) v(id, 'registry-deps', `'${spec}' names registry ${reg[1]}/${reg[2]}, which does not exist`, rel, line);
          if (reg[2] === id) v(id, 'relative-escape', `'${spec}' imports the item itself through the registry alias; use a relative path`, rel, line);
          else if (!dev) wantRegistry.add(reg[2]);
          continue;
        }
        if (spec.startsWith('@/')) { v(id, 'public-import', `'${spec}' is an app alias outside the registry (@/registry/<kind>/<id> only)`, rel, line); continue; }
        if (spec === 'aura-glass' || spec.startsWith('aura-glass/')) {
          const key = entries.has(spec) ? spec : /^aura-glass\/icons\/[^/]+$/.test(spec) ? 'aura-glass/icons/*' : null;
          if (!key) { v(id, 'public-import', `'${spec}' is not a public 5.0 entry`, rel, line); continue; }
          const exportsSet = entries.get(key);
          for (const { name, type } of imp.names) {
            if (imp.typeOnly || type) continue;
            if (exportsSet && !exportsSet.has(name)) v(id, 'public-import', `'${name}' is not a value export of '${spec}' (ENTRIES/ROOT_EXPORTS; import types with \`type\`)`, rel, line);
            if (!dev && /^[A-Z]/.test(name)) componentNames.add(name);
          }
          if (!dev) auraShipped = true;
          continue;
        }
        if (spec.startsWith('node:') || DEV_PKG.test(spec)) {
          if (!dev) v(id, 'npm-deps', `'${spec}' is harness-only and cannot be imported by shipped code`, rel, line);
          continue;
        }
        if (dev) continue;
        importedPkgs.add(pkgOf(spec));
      }
    }

    /* registryDependencies */
    const want = new Set(wantRegistry);
    if (auraShipped) want.add(BASE_ID);
    const have = new Set(item.registryDependencies ?? []);
    for (const d of have) if (!idExists(d)) v(id, 'registry-deps', `registryDependencies '${d}' is not a registry id in registry/{base,blocks,items}`, relMeta);
    for (const d of want) if (!have.has(d)) v(id, 'registry-deps', `imports ${d === BASE_ID ? 'aura-glass' : `@/registry/*/${d}`} but registryDependencies lacks '${d}'`, relMeta);
    for (const d of have) if (idExists(d) && !want.has(d)) v(id, 'registry-deps', `registryDependencies '${d}' is never imported`, relMeta);

    /* npm dependencies */
    const deps = (item.dependencies ?? []).map(bareDep);
    for (const d of deps) {
      if (d === 'aura-glass') { if (!auraShipped) v(id, 'npm-deps', `dependency 'aura-glass' is never imported`, relMeta); }
      else if (!IMPLICIT.has(d) && !importedPkgs.has(d)) v(id, 'npm-deps', `dependency '${d}' is never imported`, relMeta);
    }
    for (const p of importedPkgs) if (!deps.includes(p)) v(id, 'npm-deps', `imports '${p}' but dependencies lacks it`, relMeta);

    /* meta.auraglass.components / client */
    if (meta && typeof meta.client === 'boolean' && meta.client !== usesClient) {
      v(id, 's46', `meta.auraglass.client ${meta.client} but ${usesClient ? 'a shipped file is' : 'no shipped file is'} a 'use client' module`, relMeta);
    }
    if (meta && Array.isArray(meta.components)) {
      const declared = new Set(meta.components);
      for (const n of componentNames) if (!declared.has(n)) v(id, 'meta-components', `imports ${n} not listed in meta.auraglass.components`, relMeta);
      for (const n of declared) if (!componentNames.has(n)) v(id, 'meta-components', `meta.auraglass.components lists ${n}, which is never imported`, relMeta);
    }

    /* stories */
    const stories = all.filter(isStory);
    const exportsText = stories.map((s) => stripComments(readFileSync(join(dir, s), 'utf8'))).join('\n');
    const exported = new Set([...exportsText.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
    const required = shippedAsync ? [...STORY_STATES, 'Loading'] : STORY_STATES;
    if (!stories.length) v(id, 'stories', 'no colocated *.stories.tsx');
    for (const s of required) if (!exported.has(s)) v(id, 'stories', `story export ${s} missing${s === 'Loading' ? ' (item is async)' : ''}`);
  }
  return { violations, counts };
}

export function main(argv = process.argv.slice(2)) {
  const known = new Set(['--root', '--json', '--count']);
  for (let i = 0; i < argv.length; i += 1) {
    if (!known.has(argv[i])) { console.error(`verify-registry: unknown argument ${argv[i]}`); return 2; }
    if (argv[i] !== '--count') i += 1;
  }
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const { violations, counts } = lintRegistry({ root: arg('--root') ? resolve(arg('--root')) : REPO });
  const json = arg('--json');
  if (json) { mkdirSync(dirname(resolve(json)), { recursive: true }); writeFileSync(resolve(json), JSON.stringify({ violations, counts }, null, 2) + '\n'); }
  if (argv.includes('--count')) {
    for (const c of counts) console.log(`${c.kind}/${c.id}: ${c.listed}/${c.sources} source files listed in files[]`);
    const tot = counts.reduce((a, c) => ({ s: a.s + c.sources, l: a.l + c.listed }), { s: 0, l: 0 });
    console.log(`total: ${tot.l}/${tot.s} source files listed across ${counts.length} SURF ids`);
  }
  for (const x of violations) console.error(`${x.file ?? x.id}${x.line ? `:${x.line}` : ''} [${x.rule}] ${x.msg}`);
  if (violations.length) { console.error(`surf registry lint: ${violations.length} violation(s)`); return 1; }
  console.log(`surf registry lint: clean (${counts.length} SURF ids)`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
