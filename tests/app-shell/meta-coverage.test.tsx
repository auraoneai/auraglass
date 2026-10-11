/* REQ-SURF-09 / REQ-FIN-80 — SURF meta coverage.
   For every SURF ComponentMeta (one <Name>.meta.ts per exported component):
   - render each story fixture of that component (every export of every SURF
     story file whose `parameters.ag.subject` is the component) plus the
     state fixtures in ./meta-coverage.fixtures.tsx (open popovers, loading,
     optional slots — states the stories do not reach);
   - collect every rendered `data-ag-part` under document.body (portals too);
   - diff: meta.parts must equal the parts the component itself renders.
     `missing`   = declared in meta.parts but never rendered by any fixture;
     `undeclared` = rendered but declared neither by this meta nor by a
                    component the fixture composes (`composes`, resolved to
                    that component's meta parts plus, via COMPOSED_RENDERERS,
                    the parts it renders in isolation — meta-less MAT pieces
                    and foreign metas that lag their own DOM).
     Each `composes` entry must itself contribute at least one rendered part,
     so the composition list cannot go stale.
   Also: budgetKb equals the fragments/size-budgets/surf.ts row that imports
   the component; interactive (client/mixed) metas carry an APG pattern URL. */
import { afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PART_NAME_RE } from '../../src/contracts/components';
import type { ComponentMeta } from '../../src/contracts/components';
import { COMPOSED_RENDERERS, FIXTURES, type StateFixture } from './meta-coverage.fixtures';
import sizeBudgets from '../../fragments/size-budgets/surf';

const ROOT = join(__dirname, '..', '..');
/** PRD-F §6 FIN-F source roots that hold component metas. */
const SURF_ROOTS = [
  'src/app-shell', 'src/data', 'src/date', 'src/ai', 'src/media', 'src/backdrops', 'src/charts', 'src/three',
  'src/components/tabs', 'src/components/tab-bar', 'src/components/breadcrumbs', 'src/components/pagination',
  'src/components/command-palette', 'src/components/source-transition', 'src/components/timeline',
];

function walk(dir: string, re: RegExp, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, re, out);
    else if (re.test(name)) out.push(p);
  }
  return out;
}

interface MetaRecord { meta: ComponentMeta; file: string }
function metasIn(files: string[]): MetaRecord[] {
  const out: MetaRecord[] = [];
  for (const file of files) {
    const mod = require(file) as Record<string, unknown>;
    for (const v of Object.values(mod)) {
      const m = v as Partial<ComponentMeta> | null;
      if (m && typeof m === 'object' && typeof m.name === 'string' && Array.isArray(m.parts)) {
        out.push({ meta: m as ComponentMeta, file: relative(ROOT, file) });
      }
    }
  }
  return out;
}

const SURF_METAS = metasIn(SURF_ROOTS.flatMap((r) => walk(join(ROOT, r), /\.meta\.ts$/))).filter((r) => r.meta.owner === 'SURF');
/** Every meta in the repo (any owner) — the resolution set for `composes`. */
const ALL_METAS = new Map(metasIn(walk(join(ROOT, 'src'), /\.meta\.ts$/)).map((r) => [r.meta.name, r.meta]));

type StoryLike = { render?: (args: Record<string, unknown>, ctx: unknown) => React.ReactElement; args?: Record<string, unknown> };
type StoryModule = { default: { component?: React.ComponentType<Record<string, unknown>>; args?: Record<string, unknown>; render?: StoryLike['render']; parameters?: { ag?: { subject?: string } } } } & Record<string, unknown>;

/** Story modules are loaded at module scope: `storybook/test` registers jest hooks on import. */
const STORY_FILES = SURF_ROOTS.flatMap((r) => walk(join(ROOT, r), /\.stories\.tsx$/));
const STORIES_BY_SUBJECT = new Map<string, Array<{ file: string; mod: StoryModule }>>();
for (const file of STORY_FILES) {
  const mod = require(file) as StoryModule;
  const subject = mod.default?.parameters?.ag?.subject;
  if (!subject) continue;
  const list = STORIES_BY_SUBJECT.get(subject) ?? [];
  list.push({ file: relative(ROOT, file), mod });
  STORIES_BY_SUBJECT.set(subject, list);
}

function storyElements(subject: string, only?: readonly string[]): Array<[string, () => React.ReactElement]> {
  const out: Array<[string, () => React.ReactElement]> = [];
  for (const { file, mod } of STORIES_BY_SUBJECT.get(subject) ?? []) {
    const meta = mod.default;
    for (const [name, value] of Object.entries(mod)) {
      if (name === 'default' || !value || typeof value !== 'object') continue;
      if (only && !only.includes(name)) continue;
      const story = value as StoryLike;
      const args = { ...(meta.args ?? {}), ...(story.args ?? {}) };
      const renderFn = story.render ?? meta.render;
      const Component = meta.component;
      if (!renderFn && !Component) throw new Error(`${file}#${name}: story has neither render nor component`);
      const Story = () => (renderFn ? renderFn(args, { args, parameters: {}, globals: {} }) : React.createElement(Component!, args));
      out.push([`${file}#${name}`, () => <Story />]);
    }
  }
  return out;
}

const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
interface Rendered { parts: Set<string>; focusOwners: Set<string> }

