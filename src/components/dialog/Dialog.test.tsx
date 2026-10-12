/* CMP-220 (REQ-CMP-78): Dialog family suite — real Base UI, no mocks. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Dialog } from './index';
import type { DialogRootProps } from './Dialog.types';
import meta from './Dialog.meta';
import { layerStackFor } from '../../theme/layers/LayerStack';

function Demo({ root = {}, popup = {}, withTitle = true, children }: {
  root?: Record<string, unknown>;
  popup?: Record<string, unknown>;
  withTitle?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root {...root}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content {...popup}>
        {withTitle ? <Dialog.Title>Title</Dialog.Title> : null}
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Body>{children ?? 'Body'}</Dialog.Body>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
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

  it('sizes: data-ag-size sm|md|lg on the popup (xl/full moved to appearance)', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { unmount } = render(<Demo popup={{ size }} root={{ defaultOpen: true }} />);
      await act(async () => {});
      expect(openPopup()?.getAttribute('data-ag-size')).toBe(size);
      unmount();
    }
  });

  it('appearance: data-ag-appearance=wide emitted; CSS maps wide→960px', async () => {
    render(<Demo popup={{ appearance: 'wide' }} root={{ defaultOpen: true }} />);
    await act(async () => {});
    expect(openPopup()?.getAttribute('data-ag-appearance')).toBe('wide');
    const css = readFileSync(resolve(__dirname, 'Dialog.css'), 'utf8');
    const wide = css.match(/\[data-ag-appearance='wide'\][^}]*/u)?.[0] ?? '';
    expect(wide).toContain('max-inline-size: 960px');
  });

  it('appearance: fullscreen emits the attr; xl is not a size', async () => {
    render(<Demo popup={{ appearance: 'fullscreen' }} root={{ defaultOpen: true }} />);
    await act(async () => {});
    expect(openPopup()?.getAttribute('data-ag-appearance')).toBe('fullscreen');
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
        <Dialog.Content render={<form data-testid="f" onSubmit={(e) => e.preventDefault()} />} backdrop={false}>
          <Dialog.Title>F</Dialog.Title>
          <button type="submit">Save</button>
        </Dialog.Content>
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
        <Dialog.Content backdrop={false}>
          <Dialog.Header><Dialog.Title>H</Dialog.Title></Dialog.Header>
          <Dialog.Body padding="none">B</Dialog.Body>
          <Dialog.Footer>F</Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await act(async () => {});
    for (const part of ['header', 'body', 'footer']) {
      const el = document.querySelector(`[data-ag-part="${part}"]`)!;
      expect(el).toBeTruthy();
      expect(el.hasAttribute('data-ag-surface')).toBe(false);
    }
    expect(document.querySelector('[data-ag-part="body"]')!.getAttribute('data-padding')).toBe('none');
  });

  it('palette shell: placement=top + initialFocus reaches the input', async () => {
    const inputRef = React.createRef<HTMLInputElement>();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content placement="top" initialFocus={inputRef} backdrop={false}>
          <Dialog.Title>P</Dialog.Title>
          <Dialog.Body><input ref={inputRef} data-testid="inside" /></Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await act(async () => {});
    const popup = openPopup()!;
    expect(popup.getAttribute('data-placement')).toBe('top');
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(document.activeElement).toBe(inputRef.current ?? openPopup());
  });

  /* REQ-CMP-88: Base UI is the only focus manager. An explicit initialFocus
     target receives focus on open, and an explicit finalFocus target (not
     the trigger) receives it on close — the LayerStack registers with
     restoreFocusTo:false so it never re-restores the trigger over it. */
  it('explicit initialFocus and finalFocus targets receive focus', async () => {
    const inside = React.createRef<HTMLButtonElement>();
    const after = React.createRef<HTMLButtonElement>();
    render(
      <>
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content initialFocus={inside} finalFocus={after}>
            <Dialog.Title>Focus targets</Dialog.Title>
            <Dialog.Body>
              <button type="button">First</button>
              <button type="button" ref={inside}>Second</button>
            </Dialog.Body>
            <Dialog.Close>Done</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
        <button type="button" ref={after}>Elsewhere</button>
      </>,
    );
    await userEvent.click(screen.getByText('Open'));
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(inside.current).not.toBeNull();
    expect(document.activeElement).toBe(inside.current);
    await userEvent.keyboard('{Escape}');
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(openPopup()).toBeNull();
    expect(document.activeElement).toBe(after.current);
  });

  it('the LayerStack entry never restores focus itself (restoreFocusTo: false)', async () => {
    render(<Demo root={{ defaultOpen: true }} />);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    const top = layerStackFor(document).top();
    expect(top?.kind).toBe('dialog');
    expect(top?.restoreFocusTo).toBe(false);
  });

  it('default close returns focus to the trigger exactly once (Base UI only)', async () => {
    render(<Demo />);
    const trigger = screen.getByText('Open');
    await userEvent.click(trigger);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(openPopup()!.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(document.activeElement).toBe(trigger);
  });

  it('nested: parent popup gets data-ag-nested-open while child is open', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="outer" backdrop={false}>
          <Dialog.Title>Outer</Dialog.Title>
          <Dialog.Root defaultOpen>
            <Dialog.Content aria-label="inner" backdrop={false}><Dialog.Title>Inner</Dialog.Title></Dialog.Content>
          </Dialog.Root>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    const popups = [...document.querySelectorAll('[data-ag-part="popup"]')];
    const outer = popups.find((p) => p.getAttribute('aria-label') === 'outer')!;
    expect(outer.hasAttribute('data-ag-nested-open')).toBe(true);
  });
  it('Close: no children = corner icon button; with children = footer Button', async () => {
    render(
      <Dialog.Root defaultOpen>

          <Dialog.Content>
            <Dialog.Close />
            <Dialog.Title>T</Dialog.Title>
            <Dialog.Footer><Dialog.Close>Done</Dialog.Close></Dialog.Footer>
          </Dialog.Content>

      </Dialog.Root>,
    );
    await act(async () => {});
    const [icon, text] = [...document.querySelectorAll('[data-ag-part="close"]')];
    expect(icon!.classList.contains('ag-dialog-close')).toBe(true);
    expect(icon!.classList.contains('ag-button')).toBe(false);
    expect(text!.classList.contains('ag-dialog-close')).toBe(false);
    expect(text!.classList.contains('ag-button')).toBe(true);
    expect(text!.textContent).toBe('Done');
  });

  it('CSS: the resting popup does not zero --_ag-optics (blur/rim stay on)', () => {
    const css = readFileSync(resolve(__dirname, 'Dialog.css'), 'utf8');
    const resting = css.match(/\.ag-dialog-popup \{[^}]*\}/u)?.[0] ?? '';
    expect(resting).not.toBe('');
    expect(resting).not.toContain('--_ag-optics');
  });
});

/* REQ-CMP-86: the root takes modal: boolean (default true); there is no
   'trap-focus' value on the public API. */
describe('REQ-CMP-86 Dialog modal prop', () => {
  it("modal is boolean only — 'trap-focus' is not a public value", () => {
    const ok: DialogRootProps['modal'][] = [true, false, undefined];
    // @ts-expect-error 'trap-focus' was removed from DialogRootProps.modal
    const bad: DialogRootProps['modal'] = 'trap-focus';
    expect(ok).toHaveLength(3);
    expect(bad).toBe('trap-focus');
    expect(meta.variants?.['modal']).toEqual(['true', 'false']);
  });

  it('default (modal) gives aria-modal + the scrim; modal=false gives neither', async () => {
    const { unmount } = render(<Demo root={{ defaultOpen: true }} />);
    await act(async () => {});
    expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-modal')).toBe('true');
    expect(document.querySelector('.ag-scrim')).not.toBeNull();
    unmount();
    render(<Demo root={{ defaultOpen: true, modal: false }} />);
    await act(async () => {});
    expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-modal')).toBeNull();
    expect(document.querySelector('.ag-scrim')).toBeNull();
  });
});
