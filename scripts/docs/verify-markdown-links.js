#!/usr/bin/env node
/* scripts/docs/verify-markdown-links.js — REQ-PLAT-102 (REQ-FIN-43), PLAT-383.
 * Route-aware, case-sensitive Markdown link checker (ESM; package type=module).
 *
 * Inputs (repo-relative):
 *   - docs-app pages: apps/docs/content/**, apps/docs/generated/**,
 *     docs/quickstart/** (→ /quickstart/*), docs/guides/** (→ /guides/*) —
 *     the same source roots, prefixes and precedence as apps/docs/lib/routes.ts;
 *   - plain repo Markdown: README.md and docs/** (minus docs/auraglass-5/**,
 *     the planning archive, and the docs-app roots above).
 *
 * Rules:
 *   - File targets resolve with fs.realpathSync.native and must match the
 *     written path's case exactly on every OS (macOS/Windows included).
 *   - `/absolute` links on docs-app pages must be a docs route: a page of the
 *     static export (`--out apps/docs/out`, trailingSlash layout
 *     <route>/index.html), else the source-derived route set (plus component /
 *     surface / api routes from apps/docs/generated/nav-data.json when it
 *     exists); or a redirect source (apps/docs/redirects.json,
 *     apps/docs/public/_redirects); or a file under apps/docs/public/. Route
 *     comparison is exact (case-sensitive).
 *   - Relative links on docs-app pages must land on another page's source
 *     (the renderer turns those into routes). A relative link to a repo file
 *     that is not a page renders as a dead href on the site and fails.
 *   - Plain repo Markdown: `/x` resolves against the repo root (GitHub/GitLab
 *     rendering), relative links against the file.
 *   - `#fragment` on a Markdown target must be a heading slug or an explicit
 *     id; on an out/ page an `id="…"` in its HTML; `#L<n>` on other files a
 *     valid line.
 * Expiring baseline: scripts/integration/baselines/docs-links.json (PRD-F
 * §4.3 rule 3). Exit 1 on any blocking finding.
 *
 * Usage: node scripts/docs/verify-markdown-links.js [--out <dir>] [--json <file>]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyBaseline, loadBaseline, packageVersion } from './lib/baseline.mjs';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MD = /\.(md|mdx)$/;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const toPosix = (p) => p.split(sep).join('/');

/** Docs-app source roots in precedence order (mirrors apps/docs/lib/routes.ts sourceRoots). */
export const PAGE_ROOTS = [
  { dir: 'apps/docs/content', prefix: '' },
  { dir: 'apps/docs/generated', prefix: '' },
  { dir: 'docs/quickstart', prefix: 'quickstart' },
  { dir: 'docs/guides', prefix: 'guides' },
];
export const PLAIN_ROOTS = ['README.md', 'docs'];
export const PLAIN_EXCLUDE = ['docs/auraglass-5', 'docs/quickstart', 'docs/guides'];

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, test, out);
    else if (test(name)) out.push(p);
  }
  return out;
}

/** True when `p` exists and its on-disk spelling equals `p` exactly. */
export function existsExactCase(p) {
  try {
    return realpathSync.native(p) === resolve(p) || caseWalk(p);
  } catch {
    return false;
  }
}
/* realpath also resolves symlinks; fall back to a per-segment directory
   listing so a symlinked parent is not mistaken for a case mismatch. */
function caseWalk(p) {
  const abs = resolve(p);
  const parts = abs.split(sep);
  let cur = parts[0] || sep;
  for (const part of parts.slice(1)) {
    if (!part) continue;
    if (!readdirSync(cur).includes(part)) return false;
    cur = join(cur, part);
  }
  return true;
}

