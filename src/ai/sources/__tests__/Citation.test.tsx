import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Citation } from '../Citation';

const source = { type: 'source-url' as const, sourceId: 's-1', url: 'https://docs.x/keys', title: 'Key policy' };

describe('Citation', () => {
  it('accessible name "Source {index}: {title}", href to the source item', () => {
    render(<Citation messageId="m1" source={source} index={2} />);
    const a = screen.getByRole('link', { name: 'Source 2: Key policy' });
    expect(a.getAttribute('href')).toBe('#ag-src-m1-s-1');
    expect(a.textContent).toContain('[2]');
  });
  it('preview opens on focus', () => {
    render(<Citation messageId="m1" source={source} index={1} />);
    const a = screen.getByRole('link', { name: 'Source 1: Key policy' });
    fireEvent.focus(a);
    expect(document.querySelector('[data-ag-part="citation-preview"]')).not.toBeNull();
    fireEvent.blur(a);
    expect(document.querySelector('[data-ag-part="citation-preview"]')).toBeNull();
  });
});
