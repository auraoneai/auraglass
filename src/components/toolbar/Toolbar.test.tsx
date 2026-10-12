import { ToolbarIconButton } from './Toolbar.client';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './index';
import { IconButton } from '../icon-button';

const X = <svg data-testid="x" />;

describe('Toolbar', () => {
  it('REQ-MAT-23: bar size class resolves regular thickness; refraction keys the bar lens; explicit thickness wins', () => {
    const { unmount } = render(<Toolbar.Root aria-label="Bar" refraction><Toolbar.Button>B</Toolbar.Button></Toolbar.Root>);
    const root = screen.getByRole('toolbar', { name: 'Bar' });
    expect(root.getAttribute('data-ag-thickness')).toBe('regular');
    expect(root.getAttribute('data-ag-sizeclass')).toBe('bar');
    unmount();
    render(<Toolbar.Root aria-label="Thin" thickness="thin"><Toolbar.Button>B</Toolbar.Button></Toolbar.Root>);
    const thin = screen.getByRole('toolbar', { name: 'Thin' });
    expect(thin.getAttribute('data-ag-thickness')).toBe('thin');
    expect(thin.hasAttribute('data-ag-sizeclass')).toBe(false);
  });

  it('renders root inside a SurfaceGroup with parts', () => {
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Group>
          <Toolbar.Button render={<IconButton label="Undo" icon={X} />} />
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );
    const root = screen.getByRole('toolbar', { name: 'Editor' });
    expect(root.getAttribute('data-ag-part')).toBe('root');
    /* REQ-CMP-37: root IS the surface group — merged attrs, no wrapper */
    expect(root.getAttribute('data-ag-group')).toBe('');
    expect(root.getAttribute('data-ag-spacing')).toBe('2');
    expect(root.getAttribute('data-ag-surface')).toBe('');
    expect(root.getAttribute('data-ag-shape')).toBe('capsule');
    expect(root.parentElement?.getAttribute('data-ag-group')).toBeNull();
    expect(screen.getByText('Help').closest('[data-ag-part="link"]')).not.toBeNull();
    expect(root.querySelector('[data-ag-part="separator"]')).not.toBeNull();
    expect(root.querySelector('[data-ag-part="group"]')).not.toBeNull();
  });

  it('Toolbar.Button renders our ag-button through the render prop', () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.Button prominent>Save</Toolbar.Button>
      </Toolbar.Root>,
    );
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('ag-button');
    expect(btn.getAttribute('data-ag-prominent')).toBe('');
  });

  it('Toolbar.Button render={<IconButton/>} renders an icon-only toolbar button', () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.Button render={<IconButton label="Undo" icon={X} />} />
      </Toolbar.Root>,
    );
    const btn = screen.getByRole('button', { name: 'Undo' });
    expect(btn).toHaveClass('ag-icon-button');
  });

  it('orientation=vertical is forwarded', () => {
    render(
      <Toolbar.Root aria-label="t" orientation="vertical">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    const root = screen.getByRole('toolbar');
    expect(root.getAttribute('data-ag-shape')).toBeNull();
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('horizontal root emits capsule shape', () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('toolbar').getAttribute('data-ag-shape')).toBe('capsule');
  });
});

/* REQ-CMP-40 overflow, measured: jsdom has no layout, so the bar's content
   width (scrollWidth) and its parent's inline space (clientWidth) are stubbed
   and a ResizeObserver stand-in replays the resize. */
