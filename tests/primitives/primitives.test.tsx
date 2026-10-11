/* REQ-CMP-28: FocusScope trap/loop/restore, Label required+disabled,
   VisuallyHidden clip, GlassLabel compat adapter (DEP-C0280), and FocusScope
   behaviour inside Sheet (modal trap+loop / non-modal tab-out) and Tour. */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act, fireEvent, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FocusScope } from '../../src/primitives/FocusScope';
import { Label } from '../../src/primitives/Label';
import { VisuallyHidden } from '../../src/primitives/VisuallyHidden';
import { Sheet } from '../../src/components/sheet';
import { Tour } from '../../src/components/tour';
import { GlassLabel } from '../../src/compat/cmp/controls/GlassLabel';
import * as CompatCmp from '../../src/compat/cmp';

const ROOT = join(__dirname, '../..');

describe('FocusScope', () => {
  it('autoFocus moves focus into the scope and loops Tab at the end', async () => {
    render(
      <FocusScope loop autoFocus>
        <button type="button">one</button>
        <button type="button">two</button>
      </FocusScope>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    const first = document.querySelector('button');
    expect(document.activeElement).toBe(first);
    (document.activeElement as HTMLElement).blur();
    (document.querySelectorAll('button')[1] as HTMLElement).focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
  });

  it('trapped pulls outside focus back into the scope', async () => {
    render(
      <>
        <FocusScope trapped>
          <button type="button">inside</button>
        </FocusScope>
        <button type="button">outside</button>
      </>,
    );
    await act(async () => {});
    const outside = document.querySelectorAll('button')[1] as HTMLElement;
    fireEvent.focusIn(outside);
    await act(async () => {});
    expect((document.activeElement as HTMLElement)?.textContent).toBe('inside');
  });

  it('restoreFocus returns focus to the previous element on unmount', async () => {
    const App = ({ open }: { open: boolean }) => (
      <>
        <button type="button">before</button>
        {open ? <FocusScope restoreFocus><button type="button">in</button></FocusScope> : null}
      </>
    );
    const { rerender } = render(<App open={false} />);
    const before = document.querySelector('button') as HTMLElement;
    before.focus();
    rerender(<App open={true} />);
    await act(async () => {});
    rerender(<App open={false} />);
    await act(async () => {});
    expect(document.activeElement).toBe(before);
  });
});

describe('Label', () => {
  it('renders label[data-ag-part=label]; required adds asterisk + SR text', () => {
    const { container } = render(<Label required htmlFor="f1">Name</Label>);
    const el = container.querySelector('label[data-ag-part="label"]');
    expect(el).not.toBeNull();
    expect(el!.getAttribute('for')).toBe('f1');
    expect(el!.querySelector('span[aria-hidden="true"]')?.textContent).toBe('*');
    expect(el!.textContent).toContain('(required)');
  });

  it('disabled sets data-disabled', () => {
    const { container } = render(<Label disabled>Off</Label>);
    expect(container.querySelector('label')?.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('VisuallyHidden', () => {
  it('renders a span carrying the children', () => {
    const { container } = render(<VisuallyHidden>secret</VisuallyHidden>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('SPAN');
    expect(el.textContent).toBe('secret');
    /* clip styles live in VisuallyHidden.css, not a class — verify the sheet. */
    const css = readFileSync(join(ROOT, 'src/primitives/VisuallyHidden.css'), 'utf8');
    expect(css).toContain('clip-path: inset(50%)');
    expect(css).toContain(':focus-visible');
  });
});

describe('GlassLabel compat adapter (DEP-C0280)', () => {
  it('renders Label and warns once with the DEP-C0280 id', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { container, rerender } = render(<GlassLabel required htmlFor="g1">Email</GlassLabel>);
      const el = container.querySelector('label[data-ag-part="label"]');
      expect(el).not.toBeNull();
      expect(el!.getAttribute('for')).toBe('g1');
      expect(el!.textContent).toContain('(required)');
      rerender(<GlassLabel disabled>Email</GlassLabel>);
      expect(container.querySelector('label')!.hasAttribute('data-disabled')).toBe(true);
      const calls = warn.mock.calls.filter((c) => String(c[0]).includes('DEP-C0280'));
      expect(calls).toHaveLength(1);
      expect(warn.mock.calls.some((c) => String(c[0]).includes('DEP-C0221'))).toBe(false);
    } finally {
      warn.mockRestore();
    }
  });

  it('is exported from the compat cmp barrel', () => {
    expect(CompatCmp.GlassLabel).toBe(GlassLabel);
  });
});

const tabbables = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])'));

const tick = () => act(async () => { await new Promise((r) => setTimeout(r, 10)); });

function SheetDemo({ modal }: { modal: boolean }) {
  return (
    <Sheet.Root defaultOpen modal={modal}>
      <Sheet.Trigger>Open sheet</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Body>
          <button type="button">first</button>
          <button type="button">last</button>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}

describe('FocusScope in Sheet (CMP-28)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });

  it('modal sheet: focus moves into the popup and Tab from the last control loops to the first', async () => {
    render(<SheetDemo modal />);
    await tick();
    const popup = document.querySelector<HTMLElement>('[data-ag-part="popup"]')!;
    const scope = popup.querySelector<HTMLElement>('.ag-sheet-focus-scope')!;
    expect(scope).not.toBeNull();
    expect(scope.style.display).toBe('contents');
    const focusables = tabbables(scope);
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    // autoFocus lands on the scope's first tabbable (Base UI's own focus
    // manager runs too, so wait for focus to settle rather than a fixed tick).
    await waitFor(() => expect(document.activeElement).toBe(first));
    last.focus();
    // fireEvent returns false when the handler called preventDefault (loop).
    expect(fireEvent.keyDown(document, { key: 'Tab' })).toBe(false);
    expect(document.activeElement).toBe(first);
    expect(fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })).toBe(false);
    expect(document.activeElement).toBe(last);
  });

  it('non-modal sheet: autofocuses in, but Tab from the last control is left to the browser (CMP-92 tab-out)', async () => {
    render(<SheetDemo modal={false} />);
    await tick();
    const scope = document.querySelector<HTMLElement>('[data-ag-part="popup"] .ag-sheet-focus-scope')!;
    expect(scope).not.toBeNull();
    const focusables = tabbables(scope);
    await waitFor(() => expect(document.activeElement).toBe(focusables[0]));
    const last = focusables[focusables.length - 1]!;
    last.focus();
    expect(fireEvent.keyDown(document, { key: 'Tab' })).toBe(true);
    expect(document.activeElement).toBe(last);
  });
});

describe('FocusScope in Tour (CMP-28)', () => {
  const steps = [
    { target: '#t1', title: 'First', description: 'one' },
    { target: '#t2', title: 'Second', description: 'two' },
  ];

  it('autofocuses the step, loops Tab inside it, and moves focus to the new step on advance', async () => {
    render(
      <div>
        <button id="t1" type="button">A</button><button id="t2" type="button">B</button>
        <Tour.Root defaultOpen steps={steps} />
      </div>,
    );
    await tick();
    let step = document.querySelector<HTMLElement>('[data-ag-part="step"]')!;
    expect(step.closest('.ag-tour-focus-scope')).not.toBeNull();
    const controls = tabbables(step);
    await waitFor(() => expect(document.activeElement).toBe(controls[0]));
    controls[controls.length - 1]!.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(controls[0]);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await tick();
    step = document.querySelector<HTMLElement>('[data-ag-part="step"]')!;
    expect(step.textContent).toContain('Second');
    await waitFor(() => expect(document.activeElement).toBe(tabbables(step)[0]));
  });
});
