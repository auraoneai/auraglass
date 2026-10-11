// lib/routes.ts — REQ-PLAT-99. Route table for the static export: every page
// under content/**, docs/quickstart, docs/guides and generated/**, plus one
// page per component meta, certified surface, API subpath and nav href.
// A nav target whose owner has not landed its page renders an explicit
// "pending" page (PLAT-377: "other streams' pages pending when absent").
// Server/build-time only (node:fs).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';
import {
  apiHref, buildNav, componentHref, navHrefs, surfaceHref,
  type ApiRow, type ComponentRow, type NavData, type NavSection, type SurfaceRow,
} from '../nav.config';

export interface SourceFile { route: string; file: string; repoPath: string }
export type PageSpec =
  | { kind: 'markdown'; route: string; source: SourceFile }
  | { kind: 'component'; route: string; component: ComponentRow; source: SourceFile | null }
  | { kind: 'surface'; route: string; surface: SurfaceRow }
  | { kind: 'api'; route: string; api: ApiRow; report: string | null }
  | { kind: 'pending'; route: string; title: string; owner: string; expected: string[] };

/** apps/docs directory for both `next build` (cwd apps/docs) and Jest (cwd repo root). */
export function docsAppDir(cwd = process.cwd()): string {
  return existsSync(join(cwd, 'nav.config.ts')) ? cwd : join(cwd, 'apps', 'docs');
}
export const repoRoot = (appDir: string) => join(appDir, '..', '..');

const MD = /\.(md|mdx)$/;
function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else if (MD.test(name)) out.push(p);
  }
  return out;
}
const toPosix = (p: string) => p.split(sep).join('/');

/** Source roots in precedence order: stream prose beats generated pages beats repo docs. */
export function sourceRoots(appDir: string): Array<{ dir: string; prefix: string }> {
  const root = repoRoot(appDir);
  return [
    { dir: join(appDir, 'content'), prefix: '' },
    { dir: join(appDir, 'generated'), prefix: '' },
    { dir: join(root, 'docs', 'quickstart'), prefix: 'quickstart' },
    { dir: join(root, 'docs', 'guides'), prefix: 'guides' },
  ];
}

export function discoverSources(appDir: string): Map<string, SourceFile> {
  const root = repoRoot(appDir);
  const map = new Map<string, SourceFile>();
  for (const { dir, prefix } of sourceRoots(appDir)) {
    for (const file of walk(dir)) {
      const rel = toPosix(relative(dir, file)).replace(MD, '').replace(/\/index$/, '');
      const route = '/' + posix.join(prefix, rel);
      if (!map.has(route)) map.set(route, { route, file, repoPath: toPosix(relative(root, file)) });
    }
  }
  return map;
}

/** Repo paths a pending route's owner is expected to add (first is canonical). */
export function expectedSources(route: string): string[] {
  const rel = route.replace(/^\//, '');
  const [head, ...rest] = rel.split('/');
  const out = [`apps/docs/content/${rel}.mdx`, `apps/docs/content/${rel}.md`];
  if (head === 'quickstart' || head === 'guides') out.push(`docs/${head}/${rest.join('/')}.md`);
  return out;
}
const OWNERS: Record<string, string> = { mat: 'MAT', cmp: 'CMP', surf: 'SURF', qual: 'QUAL', plat: 'PLAT', guides: 'PLAT', quickstart: 'PLAT' };
export const ownerOf = (route: string) => OWNERS[route.split('/')[1] ?? ''] ?? 'PLAT';

export function loadNavData(appDir: string): NavData {
  const p = join(appDir, 'generated', 'nav-data.json');
  if (!existsSync(p)) throw new Error(`${p} missing — run node scripts/docs/prepare-docs-app.mjs (npm run docs:build does)`);
  return JSON.parse(readFileSync(p, 'utf8')) as NavData;
}

export interface SiteModel { data: NavData; nav: NavSection[]; pages: Map<string, PageSpec> }

export function buildSite(appDir: string, data: NavData = loadNavData(appDir)): SiteModel {
  const root = repoRoot(appDir);
  const nav = buildNav(data);
  const sources = discoverSources(appDir);
  const pages = new Map<string, PageSpec>();
  for (const c of data.components) {
    const route = componentHref(c.slug);
    pages.set(route, { kind: 'component', route, component: c, source: sources.get(route) ?? null });
  }
  for (const s of data.surfaces) pages.set(surfaceHref(s.name), { kind: 'surface', route: surfaceHref(s.name), surface: s });
  for (const a of data.api) {
    const route = apiHref(a.slug);
    pages.set(route, { kind: 'api', route, api: a, report: existsSync(join(root, a.report)) ? join(root, a.report) : null });
  }
  for (const [route, source] of sources) if (!pages.has(route)) pages.set(route, { kind: 'markdown', route, source });
  const titles = new Map(nav.flatMap((s) => s.groups.flatMap((g) => g.entries.map((e) => [e.href, e.title] as const))));
  for (const href of navHrefs(nav)) {
    if (!pages.has(href)) pages.set(href, { kind: 'pending', route: href, title: titles.get(href) ?? href, owner: ownerOf(href), expected: expectedSources(href) });
  }
  return { data, nav, pages };
}

/** Next.js generateStaticParams shape for app/[...slug]. */
export const staticParams = (site: SiteModel) => [...site.pages.keys()].sort().map((route) => ({ slug: route.slice(1).split('/') }));
