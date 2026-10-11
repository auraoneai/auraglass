/* CMP-300 + REQ-CMP-113: Card — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Card } from './index';

describe('Card', () => {
  it('renders the compound parts root/header/title/description/body/footer', () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Name</Card.Title>
          <Card.Description>Sub</Card.Description>
        </Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    );
    for (const p of ['root', 'header', 'title', 'description', 'body', 'footer']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).not.toBeNull();
    }
  });

  it('interactive emits data-ag-interactive without forcing tabIndex', () => {
    const { container } = render(<Card interactive>x</Card>);
    const el = container.querySelector('[data-ag-part="root"]')! as HTMLElement;
    expect(el.hasAttribute('data-ag-interactive')).toBe(true);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('interactive + render={<a/>} renders a real link', () => {
    const { container } = render(<Card interactive render={<a href="/x" />}>x</Card>);
    const el = container.querySelector('[data-ag-part="root"]')! as HTMLElement;
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/x');
    expect(el.hasAttribute('data-ag-interactive')).toBe(true);
  });

  it('is material-bearing: default content layer, variant → data-ag-variant', () => {
    const { container, unmount } = render(<Card>x</Card>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-ag-layer')).toBe('content');
    unmount();
    const { container: c2 } = render(<Card variant="clear" thickness="thin" prominent>x</Card>);
    const el2 = c2.querySelector('[data-ag-part="root"]')!;
    expect(el2.getAttribute('data-ag-variant')).toBe('clear');
    expect(el2.getAttribute('data-ag-thickness')).toBe('thin');
    expect(el2.hasAttribute('data-ag-prominent')).toBe(true);
  });
});
