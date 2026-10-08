/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { CommandPalette } from './CommandPalette';
import { Command } from './Command';

describe('CommandPalette (SURF-087)', () => {
  it('mod+k toggles the palette open', async () => {
    render(<CommandPalette />);
    expect(document.querySelector('[data-ag-part="command-palette"]')).toBeNull();
    await act(async () => { fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true }); });
    // The real CMP Dialog portals its popup in after the portal-layer settle
    // microtask, so the query waits for the mount.
    await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).not.toBeNull());
    await act(async () => { fireEvent.keyDown(document.body, { key: 'k', metaKey: true }); });
    await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).toBeNull());
  });

  it('hotkey=false registers no listener', () => {
    const spy = jest.spyOn(document, 'addEventListener');
    render(<CommandPalette hotkey={false} />);
    const keys = spy.mock.calls.filter(([type]) => type === 'keydown');
    expect(keys).toHaveLength(0);
    spy.mockRestore();
  });

  it('one keydown listener per mounted palette', () => {
    const spy = jest.spyOn(document, 'addEventListener');
    const { unmount } = render(<CommandPalette />);
    const keys = spy.mock.calls.filter(([type]) => type === 'keydown');
    expect(keys).toHaveLength(1);
    unmount();
    spy.mockRestore();
  });

  it('renders no scrim or blur element of its own', async () => {
    render(<CommandPalette open />);
    await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).not.toBeNull());
    const el = document.querySelector('[data-ag-part="command-palette"]')!;
    expect(el.querySelector('[data-ag-backdrop], [data-ag-scrim], .ag-scrim')).toBeNull();
    expect((el as HTMLElement).style.backdropFilter ?? '').toBe('');
  });
});
