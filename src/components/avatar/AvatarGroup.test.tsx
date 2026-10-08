import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { AvatarGroup } from './index';

const faces = ['A', 'B', 'C', 'D', 'E'];

describe('AvatarGroup', () => {
  it('clamps children at max and renders an overflow item labelled "N more"', () => {
    const { container } = render(
      <AvatarGroup max={3}>
        {faces.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </AvatarGroup>,
    );
    expect(container.querySelectorAll('[data-ag-part="item"]')).toHaveLength(3);
    const overflow = screen.getByLabelText('2 more');
    expect(overflow).toHaveTextContent('+2');
    expect(overflow.getAttribute('data-ag-part')).toBe('value');
  });
  it('renders all items without overflow below max', () => {
    const { container } = render(
      <AvatarGroup max={10}>
        <span>A</span>
        <span>B</span>
      </AvatarGroup>,
    );
    expect(container.querySelectorAll('[data-ag-part="item"]')).toHaveLength(2);
    expect(container.querySelector('[data-ag-part="value"]')).toBeNull();
  });
  it('forwards ref to the root and carries size', () => {
    const seen: Element[] = [];
    const { container } = render(
      <AvatarGroup size="lg" ref={(n) => { seen.push(n!); }}>
        <span>A</span>
      </AvatarGroup>,
    );
    expect(seen[seen.length - 1]).toBe(container.querySelector('[data-ag-part="root"]'));
    expect(container.querySelector('[data-ag-part="root"]')).toHaveAttribute('data-ag-size', 'lg');
  });
});
