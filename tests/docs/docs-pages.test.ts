/**
 * @jest-environment node
 */
/* tests/docs/docs-pages.test.ts — PLAT-379 (REQ-PLAT-100, REQ-FIN-43, AC-FIN-43).
   The generated reference: one page per *.meta.ts whose name is a value export
   of its entry (never a page for a non-exported symbol); the committed
   apps/docs/public/components/<slug>.md carries the same props and parts sets
   as the full page plus one example; props.json rows keep name and type;
   gen-component-docs --check exits 1 after a meta edit; the packed d.ts and the
   source produce the same reference. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildReference, PUBLIC_DIR, renderPage, renderPublic, run, sectionNames,
} from '../../scripts/docs/gen-component-docs.mjs';
import { resolveTypesSource, serializeProps, unwrapParens } from '../../scripts/docs/gen-props.mjs';
import { loadMetas } from '../../scripts/docs/load-metas.mjs';
import { makeFixture, packFixture, type Fixture, type FixtureComponent } from './helpers/reference-fixture';

const root = join(__dirname, '..', '..');
const quiet = { log: () => {}, error: () => {} };
const fixtures: Fixture[] = [];
const fixture = (components: FixtureComponent[], opts?: Parameters<typeof makeFixture>[1]) => {
  const f = makeFixture(components, opts); fixtures.push(f); return f;
};
afterAll(() => fixtures.forEach((f) => f.cleanup()));

const widget: FixtureComponent = {
  name: 'Widget', dir: 'widget', parts: ['root', 'label'], states: ['open', 'closed'],
  props: [
    { name: 'label', type: 'string', doc: 'Visible label.' },
    { name: 'size', type: "'sm' | 'md'", optional: true, doc: 'Control size.', default: "'md'" },
    { name: 'onOpenChange', type: '(open: boolean) => void', optional: true, doc: 'Open state callback.' },
  ],
  selectors: { '.glass-widget': '[data-ag-part="root"]' },
};
const hidden: FixtureComponent = { name: 'Hidden', dir: 'hidden', exported: false, props: [{ name: 'x', type: 'string', doc: 'X.' }] };

describe('generated reference (repository)', () => {
  const ref = buildReference({ root });
  const { metas } = loadMetas(root);

  it('documents only metas whose name is an export of their entry, and says why the rest have no page', () => {
    expect(ref.components.length).toBeGreaterThan(0);
    const paged = new Set(ref.components.map((c) => c.name));
    for (const { meta, file } of metas) {
      if (paged.has(meta.name)) continue;
      expect(ref.skipped).toContainEqual(expect.objectContaining({ name: meta.name, file }));
    }
    expect(ref.components.length + ref.skipped.length).toBe(metas.length);
  });

  it('committed public pages are exactly the generated set (no page for a non-exported symbol)', () => {
    const dir = join(root, PUBLIC_DIR);
    const onDisk = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
    expect(onDisk).toEqual(ref.components.map((c) => `${c.slug}.md`).sort());
    for (const c of ref.components) expect(readFileSync(join(dir, `${c.slug}.md`), 'utf8')).toBe(renderPublic(c));
    expect(run({ root, check: true, ...quiet })).toBe(0);
  });

  it('public markdown and page share the props and parts sets, equal to the extracted props and meta parts', () => {
    for (const c of ref.components) {
      const pub = renderPublic(c); const page = renderPage(c);
      const propNames = c.props.map((p) => p.name);
      expect({ c: c.name, props: sectionNames(pub, 'Props') }).toEqual({ c: c.name, props: propNames });
      expect({ c: c.name, props: sectionNames(page, 'Props') }).toEqual({ c: c.name, props: propNames });
      expect({ c: c.name, parts: sectionNames(pub, 'Parts') }).toEqual({ c: c.name, parts: [...c.meta.parts] });
      expect({ c: c.name, parts: sectionNames(page, 'Parts') }).toEqual({ c: c.name, parts: [...c.meta.parts] });
      expect(pub).toContain(`import { ${c.name} } from '${c.meta.entry === '.' ? 'aura-glass' : `aura-glass/${c.meta.entry.slice(2)}`}';`);
    }
  });

  it('every props.json row carries name and type (the JSON.stringify replacer bug is gone)', () => {
    const json = JSON.parse(serializeProps(ref.props)) as Record<string, Array<Record<string, unknown>>>;
    const rows = Object.values(json).flat();
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(typeof r.name).toBe('string');
      expect(typeof r.type).toBe('string');
      expect((r.type as string).length).toBeGreaterThan(0);
    }
    const button = json.Button!.find((r) => r.name === 'size');
    expect(button).toMatchObject({ name: 'size', type: "'sm' | 'md' | 'lg'", required: false });
  });
});

describe('generated reference (fixture repo)', () => {
  it('renders import, props (name/type/default/TSDoc), parts, states, keyboard, Replaces and selectors', () => {
    const f = fixture([widget], { examples: { widget: { basic: "import { Widget } from 'aura-glass';\n\nexport default () => <Widget label=\"Hi\" />;\n" } } });
    const ref = buildReference({ root: f.root });
    const [c] = ref.components;
    expect(c!.props.map((p) => [p.name, p.type, p.required, p.default, p.description])).toEqual([
      ['label', 'string', true, null, 'Visible label.'],
      ['onOpenChange', '(open: boolean) => void', false, null, 'Open state callback.'],
      ['size', "'sm' | 'md'", false, "'md'", 'Control size.'],
    ]);
    const page = renderPage(c!);
    expect(page).toContain("import { Widget } from 'aura-glass';");
    expect(page).toContain("| `size?` | `'sm' \\| 'md'` | `'md'` | Control size. |");
    expect(page).toContain('| `label` | `[data-ag-part="label"]` |');
    expect(sectionNames(page, 'States')).toEqual(['open', 'closed']);
    expect(page).toContain('| `Enter` | Activates the button |');
    expect(page).toContain('| `GlassWidget` | full | no |');
    expect(page).toContain('| `GlassWidget` | `.glass-widget` | `[data-ag-part="root"]` |');
    expect(page).toContain('pending (claim `component-size-gzip-kb:widget`)');
    const pub = renderPublic(c!);
    expect(pub).toContain('```tsx\nimport { Widget } from \'aura-glass\';');
  });

  it('a meta whose component is not exported gets no page and no public markdown', () => {
    const f = fixture([widget, hidden]);
    const ref = buildReference({ root: f.root });
    expect(ref.components.map((c) => c.name)).toEqual(['Widget']);
    expect(ref.skipped).toEqual([expect.objectContaining({ name: 'Hidden', reason: 'not a value export of aura-glass' })]);
    expect(run({ root: f.root, ...quiet })).toBe(0);
    expect(readdirSync(join(f.root, PUBLIC_DIR)).sort()).toEqual(['widget.md']);
  });

  it('a meta absent from the runtime export snapshot gets no page', () => {
    const f = fixture([widget]);
    f.write('.artifacts/snapshot.json', JSON.stringify({ version: 1, entries: { '.': { runtime: [], types: ['Widget'] } } }));
    const ref = buildReference({ root: f.root, snapshotPath: join(f.root, '.artifacts/snapshot.json') });
    expect(ref.components).toEqual([]);
    expect(ref.skipped[0]!.reason).toBe('not in the runtime export snapshot of .');
  });

  it('--check exits 0 when current and 1 after a meta edit, a missing page or a stale page', () => {
    const f = fixture([widget]);
    expect(run({ root: f.root, ...quiet })).toBe(0);
    expect(run({ root: f.root, check: true, ...quiet })).toBe(0);

    const metaPath = join(f.root, 'src/widget/Widget.meta.ts');
    f.write('src/widget/Widget.meta.ts', readFileSync(metaPath, 'utf8').replace('["root","label"]', '["root","label","icon"]'));
    const errors: string[] = [];
    expect(run({ root: f.root, check: true, log: () => {}, error: (m) => errors.push(m) })).toBe(1);
    expect(errors.join('\n')).toContain('changed: widget.md');

    expect(run({ root: f.root, ...quiet })).toBe(0);
    f.write(`${PUBLIC_DIR}/gone.md`, '# Gone\n');
    expect(run({ root: f.root, check: true, ...quiet })).toBe(1);
  });

  it('exits 1 without build/exports.manifest.json instead of skipping', () => {
    const f = fixture([widget]);
    rmSync(join(f.root, 'build/exports.manifest.json'));
    const errors: string[] = [];
    expect(run({ root: f.root, check: true, log: () => {}, error: (m) => errors.push(m) })).toBe(1);
    expect(errors.join('\n')).toContain('exports.manifest.json missing');
  });

  it('reads props from the packed d.ts when a tarball is present, with the same result as the source', () => {
    const f = fixture([widget, hidden]);
    const fromSource = buildReference({ root: f.root });
    expect(fromSource.typesSource).toMatch(/^source entries/);
    const tgz = packFixture(f, [widget, hidden]);
    const source = resolveTypesSource({ root: f.root });
    expect(source.kind).toBe('packed');
    source.cleanup();
    const fromPack = buildReference({ root: f.root });
    expect(fromPack.typesSource).toBe('packed d.ts of .artifacts/pack/aura-glass-5.0.0-alpha.0.tgz');
    expect(fromPack.components.map(renderPublic)).toEqual(fromSource.components.map(renderPublic));
    expect(fromPack.skipped.map((s) => s.name)).toEqual(['Hidden']);
    expect(existsSync(tgz)).toBe(true);
  });

  it('--require-packed fails when no tarball exists', () => {
    const f = fixture([widget]);
    expect(() => buildReference({ root: f.root, requirePacked: true })).toThrow(/--require-packed/);
  });

  it('unwraps only one balanced pair of parentheses', () => {
    expect(unwrapParens('((a: string) => void)')).toBe('(a: string) => void');
    expect(unwrapParens('(a: string) => (b: number)')).toBe('(a: string) => (b: number)');
    expect(unwrapParens('string')).toBe('string');
  });
});
