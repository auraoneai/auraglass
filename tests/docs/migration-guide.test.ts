/**
 * @jest-environment node
 */
/* tests/docs/migration-guide.test.ts — REQ-PLAT-105 (REQ-FIN-43, FIN-C.3-11).
   The 4.x → 5.0 guide is generated, never hand-written: gen-deprecations
   --docs assembles apps/docs/templates/plat/migrate/5.mdx with the catalogue
   transforms and their basic fixtures, the breaking register, every
   deprecation entry (anchor = its `doc` fragment), ComponentMeta migration
   rows and the removed rows. The page is rendered to HTML with the docs app's
   own renderer (apps/docs/lib/markdown.tsx, the code path of
   app/[...slug]/page.tsx for Markdown routes) and every anchor is resolved on
   that HTML. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadEntries, loadBreakingRegister, docsMd, main as genMain } from '../../scripts/release/gen-deprecations.mjs';
import {
  GUIDE_OUT, GUIDE_ROUTE, SECTIONS, TEMPLATE_PATH, assembleGuide, buildGuide, guideInputs, handWritten,
  entryAnchor, bAnchor, codemodAnchor, basicFixture,
} from '../../scripts/docs/lib/migration-guide.mjs';
import { main as storiesMain, pages as storyPages, STORIES_DIR } from '../../scripts/docs/gen-migration-stories.mjs';
import { renderMarkdown, type LinkLike } from '../../apps/docs/lib/markdown';
import { buildSite, discoverSources } from '../../apps/docs/lib/routes';
import { collectNavData } from '../../scripts/docs/prepare-docs-app.mjs';
import type { NavData } from '../../apps/docs/nav.config';

import type { GuideInputs, RegisterItem } from '../../scripts/docs/lib/migration-guide.mjs';
import type { LoadedEntry } from '../../scripts/release/gen-deprecations.mjs';

const root = join(__dirname, '..', '..');
const Link = ({ href, children }: LinkLike) => React.createElement('a', { href }, children);
const toHtml = (md: string, file: string) => renderToStaticMarkup(renderMarkdown(md, { Link, file }).body);
const ids = (html: string) => [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]!);
const hrefs = (html: string) => [...html.matchAll(/\bhref="#([^"]+)"/g)].map((m) => m[1]!);

let cache: { entries: LoadedEntry[]; register: RegisterItem[]; inputs: GuideInputs; guide: string; html: string } | null = null;
async function built() {
  if (cache) return cache;
  const entries = await loadEntries(root);
  const register = loadBreakingRegister(join(root, 'docs/release/breaking-changes.json'));
  const inputs = await guideInputs(root, { entries, register });
  const guide = buildGuide(root, inputs);
  cache = { entries, register, inputs, guide, html: toHtml(guide, GUIDE_OUT) };
  return cache;
}

describe('generated v5 migration guide (built HTML)', () => {
  it('iterates the real deprecation entries (> 0)', async () => {
    const { entries } = await built();
    expect(entries.length).toBeGreaterThan(0);
  }, 60000);

  it('every entry doc fragment resolves to exactly one element id on the built page', async () => {
    const { entries, html } = await built();
    const all = ids(html);
    for (const e of entries) {
      const frag = e.doc.replace(/^#/, '');
      expect(entryAnchor(e)).toBe(frag);
      expect(all.filter((x) => x === frag)).toHaveLength(1);
    }
  });

  it('anchors every register B-id as #b-<n> and every catalogue transform by id', async () => {
    const { register, inputs, html } = await built();
    const all = new Set(ids(html));
    expect(register.length).toBeGreaterThanOrEqual(21);
    for (const r of register) expect(all.has(bAnchor(r.id))).toBe(true);
    for (const t of inputs.catalogue.transforms) expect(all.has(codemodAnchor(t.id))).toBe(true);
  });

  it('has the required sections in order', async () => {
    const { html } = await built();
    const order = ['before-you-start', 'run-the-codemods', 'breaking-changes', 'by-component', 'removed-with-no-successor', 'rollback']
      .map((id) => html.indexOf(`<h2 id="${id}">`));
    for (const i of order) expect(i).toBeGreaterThan(-1);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('every in-page link resolves to an id on the page', async () => {
    const { html } = await built();
    const all = new Set(ids(html));
    const links = hrefs(html);
    expect(links.length).toBeGreaterThan(0);
    expect(links.filter((h) => !all.has(h))).toEqual([]);
  });

  it('shows the basic fixture of every transform that has one, verbatim', async () => {
    const { inputs, guide } = await built();
    let shown = 0;
    for (const t of inputs.catalogue.transforms) {
      const f = basicFixture(root, t.id);
      if (!f) continue;
      shown++;
      expect(guide).toContain(f.input.text.replace(/\n$/, ''));
      expect(guide).toContain(f.output.text.replace(/\n$/, ''));
    }
    expect(shown).toBeGreaterThan(0);
  });

  it('lists every ComponentMeta migration row under By component', async () => {
    const { inputs, html } = await built();
    const withRows = inputs.metas.filter((m) => m.migration.length);
    expect(withRows.length).toBeGreaterThan(0);
    const section = html.slice(html.indexOf('<h2 id="by-component">'), html.indexOf('<h2 id="removed-with-no-successor">'));
    for (const m of withRows) for (const r of m.migration) expect(section).toContain(`<code>${r.from}</code>`);
  });

  it('contains no "Pending" text in the output', async () => {
    const { guide, html } = await built();
    expect(guide).not.toMatch(/pending/i);
    expect(html).not.toMatch(/pending/i);
  });
});

describe('thin template', () => {
  const template = readFileSync(join(root, TEMPLATE_PATH), 'utf8');

  it('hand-written part contains 0 Glass[A-Z] tokens', () => {
    expect(handWritten(template).match(/\bGlass[A-Z]\w+/g)).toBeNull();
  });

  it('carries each generated section directive exactly once', () => {
    for (const s of SECTIONS) expect(template.split(`{/* @generated ${s} */}`).length - 1).toBe(1);
  });

  it('is not itself a docs route (only the generated page is)', () => {
    const routes = [...discoverSources(join(root, 'apps/docs')).values()].map((s) => s.repoPath);
    expect(routes).not.toContain(TEMPLATE_PATH);
    expect(existsSync(join(root, 'apps/docs/content/plat/migrate/5.mdx'))).toBe(false);
  });

  it('assembleGuide rejects unknown, repeated and missing directives', () => {
    const parts = { a: 'A', b: 'B' };
    expect(() => assembleGuide('{/* @generated a */}\n{/* @generated c */}\n', parts)).toThrow(/unknown generated section 'c'/);
    expect(() => assembleGuide('{/* @generated a */}\n{/* @generated a */}\n{/* @generated b */}\n', parts)).toThrow(/used twice/);
    expect(() => assembleGuide('{/* @generated a */}\n', parts)).toThrow(/missing generated section\(s\) b/);
    expect(assembleGuide('{/* note\n   more */}\n# T\n\n{/* @generated a */}\n\n{/* @generated b */}\n', parts)).toBe('# T\n\nA\n\nB\n');
  });

  it('buildGuide refuses a template that names a 4.x export', async () => {
    const { inputs } = await built();
    expect(() => buildGuide(root, { ...inputs, template: `${inputs.template}\nUse GlassButton.\n` })).toThrow(/GlassButton/);
  });
});

describe('gen-deprecations --docs', () => {
  it('writes the guide and the deprecations page as routable docs sources', async () => {
    const { entries, register, guide } = await built();
    expect(await genMain(['--docs'])).toBe(0);
    expect(readFileSync(join(root, GUIDE_OUT), 'utf8')).toBe(guide);
    const deps = readFileSync(join(root, 'apps/docs/generated/migration/deprecations.md'), 'utf8');
    expect(deps).toBe(docsMd(entries, register));
    /* The standalone page renders and links codemods into the guide. */
    const html = toHtml(deps, 'apps/docs/generated/migration/deprecations.md');
    for (const e of entries) expect(ids(html)).toContain(e.doc.replace(/^#/, ''));
    expect(html).toContain(`href="${GUIDE_ROUTE}#canonical-names"`);
  });

  it('the docs app serves /plat/migrate/5 from the generated guide', async () => {
    const { guide } = await built();
    const dir = mkdtempSync(join(tmpdir(), 'migration-guide-'));
    const app = join(dir, 'apps/docs');
    mkdirSync(join(app, 'generated/plat/migrate'), { recursive: true });
    writeFileSync(join(app, 'generated/plat/migrate/5.md'), guide);
    const data = collectNavData(root) as NavData;
    expect(buildSite(app, data).pages.get(GUIDE_ROUTE)).toMatchObject({ kind: 'markdown', source: { repoPath: GUIDE_OUT } });
  }, 60000);

  it('rejects an entry whose doc is not a #dep- fragment', () => {
    expect(() => entryAnchor({ id: 'DEP-P0001', doc: 'docs/x.md' })).toThrow(/not a #dep-<id> fragment/);
  });
});

describe('other migration pages', () => {
  it('exist as docs content', () => {
    for (const slug of ['from-mui', 'from-radix', 'from-lucide']) {
      expect(existsSync(join(root, `apps/docs/content/plat/migrate/${slug}.mdx`))).toBe(true);
    }
  });
});

describe('generated Storybook migration pages', () => {
  it('are fresh (gen-migration-stories --check) and use only the S-51 blocks', async () => {
    expect(await storiesMain(['--check'])).toBe(0);
    const all = await storyPages(root);
    expect(Object.keys(all).length).toBeGreaterThan(0);
    for (const [file, src] of Object.entries(all)) {
      expect(file).toMatch(/^[A-Z][A-Za-z0-9]*\.generated\.mdx$/);
      const storybookImports = [...src.matchAll(/from '([^']*\.storybook[^']*)'/g)].map((m) => m[1]);
      expect(storybookImports).toEqual(['../../../.storybook/blocks/index']);
      expect(src).toMatch(/import \{ MigrationTable, SelectorTable \} from/);
      expect(src).toContain('<MigrationTable of={meta} />');
      expect(src).toContain('<SelectorTable of={meta} />');
      const metaImport = src.match(/import meta from '([^']+)'/)![1]!;
      expect(existsSync(join(root, STORIES_DIR, `${metaImport}.ts`))).toBe(true);
    }
  }, 60000);
});
