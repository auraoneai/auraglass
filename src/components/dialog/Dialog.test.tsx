/* CMP-220 (REQ-CMP-78): Dialog family suite — real Base UI, no mocks. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Dialog } from './index';

function Demo({ root = {}, popup = {}, withTitle = true, children }: {
  root?: Record<string, unknown>;
  popup?: Record<string, unknown>;
  withTitle?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root {...root}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup {...popup}>
          {withTitle ? <Dialog.Title>Title</Dialog.Title> : null}
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Body>{children ?? 'Body'}</Dialog.Body>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const openPopup = () => document.querySelector<HTMLElement>('[data-ag-part="popup"]');

describe('Dialog (CMP-209..216, 220)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });
  afterEach(() => { jest.restoreAllMocks(); });

  it('role=dialog + aria-modal on the popup only', async () => {
    render(<Demo />);
    await userEvent.click(screen.getByText('Open'));
    const popup = openPopup();
    expect(popup).toBeTruthy();
    expect(popup!.getAttribute('role')).toBe('dialog');
    expect(popup!.getAttribute('aria-modal')).toBe('true');
  });

  it('dev error when a dialog opens with no Title and no aria-label', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Demo withTitle={false} popup={{ 'aria-label': undefined }} />);
    await userEvent.click(screen.getByText('Open'));
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('accessible name'));
  });

  it('no dev error when Title is present (labelled and described)', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Demo />);
    await userEvent.click(screen.getByText('Open'));
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    const popup = openPopup()!;
    expect(popup.getAttribute('aria-labelledby')).toBeTruthy();
    expect(popup.getAttribute('aria-describedby')).toBeTruthy();
    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining('accessible name'));
  });

  it('sizes: data-ag-size sm|md|lg|xl|full on the popup', async () => {
    for (const size of ['sm', 'md', 'lg', 'xl', 'full'] as const) {
      const { unmount } = render(<Demo popup={{ size }} root={{ defaultOpen: true }} />);
      await act(async () => {});
      expect(openPopup()?.getAttribute('data-ag-size')).toBe(size);
      unmount();
    }
  });

  it('material attributes: overlay layer, thick, data-ag-overlay=dialog', async () => {
    render(<Demo root={{ defaultOpen: true }} />);
    await act(async () => {});
    const popup = openPopup()!;
    expect(popup.getAttribute('data-ag-layer')).toBe('overlay');
    expect(popup.getAttribute('data-ag-thickness')).toBe('thick');
    expect(popup.getAttribute('data-ag-overlay')).toBe('dialog');
    expect(document.querySelector('.ag-scrim')).toBeTruthy();
  });

  it('form render: submit inside does not close', async () => {
    const onOpenChange = jest.fn();
    render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Popup render={<form data-testid="f" onSubmit={(e) => e.preventDefault()} />}>
            <Dialog.Title>F</Dialog.Title>
            <button type="submit">Save</button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => {});
    const form = document.querySelector('form[data-testid="f"]')!;
    fireEvent.submit(form);
    await act(async () => {});
    expect(form.isConnected).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
  });

  it('reason values: trigger-press / close-press / escape-key', async () => {
    const onOpenChange = jest.fn();
    const { unmount } = render(<Demo root={{ onOpenChange }} />);
    await userEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
    await act(async () => {});
    await userEvent.click(document.querySelector('[data-ag-part="close"]')!);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'close-press' }));
    unmount();
    onOpenChange.mockClear();
    render(<Demo root={{ onOpenChange, defaultOpen: true }} />);
    await act(async () => {});
    (openPopup() as HTMLElement).focus();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
  });

  it('non-modal has no backdrop; modal=true renders the single scrim', async () => {
    const { unmount } = render(<Demo root={{ modal: false, defaultOpen: true }} />);
    await act(async () => {});
    expect(document.querySelector('.ag-scrim')).toBeNull();
    unmount();
    render(<Demo root={{ modal: true, defaultOpen: true }} />);
    await act(async () => {});
    expect(document.querySelectorAll('.ag-scrim').length).toBe(1);
  });

  /* REQ-CMP-88: the LayerStack is the only scroll-lock writer (Base UI's
     useScrollLock only runs for modal === true, which the root no longer
     passes); modal={false} gets neither lock nor inert. */
  it('scroll lock has one owner: stack attribute set, no Base UI overflow write', async () => {
    const html = document.documentElement;
    const buWrote = () => [html, document.body].some((el) =>
      /hidden|clip/.test(`${el.style.overflow} ${el.style.overflowY} ${el.style.overflowX}`));
    const { unmount } = render(<Demo root={{ modal: true, defaultOpen: true }} />);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(html.hasAttribute('data-ag-scroll-locked')).toBe(true);
    expect(buWrote()).toBe(false);
    unmount();
    expect(html.hasAttribute('data-ag-scroll-locked')).toBe(false);
    render(<Demo root={{ modal: false, defaultOpen: true }} />);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(html.hasAttribute('data-ag-scroll-locked')).toBe(false);
    expect(buWrote()).toBe(false);
    expect(document.querySelector('[inert]')).toBeNull();
  });

  it('close label localisable via labels.close', async () => {
    render(<Demo root={{ defaultOpen: true, labels: { close: 'Schließen' } }} />);
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="close"]')!.getAttribute('aria-label')).toBe('Schließen');
  });

  it('layout parts are not surfaces; body padding none', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Header><Dialog.Title>H</Dialog.Title></Dialog.Header>
            <Dialog.Body padding="none">B</Dialog.Body>
            <Dialog.Footer>F</Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => {});
    for (const part of ['header', 'body', 'footer']) {
      const el = document.querySelector(`[data-ag-part="${part}"]`)!;
      expect(el).toBeTruthy();
      expect(el.hasAttribute('data-ag-surface')).toBe(false);
    }
    expect(document.querySelector('[data-ag-part="body"]')!.getAttribute('data-ag-padding')).toBe('none');
  });

  it('palette shell: placement=top + initialFocus reaches the input', async () => {
    const inputRef = React.createRef<HTMLInputElement>();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Popup placement="top" initialFocus={inputRef}>
            <Dialog.Title>P</Dialog.Title>
            <Dialog.Body><input ref={inputRef} data-testid="inside" /></Dialog.Body>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => {});
    const popup = openPopup()!;
    expect(popup.getAttribute('data-ag-placement')).toBe('top');
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(document.activeElement).toBe(inputRef.current ?? openPopup());
  });

  it('nested: parent popup gets data-ag-nested-open while child is open', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Popup aria-label="outer">
            <Dialog.Title>Outer</Dialog.Title>
            <Dialog.Root defaultOpen>
              <Dialog.Portal>
                <Dialog.Popup aria-label="inner"><Dialog.Title>Inner</Dialog.Title></Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    const popups = [...document.querySelectorAll('[data-ag-part="popup"]')];
    const outer = popups.find((p) => p.getAttribute('aria-label') === 'outer')!;
    expect(outer.hasAttribute('data-ag-nested-open')).toBe(true);
  });
});
