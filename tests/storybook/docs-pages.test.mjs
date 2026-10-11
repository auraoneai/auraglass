/* REQ-QUAL-51 (S-51; REQ-FIN-106, FIN-450): generated docs pages. For every flagship number 1..44 each ComponentMeta
   renders the six sections (Usage, Anatomy, Material role, Keyboard, Migration, Selectors); a number without a meta
   yet is pending through the expiring baseline (owners' REQ-QUAL-71 renumbering), never silently skipped.
   The blocks are accessible tables with captions, the S-51 seed marker is gone, and no MDX imports an APG spec. */
import { afterEach, describe, expect, it } from '@jest/globals';
import { cleanup, render, within } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DocsSections, DOCS_SECTIONS } from '../../.storybook/docs/DocsSections';
import { Anatomy, KeyboardTable, MigrationTable, PropsTable, SelectorTable } from '../../.storybook/blocks/index';
import * as blocks from '../../.storybook/blocks/index';
import { ROOT, loadMetas, storyFiles, walk } from '../../scripts/storybook/lib/story-static.mjs';
import { docsPageViolations, FLAGSHIP_COUNT } from '../../scripts/storybook/lib/story-contract.mjs';
import { buildApgIndex } from '../../scripts/storybook/write-apg-index.mjs';
import { loadBaseline, compare, packageVersion } from '../../scripts/storybook/lib/baseline.mjs';

afterEach(cleanup);

const metas = loadMetas(ROOT);
const apg = buildApgIndex(ROOT);
const HEADINGS = ['Usage', 'Anatomy', 'Material role', 'Keyboard', 'Migration', 'Selectors'];

function renderPage(meta, opts = {}) {
  const keyboardStoryId = opts.keyboardStoryId ?? null;
  return render(React.createElement(DocsSections, {
    meta, usage: opts.usage ?? null, keyboardStoryId, apg: opts.apg === undefined ? apg : opts.apg,
  }));
}

describe('docs blocks (S-51)', () => {
  it('exports exactly the five blocks', () => {
    expect(Object.keys(blocks).sort()).toEqual(['Anatomy', 'KeyboardTable', 'MigrationTable', 'PropsTable', 'SelectorTable']);
  });

  it('render tables with a caption and scope="col" headers', () => {
    const meta = metas.find((m) => m.name === 'Button');
    const { container } = render(React.createElement(React.Fragment, null,
      React.createElement(Anatomy, { of: meta }), React.createElement(MigrationTable, { of: meta }),
      React.createElement(PropsTable, { of: meta }), React.createElement(SelectorTable, { of: meta }),
      React.createElement(KeyboardTable, { script: [{ press: 'Enter', expectState: { 'aria-pressed': 'true' } }] })));
    const tables = [...container.querySelectorAll('table')];
    expect(tables).toHaveLength(5);
    for (const t of tables) {
      expect(t.querySelector('caption')?.textContent).toBeTruthy();
      const ths = [...t.querySelectorAll('thead th')];
      expect(ths.length).toBeGreaterThan(0);
      for (const th of ths) expect(th.getAttribute('scope')).toBe('col');
    }
  });

  it('source has <caption>, no @ag-contract-seed under .storybook/blocks', () => {
    const src = readFileSync(join(ROOT, '.storybook/blocks/index.tsx'), 'utf8');
    expect((src.match(/<caption/g) ?? []).length).toBeGreaterThanOrEqual(1);
    const seeded = walk(ROOT, '.storybook/blocks').filter((f) => readFileSync(join(ROOT, f), 'utf8').includes('@ag-contract-seed'));
    expect(seeded).toEqual([]);
  });
});