/** Fenced code and inline code are not links. */
export function stripCode(src) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return src.replace(/^(\s*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2[`~]*\s*$/gm, blank).replace(/`[^`\n]*`/g, blank);
}

/** Links of one Markdown source: inline, image and reference definitions, with 1-based lines. */
export function extractLinks(src) {
  const text = stripCode(src);
  const links = [];
  const lineOf = (i) => text.slice(0, i).split('\n').length;
  const inline = /!?\[(?:[^\]\n\\]|\\.|\[[^\]\n]*\])*\]\(\s*(<[^>\n]*>|[^)\s]+)(?:\s+["'(][^)\n]*)?\)/g;
  const refdef = /^ {0,3}\[[^\]\n]+\]:\s+(<[^>\n]*>|\S+)/gm;
  for (const re of [inline, refdef]) {
    for (const m of text.matchAll(re)) links.push({ href: m[1].replace(/^<|>$/g, ''), line: lineOf(m.index) });
  }
  return links.sort((a, b) => a.line - b.line);
}

/** GitHub-style heading slugs (with -1, -2 suffixes) plus explicit ids. */
export function anchorsOf(src) {
  const anchors = new Set();
  const counts = new Map();
  for (const m of stripCode(src).matchAll(/^(#{1,6})\s+(.+?)\s*#*\s*$/gm)) {
    const base = m[2].trim().toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-');
    const n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
    anchors.add(n ? `${base}-${n}` : base);
  }
  for (const m of src.matchAll(/\bid=["']([^"']+)["']/g)) anchors.add(m[1]);
  return anchors;
}

/** Page sources → route (first root wins, like routes.ts discoverSources). */
export function discoverPages(root) {
  const byRoute = new Map();
  for (const { dir, prefix } of PAGE_ROOTS) {
    const abs = join(root, dir);
    for (const file of walk(abs, (n) => MD.test(n))) {
      const rel = toPosix(relative(abs, file)).replace(MD, '').replace(/(^|\/)index$/, '');
      const route = '/' + posix.join(prefix, rel).replace(/^\.$/, '');
      if (!byRoute.has(route)) byRoute.set(route, toPosix(relative(root, file)));
    }
  }
  const byFile = new Map([...byRoute].map(([r, f]) => [f, r]));
  return { byRoute, byFile };
}

/** Routes of a static export with trailingSlash (out/<route>/index.html) or flat <route>.html. */
export function routesFromOut(outDir) {
  const routes = new Map();
  for (const file of walk(outDir, (n) => n.endsWith('.html'))) {
    const rel = toPosix(relative(outDir, file));
    const route = '/' + rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
    routes.set(route.replace(/\/$/, '') || '/', file);
  }
  return routes;
}

/** Redirect sources from apps/docs/redirects.json and apps/docs/public/_redirects. */
export function redirectSources(root) {
  const out = new Set();
  const json = join(root, 'apps/docs/redirects.json');
  if (existsSync(json)) {
    const data = JSON.parse(readFileSync(json, 'utf8'));
    const rows = Array.isArray(data) ? data : data.redirects ?? [];
    for (const r of rows) if (r?.source) out.add(String(r.source).replace(/\/$/, '') || '/');
  }
  const flat = join(root, 'apps/docs/public/_redirects');
  if (existsSync(flat)) {
    for (const line of readFileSync(flat, 'utf8').split('\n')) {
      const src = line.trim().split(/\s+/)[0];
      if (src && !src.startsWith('#')) out.add(src.replace(/\/$/, '') || '/');
    }
  }
  return out;
}

function navRoutes(root) {
  const p = join(root, 'apps/docs/generated/nav-data.json');
  if (!existsSync(p)) return [];
  const d = JSON.parse(readFileSync(p, 'utf8'));
  return [
    ...(d.components ?? []).map((c) => `/components/${c.slug}`),
    ...(d.surfaces ?? []).map((s) => `/surfaces/${s.name}`),
    ...(d.api ?? []).map((a) => `/api/${a.slug}`),
  ];
}

function redirectMatch(route, redirects) {
  if (redirects.has(route)) return true;
  for (const r of redirects) if (r.endsWith('/*') && (route === r.slice(0, -2) || route.startsWith(r.slice(0, -1)))) return true;
  return false;
}

function lineAnchorOk(file, frag) {
  const m = /^L(\d+)(?:-L(\d+))?$/.exec(frag);
  if (!m) return false;
  const n = readFileSync(file, 'utf8').split('\n').length;
  const a = Number(m[1]); const b = Number(m[2] ?? m[1]);
  return a >= 1 && b >= a && b <= n;
}

function decode(p) { try { return decodeURIComponent(p); } catch { return p; } }

/**
 * All findings for the repo at `root`. `outDir` (absolute) switches the
 * route set to the static export.
 */
export function checkLinks({ root = ROOT_DEFAULT, outDir = null } = {}) {
  const pages = discoverPages(root);
  const outRoutes = outDir && existsSync(outDir) ? routesFromOut(outDir) : null;
  const routeSet = new Set(outRoutes ? outRoutes.keys() : [...pages.byRoute.keys(), ...navRoutes(root)]);
  const redirects = redirectSources(root);
  const publicDir = join(root, 'apps/docs/public');
  const findings = [];
  const fail = (file, line, href, message) => findings.push({ file, line, href, message });

  const fileTarget = (sourceAbs, file, line, href, path, frag) => {
    const target = path ? resolve(path) : sourceAbs;
    if (!existsSync(target)) return fail(file, line, href, `target does not exist: ${toPosix(relative(root, target))}`), null;
    if (!existsExactCase(target)) {
      let real = target; try { real = realpathSync.native(target); } catch { /* reported below */ }
      return fail(file, line, href, `case mismatch: written ${toPosix(relative(root, target))}, on disk ${toPosix(relative(root, real))}`), null;
    }
    if (frag && statSync(target).isFile()) {
      if (MD.test(target)) {
        if (!anchorsOf(readFileSync(target, 'utf8')).has(frag.replace(/^user-content-/, ''))) fail(file, line, href, `anchor #${frag} not found in ${toPosix(relative(root, target))}`);
      } else if (!lineAnchorOk(target, frag)) fail(file, line, href, `#${frag} is not a valid #L<n> anchor of ${toPosix(relative(root, target))}`);
    }
    return target;
  };

  const routeTarget = (file, line, href, path, frag) => {
    const route = (path.replace(MD, '').replace(/\/$/, '') || '/');
    if (routeSet.has(route)) {
      if (frag) {
        const html = outRoutes?.get(route);
        const src = !outRoutes && pages.byRoute.get(route);
        const ids = html ? new Set([...readFileSync(html, 'utf8').matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])) : src ? anchorsOf(readFileSync(join(root, src), 'utf8')) : null;
        if (ids && !ids.has(frag)) fail(file, line, href, `anchor #${frag} not found on route ${route}`);
      }
      return;
    }
    if (redirectMatch(route, redirects)) return;
    if (existsSync(join(publicDir, path)) && existsExactCase(join(publicDir, path))) return;
    if (outDir && existsSync(join(outDir, path)) && statSync(join(outDir, path)).isFile() && existsExactCase(join(outDir, path))) return;
    const near = [...routeSet].find((r) => r.toLowerCase() === route.toLowerCase());
    fail(file, line, href, near ? `route case mismatch: ${route} (route is ${near})` : `no docs route ${route}${outRoutes ? ' in the static export' : ''}`);
  };

  // Docs-app pages.
  for (const [route, repoPath] of pages.byRoute) {
    void route;
    const abs = join(root, repoPath);
    const src = readFileSync(abs, 'utf8');
    for (const { href, line } of extractLinks(src)) {
      if (EXTERNAL.test(href)) continue;
      const [rawPath, frag = ''] = href.split('#');
      const path = decode(rawPath.split('?')[0]);
      if (!path) { if (frag && !anchorsOf(src).has(frag)) fail(repoPath, line, href, `anchor #${frag} not found in this page`); continue; }
      if (path.startsWith('/')) { routeTarget(repoPath, line, href, path, frag); continue; }
      const target = fileTarget(abs, repoPath, line, href, join(dirname(abs), path), frag);
      if (!target || !statSync(target).isFile()) continue;
      const rel = toPosix(relative(root, target));
      if (!pages.byFile.has(rel)) fail(repoPath, line, href, `relative link to ${rel}, which is not a docs page (dead href on the site)`);
    }
  }

  // Plain repo Markdown.
  const plain = PLAIN_ROOTS.flatMap((r) => {
    const abs = join(root, r);
    if (!existsSync(abs)) return [];
    return statSync(abs).isDirectory() ? walk(abs, (n) => MD.test(n)) : [abs];
  }).filter((f) => {
    const rel = toPosix(relative(root, f));
    return !PLAIN_EXCLUDE.some((x) => rel === x || rel.startsWith(`${x}/`)) && !pages.byFile.has(rel);
  });
  for (const abs of plain) {
    const repoPath = toPosix(relative(root, abs));
    const src = readFileSync(abs, 'utf8');
    for (const { href, line } of extractLinks(src)) {
      if (EXTERNAL.test(href)) continue;
      const [rawPath, frag = ''] = href.split('#');
      const path = decode(rawPath.split('?')[0]);
      if (!path) { if (frag && !anchorsOf(src).has(frag)) fail(repoPath, line, href, `anchor #${frag} not found in this file`); continue; }
      fileTarget(abs, repoPath, line, href, path.startsWith('/') ? join(root, path) : join(dirname(abs), path), frag);
    }
  }
  return { findings, mode: outRoutes ? 'out' : 'source', routes: routeSet.size, pages: pages.byRoute.size, plain: plain.length };
}

export function main(argv = process.argv.slice(2), root = ROOT_DEFAULT) {
  const oi = argv.indexOf('--out');
  const outDir = oi >= 0 ? resolve(argv[oi + 1]) : null;
  if (outDir && !existsSync(outDir)) { console.error(`links: --out ${argv[oi + 1]} does not exist (run plat:build:docs first)`); return 1; }
  const res = checkLinks({ root, outDir });
  const baseline = loadBaseline(root, 'docs-links');
  const { excused, blocking, errors } = applyBaseline(res.findings, baseline.rows, packageVersion(root));
  const ji = argv.indexOf('--json');
  if (ji >= 0) {
    const dest = resolve(argv[ji + 1]);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, JSON.stringify({ ...res, blocking, excused: excused.length, baselineErrors: errors }, null, 2) + '\n');
  }
  for (const f of blocking) console.error(`  FAIL ${f.file}:${f.line} (${f.href}) ${f.message}`);
  for (const e of errors) console.error(`  FAIL (baseline) ${e}`);
  console.log(`links: ${res.pages} docs pages + ${res.plain} repo files, ${res.routes} routes (${res.mode}), ${blocking.length} broken` + (excused.length ? ` (+${excused.length} in ${baseline.path})` : ''));
  return blocking.length || errors.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(main());
