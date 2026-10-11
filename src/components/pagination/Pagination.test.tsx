/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Pagination } from './Pagination';

describe('Pagination (SURF-082)', () => {
  it('stable item count across pages (range never widens)', () => {
    const counts = [1, 2, 5, 9, 10].map((page) => {
      const { unmount } = render(
        <Pagination.Root
          page={page}
          pageCount={10}
          getHref={(p) => `?p=${p}`}
          aria-label="P"
        />,
      );
      const n = document.querySelectorAll('[data-ag-part="item"]').length;
      unmount();
      return n;
    });
    expect(new Set(counts).size).toBe(1);
  });

  it('aria-disabled bounds stay focusable', () => {
    render(
      <Pagination.Root page={1} pageCount={3} getHref={(p) => `?p=${p}`} aria-label="P" />,
    );
    const prev = screen.getByRole('link', { name: 'Previous page' });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev).toHaveAttribute('tabindex', '0');
    expect(prev).not.toHaveAttribute('disabled');
  });

  it('link mode uses getHref for page links', () => {
    render(
      <Pagination.Root page={4} pageCount={9} getHref={(p) => `/items?p=${p}`} aria-label="P" />,
    );
    expect(screen.getByRole('link', { name: 'Page 4' })).toHaveAttribute('href', '/items?p=4');
    expect(screen.getByRole('link', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('button mode fires onPageChange', () => {
    const seen: number[] = [];
    render(
      <Pagination.Root
        pageCount={5}
        onPageChange={(p) => seen.push(p)}
        aria-label="P"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(seen).toEqual([2]);
  });

  it('labels override names', () => {
    render(
      <Pagination.Root
        page={1}
        pageCount={2}
        getHref={(p) => `?p=${p}`}
        labels={{ previous: 'Zurück', next: 'Weiter', page: (n) => `Seite ${n}` }}
        aria-label="P"
      />,
    );
    expect(screen.getByRole('link', { name: 'Zurück' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Seite 2' })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #358 (SURF-58/59).
// ---------------------------------------------------------------------------
import { getPaginationRange } from './getRange';

describe('Pagination SURF-58: button mode', () => {
  it('uncontrolled button mode advances (2 Next clicks -> Page 3 current)', () => {
    render(<Pagination.Root pageCount={9} aria-label="P" />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('defaultPage seeds the uncontrolled page', () => {
    render(<Pagination.Root defaultPage={4} pageCount={9} aria-label="P" />);
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('controlled button mode does not advance without the parent', () => {
    const seen: number[] = [];
    render(<Pagination.Root page={2} pageCount={9} onPageChange={(p) => seen.push(p)} aria-label="P" />);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(seen).toEqual([3]);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('labels.page applies in button mode (template and non-echoing function)', () => {
    const { unmount } = render(
      <Pagination.Root pageCount={3} labels={{ page: (n) => `Seite ${n}` }} aria-label="P" />,
    );
    expect(screen.getByRole('button', { name: 'Seite 2' })).toBeTruthy();
    unmount();
    const words = ['zero', 'one', 'two', 'three'];
    render(<Pagination.Root pageCount={3} labels={{ page: (n) => `Page ${words[n] ?? 'many'}` }} aria-label="P" />);
    expect(screen.getByRole('button', { name: 'Page two' })).toBeTruthy();
  });

  it('Pagination.getRange is the range helper', () => {
    expect(typeof Pagination.getRange).toBe('function');
    expect(Pagination.getRange).toBe(getPaginationRange);
  });
});

describe('Pagination SURF-59: compact status + range cap', () => {
  it("renders the 'Page N of M' status in link and button mode", () => {
    const { unmount } = render(<Pagination.Root page={3} pageCount={12} getHref={(p) => `?p=${p}`} aria-label="P" />);
    expect(document.querySelector('[data-ag-part="status"]')!.textContent).toBe('Page 3 of 12');
    unmount();
    render(<Pagination.Root defaultPage={5} pageCount={12} aria-label="P" />);
    expect(document.querySelector('[data-ag-part="status"]')!.textContent).toBe('Page 5 of 12');
  });

  it('range length <= 2b + 2s + 3 for pageCount 1..50 x sibling 0..2 x boundary 0..2 (every page)', () => {
    const over: string[] = [];
    let checked = 0;
    for (let pageCount = 1; pageCount <= 50; pageCount++) {
      for (let s = 0; s <= 2; s++) {
        for (let b = 0; b <= 2; b++) {
          for (let page = 1; page <= pageCount; page++) {
            const r = getPaginationRange({ page, pageCount, siblingCount: s, boundaryCount: b });
            checked++;
            if (r.length > 2 * b + 2 * s + 3) over.push(`n=${pageCount} s=${s} b=${b} p=${page} len=${r.length}`);
            if (!r.includes(page)) over.push(`n=${pageCount} s=${s} b=${b} p=${page} missing current`);
          }
        }
      }
    }
    expect(checked).toBe(9 * (50 * 51) / 2);
    expect(over).toEqual([]);
  });
});

describe('Pagination SURF-59: content material', () => {
  it('both modes render content-layer material (no blur layer)', () => {
    const { unmount } = render(<Pagination.Root page={1} pageCount={3} getHref={(p) => `?p=${p}`} aria-label="L" />);
    expect(screen.getByRole('navigation', { name: 'L' })).toHaveAttribute('data-ag-layer', 'content');
    unmount();
    render(<Pagination.Root pageCount={3} aria-label="B" />);
    expect(screen.getByRole('navigation', { name: 'B' })).toHaveAttribute('data-ag-layer', 'content');
  });
});