describe('generated docs page per flagship (44 × 6)', () => {
  const baseline = loadBaseline(ROOT);
  const gaps = docsPageViolations(metas);
  const r = compare(gaps, baseline, { checks: ['docs-pages'], version: packageVersion(ROOT) });

  it('every flagship number 1..44 has a meta, or is pending in the expiring baseline', () => {
    expect(r.introduced.map((v) => `${v.owner}: ${v.message}`)).toEqual([]);
    const covered = new Set(metas.filter((m) => typeof m.flagship === 'number').map((m) => m.flagship));
    const pending = new Set(r.baselined.map((v) => Number(v.key.slice(1))));
    for (let n = 1; n <= FLAGSHIP_COUNT; n += 1) expect(covered.has(n) || pending.has(n)).toBe(true);
  });

  const flagshipMetas = metas.filter((m) => typeof m.flagship === 'number');
  it.each(flagshipMetas.map((m) => [m.flagship, m.name, m]))('#%i %s renders the six sections', (_n, _name, meta) => {
    const { container } = renderPage(meta, { usage: React.createElement('div', { 'data-testid': 'playground' }), keyboardStoryId: `x-${meta.name.toLowerCase()}--keyboard` });
    const sections = [...container.querySelectorAll('[data-ag-docs-section]')];
    expect(sections.map((s) => s.getAttribute('data-ag-docs-section'))).toEqual([...DOCS_SECTIONS]);
    expect(sections.map((s) => within(s).getByRole('heading', { level: 2 }).textContent)).toEqual(HEADINGS);
    for (const s of sections) expect(s.getAttribute('aria-labelledby')).toBe(s.querySelector('h2')?.id);
    expect(within(sections[0]).getByTestId('playground')).toBeTruthy();
    expect(sections[1].querySelector('caption')?.textContent).toContain(meta.name);
    expect(sections[2].querySelector('[data-ag-material-layer]')?.getAttribute('data-ag-material-layer')).toBe(meta.material?.layer ?? 'none');
  });

  it('Keyboard renders the owner APG script from apg-index.json', () => {
    const entry = apg.entries.find((e) => e.script);
    expect(entry).toBeDefined();
    const meta = metas.find((m) => m.name === 'Button');
    const { container } = renderPage(meta, { keyboardStoryId: entry.storyId });
    const kb = container.querySelector('[data-ag-docs-section="keyboard"]');
    expect(kb.querySelectorAll('tbody tr')).toHaveLength(entry.script.length);
  });

  it('Keyboard and Usage name the owner gap when the stories are missing', () => {
    const meta = metas.find((m) => m.name === 'Switch');
    const { container } = renderPage(meta);
    expect(container.querySelector('[data-ag-docs-section="usage"]').textContent).toContain('Playground');
    expect(container.querySelector('[data-ag-docs-section="keyboard"]').textContent).toContain(`${meta.owner} story contract`);
  });

  it('Keyboard says when the build has no apg-index.json', () => {
    const meta = metas.find((m) => m.name === 'Button');
    const { container } = renderPage(meta, { keyboardStoryId: 'flagships-controls-button--keyboard', apg: null });
    expect(container.querySelector('[data-ag-docs-section="keyboard"]').textContent).toContain('apg-index.json');
  });
});

describe('APG index and MDX', () => {
  it('write-apg-index binds literal ApgStep scripts to story ids', () => {
    expect(apg.version).toBe(1);
    expect(apg.entries.length).toBeGreaterThan(0);
    for (const e of apg.entries) {
      expect(e.storyId).toMatch(/^[a-z0-9-]+--[a-z0-9-]+$/);
      expect(e.spec).toMatch(/^tests\/a11y\/apg\/.+\.apg\.spec\.ts$/);
    }
  });

  it('no MDX file imports an *.apg.spec.ts', () => {
    const offenders = storyFiles(ROOT).map((f) => f.file).filter((f) => f.endsWith('.mdx'))
      .filter((f) => /from\s+['"][^'"]*\.apg\.spec(\.ts)?['"]/.test(readFileSync(join(ROOT, f), 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('no flagship MDX is written in QUAL paths', () => {
    const qualMdx = [...walk(ROOT, 'stories/qual'), ...walk(ROOT, '.storybook')].filter((f) => f.endsWith('.mdx'));
    const flagshipNames = new Set(metas.filter((m) => typeof m.flagship === 'number').map((m) => m.name));
    expect(qualMdx.filter((f) => flagshipNames.has(f.split('/').pop().replace(/\.mdx$/, '')))).toEqual([]);
  });
});
