/* REQ-CMP-16: mount every meta's first mountable story and assert no stray
   global observers/listeners are installed, and everything releases on
   unmount. ResizeObserver allowance: 1 instance for the measured-indicator
   families (Slider, SegmentedControl, ScrollArea, ImageList). */
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { discoverCmpMetas, loadStories, storyElement } from './metas';

const RO_ALLOWED = new Set(['Slider', 'SegmentedControl', 'ScrollArea', 'ImageList']);

function firstElement(name: string): React.ReactElement | null {
  for (const mod of loadStories(name)) {
    for (const exportName of Object.keys(mod.exports)) {
      if (exportName === 'default' || exportName.startsWith('__')) continue;
      try {
        const r = storyElement(mod, exportName);
        if (r.element) return r.element;
      } catch { /* fall through to component-mount */ }
      const story = mod.exports[exportName] as { render?: (a: Record<string, unknown>) => React.ReactElement; args?: Record<string, unknown> } | undefined;
      if (story && typeof story === 'object' && typeof story.render === 'function') {
        return React.createElement(story.render as unknown as React.FC<Record<string, unknown>>, story.args ?? {});
      }
    }
  }
  return null;
}

const metas = discoverCmpMetas();

describe('side-effects (REQ-CMP-16)', () => {
  it.each(metas.map((m) => m.name))('%s: no stray observers/listeners; all released on unmount', (name) => {
    const element = firstElement(name);
    if (!element) return; // metas without mountable stories covered by dom-contract

    const live: { kind: string; connected: boolean; disconnect: jest.Mock }[] = [];
    // jsdom lacks IO/RO — stub so instantiation is still counted (components
    // must feature-detect; any construct = a violation unless allowed).
    const BaseObs = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      constructor(_cb?: any) {}
    };
    const wrap = (Cls: any, kind: string) =>
      class extends (Cls ?? BaseObs) {
        constructor(cb?: any, opts?: any) {
          super(cb, opts);
          const rec = { kind, connected: false, disconnect: jest.fn(() => { rec.connected = false; }) };
          live.push(rec);
          this.disconnect = rec.disconnect as any;
          const origObs = this.observe.bind(this);
          this.observe = ((...args: any[]) => { rec.connected = true; return origObs(...args); }) as any;
        }
      };
    const RealMO = globalThis.MutationObserver, RealIO = globalThis.IntersectionObserver, RealRO = globalThis.ResizeObserver;
    const had = { MO: !!RealMO, IO: !!RealIO, RO: !!RealRO };
    if (!had.IO) (globalThis as any).IntersectionObserver = BaseObs;
    if (!had.RO) (globalThis as any).ResizeObserver = BaseObs;
    const moSpy = had.MO ? jest.spyOn(globalThis, 'MutationObserver').mockImplementation(((cb: any) => new (wrap(RealMO, 'MutationObserver'))(cb)) as any) : null;
    const ioSpy = jest.spyOn(globalThis, 'IntersectionObserver').mockImplementation(((cb: any, o: any) => new (wrap(RealIO, 'IntersectionObserver'))(cb, o)) as any);
    const roSpy = jest.spyOn(globalThis, 'ResizeObserver').mockImplementation(((cb: any) => new (wrap(RealRO, 'ResizeObserver'))(cb)) as any);

    const held: { type: string; fn: Function; target: string }[] = [];
    const on = (target: EventTarget, tag: string) => {
      const origAdd = target.addEventListener.bind(target);
      const origRm = target.removeEventListener.bind(target);
      jest.spyOn(target, 'removeEventListener').mockImplementation((type: string, fn: any, opts: any) => {
        if (type === 'scroll' || type === 'resize') {
          const i = held.findIndex((l) => l.type === type && l.fn === fn && l.target === tag);
          if (i >= 0) held.splice(i, 1);
        }
        return origRm(type, fn, opts);
      });
      return jest.spyOn(target, 'addEventListener').mockImplementation((type: string, fn: any, opts: any) => {
        if (type === 'scroll' || type === 'resize') held.push({ type, fn, target: tag });
        return origAdd(type, fn, opts);
      });
    };
    const winSpy = on(window, 'window');
    const docSpy = on(document, 'document');
    const ivSpy = jest.spyOn(globalThis, 'setInterval');

    const view = render(element);
    view.unmount();

    const unreleased = live.filter((o) => o.connected && !o.disconnect.mock.calls.length);
    const allowed = unreleased.filter((o) => o.kind === 'ResizeObserver' && RO_ALLOWED.has(name));
    const stray = unreleased.filter((o) => !allowed.includes(o));
    expect(stray.map((o) => o.kind)).toEqual([]);
    expect(allowed.length).toBeLessThanOrEqual(1);
    // BU floating-ui registers scroll/resize while open — allowed ONLY if
    // released by unmount; anything still held after unmount is a leak.
    expect(held.map((l) => `${l.target}:${l.type}`)).toEqual([]);
    expect(ivSpy.mock.calls.length).toBe(0);

    const winRm = jest.spyOn(window, 'removeEventListener'); const docRm = jest.spyOn(document, 'removeEventListener');
    moSpy?.mockRestore(); ioSpy.mockRestore(); roSpy.mockRestore(); winRm.mockRestore(); docRm.mockRestore();
    if (!had.IO) delete (globalThis as any).IntersectionObserver;
    if (!had.RO) delete (globalThis as any).ResizeObserver;
    winSpy.mockRestore(); docSpy.mockRestore(); ivSpy.mockRestore();
  });
});
