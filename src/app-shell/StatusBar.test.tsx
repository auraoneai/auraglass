/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { StatusBar } from './StatusBar';

describe('StatusBar (SURF-029)', () => {
  it('renders a sunken content bar in the status slot with no landmark role', () => {
    render(
      <StatusBar.Root>
        <StatusBar.Item>3 items</StatusBar.Item>
        <StatusBar.Item>UTC</StatusBar.Item>
      </StatusBar.Root>,
    );
    const el = document.querySelector('[data-ag-part="status-bar"]')!;
    expect(el).toHaveAttribute('data-ag-slot', 'status');
    expect(el).toHaveAttribute('data-ag-layer', 'content');
    expect(el).toHaveAttribute('data-ag-content', 'content-sunken');
    expect(el.getAttribute('role')).toBeNull();
    expect(screen.getAllByText(/items|UTC/)).toHaveLength(2);
  });
});
