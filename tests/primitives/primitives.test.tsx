/* REQ-CMP-28: FocusScope trap/loop/restore, Label required+disabled,
   VisuallyHidden clip, GlassLabel deprecation mapping, Sheet/Tour wiring. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FocusScope } from '../../src/primitives/FocusScope';
import { Label } from '../../src/primitives/Label';
import { VisuallyHidden } from '../../src/primitives/VisuallyHidden';

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

describe('GlassLabel deprecation (DEP-C0221)', () => {
  it('deprecations.json mappings carry GlassLabel -> Label', () => {
    const m = JSON.parse(readFileSync(join(ROOT, 'packages/cli/src/migrate/4to5/mappings/deprecations.json'), 'utf8'));
    const e = m.find((x: { symbol?: string }) => x.symbol === 'GlassLabel');
    expect(e?.replacement).toBe('Label');
    expect(e?.id).toBe('DEP-C0221');
  });

  it('GlassLabel is no longer in the RM-11 removal list', () => {
    const rm = readFileSync(join(ROOT, 'docs/release/decisions/removals/RM-11.json'), 'utf8');
    expect(rm).not.toContain('"GlassLabel"');
  });

  it('the generated runtime table has DEP-C0221', () => {
    const gen = readFileSync(join(ROOT, 'src/internal/deprecations.generated.ts'), 'utf8');
    expect(gen).toContain('"DEP-C0221"');
  });
});

describe('FocusScope wiring (sheet + tour)', () => {
  it('src/components/sheet and src/components/tour import FocusScope', () => {
    const sheet = readFileSync(join(ROOT, 'src/components/sheet/Sheet.client.tsx'), 'utf8');
    const tour = readFileSync(join(ROOT, 'src/components/tour/Tour.client.tsx'), 'utf8');
    expect(sheet).toContain('FocusScope');
    expect(sheet).toMatch(/trapped=\{ctx\.modal\}/);
    expect(tour).toContain('FocusScope');
  });
});
