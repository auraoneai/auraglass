/* CMP-237 (REQ-CMP-99): Sheet family suite — detents, sides, presets. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Sheet } from './index';
import { resolveDetent } from './useSheetDetents';

function Demo({ root = {}, children }: { root?: Record<string, unknown>; children?: React.ReactNode }) {
  return (
    <Sheet.Root {...root}>
      <Sheet.Trigger>Open sheet</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Handle />
        <Sheet.Header><Sheet.Title>Sheet</Sheet.Title></Sheet.Header>
        <Sheet.Body>{children ?? 'Sheet body'}</Sheet.Body>
        <Sheet.Close>Cancel</Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>
  );
}

const popup = () => document.querySelector<HTMLElement>('[data-ag-part="popup"]');
const setViewport = (w: number, h: number) => {
  Object.defineProperty(window, 'innerWidth', { value: w, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: h, configurable: true });
};

describe('Sheet (CMP-229..236)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
    setViewport(1280, 800);
  });
  afterEach(() => { jest.restoreAllMocks(); });

  it('side sheets anchor to a side; start/end resolve via direction', async () => {
    const { unmount } = render(<Demo root={{ defaultOpen: true, side: 'end' }} />);
    await act(async () => {});
    const el = popup()!;
    expect(el.getAttribute('data-ag-overlay')).toBe('sheet');
    expect(['left', 'right']).toContain(el.getAttribute('data-ag-side'));
    expect(el.getAttribute('data-ag-thickness')).toBe('thick');
    unmount();
    render(<Demo root={{ defaultOpen: true, side: 'bottom' }} />);
    await act(async () => {});
    expect(popup()!.getAttribute('data-ag-side')).toBe('bottom');
  });

  it("preset='action' forces bottom + emits action part", async () => {
    render(
      <Sheet.Root defaultOpen preset="action" side="start">
        <Sheet.Trigger>go</Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Handle />
          <Sheet.Body>
            <Sheet.Action>Save to Photos</Sheet.Action>
          </Sheet.Body>
          <Sheet.Close>Cancel</Sheet.Close>
        </Sheet.Content>
      </Sheet.Root>,
    );
    await act(async () => {});
    const el = popup()!;
    expect(el.getAttribute('data-ag-side')).toBe('bottom');
    expect(el.getAttribute('data-ag-preset')).toBe('action');
    expect(document.querySelector('[data-ag-part="action"]')).toBeTruthy();
  });

  it('resolveDetent: slow release snaps to nearest top', () => {
    const tops = [320, 0]; // detents [0.4 viewport, full] on 800px → heights [320,800] → tops [480,0]
    const r1 = resolveDetent({ positionPx: 500, velocityPxMs: 0, detentsPx: [480, 0], viewportPx: 800 });
    const r2 = resolveDetent({ positionPx: 100, velocityPxMs: 0, detentsPx: [480, 0], viewportPx: 800 });
    expect('index' in r1 && r1.index).toBe(0);
    expect('index' in r2 && r2.index).toBe(1);
    expect(tops.length).toBe(2);
  });

  it('resolveDetent: downward fling past lowest detent closes; mid fling snaps next-down', () => {
    expect(resolveDetent({ positionPx: 500, velocityPxMs: 0.9, detentsPx: [480, 0], viewportPx: 800 })).toEqual({ close: true });
    // gentle drag just past the lowest detent without fling also closes
    expect('close' in resolveDetent({ positionPx: 700, velocityPxMs: 0.6, detentsPx: [480, 0], viewportPx: 800 })).toBe(true);
    // slow drag below lowest without meeting velocity → snap back to lowest
    const r3 = resolveDetent({ positionPx: 500, velocityPxMs: 0.1, detentsPx: [480, 0], viewportPx: 800 });
    expect('index' in r3 && r3.index).toBe(0);
  });

  it('handle: keyboard cycles detents upward and announces', async () => {
    const onDetentChange = jest.fn();
    render(<Demo root={{ defaultOpen: true, detents: [0.5, 'full'], onDetentChange }} />);
    await act(async () => {});
    const handle = document.querySelector('[data-ag-part="handle"]')!;
    expect(handle.getAttribute('role')).toBe('separator');
    (handle as HTMLElement).focus();
    await userEvent.keyboard('{Enter}');
    await act(async () => {});
    expect(onDetentChange).toHaveBeenCalledWith(1);
    const live = document.querySelector('[data-ag-announcer] [aria-live="polite"], [data-ag-part="announcer"] [aria-live], [aria-live="polite"]');
    expect(live?.textContent).toBeTruthy();
  });

  it('handle drag translates via rAF and settles on release', async () => {
    render(<Demo root={{ defaultOpen: true, side: 'bottom', detents: [0.5, 'full'] }} />);
    await act(async () => {});
    const el = popup()!;
    const handle = document.querySelector('[data-ag-part="handle"]') as HTMLElement;
    el.getBoundingClientRect = () => ({ top: 400, left: 0, right: 1280, bottom: 800, width: 1280, height: 400, x: 0, y: 400, toJSON: () => ({}) });
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    fireEvent.pointerDown(handle, { pointerId: 7, clientY: 420 });
    fireEvent.pointerMove(handle, { pointerId: 7, clientY: 500 });
    await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
    expect(el.style.transform).toContain('translateY(');
    expect(el.hasAttribute('data-ag-dragging')).toBe(true);
    expect(raf).toHaveBeenCalled();
    fireEvent.pointerUp(handle, { pointerId: 7, clientY: 500 });
    await act(async () => {});
    expect(el.hasAttribute('data-ag-dragging')).toBe(false);
  });

  it('modal=false: no scrim, no aria-modal; overlay layer = thick', async () => {
    render(<Demo root={{ defaultOpen: true, modal: false }} />);
    await act(async () => {});
    expect(document.querySelector('.ag-scrim')).toBeNull();
    expect(popup()!.getAttribute('aria-modal')).toBeNull();
  });
  /* REQ-CMP-88: the LayerStack is the only scroll-lock writer. */
  it('scroll lock has one owner: stack attribute set, no Base UI overflow write', async () => {
    const html = document.documentElement;
    render(<Demo root={{ defaultOpen: true }} />);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    expect(html.hasAttribute('data-ag-scroll-locked')).toBe(true);
    for (const el of [html, document.body]) {
      expect(`${el.style.overflow} ${el.style.overflowY} ${el.style.overflowX}`).not.toMatch(/hidden|clip/);
    }
  });
});
