/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

const Path = ({ maxItems }: { maxItems?: number }) => (
  <Breadcrumbs.Root {...(maxItems !== undefined ? { maxItems } : {})}>
    <Breadcrumbs.Item>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>
      <Breadcrumbs.Link href="/lib">Library</Breadcrumbs.Link>
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>
      <Breadcrumbs.Link href="/lib/data">Data</Breadcrumbs.Link>
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>
      <Breadcrumbs.Current>Deep page</Breadcrumbs.Current>
    </Breadcrumbs.Item>
  </Breadcrumbs.Root>
);

describe('Breadcrumbs (SURF-078)', () => {
  it('nav > ol > li structure with labelled landmark', () => {
    render(<Path />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const ol = nav.querySelector('ol');
    expect(ol).not.toBeNull();
    expect(ol!.querySelectorAll(':scope > li').length).toBe(4);
  });

  it('separators are aria-hidden and the current item carries aria-current=page', () => {
    render(<Path />);
    const seps = document.querySelectorAll('[data-ag-part="separator"]');
    expect(seps.length).toBeGreaterThan(0);
    seps.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
    const current = screen.getByText('Deep page');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('collapses middle items into an overflow button', () => {
    render(<Path maxItems={3} />);
    const items = document.querySelectorAll('[data-ag-part="item"]');
    expect(items.length).toBe(4); // head + overflow + 2 tail
    expect(screen.getByRole('button', { name: /Show 1 more/i })).toBeTruthy();
  });
});
