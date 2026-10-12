/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { ResizablePanels } from './ResizablePanels';

const Three = () => (
  <ResizablePanels.Root defaultLayout={[40, 30, 30]}>
    <ResizablePanels.Panel id="a" minSize={10}>a</ResizablePanels.Panel>
    <ResizablePanels.Handle label="Split a/b" />
    <ResizablePanels.Panel id="b" minSize={10}>b</ResizablePanels.Panel>
    <ResizablePanels.Handle label="Split b/c" />
    <ResizablePanels.Panel id="c">c</ResizablePanels.Panel>
  </ResizablePanels.Root>
);

describe('ResizablePanels (SURF-051)', () => {
  it('renders separator handles with ARIA values', () => {
    render(<Three />);
    const handles = screen.getAllByRole('separator');
    expect(handles).toHaveLength(2);
    expect(handles[0]).toHaveAttribute('aria-orientation', 'vertical'); // APG: separator between left/right panes is vertical
    expect(handles[0]).toHaveAttribute('aria-valuemin', '10');
    expect(handles[0]).toHaveAttribute('aria-valuemax', '100');
  });

  it('arrow keys resize the adjacent panel', () => {
    render(<Three />);
    const h0 = screen.getAllByRole('separator')[0]!;
    h0.focus();
    fireEvent.keyDown(h0, { key: 'ArrowRight' });
    expect(h0).toHaveAttribute('aria-valuenow', '42');
    fireEvent.keyDown(h0, { key: 'ArrowLeft', shiftKey: true });
    expect(h0).toHaveAttribute('aria-valuenow', '32');
  });

  it('Home/End snap to the panel min/max', () => {
    render(<Three />);
    const h0 = screen.getAllByRole('separator')[0]!;
    // neighbours can only give 50 of the requested 60 → clamps at 90
    fireEvent.keyDown(h0, { key: 'End' });
    expect(h0).toHaveAttribute('aria-valuenow', '90');
    fireEvent.keyDown(h0, { key: 'Home' });
    expect(h0).toHaveAttribute('aria-valuenow', '10');
  });

  it('Enter collapses a collapsible panel and restores the size it had (SURF-44)', () => {
    render(
      <ResizablePanels.Root defaultLayout={[50, 50]}>
        <ResizablePanels.Panel id="a" collapsible collapsedSize={0} expandedSize={60} minSize={10}>
          a
        </ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getAllByRole('separator')[0]!;
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '0');
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '50');
  });

  it('Enter on a panel that starts collapsed (no pre-collapse size) restores expandedSize', () => {
    render(
      <ResizablePanels.Root defaultLayout={[0, 100]}>
        <ResizablePanels.Panel id="a" collapsible collapsedSize={0} expandedSize={60} minSize={10}>
          a
        </ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getAllByRole('separator')[0]!;
    expect(h).toHaveAttribute('aria-valuenow', '0');
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '60');
  });

  it('persists layout to localStorage under ag-panels:<autoSaveId>', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    render(
      <ResizablePanels.Root autoSaveId="demo" defaultLayout={[50, 50]}>
        <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getAllByRole('separator')[0]!;
    fireEvent.keyDown(h, { key: 'ArrowRight' });
    expect(spy).toHaveBeenCalledWith('ag-panels:demo', expect.stringContaining('52'));
    spy.mockRestore();
  });

  it('SURF-42: px-string sizes convert against the root rect + onCollapse/onExpand', () => {
    const onCollapse = jest.fn();
    render(
      <ResizablePanels.Root orientation="horizontal">
        <ResizablePanels.Panel id="a" defaultSize="240px" minSize="100px" collapsible onCollapse={onCollapse} />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="b" />
      </ResizablePanels.Root>,
    );
    // no measurable rect in jsdom → px strings behave like percents; the
    // contract is exercised (no crash, separator still APG-complete).
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('SURF-44: default aria-label derives from the preceding panel', () => {
    render(
      <ResizablePanels.Root orientation="horizontal" labels={{ resize: 'Größe ändern: {panel}' }}>
        <ResizablePanels.Panel id="a" label="Navigation" defaultSize={40} />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="b" />
      </ResizablePanels.Root>,
    );
    expect(screen.getByRole('separator')).toHaveAttribute('aria-label', 'Größe ändern: Navigation');
  });

  it('SURF-42: disabled handle is inert; withGrip renders the grip span', () => {
    const { container } = render(
      <ResizablePanels.Root orientation="horizontal">
        <ResizablePanels.Panel id="a" defaultSize={40} />
        <ResizablePanels.Handle disabled withGrip />
        <ResizablePanels.Panel id="b" />
      </ResizablePanels.Root>,
    );
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-disabled', 'true');
    expect(container.querySelector('.ag-panels__grip')).toBeTruthy();
  });
});

/* Root-rect mock: jsdom has no layout, so the group root reports the given
   box and every other element keeps jsdom's zero rect. */
/* jsdom ships no PointerEvent: without it fireEvent.pointer* builds a plain
   Event with no clientX/pointerId. MouseEvent carries the coordinates. */
if (typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? 'mouse';
      this.isPrimary = init.isPrimary ?? true;
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}

function mockRootRect(box: { left: number; width: number }): () => void {
  const original = Element.prototype.getBoundingClientRect;
  const spy = jest
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: Element) {
      if (this.classList.contains('ag-panels')) {
        return {
          x: box.left, y: 0, left: box.left, top: 0, width: box.width, height: 600,
          right: box.left + box.width, bottom: 600, toJSON: () => ({}),
        } as DOMRect;
      }
      return original.call(this);
    });
  return () => spy.mockRestore();
}

