/* CMP-305/423: Link — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Link } from './index';

describe('Link', () => {
  it('renders <a> root', () => {
    const { container } = render(<Link href="/x">x</Link>);
    expect(container.querySelector('[data-ag-part="root"]')!.tagName).toBe('A');
  });
  it('target=_blank merges rel and adds new-tab text', () => {
    render(<Link href="https://e.com" target="_blank" rel="nofollow">e</Link>);
    const a = screen.getByText('e').closest('a')!;
    expect(a.getAttribute('rel')).toContain('noopener');
    expect(a.getAttribute('rel')).toContain('noreferrer');
    expect(a.getAttribute('rel')).toContain('nofollow');
    expect(screen.getByText('(opens in new tab)')).toBeTruthy();
  });
  it('danger intent → data-ag-intent', () => {
    const { container } = render(<Link intent="danger" href="#">d</Link>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-intent')).toBe('danger');
  });
  it('render prop swaps the element (router link)', () => {
    const { container } = render(<Link render={<span data-router="t" />}>r</Link>);
    expect(container.querySelector('[data-ag-part="root"]')!.tagName).toBe('SPAN');
  });
});
