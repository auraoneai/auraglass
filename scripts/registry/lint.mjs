#!/usr/bin/env node
/* scripts/registry/lint.mjs — PLAT-356 (REQ-PLAT-95). Style/content gate
   over every block and item of every owner. Exit 1 on any violation.

   Usage: node scripts/registry/lint.mjs [--root <dir>] [--json <path>] [--id <item>]
   Rules:
     no-important            !important
     no-color-literal        #hex(3-8) rgb( rgba( hsl( hsla( oklch( oklab( color-mix( — incl. var() fallbacks
     no-inline-optics        backdrop-filter, blur( or inline optics styles
     no-inline-optics-style  style={{ ... colour/blur/shadow/radius ...
     import-allowlist        imports restricted to aura-glass(+subpaths), react, next/… (route/layout), own files, declared deps
     declared-dep-imported   every declared dependency must be imported
     no-const-controlled     controlled input with constant value + no-op onChange
     no-api-key              /[A-Z_]*API_KEY/ except PRISM_API_KEY in server-only app/api/<name>/route.ts
     no-client-key           NEXT_PUBLIC_*KEY or key references in client files
     no-copy-filler          lorem/ipsum/demo/placeholder copy (auth example.com allowed)
     no-viewport-class       (sm|md|lg|xl|2xl): classes unless Tailwind v4 project
     no-legacy-selector      4.x recipe selectors
     meta-components         every block lists its aura-glass imports in meta.auraglass.components
*/
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DEFAULT = join(fileURLToPath(import.meta.url), '../../..');
const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\s*\(|hsla?\s*\(|oklch\s*\(|oklab\s*\(|color-mix\s*\(/;
const OPTICS = /backdrop-filter|-webkit-backdrop-filter|\bblur\s*\(/;
const VIEWPORT = /(?<![@\w-])(?:sm|md|lg|xl|2xl):[a-zA-Z0-9-[\]]/;
const LEGACY = /\bglass-(?:app-shell__body|sidebar-rail|topbar|dock|drawer|modal|card)\b/;
const FILLER = /\b(?:lorem|ipsum|dolor|consectetur)\b|placeholder\s*=\s*["'][^"']*(?:lorem|placeholder text)/i;
const API_KEY = /[A-Z_]*API_KEY/;
const IMPORT_RE = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]/g;
// Lazy-dep convention: `const X_SPECIFIER = '<pkg>'` + a vite-ignore dynamic
// import keeps consumer-installed deps lazy without TS2307; the specifier
// literal counts as an import reference.
const SPECIFIER_RE = /const\s+\w+_SPECIFIER\s*[:=][^'"]*['"]([^'"]+)['"]/g;
const OWN = (id) => new RegExp(`^(\\.|@/|~\\b|${id}/)`);
const DEP_ALLOW = /^(aura-glass(?:\/[a-z0-9-]+)*|react(?:\/[a-z-]+)?|react-dom(?:\/[a-z-]+)?|next(?:\/[a-z0-9-]+)?)$/;
/* Stories/tests may import the harness toolchain. */
const DEV_FILE = /\.(stories|test|spec|d)\.[jt]sx?$|fixtures?\.[jt]sx?$/;
const DEV_ALLOW = /^(node:.*|@storybook(?:\/[a-z0-9-]+)?|@jest(?:\/[a-z0-9-]+)?|@testing-library(?:\/[a-z0-9-]+)*|vitest|@playwright(?:\/[a-z0-9-]+)?)$/;
/* deps satisfied by the JSX runtime — never need an explicit import. */
const IMPLICIT_DEPS = new Set(['react', 'react-dom']);
const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css|mdx?)$/;
/* Line-preserving strip of // and /*-comment regions, string-aware. */
export function stripAll(src) {
  let out = '', i = 0, mode = 'code', q = '';
  while (i < src.length) {
    const c = src[i], nx = src[i + 1];
    if (mode === 'code') {
      if (c === '/' && nx === '/') { mode = 'line'; out += '  '; i += 2; continue; }
      if (c === '/' && nx === '*') { mode = 'block'; out += '  '; i += 2; continue; }
      if (c === '"' || c === "'" || c === '`') { mode = 'str'; q = c; }
      out += c; i += 1; continue;
    }
    if (mode === 'str') {
      if (c === '\\') { out += c + (nx ?? ''); i += 2; continue; }
      if (c === q) mode = 'code';
      out += c; i += 1; continue;
    }
    if (mode === 'line') { if (c === '\n') { mode = 'code'; out += c; } else out += ' '; i += 1; continue; }
    if (mode === 'block') { if (c === '*' && nx === '/') { mode = 'code'; out += '  '; i += 2; continue; } out += c === '\n' ? '\n' : ' '; i += 1; }
  }
  return out;
}
const STYLE_OPTICS = /#[0-9a-fA-F]{3,8}\b|rgba?\s*\(|hsla?\s*\(|oklch\s*\(|oklab\s*\(|color-mix\s*\(|blur\s*\(|box-shadow\s*:|boxShadow\s*:|(?:borderRadius|radius)\s*:\s*['"](?!var\()/;

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (CODE_EXT.test(name) && !name.endsWith('.d.ts')) yield p;
  }
}

export function lintFile({ file, rel, src, id, deps, tailwind }) {
  const out = [];
  const push = (rule, line, excerpt) => out.push({ file: rel, line, rule, excerpt: excerpt.trim().slice(0, 140) });
  const lines = stripAll(src).split('\n');
  const rawLines = src.split('\n');
  const isServerRoute = /app\/api\/.*\/route\.ts$/.test(rel) || /app[\\/]api[\\/].*[\\/]route\.ts$/.test(file);
  const isClient = !isServerRoute && /use client|\.client\.|fixtures?\.|\.stories\.|index\.tsx?$/.test(rel);
  const isAuth = /auth/i.test(id);
  const isDev = DEV_FILE.test(rel);
  lines.forEach((text, i) => {
    const n = i + 1;
    const raw = rawLines[i] ?? text;
    if (/!important/.test(text)) push('no-important', n, raw);
    if (COLOR.test(text)) push('no-color-literal', n, raw);
    if (OPTICS.test(text)) push('no-inline-optics', n, raw);
    if (/style=\{\{/.test(text) && STYLE_OPTICS.test(text)) push('no-inline-optics-style', n, raw);
    if (LEGACY.test(text)) push('no-legacy-selector', n, raw);
    if (API_KEY.test(text) && !isDev && !(isServerRoute && /PRISM_API_KEY/.test(text))) push('no-api-key', n, raw);
    if (isClient && /NEXT_PUBLIC_\w*(?:KEY|SECRET|TOKEN)/.test(text)) push('no-client-key', n, raw);
    if (FILLER.test(text) && !(isAuth && /example\.com/.test(text))) push('no-copy-filler', n, raw);
    if (!tailwind && !isDev && VIEWPORT.test(text)) push('no-viewport-class', n, raw);
  });
  /* Controlled input with constant value + no-op onChange. */
  const stripped = stripAll(src);
  for (const m of stripped.matchAll(/<(?:input|textarea|select)\b[^>]*>/g)) {
    const tag = m[0];
    const constValue = /value=\{["'`][^"'`]*["'`]\}|value=\{\s*[A-Z][A-Z0-9_]*\s*\}/.test(tag);
    if (!constValue) continue;
    const handler = tag.match(/onChange=\{([^}]*)\}/);
    if (!handler || /^\s*(?:\(\)\s*=>\s*(?:\{\s*\}|null|undefined|0)|noop|undefined)\s*$/.test(handler[1])) {
      push('no-const-controlled', lineOf(stripped, m.index ?? 0), tag.slice(0, 140));
    }
  }
  /* Imports. */
  for (const m of src.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2] ?? m[3] ?? m[4];
    if (!spec) continue;
    if (spec.startsWith('.') || spec.startsWith('/') || OWN(id).test(spec)) continue;
    if (DEP_ALLOW.test(spec)) continue;
    if (isDev && DEV_ALLOW.test(spec)) continue;
    const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    const bareDeps = deps.map((d) => d.replace(/@[~^]?\d[\w.-]*$/, '').trim());
    if (!bareDeps.includes(pkg) && !bareDeps.includes(spec) && !bareDeps.some((d) => spec.startsWith(`${d}/`))) push('import-allowlist', lineOf(src, m.index), `import '${spec}' not in aura-glass/react/next/declared deps`);
  }
  return out;
}
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;

export function lint({ root = ROOT_DEFAULT, only = null } = {}) {
  const violations = [];
  const tailwind = existsSync(join(root, 'tailwind.config.ts')) || existsSync(join(root, 'tailwind.config.js')) || existsSync(join(root, 'app/tailwind.css'));
  for (const kind of ['base', 'blocks', 'items']) {
    const dir = join(root, 'registry', kind);
    if (!existsSync(dir)) continue;
    for (const id of readdirSync(dir).sort()) {
      if (only && id !== only) continue;
      const itemDir = join(dir, id);
      const itemFile = join(itemDir, 'registry-item.json');
      if (!existsSync(itemFile)) continue;
      const item = JSON.parse(readFileSync(itemFile, 'utf8'));
      const deps = item.dependencies ?? [];
      const files = [...walk(itemDir)].filter((f) => !f.endsWith('registry-item.json'));
      const imported = new Set();
      for (const file of files) {
        const src = readFileSync(file, 'utf8');
        for (const m of src.matchAll(IMPORT_RE)) { const s = m[1] ?? m[2] ?? m[3] ?? m[4]; if (s) imported.add(s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0]); }
        for (const m of src.matchAll(SPECIFIER_RE)) { const s = m[1]; if (s) imported.add(s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0]); }
        violations.push(...lintFile({ file, rel: relative(root, file), src, id, deps, tailwind }));
      }
      for (const dep of deps) {
        const bare = dep.replace(/@[~^]?\d[\w.-]*$/, '').trim();
        if (IMPLICIT_DEPS.has(bare)) continue;
        /* registry:base exists to carry the aura-glass dependency itself. */
        if (item.type === 'registry:base' && bare === 'aura-glass') continue;
        if (!imported.has(bare) && ![...imported].some((s) => s === bare || s.startsWith(`${bare}/`)))
          violations.push({ file: relative(root, itemFile), line: 1, rule: 'declared-dep-imported', excerpt: `'${dep}' declared but never imported` });
      }
      /* meta.auraglass.components must list every aura-glass import. */
      if (kind === 'blocks' || kind === 'items') {
        const declared = new Set(item.meta?.auraglass?.components ?? []);
        const actual = new Set();
        for (const file of files) {
          const src = readFileSync(file, 'utf8');
          for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](aura-glass(?:\/[a-z0-9-]+)?)['"]/g))
            for (const n of m[1].split(',')) { const name = n.trim().split(/\s+as\s+/)[0].trim(); if (name && /^[A-Z]/.test(name)) actual.add(name); }
        }
        if (kind === 'blocks') {
          for (const name of actual) if (!declared.has(name))
            violations.push({ file: relative(root, itemFile), line: 1, rule: 'meta-components', excerpt: `imports ${name} not listed in meta.auraglass.components` });
        }
      }
    }
  }
  return violations;
}

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const violations = lint({ root: arg('--root') ?? undefined, only: arg('--id') });
  const json = arg('--json');
  if (json) { mkdirSync(join(json, '..'), { recursive: true }); writeFileSync(json, JSON.stringify(violations, null, 2) + '\n'); }
  if (violations.length) {
    for (const v of violations) console.error(`${v.file}:${v.line} [${v.rule}] ${v.excerpt}`);
    console.error(`registry lint: ${violations.length} violation(s)`);
    return 1;
  }
  console.log('registry lint: clean');
  return 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
