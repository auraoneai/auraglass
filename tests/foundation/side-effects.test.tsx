/* REQ-CMP-16: mount every meta's first mountable story and assert
   - mounted and idle (after settle, before unmount) with popups closed: no
     live MutationObserver, IntersectionObserver or setInterval, and no
     window/document scroll or resize listener; ResizeObserver allowance: 1
     instance for the measured-indicator families (Slider, SegmentedControl,
     ScrollArea, ImageList). A story that renders an open popup may hold Base
     UI positioner observers until it closes, so its mounted check is skipped
     (the closed cases below cover those families at rest);
   - everything releases on unmount.
   The mounted check counts what CMP code creates. Observers created by the
   AuraGlassProvider the stories mount (src/theme, src/material/dev: theme
   attribute sync and the dev surface counter — not a component) and by Base
   UI internals CMP cannot configure (CompositeList's item-order observer on
   composites, ToastContent while a toast is visible, the ScrollArea
   viewport's and TabsList's own measurement observers) are attributed by construction stack
   and excluded there. The unmount leak check counts everything. */
import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { discoverCmpMetas, loadStories, storyElement } from './metas';
import { Popover } from '../../src/components/popover';
import { Tooltip } from '../../src/components/tooltip';
import { Menu } from '../../src/components/menu';
import { Dialog } from '../../src/components/dialog';

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

type Owner = 'cmp' | 'provider' | 'base-ui';
/** Attribute an observer to the code that constructed it (first in-repo or
    Base UI frame of the construction stack). */
const BASE_UI_INTERNALS = /@base-ui\/react\/(internals\/composite\/list\/CompositeList|toast\/content\/ToastContent|scroll-area\/viewport\/ScrollAreaViewport|tabs\/list\/TabsList)\./;
function ownerOf(stack: string): Owner {
  for (const line of stack.split('\n').slice(1)) {
    if (/side-effects\.test|node_modules\/(jest|@jest|jsdom|react-dom|react\/)/.test(line)) continue;
    if (BASE_UI_INTERNALS.test(line)) return 'base-ui';
    if (/\/src\/(theme|material\/dev)\//.test(line)) return 'provider';
    if (/\/src\//.test(line)) return 'cmp';
  }
  return 'cmp';
}

interface Probe {
  /** CMP-created observers observing right now (connected and not disconnected) */
  liveObservers: () => string[];
  /** observers still connected that were never disconnected (post-unmount leak check) */
  unreleased: () => string[];
  /** window/document scroll + resize listeners currently held */
  heldListeners: () => string[];
  /** setInterval ids not cleared */
  liveIntervals: () => number;
  restore: () => void;
}

function instrument(): Probe {
  // jsdom has no Element.getAnimations; Base UI's ScrollArea calls it once settled
  const hadGetAnimations = typeof (Element.prototype as { getAnimations?: unknown }).getAnimations === 'function';
  if (!hadGetAnimations) (Element.prototype as unknown as { getAnimations: () => Animation[] }).getAnimations = () => [];
  const live: { kind: string; owner: Owner; connected: boolean; disconnect: jest.Mock }[] = [];
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
        const rec = { kind, owner: ownerOf(new Error().stack ?? ''), connected: false, disconnect: jest.fn(() => { rec.connected = false; }) };
        live.push(rec);
        const origDisconnect = this.disconnect.bind(this);
        this.disconnect = ((...a: any[]) => { rec.disconnect(); return origDisconnect(...a); }) as any;
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
  const spies: { mockRestore: () => void }[] = [];
  const on = (target: EventTarget, tag: string) => {
    const origAdd = target.addEventListener.bind(target);
    const origRm = target.removeEventListener.bind(target);
    spies.push(jest.spyOn(target, 'removeEventListener').mockImplementation((type: string, fn: any, opts: any) => {
      if (type === 'scroll' || type === 'resize') {
        const i = held.findIndex((l) => l.type === type && l.fn === fn && l.target === tag);
        if (i >= 0) held.splice(i, 1);
      }
      return origRm(type, fn, opts);
    }));
    spies.push(jest.spyOn(target, 'addEventListener').mockImplementation((type: string, fn: any, opts: any) => {
      if (type === 'scroll' || type === 'resize') held.push({ type, fn, target: tag });
      return origAdd(type, fn, opts);
    }));
  };
  on(window, 'window');
  on(document, 'document');

  const intervals = new Set<unknown>();
  const realSet = globalThis.setInterval, realClear = globalThis.clearInterval;
  const ivSpy = jest.spyOn(globalThis, 'setInterval').mockImplementation(((fn: any, ms?: number, ...a: any[]) => {
    const id = realSet(fn, ms, ...a);
    intervals.add(id);
    return id;
  }) as any);
  const ciSpy = jest.spyOn(globalThis, 'clearInterval').mockImplementation(((id: any) => {
    intervals.delete(id);
    return realClear(id);
  }) as any);

  return {
    liveObservers: () => live.filter((o) => o.connected && o.owner === 'cmp').map((o) => o.kind),
    unreleased: () => live.filter((o) => o.connected && !o.disconnect.mock.calls.length).map((o) => o.kind),
    heldListeners: () => held.map((l) => `${l.target}:${l.type}`),
    liveIntervals: () => intervals.size,
    restore: () => {
      for (const id of intervals) realClear(id as any);
      moSpy?.mockRestore(); ioSpy.mockRestore(); roSpy.mockRestore();
      for (const s of spies.reverse()) s.mockRestore();
      ivSpy.mockRestore(); ciSpy.mockRestore();
      if (!had.IO) delete (globalThis as any).IntersectionObserver;
      if (!had.RO) delete (globalThis as any).ResizeObserver;
      if (!hadGetAnimations) delete (Element.prototype as { getAnimations?: unknown }).getAnimations;
    },
  };
}

const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 30)); });
const openPopupMounted = () =>
  document.querySelector('[data-ag-part="popup"][data-open], [data-ag-overlay][data-open], [data-ag-part="positioner"][data-open], [data-ag-part="popup"][data-state="open"], [data-ag-part="toast"][data-state="open"], [data-ag-part="command-palette"]') !== null;

