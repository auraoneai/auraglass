import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AuraGlassProvider } from '../../../theme';
import { Composer } from '../Composer';

// Announcer double (jest.mock is hoisted above the imports): every announce() call is recorded; the rest of the theme
// (AuraGlassProvider for the Menu portal) stays real.
const mockAnnounce = jest.fn<(message: string, opts?: unknown) => void>();
jest.mock('../../../theme', () => {
  const actual = jest.requireActual('../../../theme') as Record<string, unknown>;
  return { ...actual, useAnnouncer: () => ({ announce: mockAnnounce, clear: () => undefined }) };
});

const textarea = () => screen.getByLabelText('Message') as HTMLTextAreaElement;

beforeEach(() => { mockAnnounce.mockClear(); });

describe('Composer', () => {
  it('two instances have unique ids', () => {
    render(<><Composer /><Composer /></>);
    const ids = Array.from(document.querySelectorAll('[data-ag-part="textarea"]')).map((t) => t.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('REQ-SURF-116: the textarea is labelled by a <label for> (Base UI Field), not aria-label', () => {
    render(<Composer />);
    const ta = textarea();
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta.getAttribute('data-ag-part')).toBe('textarea');
    expect(ta.hasAttribute('aria-label')).toBe(false);
    const label = document.querySelector<HTMLLabelElement>(`label[for="${ta.id}"]`);
    expect(label).not.toBeNull();
    expect(label!.textContent).toBe('Message');
    expect(label!.getAttribute('data-ag-part')).toBe('label');
    expect(ta.closest('[data-ag-part="field"]')).not.toBeNull();
    expect(ta.style.getPropertyValue('--_ag-composer-max-rows')).toBe('8');
  });

  it('labels.input renames the <label>', () => {
    render(<Composer labels={{ input: 'Ask anything' }} />);
    const ta = screen.getByLabelText('Ask anything');
    expect(document.querySelector(`label[for="${ta.id}"]`)?.textContent).toBe('Ask anything');
  });

  it('controlled and uncontrolled value', () => {
    const onValueChange = jest.fn();
    const { rerender } = render(<Composer defaultValue="hi" />);
    expect(textarea().value).toBe('hi');
    rerender(<Composer value="controlled" onValueChange={onValueChange} />);
    fireEvent.change(textarea(), { target: { value: 'x' } });
    expect(onValueChange).toHaveBeenCalledWith('x');
  });

  it('Enter submits, Shift+Enter does not, IME composition does not submit', () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="hello" onSubmit={onSubmit} />);
    const ta = textarea();
    fireEvent.keyDown(ta, { key: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
    // composing Enter — keyCode 229
    fireEvent.keyDown(ta, { key: 'Enter', keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({ text: 'hello' });
  });

  it('REQ-SURF-117: Enter with isComposing:true does not submit', () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="nihongo" onSubmit={onSubmit} />);
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, isComposing: true });
    expect(ev.isComposing).toBe(true);
    fireEvent(textarea(), ev);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(ev.defaultPrevented).toBe(false);
    expect(textarea().value).toBe('nihongo');
  });

  it('REQ-SURF-117: Ctrl+Enter and Cmd+Enter submit with submitOnEnter=false; plain Enter does not', () => {
    const onSubmit = jest.fn();
    render(
      <Composer onSubmit={onSubmit}>
        <Composer.Textarea submitOnEnter={false} />
      </Composer>,
    );
    fireEvent.change(textarea(), { target: { value: 'first' } });
    fireEvent.keyDown(textarea(), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(textarea(), { key: 'Enter', ctrlKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({ text: 'first' });
    fireEvent.change(textarea(), { target: { value: 'second' } });
    fireEvent.keyDown(textarea(), { key: 'Enter', metaKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(onSubmit.mock.calls[1]![0]).toMatchObject({ text: 'second' });
  });

  it('REQ-SURF-117: while streaming, Enter does not call onSubmit and the textarea stays editable', () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="next question" status="streaming" onSubmit={onSubmit} />);
    const ta = textarea();
    expect(ta.disabled).toBe(false);
    fireEvent.keyDown(ta, { key: 'Enter' });
    fireEvent.keyDown(ta, { key: 'Enter', ctrlKey: true });
    fireEvent.submit(ta.form!);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(ta.value).toBe('next question');
  });

  it('REQ-SURF-117: status=error keeps the draft', () => {
    const onSubmit = jest.fn();
    const { rerender } = render(<Composer status="streaming" onSubmit={onSubmit} />);
    fireEvent.change(textarea(), { target: { value: 'typed while streaming' } });
    rerender(<Composer status="error" onSubmit={onSubmit} />);
    expect(textarea().value).toBe('typed while streaming');
    expect(screen.getByRole('button', { name: 'Send message' }).getAttribute('aria-disabled')).toBe('false');
  });

  it('REQ-SURF-117: uncontrolled draft is cleared after Enter and focus stays in the textarea', () => {
    const onSubmit = jest.fn();
    render(<Composer onSubmit={onSubmit} />);
    const ta = textarea();
    ta.focus();
    fireEvent.change(ta, { target: { value: 'send me' } });
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith({ text: 'send me', files: [] });
    expect(textarea().value).toBe('');
    expect(document.activeElement).toBe(textarea());
  });

  it('REQ-SURF-117: clicking Submit returns focus to the textarea', () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="via button" onSubmit={onSubmit} />);
    const submit = screen.getByRole('button', { name: 'Send message' });
    submit.focus();
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(textarea());
    expect(textarea().value).toBe('');
  });

  it('REQ-SURF-117: controlled mode reports the consumed draft through onValueChange("")', () => {
    const onValueChange = jest.fn();
    render(<Composer value="owned" onValueChange={onValueChange} onSubmit={() => undefined} />);
    fireEvent.keyDown(textarea(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('empty/whitespace text does not submit; Submit aria-disabled but focusable', () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="   " onSubmit={onSubmit} />);
    fireEvent.keyDown(textarea(), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    const submit = screen.getByRole('button', { name: 'Send message' });
    expect(submit.getAttribute('aria-disabled')).toBe('true');
  });

  it('stop swap: streaming swaps Submit→Stop; Escape calls onStop', () => {
    const onStop = jest.fn();
    render(<Composer defaultValue="x" status="streaming" onStop={onStop} />);
    expect(screen.getByRole('button', { name: 'Stop generating' })).toBeTruthy();
    fireEvent.keyDown(textarea(), { key: 'Escape' });
    expect(onStop).toHaveBeenCalled();
  });

  it('attachments: paste adds files, rejections call onAttachmentReject', () => {
    const onReject = jest.fn();
    render(<Composer accept="image/png" maxFileSize={10} onAttachmentReject={onReject} />);
    const form = document.querySelector('[data-ag-part="composer"]')!;
    const ok = new File(['x'], 'ok.png', { type: 'image/png' });
    const bad = new File(['x'], 'bad.txt', { type: 'text/plain' });
    const tooBig = new File([new Uint8Array(11)], 'big.png', { type: 'image/png' });
    fireEvent.paste(form, { clipboardData: { files: [ok, bad, tooBig] } });
    expect(screen.getByText('ok.png')).toBeTruthy();
    expect(onReject).toHaveBeenCalledTimes(2);
    expect(onReject.mock.calls.map((c) => (c[0] as { reason: string }).reason).sort()).toEqual(['size', 'type']);
  });

  it('REQ-SURF-118: under <React.StrictMode> each rejected file calls onAttachmentReject and announces once', () => {
    const onReject = jest.fn();
    render(
      <React.StrictMode>
        <Composer accept="image/png" maxFileSize={10} onAttachmentReject={onReject} />
      </React.StrictMode>,
    );
    const form = document.querySelector('[data-ag-part="composer"]')!;
    const bad = new File(['x'], 'bad.txt', { type: 'text/plain' });
    const tooBig = new File([new Uint8Array(11)], 'big.png', { type: 'image/png' });
    const ok = new File(['x'], 'ok.png', { type: 'image/png' });
    fireEvent.paste(form, { clipboardData: { files: [bad, ok, tooBig] } });
    expect(onReject).toHaveBeenCalledTimes(2);
    expect(onReject.mock.calls.map((c) => (c[0] as { file: File }).file.name)).toEqual(['bad.txt', 'big.png']);
    expect(mockAnnounce.mock.calls.filter(([m]) => m.startsWith('Attachment rejected'))).toHaveLength(2);
    expect(screen.getAllByText('ok.png')).toHaveLength(1);
  });

  it('REQ-SURF-118: count rejection uses the committed list (maxFiles across two pastes)', () => {
    const onReject = jest.fn();
    render(<Composer maxFiles={2} onAttachmentReject={onReject} />);
    const form = document.querySelector('[data-ag-part="composer"]')!;
    const f = (n: string) => new File(['x'], n, { type: 'text/plain' });
    fireEvent.paste(form, { clipboardData: { files: [f('a.txt')] } });
    fireEvent.paste(form, { clipboardData: { files: [f('b.txt'), f('c.txt')] } });
    expect(document.querySelectorAll('[data-ag-part="attachment"]')).toHaveLength(2);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onReject.mock.calls[0]![0]).toMatchObject({ reason: 'count' });
  });

  it('REQ-SURF-118: duplicate-name files are both listed and individually removable', () => {
    const onSubmit = jest.fn<(d: { text: string; files: File[] }) => void>();
    render(<Composer onSubmit={onSubmit} />);
    const form = document.querySelector('[data-ag-part="composer"]')!;
    const first = new File(['first'], 'notes.txt', { type: 'text/plain' });
    const second = new File(['second-longer'], 'notes.txt', { type: 'text/plain' });
    fireEvent.paste(form, { clipboardData: { files: [first, second] } });
    expect(screen.getAllByText('notes.txt')).toHaveLength(2);
    const removes = screen.getAllByRole('button', { name: 'Remove notes.txt' });
    expect(removes).toHaveLength(2);
    fireEvent.click(removes[0]!);
    expect(screen.getAllByText('notes.txt')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0].files).toEqual([second]);
  });

  it('REQ-SURF-118: data-dragging survives dragleave from a child and ends at depth 0', () => {
    render(<Composer />);
    const form = document.querySelector<HTMLElement>('[data-ag-part="composer"]')!;
    const ta = textarea();
    fireEvent.dragEnter(form);
    fireEvent.dragEnter(ta); // entering a child
    fireEvent.dragLeave(ta); // leaving the child, still over the form
    expect(form.getAttribute('data-dragging')).toBe('true');
    fireEvent.dragLeave(form);
    expect(form.hasAttribute('data-dragging')).toBe(false);
    fireEvent.dragEnter(form);
    const file = new File(['x'], 'drop.log', { type: 'text/plain' });
    fireEvent.drop(form, { dataTransfer: { files: [file] } });
    expect(form.hasAttribute('data-dragging')).toBe(false);
    expect(screen.getByText('drop.log')).toBeTruthy();
  });

  it('counter shows len/maxLength', () => {
    render(<Composer defaultValue="abc" maxLength={100} />);
    expect(screen.getByText('3/100')).toBeTruthy();
  });

  it('REQ-SURF-119: counter has no live region and announces exactly twice across 0→100%', () => {
    render(<Composer maxLength={10} />);
    const counter = document.querySelector('[data-ag-part="counter"]')!;
    expect(counter.hasAttribute('aria-live')).toBe(false);
    expect(counter.getAttribute('role')).toBeNull();
    for (let n = 1; n <= 10; n++) fireEvent.change(textarea(), { target: { value: 'x'.repeat(n) } });
    const counts = mockAnnounce.mock.calls.filter(([m]) => /characters$/.test(m));
    expect(counts.map(([m]) => m)).toEqual(['9 of 10 characters', '10 of 10 characters']);
    expect(document.querySelectorAll('[aria-live]')).toHaveLength(0);
  });

  it('REQ-SURF-119: secondary actions are mirrored into one leading CMP Menu; Submit stays', async () => {
    const onCustom = jest.fn();
    render(
      <AuraGlassProvider>
        <Composer onSubmit={() => undefined}>
          <Composer.Textarea />
          <Composer.Actions>
            <Composer.Action kind="attach" icon="attach" />
            <Composer.Action aria-label="Insert template" onClick={onCustom} />
            <Composer.Submit />
          </Composer.Actions>
        </Composer>
      </AuraGlassProvider>,
    );
    const actions = document.querySelector('[data-ag-part="actions"]')!;
    const menu = actions.querySelector('[data-ag-part="composer-menu"]')!;
    expect(menu).not.toBeNull();
    expect(actions.firstElementChild).toBe(menu);
    expect(actions.querySelector('[data-ag-part="submit"]')).not.toBeNull();
    const trigger = screen.getByRole('button', { name: 'More actions' });
    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.getAttribute('data-ag-part')).toBe('composer-menu-trigger');
    fireEvent.click(trigger);
    await act(async () => {});
    const items = Array.from(document.querySelectorAll('[role="menuitem"]')).map((i) => i.textContent);
    expect(items).toEqual(['Attach file', 'Insert template']);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Insert template' }));
    expect(onCustom).toHaveBeenCalledTimes(1);
  });

  it('REQ-SURF-119: the attach menu item opens the hidden file picker', async () => {
    render(
      <AuraGlassProvider>
        <Composer>
          <Composer.Actions>
            <Composer.Action kind="attach" />
            <Composer.Submit />
          </Composer.Actions>
        </Composer>
      </AuraGlassProvider>,
    );
    const input = document.querySelector<HTMLInputElement>('[data-ag-part="file-input"]')!;
    const click = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    await act(async () => {});
    fireEvent.click(screen.getByRole('menuitem', { name: 'Attach file' }));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('no menu when there are no secondary actions', () => {
    render(<Composer />);
    expect(document.querySelector('[data-ag-part="composer-menu"]')).toBeNull();
  });

  it('jest-axe: composer with actions menu has 0 violations', async () => {
    const { container } = render(
      <AuraGlassProvider>
        <Composer maxLength={20} defaultValue="draft">
          <Composer.Textarea />
          <Composer.Counter />
          <Composer.Actions>
            <Composer.Action kind="attach" icon="attach" />
            <Composer.Submit />
          </Composer.Actions>
        </Composer>
      </AuraGlassProvider>,
    );
    const results = await axe(container) as unknown as { violations: Array<{ id: string }> };
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

describe('Composer measured-height fallback (REQ-SURF-119)', () => {
  const originalCSS = (globalThis as { CSS?: unknown }).CSS;
  afterEach(() => {
    (globalThis as { CSS?: unknown }).CSS = originalCSS;
    jest.restoreAllMocks();
  });

  it('without field-sizing support the block size follows scrollHeight, capped at maxRows lines', () => {
    const supports = jest.fn((prop: string, value?: string) => !(prop === 'field-sizing' && value === 'content'));
    (globalThis as { CSS?: unknown }).CSS = { supports };
    let scroll = 20;
    jest.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(() => scroll);
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      lineHeight: '20px', fontSize: '16px', boxSizing: 'content-box',
      paddingBlockStart: '0px', paddingBlockEnd: '0px', borderBlockStartWidth: '0px', borderBlockEndWidth: '0px',
    }) as unknown as CSSStyleDeclaration);
    render(<Composer maxRows={3} />);
    expect(supports).toHaveBeenCalledWith('field-sizing', 'content');
    expect(textarea().style.blockSize).toBe('20px');
    scroll = 40;
    fireEvent.change(textarea(), { target: { value: 'a\nb' } });
    expect(textarea().style.blockSize).toBe('40px');
    scroll = 200;
    fireEvent.change(textarea(), { target: { value: 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj' } });
    expect(textarea().style.blockSize).toBe('60px');
  });

  it('with field-sizing support no inline block size is written', () => {
    (globalThis as { CSS?: unknown }).CSS = { supports: () => true };
    render(<Composer />);
    fireEvent.change(textarea(), { target: { value: 'a\nb\nc' } });
    expect(textarea().style.blockSize).toBe('');
  });
});

describe('Composer keyboard inset and thread offset (REQ-SURF-119)', () => {
  class FakeViewport extends EventTarget {
    height = 800;
    offsetTop = 0;
  }
  let vv: FakeViewport;
  const desc = Object.getOwnPropertyDescriptor(window, 'visualViewport');
  beforeEach(() => {
    vv = new FakeViewport();
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: vv });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  });
  afterEach(() => {
    if (desc) Object.defineProperty(window, 'visualViewport', desc);
    else delete (window as { visualViewport?: unknown }).visualViewport;
    jest.restoreAllMocks();
  });

  it('one shared visualViewport resize listener writes --_ag-ai-keyboard-inset; removed with the last composer', () => {
    const add = jest.spyOn(vv, 'addEventListener');
    const remove = jest.spyOn(vv, 'removeEventListener');
    const a = render(<Composer />);
    const b = render(<Composer />);
    expect(add.mock.calls.filter(([t]) => t === 'resize')).toHaveLength(1);
    vv.height = 500;
    act(() => { vv.dispatchEvent(new Event('resize')); });
    const forms = Array.from(document.querySelectorAll<HTMLElement>('[data-ag-part="composer"]'));
    expect(forms).toHaveLength(2);
    for (const f of forms) expect(f.style.getPropertyValue('--_ag-ai-keyboard-inset')).toBe('300px');
    a.unmount();
    expect(remove).not.toHaveBeenCalled();
    b.unmount();
    expect(remove.mock.calls.filter(([t]) => t === 'resize')).toHaveLength(1);
  });

  it('no listener where the VirtualKeyboard API provides env(keyboard-inset-height)', () => {
    const add = jest.spyOn(vv, 'addEventListener');
    Object.defineProperty(navigator, 'virtualKeyboard', { configurable: true, value: {} });
    try {
      render(<Composer />);
      expect(add).not.toHaveBeenCalled();
    } finally {
      delete (navigator as { virtualKeyboard?: unknown }).virtualKeyboard;
    }
  });

  it('writes its block size to the sibling Thread as --_ag-ai-composer-block', () => {
    const observers: Array<{ cb: ResizeObserverCallback; targets: Element[] }> = [];
    const original = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      rec: { cb: ResizeObserverCallback; targets: Element[] };
      constructor(cb: ResizeObserverCallback) { this.rec = { cb, targets: [] }; observers.push(this.rec); }
      observe(el: Element) { this.rec.targets.push(el); }
      unobserve() {}
      disconnect() { this.rec.targets = []; }
    };
    try {
      const { unmount } = render(
        <div>
          <section data-ag-part="thread" />
          <Composer />
        </div>,
      );
      const form = document.querySelector('[data-ag-part="composer"]')!;
      const rec = observers.find((o) => o.targets.includes(form))!;
      expect(rec).toBeDefined();
      act(() => {
        rec.cb([{ target: form, borderBoxSize: [{ blockSize: 96.4, inlineSize: 400 }], contentRect: { height: 90 } } as unknown as ResizeObserverEntry], {} as ResizeObserver);
      });
      const thread = document.querySelector<HTMLElement>('[data-ag-part="thread"]')!;
      expect(thread.style.getPropertyValue('--_ag-ai-composer-block')).toBe('96px');
      expect(thread.style.getPropertyValue('--ag-scroll-padding-block-end')).toBe('96px');
      unmount();
      expect(thread.style.getPropertyValue('--_ag-ai-composer-block')).toBe('');
    } finally {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = original;
    }
  });
});
