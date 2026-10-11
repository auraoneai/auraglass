/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MobileShell } from './MobileShell';

describe('MobileShell (SURF-030)', () => {
  it('forces compact layout with collapsed sidebar/inspector', () => {
    render(
      <MobileShell data-testid="m" topBar={<span>hdr</span>} tabBar={<nav aria-label="Tabs">tabs</nav>}>
        page
      </MobileShell>,
    );
    const root = screen.getByTestId('m');
    expect(root).toHaveAttribute('data-ag-layout', 'compact');
    expect(root).toHaveAttribute('data-ag-sidebar', 'collapsed');
    expect(root).toHaveAttribute('data-ag-inspector', 'closed');
  });

  it('renders overlay top bar and tab-bar slot', () => {
    render(
      <MobileShell topBar={<span>hdr</span>} tabBar={<nav aria-label="Tabs">tabs</nav>}>
        page
      </MobileShell>,
    );
    const top = document.querySelector('[data-ag-slot="top"]')!;
    expect(top).toHaveAttribute('data-ag-placement', 'overlay');
    expect(document.querySelector('[data-ag-slot="tabbar"]')).not.toBeNull();
  });

  it('works with no topBar/tabBar props', () => {
    render(<MobileShell>page</MobileShell>);
    expect(document.querySelector('[data-ag-slot="main"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-slot="top"]')).toBeNull();
    expect(document.querySelector('[data-ag-slot="tabbar"]')).toBeNull();
  });
});