/* CMP features whose purpose is to watch: ActivityFeed autoLoad observes its
   load-more sentinel (one IntersectionObserver while hasMore). */
const FEATURE_OBSERVERS: Record<string, string[]> = { ActivityFeed: ['IntersectionObserver'] };

/** Mounted + idle: nothing but the allowed RO is live. */
function expectIdle(probe: Probe, roAllowed: boolean, feature: string[] = []) {
  const observers = [...probe.liveObservers()];
  for (const k of feature) {
    const i = observers.indexOf(k);
    if (i >= 0) observers.splice(i, 1);
  }
  expect(observers.filter((k) => k !== 'ResizeObserver')).toEqual([]);
  expect(observers.filter((k) => k === 'ResizeObserver').length).toBeLessThanOrEqual(roAllowed ? 1 : 0);
  expect(probe.heldListeners()).toEqual([]);
  expect(probe.liveIntervals()).toBe(0);
}

const metas = discoverCmpMetas();

describe('side-effects (REQ-CMP-16)', () => {
  it.each(metas.map((m) => m.name))('%s: idle while mounted (popups closed); all released on unmount', async (name) => {
    const element = firstElement(name);
    if (!element) return; // metas without mountable stories covered by dom-contract

    const probe = instrument();
    try {
      const view = render(element);
      await settle();
      if (!openPopupMounted()) expectIdle(probe, RO_ALLOWED.has(name), FEATURE_OBSERVERS[name]);
      view.unmount();
      // Base UI releases its scroll lock (and its resize listener) on the
      // next task after unmount.
      await settle();

      const unreleased = probe.unreleased();
      const allowed = unreleased.filter((k) => k === 'ResizeObserver' && RO_ALLOWED.has(name));
      expect(unreleased.filter((k) => !(k === 'ResizeObserver' && RO_ALLOWED.has(name)))).toEqual([]);
      expect(allowed.length).toBeLessThanOrEqual(1);
      // BU floating-ui registers scroll/resize while open — allowed ONLY if
      // released by unmount; anything still held after unmount is a leak.
      expect(probe.heldListeners()).toEqual([]);
      expect(probe.liveIntervals()).toBe(0);
    } finally {
      probe.restore();
    }
  });

  /* Closed overlays at rest — including the hover-mode Popover, whose trigger
     used to hold a MutationObserver on aria-controls while closed. */
  it.each([
    ['Popover (openOnHover, closed)', () => (
      <Popover.Root openOnHover>
        <Popover.Trigger>Info</Popover.Trigger>
        <Popover.Content><Popover.Description>Static hint.</Popover.Description></Popover.Content>
      </Popover.Root>
    )],
    ['Popover (click, closed)', () => (
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content><Popover.Title>Title</Popover.Title></Popover.Content>
      </Popover.Root>
    )],
    ['Tooltip (closed)', () => (
      <Tooltip.Root>
        <Tooltip.Trigger>Hover</Tooltip.Trigger>
        <Tooltip.Content>Tip</Tooltip.Content>
      </Tooltip.Root>
    )],
    ['Menu (closed)', () => (
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content><Menu.Item>One</Menu.Item></Menu.Content>
      </Menu.Root>
    )],
    ['Dialog (closed)', () => (
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content><Dialog.Title>T</Dialog.Title></Dialog.Content>
      </Dialog.Root>
    )],
  ] as const)('%s: holds no observer, interval or global listener while idle', async (_label, ui) => {
    const probe = instrument();
    try {
      const view = render(ui());
      await settle();
      expect(openPopupMounted()).toBe(false);
      expectIdle(probe, false);
      view.unmount();
      await settle();
      expect(probe.unreleased()).toEqual([]);
      expect(probe.heldListeners()).toEqual([]);
    } finally {
      probe.restore();
    }
  });
});