async function renderFixture(fixture: StateFixture): Promise<Rendered> {
  const { render: make, interact } = typeof fixture === 'function' ? { render: fixture, interact: undefined } : fixture;
  render(make());
  await act(async () => {});
  if (interact) {
    await act(async () => {
      await interact();
    });
    await act(async () => {});
  }
  const parts = new Set<string>();
  for (const el of Array.from(document.body.querySelectorAll('[data-ag-part]'))) {
    const v = el.getAttribute('data-ag-part');
    if (v) parts.add(v);
  }
  // The part that owns each focusable element (nearest data-ag-part, self included).
  const focusOwners = new Set<string>();
  for (const el of Array.from(document.body.querySelectorAll(FOCUSABLE))) {
    const owner = el.closest('[data-ag-part]')?.getAttribute('data-ag-part');
    if (owner) focusOwners.add(owner);
  }
  cleanup();
  document.body.innerHTML = '';
  return { parts, focusOwners };
}

const APG_URL_RE = /^https:\/\/www\.w3\.org\/WAI\/ARIA\/apg\/(patterns|practices)\/[a-z-]+\/(examples\/[a-z-]+\/)?$/;

beforeAll(() => {
  // jsdom has no IntersectionObserver (Thread's load-earlier sentinel); an inert
  // observer is environment, not component behaviour.
  if (typeof (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver === 'undefined') {
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  }
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('SURF meta coverage (REQ-SURF-09)', () => {
  it('discovers every SURF meta, each with a fixture entry, one meta per name', () => {
    expect(SURF_METAS.length).toBeGreaterThanOrEqual(49);
    const names = SURF_METAS.map((r) => r.meta.name);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
    expect(names.filter((n) => !(n in FIXTURES)).sort()).toEqual([]);
    expect(Object.keys(FIXTURES).filter((n) => !names.includes(n)).sort()).toEqual([]);
  });

  it.each(SURF_METAS.map((r) => [r.meta.name, r] as const))('%s: rendered data-ag-part set equals meta.parts', async (name, { meta }) => {
    const fixture = FIXTURES[name]!;
    const elements: Array<[string, StateFixture]> = [
      ...storyElements(name, fixture.storyExports),
      ...Object.entries(fixture.states ?? {}),
    ];
    expect(elements.length).toBeGreaterThan(0);

    const rendered = new Set<string>();
    const focusOwners = new Set<string>();
    for (const [, make] of elements) {
      const r = await renderFixture(make);
      r.parts.forEach((p) => rendered.add(p));
      r.focusOwners.forEach((p) => focusOwners.add(p));
    }

    const own = new Set<string>(meta.parts as readonly string[]);
    const composedBy = new Map<string, Set<string>>();
    for (const c of fixture.composes ?? []) {
      const m = ALL_METAS.get(c);
      const renderer = COMPOSED_RENDERERS[c];
      if (!m && !renderer) throw new Error(`${name}: composes '${c}', which has neither a meta nor a COMPOSED_RENDERERS entry`);
      // A composed component contributes its declared parts plus what it renders in isolation.
      const parts = new Set<string>((m?.parts ?? []) as readonly string[]);
      if (renderer) (await renderFixture(renderer)).parts.forEach((p) => parts.add(p));
      composedBy.set(c, parts);
    }
    const allowed = new Set<string>([...own, ...[...composedBy.values()].flatMap((s) => [...s])]);

    const missing = [...own].filter((p) => !rendered.has(p)).sort();
    const undeclared = [...rendered].filter((p) => !allowed.has(p)).sort();
    const staleComposes = [...composedBy].filter(([, parts]) => ![...parts].some((p) => rendered.has(p) && !own.has(p))).map(([c]) => c);
    expect({ missing, undeclared, staleComposes }).toEqual({ missing: [], undeclared: [], staleComposes: [] });

    // Interactive = one of this component's own parts owns a focusable element
    // in a rendered fixture; such a meta must name its APG pattern.
    const ownFocus = [...focusOwners].filter((p) => own.has(p)).sort();
    expect({ ownFocus, interactiveWithoutApg: ownFocus.length > 0 && !APG_URL_RE.test(meta.apg ?? '') }).toEqual({ ownFocus, interactiveWithoutApg: false });
  });

  it.each(SURF_METAS.map((r) => [r.meta.name, r] as const))('%s: parts are kebab-case and unique', (_name, { meta }) => {
    const parts = [...meta.parts] as string[];
    expect(parts.filter((p) => !PART_NAME_RE.test(p))).toEqual([]);
    expect(parts.filter((p, i) => parts.indexOf(p) !== i)).toEqual([]);
  });

  const BUDGET_ROWS = (sizeBudgets as ReadonlyArray<{ id: string; import: string; limitBytes: number; kind: string }>)
    .filter((row) => row.kind === 'js')
    .map((row) => ({ ...row, names: (/^\{\s*([^}]+)\}/.exec(row.import)?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean) }));
  const rowsFor = (name: string) => BUDGET_ROWS.filter((row) => row.names.includes(name));
  const WITH_ROW = SURF_METAS.filter((r) => rowsFor(r.meta.name).length > 0);
  const WITHOUT_ROW = SURF_METAS.filter((r) => rowsFor(r.meta.name).length === 0);

  it.each(WITH_ROW.map((r) => [r.meta.name, r] as const))('%s: budgetKb equals its size-budget row', (name, { meta }) => {
    const rows = rowsFor(name);
    expect(rows).toHaveLength(1);
    expect({ budgetKb: meta.budgetKb }).toEqual({ budgetKb: rows[0]!.limitBytes / 1024 });
  });

  it('metas without a size-budget row declare no budgetKb (no unbacked numbers)', () => {
    expect(WITHOUT_ROW.filter((r) => r.meta.budgetKb !== undefined).map((r) => r.meta.name)).toEqual([]);
  });

  it('every apg value is an APG pattern URL', () => {
    expect(SURF_METAS.filter((r) => r.meta.apg !== undefined && !APG_URL_RE.test(r.meta.apg)).map((r) => `${r.meta.name}: ${r.meta.apg}`)).toEqual([]);
  });
});
