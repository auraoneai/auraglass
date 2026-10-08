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
