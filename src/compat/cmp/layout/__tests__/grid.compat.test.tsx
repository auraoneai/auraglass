/* REQ-CMP-112: responsive Grid emits its own container shell + inline
   --ag-grid-cols-* vars (no Container ancestor needed); masonry prop +
   GlassGrid/GlassMasonry compat. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import { act } from 'react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Grid } from '../../../../components/grid/Grid';
import { GlassGrid } from '../GlassGrid';
import { GlassMasonry } from '../GlassMasonry';
import { GlassMasonryGrid } from '../GlassMasonryGrid';

const CSS = readFileSync(join(__dirname, '../../../..', 'components/grid/Grid.css'), 'utf8');

async function warnOnce(el: React.ReactElement, id: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await act(async () => { render(el); });
  const calls = warn.mock.calls.filter((c) => String(c[0]).includes(id));
  warn.mockRestore();
  return calls;
}

describe('Grid responsive columns (REQ-CMP-112)', () => {
  it('responsive columns render a container shell + inline col vars', () => {
    const { container } = render(<Grid columns={{ base: 1, md: 3 }}><i /></Grid>);
    const shell = container.querySelector('.ag-grid-shell')!;
    const grid = shell.querySelector('.ag-grid')! as HTMLElement;
    expect(shell).not.toBeNull();
    expect(grid.style.getPropertyValue('--ag-grid-cols-base')).toBe('1');
    expect(grid.style.getPropertyValue('--ag-grid-cols-md')).toBe('3');
    expect(grid.getAttribute('data-ag-cols-md')).toBe('3');
  });

  it('CSS declares the shell container + unnamed breakpoint queries + base rule', () => {
    expect(CSS).toContain('.ag-grid-shell { container-type: inline-size; }');
    expect(CSS).toContain('@container (min-width: 768px)');
    expect(CSS).toContain('@container (min-width: 1024px)');
    expect(CSS).toContain('var(--ag-grid-cols-base, 1)');
    expect(CSS).toContain('var(--ag-grid-cols-md, var(--ag-grid-cols-sm, var(--ag-grid-cols-base, 1)))');
  });

  it('numeric columns still render a single-element grid', () => {
    const { container } = render(<Grid columns={2} />);
    expect(container.querySelector('.ag-grid-shell')).toBeNull();
    const grid = container.querySelector('.ag-grid')! as HTMLElement;
    expect(grid.style.getPropertyValue('--ag-grid-cols')).toBe('2');
  });

  it('masonry prop renders the masonry variant; CSS has @supports + columns fallback', () => {
    const { container } = render(<Grid masonry columns={3} />);
    expect(container.querySelector('.ag-grid-masonry')).not.toBeNull();
    expect(CSS).toContain('@supports (grid-template-rows: masonry)');
    expect(CSS).toContain('grid-template-rows: masonry');
  });

  it('GlassGrid warns DEP-C0270 and renders Grid', async () => {
    const calls = await warnOnce(<GlassGrid columns={2} />, 'DEP-C0270');
    expect(calls.length).toBeGreaterThan(0);
    expect(document.querySelector('.ag-grid')).not.toBeNull();
  });

  it('GlassMasonry/GlassMasonryGrid warn and render masonry variant', async () => {
    expect((await warnOnce(<GlassMasonry />, 'DEP-C0271')).length).toBeGreaterThan(0);
    expect((await warnOnce(<GlassMasonryGrid />, 'DEP-C0272')).length).toBeGreaterThan(0);
    expect(document.querySelector('.ag-grid-masonry')).not.toBeNull();
  });
});