describe('Toolbar overflow (REQ-CMP-40)', () => {
  type Box = { content: number; avail: number };
  const box: Box = { content: 300, avail: 600 };
  let observers: Array<() => void> = [];
  const protoEl = HTMLElement.prototype as unknown as Record<string, unknown>;
  const saved = {
    scroll: Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth'),
    client: Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth'),
    ro: (globalThis as { ResizeObserver?: unknown }).ResizeObserver,
  };
  beforeEach(() => {
    observers = [];
    Object.defineProperty(Element.prototype, 'scrollWidth', {
      configurable: true,
      get(this: Element) { return this.getAttribute('role') === 'toolbar' ? box.content : 0; },
    });
    Object.defineProperty(Element.prototype, 'clientWidth', {
      configurable: true,
      get(this: Element) { return this.hasAttribute('data-testid') ? box.avail : 0; },
    });
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      cb: () => void;
      constructor(cb: () => void) { this.cb = cb; observers.push(() => this.cb()); }
      observe() {}
      unobserve() {}
      disconnect() { observers = observers.filter((o) => o !== this.cb); }
    };
    void protoEl;
  });
  afterEach(() => {
    if (saved.scroll) Object.defineProperty(Element.prototype, 'scrollWidth', saved.scroll);
    if (saved.client) Object.defineProperty(Element.prototype, 'clientWidth', saved.client);
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = saved.ro;
  });
  const resize = (next: Partial<Box>) => act(() => { Object.assign(box, next); for (const o of [...observers]) o(); });

  const Bar = () => (
    <div data-testid="frame">
      <Toolbar.Root aria-label="t">
        <Toolbar.Button>Keep</Toolbar.Button>
        <Toolbar.Button priority="low">Later</Toolbar.Button>
        <ToolbarIconButton label="settings" icon={<svg />} priority="low" />
      </Toolbar.Root>
    </div>
  );

  it('wide: low items stay inline (data-priority) and no overflow Menu renders', () => {
    Object.assign(box, { content: 300, avail: 600 });
    const { container } = render(<Bar />);
    expect(container.querySelectorAll('[data-priority="low"]')).toHaveLength(2);
    expect(container.querySelector('[data-ag-part="overflow"]')).toBeNull();
  });

  it('below its content width the low items move into a trailing Menu; roving order stays consistent', () => {
    Object.assign(box, { content: 300, avail: 600 });
    const { container } = render(<Bar />);
    resize({ avail: 299 });
    const root = screen.getByRole('toolbar');
    expect(container.querySelectorAll('[data-priority="low"]')).toHaveLength(0);
    const overflow = container.querySelector('[data-ag-part="overflow"]');
    expect(overflow).not.toBeNull();
    expect(overflow?.nextElementSibling).toBeNull();
    /* the trigger is a toolbar item: exactly one tab stop, inline items first */
    const buttons = [...root.querySelectorAll<HTMLElement>('button')];
    expect(buttons.map((b) => b.getAttribute('aria-label') ?? b.textContent)).toEqual(['Keep', 'More actions']);
    expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1);
    /* the bar shrank, but the remembered content width still exceeds the space */
    resize({ content: 120 });
    expect(container.querySelector('[data-ag-part="overflow"]')).not.toBeNull();
    /* room again: everything returns inline */
    resize({ avail: 300 });
    expect(container.querySelectorAll('[data-priority="low"]')).toHaveLength(2);
    expect(container.querySelector('[data-ag-part="overflow"]')).toBeNull();
  });

  it('a bar with no low items never shows the overflow Menu', () => {
    Object.assign(box, { content: 300, avail: 100 });
    const { container } = render(
      <div data-testid="frame">
        <Toolbar.Root aria-label="t"><Toolbar.Button>Only</Toolbar.Button></Toolbar.Root>
      </div>,
    );
    resize({});
    expect(container.querySelector('[data-ag-part="overflow"]')).toBeNull();
  });
});

describe('Toolbar keyboard (REQ-CMP-40)', () => {
  /* the roving stop is the single tabindex=0 item */
  const stop = () => screen.getAllByRole('button').filter((b) => b.tabIndex === 0).map((b) => b.textContent);

  it('disabled items are skipped by default; focusableWhenDisabled keeps them in the roving order', async () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.Button>One</Toolbar.Button>
        <Toolbar.Button disabled>Two</Toolbar.Button>
        <Toolbar.Button disabled focusableWhenDisabled>Three</Toolbar.Button>
        <Toolbar.Button>Four</Toolbar.Button>
      </Toolbar.Root>,
    );
    screen.getByRole('button', { name: 'One' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(stop()).toEqual(['Three']);
    await userEvent.keyboard('{ArrowRight}');
    expect(stop()).toEqual(['Four']);
    /* loop defaults to true */
    await userEvent.keyboard('{ArrowRight}');
    expect(stop()).toEqual(['One']);
    await userEvent.keyboard('{End}');
    expect(stop()).toEqual(['Four']);
    await userEvent.keyboard('{Home}');
    expect(stop()).toEqual(['One']);
  });

  it('loop={false} stops at the ends', async () => {
    render(
      <Toolbar.Root aria-label="t" loop={false}>
        <Toolbar.Button>One</Toolbar.Button>
        <Toolbar.Button>Two</Toolbar.Button>
      </Toolbar.Root>,
    );
    screen.getByRole('button', { name: 'One' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(stop()).toEqual(['Two']);
    await userEvent.keyboard('{ArrowRight}');
    expect(stop()).toEqual(['Two']);
  });
});