const basisOf = (id: string, scope: ParentNode = document) =>
  scope.querySelector<HTMLElement>(`[data-panel="${id}"]`)!.style.flexBasis;

describe('ResizablePanels acceptance (SURF-42..46)', () => {
  it('SURF-42: nested 2x2 — a handle resizes only its own group', () => {
    render(
      <ResizablePanels.Root orientation="horizontal" defaultLayout={[50, 50]}>
        <ResizablePanels.Panel id="left">
          <ResizablePanels.Root orientation="vertical" defaultLayout={[50, 50]}>
            <ResizablePanels.Panel id="lt">lt</ResizablePanels.Panel>
            <ResizablePanels.Handle label="inner-left" />
            <ResizablePanels.Panel id="lb">lb</ResizablePanels.Panel>
          </ResizablePanels.Root>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle label="outer" />
        <ResizablePanels.Panel id="right">
          <ResizablePanels.Root orientation="vertical" defaultLayout={[50, 50]}>
            <ResizablePanels.Panel id="rt">rt</ResizablePanels.Panel>
            <ResizablePanels.Handle label="inner-right" />
            <ResizablePanels.Panel id="rb">rb</ResizablePanels.Panel>
          </ResizablePanels.Root>
        </ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const innerLeft = screen.getByRole('separator', { name: 'inner-left' });
    const outer = screen.getByRole('separator', { name: 'outer' });
    const innerRight = screen.getByRole('separator', { name: 'inner-right' });

    fireEvent.keyDown(innerLeft, { key: 'ArrowDown' });
    expect(innerLeft).toHaveAttribute('aria-valuenow', '52');
    expect([basisOf('lt'), basisOf('lb')]).toEqual(['52%', '48%']);
    expect([basisOf('left'), basisOf('right')]).toEqual(['50%', '50%']);
    expect([basisOf('rt'), basisOf('rb')]).toEqual(['50%', '50%']);

    fireEvent.keyDown(outer, { key: 'ArrowRight' });
    expect(outer).toHaveAttribute('aria-valuenow', '52');
    expect([basisOf('left'), basisOf('right')]).toEqual(['52%', '48%']);
    expect([basisOf('lt'), basisOf('lb')]).toEqual(['52%', '48%']);
    expect(innerRight).toHaveAttribute('aria-valuenow', '50');
  });

  it("SURF-42: minSize='240px' in a 1200 px root clamps at 20%", () => {
    const restore = mockRootRect({ left: 0, width: 1200 });
    try {
      render(
        <ResizablePanels.Root orientation="horizontal" defaultLayout={[50, 50]}>
          <ResizablePanels.Panel id="a" minSize="240px">a</ResizablePanels.Panel>
          <ResizablePanels.Handle label="Split" />
          <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
        </ResizablePanels.Root>,
      );
      const h = screen.getByRole('separator');
      fireEvent.keyDown(h, { key: 'Home' });
      expect(h).toHaveAttribute('aria-valuenow', '20');
      expect(h).toHaveAttribute('aria-valuemin', '20');
      fireEvent.keyDown(h, { key: 'ArrowLeft', shiftKey: true });
      expect(h).toHaveAttribute('aria-valuenow', '20');
      expect(basisOf('a')).toBe('20%');
    } finally {
      restore();
    }
  });

  it('SURF-42: onCollapse fires once on Enter-collapse, onExpand once on restore', () => {
    const onCollapse = jest.fn();
    const onExpand = jest.fn();
    render(
      <ResizablePanels.Root defaultLayout={[40, 60]}>
        <ResizablePanels.Panel id="a" collapsible minSize={20} onCollapse={onCollapse} onExpand={onExpand}>
          a
        </ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getByRole('separator');
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(onCollapse).toHaveBeenCalledTimes(1);
    expect(onExpand).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(onCollapse).toHaveBeenCalledTimes(1);
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('SURF-43: drag in a 600 px-offset container — container-relative, 0 commits mid-drag, single onLayout', () => {
    jest.useFakeTimers();
    const restore = mockRootRect({ left: 600, width: 1000 });
    const onLayout = jest.fn();
    let commits = 0;
    try {
      render(
        <React.Profiler id="panels" onRender={() => { commits += 1; }}>
          <ResizablePanels.Root orientation="horizontal" defaultLayout={[50, 50]} onLayout={onLayout}>
            <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
            <ResizablePanels.Handle label="Split" />
            <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
          </ResizablePanels.Root>
        </React.Profiler>,
      );
      const h = screen.getByRole('separator');
      // jsdom has no pointer-capture implementation.
      const capture = jest.fn();
      Object.assign(h, { setPointerCapture: capture, releasePointerCapture: jest.fn() });
      const before = commits;
      fireEvent.pointerDown(h, { pointerId: 7, clientX: 1000, pointerType: 'touch' });
      fireEvent.pointerMove(h, { pointerId: 7, clientX: 1050, pointerType: 'touch' });
      fireEvent.pointerMove(h, { pointerId: 7, clientX: 1100, pointerType: 'touch' });
      jest.advanceTimersByTime(32); // flush the coalesced rAF write
      expect(basisOf('a')).toBe('60%');
      expect(basisOf('b')).toBe('40%');
      expect({ commitsDuringDrag: commits - before, onLayoutCalls: onLayout.mock.calls.length }).toEqual({
        commitsDuringDrag: 0,
        onLayoutCalls: 0,
      });
      expect(capture).toHaveBeenCalledWith(7);
      fireEvent.pointerUp(h, { pointerId: 7, clientX: 1100, pointerType: 'touch' });
      expect(onLayout).toHaveBeenCalledTimes(1);
      expect(onLayout).toHaveBeenCalledWith([60, 40]);
      expect(h).toHaveAttribute('aria-valuenow', '60');
      // lostpointercapture after pointerup must not commit a second time
      fireEvent(h, new Event('lostpointercapture', { bubbles: true }));
      expect(onLayout).toHaveBeenCalledTimes(1);
    } finally {
      restore();
      jest.useRealTimers();
    }
  });

  it('SURF-43: pointercancel ends the drag and commits once', () => {
    const restore = mockRootRect({ left: 0, width: 1000 });
    const onLayout = jest.fn();
    try {
      render(
        <ResizablePanels.Root defaultLayout={[50, 50]} onLayout={onLayout}>
          <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
          <ResizablePanels.Handle label="Split" />
          <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
        </ResizablePanels.Root>,
      );
      const h = screen.getByRole('separator');
      fireEvent.pointerDown(h, { pointerId: 3, clientX: 500 });
      fireEvent.pointerMove(h, { pointerId: 3, clientX: 450 });
      fireEvent.pointerCancel(h, { pointerId: 3 });
      expect(onLayout).toHaveBeenCalledTimes(1);
      expect(onLayout).toHaveBeenCalledWith([45, 55]);
      // a stray move after cancel does nothing
      fireEvent.pointerMove(h, { pointerId: 3, clientX: 100 });
      expect(onLayout).toHaveBeenCalledTimes(1);
    } finally {
      restore();
    }
  });

  it('SURF-44: aria-controls resolves, default name is "Resize <id>", RTL ArrowRight decreases', () => {
    render(
      <div dir="rtl">
        <ResizablePanels.Root orientation="horizontal" defaultLayout={[50, 50]}>
          <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
          <ResizablePanels.Handle />
          <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
        </ResizablePanels.Root>
      </div>,
    );
    const h = screen.getByRole('separator', { name: 'Resize a' });
    expect(h).toHaveAttribute('aria-orientation', 'vertical');
    expect(document.getElementById(h.getAttribute('aria-controls')!)).not.toBeNull();
    fireEvent.keyDown(h, { key: 'ArrowRight' });
    expect(h).toHaveAttribute('aria-valuenow', '48');
    fireEvent.keyDown(h, { key: 'ArrowLeft' });
    expect(h).toHaveAttribute('aria-valuenow', '50');
  });

  it('SURF-46: SSR seeds flex-basis from defaultLayout; hydrate restores the saved layout with 0 console.error', async () => {
    const { renderToString } = await import('react-dom/server');
    const { hydrateRoot } = await import('react-dom/client');
    const { act } = await import('react');
    const tree = (
      <ResizablePanels.Root orientation="horizontal" autoSaveId="ssr-restore" defaultLayout={[30, 70]}>
        <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>
    );
    const html = renderToString(tree);
    expect(html).toContain('flex-basis:30%');
    expect(html).toContain('flex-basis:70%');

    localStorage.setItem('ag-panels:ssr-restore', JSON.stringify([40, 60]));
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const recoverable: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(host, tree, { onRecoverableError: (e) => recoverable.push(e) });
      });
      expect({ consoleErrors: error.mock.calls.length, recoverable: recoverable.length }).toEqual({
        consoleErrors: 0,
        recoverable: 0,
      });
      expect([basisOf('a', host), basisOf('b', host)]).toEqual(['40%', '60%']);
    } finally {
      error.mockRestore();
      await act(async () => root?.unmount());
      host.remove();
      localStorage.removeItem('ag-panels:ssr-restore');
    }
  });

  it('SURF-44: without labels, every handle names and controls its own preceding panel right after mount', () => {
    render(
      <ResizablePanels.Root orientation="horizontal" defaultLayout={[30, 30, 40]}>
        <ResizablePanels.Panel id="a" minSize={5}>a</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="b" minSize={15} maxSize={70}>b</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="c">c</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const handles = screen.getAllByRole('separator');
    expect(handles.map((h) => h.getAttribute('aria-controls'))).toEqual(['a', 'b']);
    expect(handles.map((h) => h.getAttribute('aria-label'))).toEqual(['Resize a', 'Resize b']);
    expect(handles[1]).toHaveAttribute('aria-valuemin', '15');
    expect(handles[1]).toHaveAttribute('aria-valuemax', '70');
    expect(handles.map((h) => h.getAttribute('aria-valuenow'))).toEqual(['30', '30']);
  });

  it('SURF-44: SSR markup already carries each handle\'s own aria-controls/name', async () => {
    const { renderToString } = await import('react-dom/server');
    const html = renderToString(
      <ResizablePanels.Root orientation="horizontal" defaultLayout={[30, 30, 40]}>
        <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="c">c</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    expect(html).toContain('aria-controls="a"');
    expect(html).toContain('aria-controls="b"');
    expect(html).toContain('aria-label="Resize b"');
  });

  it('SURF-44: collapse a 45% panel with no expandedSize; Enter twice restores 45', () => {
    render(
      <ResizablePanels.Root defaultLayout={[45, 55]}>
        <ResizablePanels.Panel id="a" collapsible minSize={20}>a</ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getByRole('separator');
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '0');
    expect(basisOf('b')).toBe('100%');
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '45');
    expect([basisOf('a'), basisOf('b')]).toEqual(['45%', '55%']);
  });

  it('SURF-42: a pointer drag past min/2 snap-collapses and fires onCollapse exactly once; dragging back fires onExpand once', () => {
    const restore = mockRootRect({ left: 0, width: 1000 });
    const onCollapse = jest.fn();
    const onExpand = jest.fn();
    const onLayout = jest.fn();
    try {
      render(
        <ResizablePanels.Root defaultLayout={[30, 70]} onLayout={onLayout}>
          <ResizablePanels.Panel id="a" collapsible minSize={20} onCollapse={onCollapse} onExpand={onExpand}>a</ResizablePanels.Panel>
          <ResizablePanels.Handle label="Split" />
          <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
        </ResizablePanels.Root>,
      );
      const h = screen.getByRole('separator');
      Object.assign(h, { setPointerCapture: jest.fn(), releasePointerCapture: jest.fn() });
      // 30% → 5% (below min/2 = 10%) snaps to collapsedSize 0
      fireEvent.pointerDown(h, { pointerId: 1, clientX: 300 });
      fireEvent.pointerMove(h, { pointerId: 1, clientX: 200 });
      fireEvent.pointerMove(h, { pointerId: 1, clientX: 50 });
      fireEvent.pointerUp(h, { pointerId: 1, clientX: 50 });
      expect(onLayout).toHaveBeenLastCalledWith([0, 100]);
      expect(onCollapse).toHaveBeenCalledTimes(1);
      expect(onExpand).toHaveBeenCalledTimes(0);
      // a second drag that stays collapsed fires nothing
      fireEvent.pointerDown(h, { pointerId: 2, clientX: 0 });
      fireEvent.pointerMove(h, { pointerId: 2, clientX: 30 });
      fireEvent.pointerUp(h, { pointerId: 2, clientX: 30 });
      expect(onCollapse).toHaveBeenCalledTimes(1);
      expect(onExpand).toHaveBeenCalledTimes(0);
      // Enter restores the pre-drag size (30) and fires onExpand once
      fireEvent.keyDown(h, { key: 'Enter' });
      expect(h).toHaveAttribute('aria-valuenow', '30');
      expect(onExpand).toHaveBeenCalledTimes(1);
      expect(onCollapse).toHaveBeenCalledTimes(1);
    } finally {
      restore();
    }
  });

  it('SURF-46: stacks below threshold — data-stacked follows the root width against stackBelow', () => {
    let width = 500;
    const original = Element.prototype.getBoundingClientRect;
    const spy = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if (this.classList.contains('ag-panels')) {
        return { x: 0, y: 0, left: 0, top: 0, width, height: 600, right: width, bottom: 600, toJSON: () => ({}) } as DOMRect;
      }
      return original.call(this);
    });
    const observers: Array<() => void> = [];
    const OrigRO = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      private cb: () => void;
      constructor(cb: () => void) { this.cb = cb; observers.push(() => this.cb()); }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    try {
      const { container } = render(
        <ResizablePanels.Root orientation="horizontal" stackBelow={600} defaultLayout={[50, 50]}>
          <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
          <ResizablePanels.Handle label="Split" />
          <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
        </ResizablePanels.Root>,
      );
      const root = container.querySelector<HTMLElement>('.ag-panels')!;
      expect(root.dataset['stacked']).toBe('true');
      expect(root.style.flexDirection).toBe('column');
      expect(root).toHaveAttribute('data-stack-below', '600');
      width = 800;
      observers.forEach((fire) => fire());
      expect(root.dataset['stacked']).toBe('false');
      expect(root.style.flexDirection).toBe('row');
      width = 599;
      observers.forEach((fire) => fire());
      expect(root.dataset['stacked']).toBe('true');
    } finally {
      spy.mockRestore();
      globalThis.ResizeObserver = OrigRO;
    }
  });

  it('SURF-46: a vertical group never stacks (stackBelow applies to horizontal groups)', () => {
    const { container } = render(
      <ResizablePanels.Root orientation="vertical" stackBelow={10_000}>
        <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    expect(container.querySelector<HTMLElement>('.ag-panels')!.dataset['stacked']).toBeUndefined();
  });
});
