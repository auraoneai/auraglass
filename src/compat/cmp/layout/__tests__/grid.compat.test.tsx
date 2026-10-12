/* REQ-CMP-112: Grid responsive columns (own container shell + private
   --_ag-grid-cols-* vars), masonry prop, Stack SpaceToken gap, and the
   GlassGrid / GlassMasonry / GlassMasonryGrid / GlassFlex / Box compat
   adapters on the release/4.x fragment ids (DEP-C0268..0272).
   Computed track counts at real container widths are asserted in
   tests/e2e/cmp/layout/grid-columns.spec.ts (GitLab CI only). */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Grid } from '../../../../components/grid/Grid';
import { Stack } from '../../../../components/stack/Stack';
import { GlassGrid } from '../GlassGrid';
import { GlassMasonry } from '../GlassMasonry';
import { GlassMasonryGrid } from '../GlassMasonryGrid';
import { GlassFlex } from '../GlassFlex';
import { Box } from '../Box';
import * as compat from '../../index';

let warn: jest.SpiedFunction<typeof console.warn>;
beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
});
const warnedIds = () => warn.mock.calls.map((c) => String(c[0]));
const root = (c: HTMLElement) => c.querySelector('[data-ag-part="root"]') as HTMLElement;

describe('Grid (REQ-CMP-112)', () => {
  it('responsive columns render a container shell around the grid and set the col vars', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Grid ref={ref} id="g" columns={{ base: 1, md: 3 }}>
        <i />
      </Grid>,
    );
    const shell = container.firstElementChild as HTMLElement;
    expect(shell).toHaveClass('ag-grid-shell');
    expect(shell).toHaveAttribute('data-ag-part', 'shell');
    const grid = root(container);
    expect(grid.parentElement).toBe(shell);
    expect(ref.current).toBe(grid);
    expect(grid).toHaveAttribute('id', 'g');
    expect(grid.style.getPropertyValue('--_ag-grid-cols-base')).toBe('1');
    expect(grid.style.getPropertyValue('--_ag-grid-cols-md')).toBe('3');
    expect(grid.style.getPropertyValue('--_ag-grid-cols-sm')).toBe('');
    expect(grid.style.getPropertyValue('--_ag-grid-cols-lg')).toBe('');
  });

  it('numeric columns render one element with --_ag-grid-cols', () => {
    const { container } = render(<Grid columns={2} />);
    expect(container.querySelector('.ag-grid-shell')).toBeNull();
    const grid = root(container);
    expect(container.firstElementChild).toBe(grid);
    expect(grid.style.getPropertyValue('--_ag-grid-cols')).toBe('2');
    expect(grid).toHaveAttribute('data-cols', '2');
  });

  it('minItemWidth sets the auto-fill floor for number and string widths', () => {
    const a = render(<Grid minItemWidth={200} />);
    expect(root(a.container).style.getPropertyValue('--_ag-grid-min-item')).toBe('200px');
    expect(root(a.container)).toHaveAttribute('data-min-item', '');
    const b = render(<Grid minItemWidth="12rem" columns={{ base: 2 }} />);
    expect(root(b.container).style.getPropertyValue('--_ag-grid-min-item')).toBe('12rem');
  });

  it('masonry prop equals variant="masonry"', () => {
    const a = render(<Grid masonry columns={3} />);
    const b = render(<Grid variant="masonry" columns={3} />);
    for (const c of [a.container, b.container]) {
      const g = root(c);
      expect(g).toHaveAttribute('data-ag-appearance', 'masonry');
      expect(g).toHaveClass('ag-grid-masonry');
      expect(g.style.getPropertyValue('--_ag-grid-cols')).toBe('3');
    }
  });

  it('masonry with minItemWidth uses the width floor, not a fixed count', () => {
    const { container } = render(<Grid masonry minItemWidth={180} />);
    const g = root(container);
    expect(g.style.getPropertyValue('--_ag-grid-cols')).toBe('');
    expect(g.style.getPropertyValue('--_ag-grid-min-item')).toBe('180px');
  });

  it('masonry keeps children in source order', () => {
    const { container } = render(
      <Grid masonry columns={2}>
        <button>a</button>
        <button>b</button>
        <button>c</button>
      </Grid>,
    );
    expect([...root(container).querySelectorAll('button')].map((b) => b.textContent)).toEqual(['a', 'b', 'c']);
  });

  it('gap takes a SpaceToken string or number, or a raw length', () => {
    expect(root(render(<Grid gap="4" />).container).style.gap).toBe('var(--ag-space-4)');
    expect(root(render(<Grid gap={6} />).container).style.gap).toBe('var(--ag-space-6)');
    expect(root(render(<Grid gap="1.5rem" />).container).style.gap).toBe('1.5rem');
  });
});

describe('Stack gap (REQ-CMP-112)', () => {
  it('maps SpaceToken strings and numbers to --ag-space-N and passes raw lengths', () => {
    expect(root(render(<Stack gap="12" />).container).style.gap).toBe('var(--ag-space-12)');
    expect(root(render(<Stack gap={2} />).container).style.gap).toBe('var(--ag-space-2)');
    expect(root(render(<Stack gap="3px" />).container).style.gap).toBe('3px');
  });
});

