/* CMP-300: Card — generated for lane 3g (T0/T2 components). */
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
  it('interactive adds data-ag-interactive and tabIndex 0', () => {
    const { container } = render(<Card interactive>x</Card>);
    const el = container.querySelector('[data-ag-part="root"]')! as HTMLElement;
    expect(el.hasAttribute('data-ag-interactive')).toBe(true);
    expect(el.tabIndex).toBe(0);
  });
  it('is material-bearing via materialProps (layer attr)', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-layer')).toBe('content');
  });
});
