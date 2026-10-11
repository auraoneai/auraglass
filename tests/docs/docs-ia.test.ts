/**
 * @jest-environment node
 */
/* tests/docs/docs-ia.test.ts — REQ-PLAT-99 / PLAT-377 (REQ-FIN-43, AC-FIN-43).
   nav.config.ts order and labels are exact; Components come from every
   *.meta.ts (flagships by §11.2 group, then Core); Surfaces are exactly the
   certified registry blocks; API is one entry per JS subpath; every nav
   target is a statically generated route (other streams' pages render as
   pending while absent); the example scenes are the S-42 SCENES. */
import { describe, expect, it } from '@jest/globals';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectNavData, collectSurfaces } from '../../scripts/docs/prepare-docs-app.mjs';
import { buildNav, navHrefs, type NavData, type NavSection } from '../../apps/docs/nav.config';
import { buildSite, staticParams } from '../../apps/docs/lib/routes';
import { SCENES, SCENE_BACKDROP } from '../../src/contracts/testing';

/* scripts/registry/build.mjs ships no declaration file; type the one call used here. */
type RegistryBuild = (o: { root: string; write: boolean }) => { report: { items: Array<{ name: string; kind: string; status: string }> } };
const buildRegistry: RegistryBuild = require('../../scripts/registry/build.mjs').build;

const root = join(__dirname, '..', '..');
const appDir = join(root, 'apps', 'docs');
const data = collectNavData(root) as NavData;
const nav = buildNav(data);
const section = (n: NavSection[], title: string) => n.find((s) => s.title === title)!;
const labels = (n: NavSection[], title: string) => section(n, title).groups.flatMap((g) => g.entries.map((e) => e.title));
const onlyGroup = (n: NavSection[], title: string) => section(n, title).groups[0]!.entries;

function metaNames(dir: string, out = new Set<string>()): Set<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) metaNames(p, out);
    else if (name.endsWith('.meta.ts')) {
      /* Every meta object literal (default or named export) opens with name + owner. */
      for (const m of readFileSync(p, 'utf8').matchAll(/\bname:\s*'([^']+)',\s*owner:\s*'(?:CMP|SURF|MAT)'/g)) out.add(m[1]!);
    }
  }
  return out;
}

