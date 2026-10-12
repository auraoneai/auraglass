import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentedControl } from './index';

/* jsdom lacks PointerEvent; Base UI radio dispatches one on click. */
beforeAll(() => {
  if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

const Items = () => (
  <>
    <SegmentedControl.Item value="list">List</SegmentedControl.Item>
    <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
  </>
);

describe('SegmentedControl', () => {
  it('renders radiogroup semantics with parts', () => {
    render(
      <SegmentedControl.Root aria-label="View" name="view" defaultValue="list">
        <Items />
      </SegmentedControl.Root>,
    );
    const group = screen.getByRole('radiogroup', { name: 'View' });
    expect(group.getAttribute('data-ag-part')).toBe('root');
    expect(group.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(group.querySelectorAll('[data-ag-part="item-label"]')).toHaveLength(3);
  });

  it('single-select: choosing an item checks it and calls onValueChange', () => {
    const onValueChange = jest.fn();
    render(
      <SegmentedControl.Root aria-label="View" name="view" onValueChange={onValueChange}>
        <Items />
      </SegmentedControl.Root>,
    );
    const grid = screen.getByRole('radio', { name: 'Grid' });
    fireEvent.click(grid);
    expect(onValueChange).toHaveBeenCalledWith('grid', expect.anything());
  });

  it('defaultValue checks the initial item', () => {
    render(
      <SegmentedControl.Root aria-label="View" name="view" defaultValue="map">
        <Items />
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled item cannot be selected', () => {
    const onValueChange = jest.fn();
    render(
      <SegmentedControl.Root aria-label="View" name="view" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a" disabled>A</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'A' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('size emits data-ag-size', () => {
    render(
      <SegmentedControl.Root aria-label="View" name="view" size="sm">
        <Items />
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radiogroup').getAttribute('data-ag-size')).toBe('sm');
  });

  it('orientation=vertical emits data-orientation; indicator suppressed when supplied (REQ-CMP-41)', () => {
    const { container } = render(
      <SegmentedControl.Root aria-label="View" name="v" orientation="vertical" defaultValue="a">
        <SegmentedControl.Indicator className="custom-ind">!</SegmentedControl.Indicator>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(container.querySelector('[data-orientation="vertical"]')).not.toBeNull();
    const inds = container.querySelectorAll('[data-ag-part="indicator"]');
    expect(inds.length).toBe(1);
    expect(inds[0]?.classList.contains('custom-ind')).toBe(true);
  });
});

describe('REQ-CMP-42 indicator positioning', () => {
  it('checked item measurement sets --_ag-seg-* vars; animating flag settles', async () => {
    const { container } = render(
      <SegmentedControl.Root aria-label="View" name="v" defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    await new Promise((r) => setTimeout(r, 50));
    const root = container.querySelector('[data-ag-part="root"]') as HTMLElement;
    const checked = root.querySelector('[aria-checked="true"]');
    expect(checked).not.toBeNull();
    /* jsdom rect is 0-sized but the vars must be written */
    expect(root.style.getPropertyValue('--_ag-seg-w')).toMatch(/px/);
    /* select B -> animating flag appears then settles */
    const b = screen.getByRole('radio', { name: 'B' });
    fireEvent.click(b);
    await new Promise((r) => setTimeout(r, 80));
    expect(root.getAttribute('data-ag-animating')).toBeNull();
    const ind = root.querySelector('[data-ag-part="indicator"]') as HTMLElement;
    expect(ind.getAttribute('data-ag-animating')).toBeNull();
    expect(ind.getAttribute('data-ag-allow-nested')).toBeNull();
  });

  it('the moving indicator carries data-ag-animating + allow-nested until transitionend; the root never does', async () => {
    const proto = HTMLElement.prototype as unknown as { getAnimations?: () => unknown[] };
    const prev = proto.getAnimations;
    /* a running CSS transition on the indicator (jsdom has no animation engine) */
    proto.getAnimations = function getAnimations(this: HTMLElement) {
      return this.getAttribute('data-ag-part') === 'indicator' && this.hasAttribute('data-ag-animating') ? [{}] : [];
    };
    try {
      const { container } = render(
        <SegmentedControl.Root aria-label="View" name="v" defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
          <SegmentedControl.Item value="b">B</SegmentedControl.Item>
          <SegmentedControl.Item value="c">C</SegmentedControl.Item>
        </SegmentedControl.Root>,
      );
      const root = container.querySelector('[data-ag-part="root"]') as HTMLElement;
      const ind = root.querySelector('[data-ag-part="indicator"]') as HTMLElement;
      fireEvent.click(screen.getByRole('radio', { name: 'C' }));
      await new Promise((r) => setTimeout(r, 80));
      expect(ind.hasAttribute('data-ag-animating')).toBe(true);
      expect(ind.hasAttribute('data-ag-allow-nested')).toBe(true);
      expect(root.hasAttribute('data-ag-animating')).toBe(false);
      /* a bubbling transitionend from a child does not settle it */
      fireEvent.transitionEnd(screen.getByRole('radio', { name: 'C' }));
      expect(ind.hasAttribute('data-ag-animating')).toBe(true);
      fireEvent.transitionEnd(ind);
      expect(ind.hasAttribute('data-ag-animating')).toBe(false);
      expect(ind.hasAttribute('data-ag-allow-nested')).toBe(false);
    } finally {
      if (prev) proto.getAnimations = prev; else delete proto.getAnimations;
    }
  });

  it('calm/none jump: no animating flag, the indicator is measured directly', async () => {
    const { container } = render(
      <div data-ag-motion="calm">
        <SegmentedControl.Root aria-label="View" name="v" defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
          <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>,
    );
    const ind = container.querySelector('[data-ag-part="indicator"]') as HTMLElement;
    const seen: boolean[] = [];
    const mo = new MutationObserver(() => seen.push(ind.hasAttribute('data-ag-animating')));
    mo.observe(ind, { attributes: true });
    fireEvent.click(screen.getByRole('radio', { name: 'B' }));
    await new Promise((r) => setTimeout(r, 80));
    mo.disconnect();
    expect(seen.includes(true)).toBe(false);
  });
});

describe('REQ-MAT-48 morph owner', () => {
  it('indicator is a view-transition participant named from useId, sanitised to [a-z0-9-]', () => {
    const { container } = render(
      <>
        <SegmentedControl.Root aria-label="One" name="one" defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        </SegmentedControl.Root>
        <SegmentedControl.Root aria-label="Two" name="two" defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        </SegmentedControl.Root>
      </>,
    );
    const inds = [...container.querySelectorAll<HTMLElement>('[data-ag-part="indicator"]')];
    expect(inds).toHaveLength(2);
    const names = inds.map((el) => el.style.viewTransitionName);
    for (const [i, el] of inds.entries()) {
      expect(el.hasAttribute('data-ag-vt-participant')).toBe(true);
      expect(el.getAttribute('data-ag-layer')).toBe('transient');
      expect(el.getAttribute('data-ag-shape')).toBe('concentric');
      expect(names[i]).toMatch(/^ag-segmented-indicator-[a-z0-9-]+$/);
    }
    expect(new Set(names).size).toBe(2);
  });
});

describe('REQ-CMP-44', () => {
  it('auto title from string children when no title given', () => {
    render(
      <SegmentedControl.Root aria-label="v" name="v" defaultValue="a">
        <SegmentedControl.Item value="a">Alpha</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('title', 'Alpha');
  });

  it('warns once when >5 items at ≤390px (mocked RO)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    class RO {
      cb: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) { this.cb = cb; }
      observe(el: Element) {
        this.cb([{ contentRect: { width: 390 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
      }
      unobserve() {}
      disconnect() {}
    }
    const prev = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
    try {
      render(
        <SegmentedControl.Root aria-label="v" name="v" defaultValue="a">
          {['a','b','c','d','e','f'].map((v) => (
            <SegmentedControl.Item key={v} value={v}>{v}</SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>,
      );
      const calls = warn.mock.calls.filter((c) => String(c[0]).includes('prefer Select'));
      expect(calls).toHaveLength(1);
    } finally {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = prev;
      warn.mockRestore();
    }
  });
});