describe('layout compat adapters (REQ-CMP-112)', () => {
  it('exports every adapter from src/compat/cmp', () => {
    for (const name of ['GlassGrid', 'GlassMasonry', 'GlassMasonryGrid', 'GlassFlex', 'Box']) {
      expect(typeof (compat as Record<string, unknown>)[name]).toBe('function');
    }
  });

  it('GlassGrid warns DEP-C0270 and maps cols/responsive/gap/autoFit', () => {
    const { container } = render(<GlassGrid cols={2} responsive={{ md: 4 }} gap="lg" gapY="xs" />);
    expect(warnedIds().filter((m) => m.includes('DEP-C0270'))).toHaveLength(1);
    const g = root(container);
    expect(g.style.getPropertyValue('--_ag-grid-cols-base')).toBe('2');
    expect(g.style.getPropertyValue('--_ag-grid-cols-md')).toBe('4');
    expect(g.style.gap).toBe('var(--ag-space-6)');
    expect(g.style.rowGap).toBe('var(--ag-space-1)');
    const auto = render(<GlassGrid autoFit minColWidth="10rem" />);
    expect(root(auto.container).style.getPropertyValue('--_ag-grid-min-item')).toBe('10rem');
  });

  it('GlassGrid drops responsive.xl with one prop warning', () => {
    render(<GlassGrid cols={1} responsive={{ xl: 6 }} />);
    expect(warnedIds().filter((m) => m.includes('DEP-C0270.prop.responsive.xl'))).toHaveLength(1);
  });

  it('GlassMasonry warns DEP-C0271, renders Grid masonry with a px gap and no invalid role', () => {
    const { container } = render(
      <GlassMasonry columns={4} gap={8}>
        <div />
      </GlassMasonry>,
    );
    expect(warnedIds().filter((m) => m.includes('DEP-C0271'))).toHaveLength(1);
    const g = root(container);
    expect(g).toHaveAttribute('data-ag-appearance', 'masonry');
    expect(g.style.getPropertyValue('--_ag-grid-cols')).toBe('4');
    expect(g.style.gap).toBe('8px');
    expect(g).not.toHaveAttribute('role');
  });

  it('GlassMasonryGrid warns DEP-C0272 and renders items in source order', () => {
    const items = ['a', 'b', 'c'].map((id) => ({ id, content: <button>{id}</button> }));
    const { container } = render(<GlassMasonryGrid items={items} config={{ columns: 3, gap: 10 }} showStats />);
    expect(warnedIds().filter((m) => m.includes('DEP-C0272'))).toHaveLength(2);
    expect(warnedIds().some((m) => m.includes('DEP-C0272.prop.showStats'))).toBe(true);
    const g = root(container);
    expect(g).toHaveAttribute('data-ag-appearance', 'masonry');
    expect(g.style.getPropertyValue('--_ag-grid-cols')).toBe('3');
    expect(g.style.gap).toBe('10px');
    expect([...g.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['a', 'b', 'c']);
  });

  it('GlassMasonryGrid columns "auto" uses the 4.x 200px min item width', () => {
    const { container } = render(<GlassMasonryGrid items={[]} />);
    expect(root(container).style.getPropertyValue('--_ag-grid-min-item')).toBe('200px');
  });

  it('GlassFlex warns DEP-C0268 and keeps the 4.x row default', () => {
    const { container } = render(<GlassFlex gap="md" justify="between" align="center" />);
    expect(warnedIds().filter((m) => m.includes('DEP-C0268'))).toHaveLength(1);
    const s = root(container);
    expect(s).toHaveClass('ag-stack');
    expect(s).toHaveAttribute('data-direction', 'row');
    expect(s.style.gap).toBe('var(--ag-space-4)');
    expect(s.style.justifyContent).toBe('space-between');
    expect(s.style.alignItems).toBe('center');
  });

  it('GlassFlex maps reverse directions, wrap-reverse and full sizing', () => {
    const { container } = render(<GlassFlex direction="col-reverse" wrap="wrap-reverse" fullWidth />);
    const s = root(container);
    expect(s).toHaveAttribute('data-direction', 'column');
    expect(s.style.flexDirection).toBe('column-reverse');
    expect(s.style.flexWrap).toBe('wrap-reverse');
    expect(s.style.inlineSize).toBe('100%');
  });

  it('GlassFlex drops responsive with one prop warning', () => {
    render(<GlassFlex responsive={{ md: 'col' }} />);
    expect(warnedIds().filter((m) => m.includes('DEP-C0268.prop.responsive'))).toHaveLength(1);
  });

  it('Box warns DEP-C0269, renders Stack and passes HTML attributes', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Box id="b" aria-label="box" onClick={onClick} as="section">
        x
      </Box>,
    );
    expect(warnedIds().filter((m) => m.includes('DEP-C0269'))).toHaveLength(2);
    expect(warnedIds().some((m) => m.includes('DEP-C0269.prop.as'))).toBe(true);
    const s = root(container);
    expect(s).toHaveClass('ag-stack');
    expect(s).toHaveAttribute('id', 'b');
    expect(s).toHaveAttribute('aria-label', 'box');
    s.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