describe('docs IA (nav.config.ts)', () => {
  it('has exactly the seven sections in contractual order', () => {
    expect(nav.map((s) => s.title)).toEqual(['Get started', 'Foundations', 'Components', 'Surfaces', 'Guides', 'Migrate', 'API']);
  });

  it('lists the fixed sections verbatim', () => {
    expect(labels(nav, 'Get started')).toEqual(['Introduction', 'Next quickstart', 'Vite quickstart', 'CLI']);
    expect(labels(nav, 'Foundations')).toEqual(['Choosing a material', 'Theming', 'Accessibility', 'Motion', 'Layers & CSS']);
    expect(labels(nav, 'Guides')).toEqual(['Next.js', 'Vite', 'React Router', 'RSC', 'Tailwind', 'Plain CSS', 'shadcn', 'Testing', 'AI agents']);
    expect(labels(nav, 'Migrate')).toEqual(['4→5', 'From MUI', 'From Radix', 'From Lucide']);
  });

  it('derives Components from every *.meta.ts: flagships by group, then Core', () => {
    const comps = section(nav, 'Components');
    expect(comps.groups.map((g) => g.title)).toEqual(['Controls', 'Overlays', 'Navigation', 'Data', 'AI', 'Media', 'Core']);
    /* Independent source scan: every meta name is documented exactly once. */
    expect(data.components.map((c) => c.name).sort()).toEqual([...metaNames(join(root, 'src'))].sort());
    const ranges: Record<string, [number, number]> = { Controls: [1, 14], Overlays: [15, 21], Navigation: [22, 31], Data: [32, 37], AI: [38, 42], Media: [43, 44] };
    for (const g of comps.groups) {
      const expected = g.title === 'Core'
        ? data.components.filter((c) => c.flagship === null && c.tier !== 'preview').sort((a, b) => a.name.localeCompare(b.name))
        : data.components.filter((c) => c.flagship !== null && c.flagship >= ranges[g.title]![0] && c.flagship <= ranges[g.title]![1])
          .sort((a, b) => a.flagship! - b.flagship! || a.name.localeCompare(b.name));
      expect(g.entries).toEqual(expected.map((c) => ({ title: c.name, href: `/components/${c.slug}` })));
    }
    expect(section(nav, 'Components').groups.find((g) => g.title === 'Controls')!.entries[0]).toEqual({ title: 'Button', href: '/components/button' });
    expect(comps.groups.flatMap((g) => g.entries).length).toBe(data.components.filter((c) => c.tier !== 'preview').length);
  });

  it('lists exactly the certified registry blocks under Surfaces', () => {
    const { report } = buildRegistry({ root, write: false });
    const certified = report.items.filter((r) => r.kind === 'blocks' && r.status === 'certified').map((r) => `/surfaces/${r.name}`).sort();
    expect(onlyGroup(nav, 'Surfaces').map((e) => e.href).sort()).toEqual(certified);
  });

  it('admits a block to Surfaces only when certified at the build sha (fixture registry)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'docs-ia-reg-'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '5.0.0-alpha.0' }));
    mkdirSync(join(dir, 'registry/schema'), { recursive: true });
    cpSync(join(root, 'registry/schema/registry-item.json'), join(dir, 'registry/schema/registry-item.json'));
    const add = (kind: string, name: string, certified: string | null) => {
      const d = join(dir, 'registry', kind, name);
      mkdirSync(d, { recursive: true });
      writeFileSync(join(d, 'index.tsx'), 'export default function X() { return null; }\n');
      writeFileSync(join(d, 'registry-item.json'), JSON.stringify({
        $schema: 'https://ui.shadcn.com/schema/registry-item.json', name, type: kind === 'blocks' ? 'registry:block' : 'registry:item',
        title: `Title ${name}`, description: `About ${name}`, files: [{ path: 'index.tsx', type: 'registry:block' }],
        meta: { auraglass: { owner: 'SURF', surface: kind === 'blocks' ? 'block' : 'item', client: true, components: [], certified } },
      }));
    };
    add('blocks', 'alpha', 'abc1234');
    add('blocks', 'beta', null);
    add('blocks', 'delta', 'def5678');
    add('items', 'gamma', 'abc1234');
    const surfaces = collectSurfaces(dir, { sha: 'abc1234' });
    expect(surfaces).toEqual([{ name: 'alpha', title: 'Title alpha', description: 'About alpha', owner: 'SURF', files: ['index.tsx'] }]);
    const fixtureNav = buildNav({ ...data, surfaces });
    expect(onlyGroup(fixtureNav, 'Surfaces')).toEqual([{ title: 'Title alpha', href: '/surfaces/alpha' }]);
  });

  it('has one API entry per JavaScript subpath of package.json exports', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    const subpaths = Object.keys(pkg.exports).filter((k) => k !== './package.json' && !k.endsWith('.css') && !k.endsWith('.json'));
    const api = onlyGroup(nav, 'API');
    expect(api.map((e) => e.title)).toEqual(subpaths.map((s) => (s === '.' ? 'aura-glass' : `aura-glass/${s.slice(2)}`)));
    expect(api[0]).toEqual({ title: 'aura-glass', href: '/api/root' });
  });

  it('generates a static route for every nav href', () => {
    const site = buildSite(appDir, data);
    const routes = new Set(staticParams(site).map((p) => '/' + p.slug.join('/')));
    const hrefs = navHrefs(nav);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const h of hrefs) {
      expect(h).toMatch(/^\/[a-z0-9][a-z0-9./-]*[a-z0-9]$/);
      expect(routes.has(h)).toBe(true);
    }
  });

  it('resolves every nav href to its source, or to a pending page whose expected file is absent', () => {
    const site = buildSite(appDir, data);
    for (const h of navHrefs(nav)) {
      const page = site.pages.get(h)!;
      switch (page.kind) {
        case 'markdown': expect(existsSync(page.source.file)).toBe(true); break;
        case 'pending': for (const e of page.expected) expect(existsSync(join(root, e))).toBe(false); break;
        case 'component': expect(data.components).toContain(page.component); break;
        case 'surface': expect(data.surfaces).toContain(page.surface); break;
        case 'api': expect(data.api).toContain(page.api); break;
      }
    }
    expect(site.pages.get('/plat/introduction')).toMatchObject({ kind: 'markdown', source: { repoPath: 'apps/docs/content/plat/introduction.mdx' } });
    expect(site.pages.get('/quickstart/next')).toMatchObject({ kind: 'markdown', source: { repoPath: 'docs/quickstart/next.md' } });
    expect(site.pages.get('/plat/migrate/from-mui')).toMatchObject({ kind: 'markdown', source: { repoPath: 'apps/docs/content/plat/migrate/from-mui.mdx' } });
    /* /plat/migrate/5 is generated (gen-deprecations --docs, REQ-PLAT-105); tests/docs/migration-guide.test.ts routes it. */
  });

  it('turns a pending nav page into a content page when its owner lands it; content beats docs/guides', () => {
    const dir = mkdtempSync(join(tmpdir(), 'docs-ia-app-'));
    const app = join(dir, 'apps/docs');
    mkdirSync(join(app, 'content/plat'), { recursive: true });
    mkdirSync(join(dir, 'docs/guides'), { recursive: true });
    writeFileSync(join(app, 'content/plat/introduction.mdx'), '# Introduction\n');
    writeFileSync(join(dir, 'docs/guides/vite.md'), '# Vite (repo docs)\n');
    const before = buildSite(app, data);
    expect(before.pages.get('/mat/theming')).toEqual({
      kind: 'pending', route: '/mat/theming', title: 'Theming', owner: 'MAT',
      expected: ['apps/docs/content/mat/theming.mdx', 'apps/docs/content/mat/theming.md'],
    });
    expect(before.pages.get('/guides/vite')).toMatchObject({ kind: 'markdown', source: { repoPath: 'docs/guides/vite.md' } });
    mkdirSync(join(app, 'content/mat'), { recursive: true });
    writeFileSync(join(app, 'content/mat/theming.mdx'), '# Theming\n');
    mkdirSync(join(app, 'content/guides'), { recursive: true });
    writeFileSync(join(app, 'content/guides/vite.mdx'), '# Vite\n');
    const after = buildSite(app, data);
    expect(after.pages.get('/mat/theming')).toMatchObject({ kind: 'markdown', source: { repoPath: 'apps/docs/content/mat/theming.mdx' } });
    expect(after.pages.get('/guides/vite')).toMatchObject({ kind: 'markdown', source: { repoPath: 'apps/docs/content/guides/vite.mdx' } });
  });

  it('feeds the example renderer the 8 S-42 SCENES with their declared backdrops', () => {
    expect(data.scenes.map((s) => s.id)).toEqual([...SCENES]);
    for (const s of data.scenes) expect(s.backdrop).toBe(SCENE_BACKDROP[s.id as keyof typeof SCENE_BACKDROP]);
    for (const s of data.scenes.filter((x) => x.file)) expect(existsSync(join(root, 'certification/scenes', s.file!))).toBe(true);
  });
});
