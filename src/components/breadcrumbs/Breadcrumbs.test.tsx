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

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #357/#358 (SURF-55..57).
// ---------------------------------------------------------------------------
import { act, fireEvent, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

const Six = () => (
  <Breadcrumbs.Root maxItems={3}>
    {['/', '/a', '/a/b', '/a/b/c', '/a/b/c/d'].map((href, i) => (
      <Breadcrumbs.Item key={href}>
        <Breadcrumbs.Link href={href}>{`L${i}`}</Breadcrumbs.Link>
      </Breadcrumbs.Item>
    ))}
    <Breadcrumbs.Item>
      <Breadcrumbs.Current>Here</Breadcrumbs.Current>
    </Breadcrumbs.Item>
  </Breadcrumbs.Root>
);

describe('Breadcrumbs SURF-55: separators between items only', () => {
  it('the last li contains 0 separators; every other li has exactly 1', () => {
    render(<Path />);
    const lis = [...document.querySelectorAll('ol > li')];
    expect(lis).toHaveLength(4);
    expect(lis.at(-1)!.querySelectorAll('[data-ag-part="separator"]')).toHaveLength(0);
    for (const li of lis.slice(0, -1)) {
      expect(li.querySelectorAll('[data-ag-part="separator"]')).toHaveLength(1);
    }
  });

  it('Breadcrumbs.List applies the same rule; an explicit separator prop wins', () => {
    render(
      <nav aria-label="x">
        <Breadcrumbs.List>
          <Breadcrumbs.Item><Breadcrumbs.Link href="/">a</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Item separator={false}><Breadcrumbs.Link href="/b">b</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Item><Breadcrumbs.Current>c</Breadcrumbs.Current></Breadcrumbs.Item>
        </Breadcrumbs.List>
      </nav>,
    );
    const counts = [...document.querySelectorAll('ol > li')].map(
      (li) => li.querySelectorAll('[data-ag-part="separator"]').length,
    );
    expect(counts).toEqual([1, 0, 0]);
  });

  it('separator glyph mirrors under dir=rtl', () => {
    render(
      <div dir="rtl">
        <Path />
      </div>,
    );
    const sep = document.querySelector('[data-ag-part="separator"]')!;
    expect(sep).toHaveClass('ag-breadcrumbs__separator');
    expect(sep.closest('[dir="rtl"]')).not.toBeNull();
    const css = readFileSync(join(__dirname, 'Breadcrumbs.css'), 'utf8');
    const flips: string[] = [];
    postcss.parse(css).walkRules('.ag-breadcrumbs__separator:dir(rtl)', (r) =>
      r.walkDecls('transform', (d) => {
        flips.push(d.value);
      }),
    );
    expect(flips).toEqual(['scaleX(-1)']);
  });

  it('Ellipsis is a static aria-hidden glyph; Overflow is the client island', () => {
    render(<Breadcrumbs.Ellipsis />);
    const el = document.querySelector('[data-ag-part="ellipsis"]')!;
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.textContent).toBe('…');
    expect(Breadcrumbs.Overflow).not.toBe(Breadcrumbs.Ellipsis);
  });
});

describe('Breadcrumbs SURF-56: collapses middle into a link menu', () => {
  it("maxItems=3 over 6 items -> 'Show 3 more' + 3 menuitems with href", async () => {
    render(<Six />);
    const trigger = screen.getByRole('button', { name: 'Show 3 more' });
    expect(document.querySelectorAll('ol > li')).toHaveLength(4); // head + overflow + 2 tail
    await act(async () => {
      fireEvent.click(trigger);
    });
    const items = await waitFor(() => {
      const found = screen.getAllByRole('menuitem');
      expect(found).toHaveLength(3);
      return found;
    });
    expect(items.map((i) => i.getAttribute('href'))).toEqual(['/a', '/a/b', '/a/b/c']);
    expect(items.map((i) => i.textContent)).toEqual(['L1', 'L2', 'L3']);
  });
});

describe('Breadcrumbs SURF-57: 16ch truncation keeps the full accessible name', () => {
  it('link carries the full text as name and title; Current is excluded', () => {
    const long = 'A forty character breadcrumb label here!';
    expect(long).toHaveLength(40);
    render(
      <Breadcrumbs.Root>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/x">{long}</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Item><Breadcrumbs.Current>{long}</Breadcrumbs.Current></Breadcrumbs.Item>
      </Breadcrumbs.Root>,
    );
    const link = screen.getByRole('link', { name: long });
    expect(link).toHaveAttribute('title', long);
    expect(screen.getByText(long, { selector: '[data-ag-part="current"]' })).not.toHaveAttribute('title');
    const css = readFileSync(join(__dirname, 'Breadcrumbs.css'), 'utf8');
    const decls: Record<string, string> = {};
    postcss.parse(css).walkRules('.ag-breadcrumbs__link', (r) =>
      r.walkDecls((d) => {
        decls[d.prop] = d.value;
      }),
    );
    expect(decls).toMatchObject({
      'max-inline-size': '16ch',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    });
  });
});
