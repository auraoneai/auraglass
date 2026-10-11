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

  it('open renders a clear scrim, overlay/thick material, and focuses the combobox', async () => {
    render(<CommandPalette open />);
    await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).not.toBeNull());
    const el = document.querySelector<HTMLElement>('[data-ag-part="command-palette"]')!;
    expect(document.querySelector('[data-ag-scrim]')).not.toBeNull();
    expect(el.contains(document.querySelector('[data-ag-scrim]'))).toBe(false);
    expect(el).toHaveAttribute('data-ag-layer', 'overlay');
    expect(el).toHaveAttribute('data-ag-thickness', 'thick');
    expect(el).toHaveAttribute('role', 'dialog');
    expect(el).toHaveAccessibleName('Command palette');
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('combobox')));
  });
});

// REQ-SURF-62: hotkey opens and restores focus.
it('hotkey opens, focuses the input, and restores focus on close', async () => {
  render(
    <>
      <button data-testid="trigger">Trigger</button>
      <CommandPalette />
    </>,
  );
  const btn = screen.getByTestId('trigger');
  btn.focus();
  await act(async () => { fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true }); });
  await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).not.toBeNull());
  const input = document.querySelector('[data-ag-part="input"]') as HTMLElement;
  expect(input).not.toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(input));
  // Escape 1: clears query (empty -> propagates). Escape 2: Dialog dismisses.
  await act(async () => { fireEvent.keyDown(input, { key: 'Escape' }); });
  await act(async () => { fireEvent.keyDown(input, { key: 'Escape' }); });
  await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).toBeNull());
  expect(document.activeElement).toBe(btn);
});

// ---------------------------------------------------------------------------
// REQ-FIN-07 transfer (REQ-FIN-82): LayerStack + portal-root registration.
// ---------------------------------------------------------------------------
import { AuraGlassProvider } from '../../theme';
import { Popover } from '../popover';
import { layerStackFor } from '../../theme/layers/LayerStack';

describe('CommandPalette layer registration (REQ-FIN-07 transfer)', () => {
  it("registers one open 'command-palette' modal entry while open and pops it on close", async () => {
    const stack = layerStackFor(document);
    const { rerender } = render(<CommandPalette open />);
    await waitFor(() => expect(stack.top()?.kind).toBe('command-palette'));
    expect(stack.top()).toMatchObject({ kind: 'command-palette', modal: true, open: true });
    expect(stack.top()!.element).toBe(document.querySelector('[data-ag-part="command-palette"]'));
    expect(document.documentElement).toHaveAttribute('data-ag-scroll-locked');
    rerender(<CommandPalette open={false} />);
    await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).toBeNull());
    expect(stack.top()?.open ?? false).toBe(false);
  });

  it("portals into the provider's overlay layer root (usePortalContainer('overlay'))", async () => {
    render(
      <AuraGlassProvider>
        <CommandPalette open />
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(document.querySelector('[data-ag-part="command-palette"]')).not.toBeNull());
    const overlayRoot = document.querySelector('[data-ag-portal-root] [data-ag-layer-root="overlay"]');
    expect(overlayRoot).not.toBeNull();
    expect(overlayRoot!.contains(document.querySelector('[data-ag-part="command-palette"]'))).toBe(true);
  });

  it('stacked Escape: a popover opened above the palette takes the key; the palette stays open', async () => {
    const onOpenChange = jest.fn();
    const popoverChange = jest.fn();
    render(
      <CommandPalette open onOpenChange={onOpenChange}>
        <Command.Root>
          <Command.Input />
          <Command.List><Command.Item value="a">A</Command.Item></Command.List>
        </Command.Root>
        <Popover.Root defaultOpen onOpenChange={popoverChange}>
          <Popover.Trigger>more</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup aria-label="nested">
                <button type="button">inside</button>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </CommandPalette>,
    );
    const inside = await screen.findByRole('button', { name: 'inside' });
    await waitFor(() => expect(layerStackFor(document).top()?.kind).toBe('popover'));
    act(() => inside.focus());
    await act(async () => {
      fireEvent.keyDown(inside, { key: 'Escape' });
    });
    await waitFor(() => expect(screen.queryByRole('button', { name: 'inside' })).toBeNull());
    expect(popoverChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
    expect(document.querySelector('[data-ag-part="command-palette"]')).not.toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
    // the palette is the top layer again: Escape (empty query) closes it
    await waitFor(() => expect(layerStackFor(document).top()?.kind).toBe('command-palette'));
    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
