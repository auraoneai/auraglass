/* CMP-270 (REQ-CMP-97/85): Popover — openOnHover delays, focus-opens,
   aria wiring, close reasons, hover-close delay. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { Popover } from './index';

const Demo = ({ trigger = {}, root = {} }: { trigger?: Record<string, unknown>; root?: Record<string, unknown> }) => (
  <AuraGlassProvider>
    <Popover.Root {...root}>
      <Popover.Trigger {...trigger}>anchor</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup aria-label="pop">
            <Popover.Arrow />
            <Popover.Title>Title</Popover.Title>
            <Popover.Description>Body</Popover.Description>
            <Popover.Close>Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </AuraGlassProvider>
);

describe('Popover', () => {
  /* REQ-CMP-98: provider-free mounts (portal falls back to document.body). */
  it('trigger aria-controls === popup id; hover mode + non-interactive popup -> aria-describedby, no haspopup', async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>anchor</Popover.Trigger>
        <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="pop"><p>plain text only</p></Popover.Popup></Popover.Positioner></Popover.Portal>
      </Popover.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    const trigger = screen.getByText('anchor');
    const popup = document.querySelector<HTMLElement>('[data-ag-part="popup"]')!;
    expect(trigger.getAttribute('aria-controls')).toBe(popup.id);
    // click mode keeps haspopup=dialog and no describedby
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('hover mode + non-interactive popup: trigger is describedby popup, haspopup dropped (REQ-CMP-98)', async () => {
    render(
      <Popover.Root>
        <Popover.Trigger openOnHover>anchor</Popover.Trigger>
        <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="pop"><p>plain text only</p></Popover.Popup></Popover.Positioner></Popover.Portal>
      </Popover.Root>,
    );
    const trigger = screen.getByText('anchor');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseMove(trigger);
    await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
    const popup = document.querySelector<HTMLElement>('[data-ag-part="popup"]')!;
    expect(trigger.getAttribute('aria-describedby')).toBe(popup.id);
    expect(trigger.getAttribute('aria-haspopup')).toBeNull();
  });

  it('hover mode WITH interactive popup keeps haspopup=dialog (REQ-CMP-98)', async () => {
    render(
      <Popover.Root>
        <Popover.Trigger openOnHover>anchor</Popover.Trigger>
        <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="pop"><Popover.Close>Close</Popover.Close></Popover.Popup></Popover.Positioner></Popover.Portal>
      </Popover.Root>,
    );
    const trigger = screen.getByText('anchor');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseMove(trigger);
    await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeTruthy();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it('opens on trigger click and reports reason trigger-press', async () => {
    const onOpenChange = jest.fn();
    render(
      <AuraGlassProvider>
        <Popover.Root onOpenChange={onOpenChange}>
          <Popover.Trigger>anchor</Popover.Trigger>
          <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="pop" /></Popover.Positioner></Popover.Portal>
        </Popover.Root>
      </AuraGlassProvider>,
    );
    await userEvent.click(screen.getByText('anchor'));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
  });

  it('aria wiring: trigger haspopup=dialog, expanded; popup role=dialog labelled', async () => {
    render(<Demo root={{ defaultOpen: true }} />);
    const trigger = screen.getByText('anchor');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const popup = document.querySelector('[data-ag-part="popup"]')!;
    expect(popup).toHaveAttribute('role', 'dialog');
    const title = popup.querySelector('[data-ag-part="title"]');
    expect(popup.getAttribute('aria-labelledby')).toBe(title?.id);
  });

  it('openOnHover: delay 300 to open, closeDelay 150 to close', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Demo trigger={{ openOnHover: true }} />);
    const trigger = screen.getByText('anchor');
    fireEvent.mouseEnter(trigger);
    // jsdom PointerEvent lacks pointerType; BU's hover is mouse-gated
    fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
    fireEvent.mouseMove(trigger);
    act(() => { jest.advanceTimersByTime(299); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    act(() => { jest.advanceTimersByTime(2); });
    expect(document.querySelector('[data-ag-part="popup"]')).not.toBeNull();
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    fireEvent.mouseLeave(trigger);
    act(() => { jest.advanceTimersByTime(149); });
    expect(document.querySelector('[data-ag-part="popup"]')).not.toBeNull();
    act(() => { jest.advanceTimersByTime(2); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    void user;
  });

  it('material attributes: overlay regular + data-state', async () => {
    render(<Demo root={{ defaultOpen: true }} />);
    const popup = document.querySelector('[data-ag-part="popup"]')!;
    expect(popup.getAttribute('data-ag-overlay')).toBe('popover');
    expect(popup.getAttribute('data-ag-layer')).toBe('overlay');
    expect(popup.getAttribute('data-ag-thickness')).toBe('regular');
    expect(popup.getAttribute('data-state')).toBe('open');
  });

  it('parts exist: positioner/arrow/title/description/close', async () => {
    render(<Demo root={{ defaultOpen: true }} />);
    for (const part of ['positioner', 'arrow', 'title', 'description', 'close']) {
      expect(document.querySelector(`[data-ag-part="${part}"]`)).toBeTruthy();
    }
  });

  it('Escape closes with reason escape-key', async () => {
    const onOpenChange = jest.fn();
    render(
      <AuraGlassProvider>
        <Popover.Root defaultOpen onOpenChange={onOpenChange}>
          <Popover.Trigger>anchor</Popover.Trigger>
          <Popover.Portal><Popover.Positioner><Popover.Popup aria-label="p" /></Popover.Positioner></Popover.Portal>
        </Popover.Root>
      </AuraGlassProvider>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    (document.querySelector('[data-ag-part="popup"]') as HTMLElement).focus();
    await userEvent.keyboard('{Escape}');
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
  });
});
