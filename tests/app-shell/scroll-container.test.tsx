/** @jest-environment jsdom */
// REQ-SURF-193 (REQ-FIN-90): AppShell.Main is the shell's scroll region and a
// [data-ag-scroll-container], so MAT's scroll-padding rung pads both block
// edges from --ag-scroll-padding-top/bottom and useStickyScrollPadding writes
// sticky chrome heights onto it (focused content is never obscured).
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from '../../src/app-shell/AppShell';

describe('AppShell.Main scroll container (REQ-SURF-193)', () => {
  it('marks Main as the scroll container', () => {
    const { container } = render(
      <AppShell.Root>
        <AppShell.Main>content</AppShell.Main>
      </AppShell.Root>,
    );
    const main = container.querySelector('main[data-ag-slot="main"]');
    expect(main).not.toBeNull();
    expect(main!.getAttribute('data-ag-scroll-container')).toBe('');
  });
});
