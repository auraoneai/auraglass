/** @jest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  getServerSnapshot,
  getSnapshot,
  registerControlled,
  setInspector,
  setSidebar,
  subscribe,
} from './appShellStore';

function makeRoot(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('div');
  el.className = 'ag-app-shell';
  el.dataset['agPart'] = 'root';
  el.dataset['agSidebar'] = attrs['sidebar'] ?? 'expanded';
  el.dataset['agInspector'] = attrs['inspector'] ?? 'closed';
  el.dataset['agLayout'] = attrs['layout'] ?? 'auto';
  if (attrs['persistKey']) el.dataset['persistKey'] = attrs['persistKey'];
  // REQ-SURF-17: Root is the container; slots live in the inner grid frame.
  const frame = document.createElement('div');
  frame.className = 'ag-app-shell__frame';
  const side = document.createElement('aside');
  side.dataset['agSlot'] = 'sidebar';
  frame.append(side);
  el.append(frame);
  document.body.append(el);
  return el;
}

describe('appShellStore (SURF-026)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.cookie = '';
  });

  it('toggle updates root attribute', () => {
    const root = makeRoot();
    setSidebar(root, 'rail');
    expect(root.dataset['agSidebar']).toBe('rail');
    expect(getSnapshot(root).sidebar).toBe('rail');
    setInspector(root, 'open');
    expect(root.dataset['agInspector']).toBe('open');
  });

  it('collapsed sidebar sets inert on the slot element', () => {
    const root = makeRoot();
    setSidebar(root, 'collapsed');
    const side = root.querySelector('[data-ag-slot="sidebar"]')!;
    expect(side.hasAttribute('inert')).toBe(true);
    setSidebar(root, 'expanded');
    expect(side.hasAttribute('inert')).toBe(false);
  });

  it('writes the ag-shell-<key> cookie when persistKey is set', () => {
    const root = makeRoot({ persistKey: 'demo' });
    setSidebar(root, 'rail');
    const jar = document.cookie;
    expect(jar).toContain('ag-shell-demo=');
    expect(jar).toContain('sidebar:rail');
  });

  it('controlled mode calls handlers only (no attribute write)', () => {
    const root = makeRoot();
    const calls: string[] = [];
    const unregister = registerControlled(
      root,
      { onSidebarChange: (s) => calls.push(s) },
      { sidebar: 'expanded' },
    );
    setSidebar(root, 'rail');
    expect(calls).toEqual(['rail']);
    expect(root.dataset['agSidebar']).toBe('expanded'); // unchanged until prop lands
    unregister();
    setSidebar(root, 'collapsed');
    expect(root.dataset['agSidebar']).toBe('collapsed');
  });

  it('server snapshot equals the rendered attributes', () => {
    const root = makeRoot({ sidebar: 'rail', inspector: 'open', layout: 'desktop' });
    const s = getServerSnapshot(root);
    expect(s.sidebar).toBe('rail');
    expect(s.inspector).toBe('open');
    expect(s.mode).toBe('wide');
  });

  it('writes the exact cookie string with both keys (SURF-21)', () => {
    const root = makeRoot({ persistKey: 'demo' });
    const desc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
    const written: string[] = [];
    const set = jest.spyOn(Document.prototype, 'cookie', 'set').mockImplementation(function (this: Document, v: string) {
      written.push(v);
      desc.set!.call(this, v);
    });
    try {
      setInspector(root, 'open');
      setSidebar(root, 'rail');
    } finally {
      set.mockRestore();
    }
    // Defaults are written too: the first write carries sidebar:expanded.
    expect(written).toEqual([
      'ag-shell-demo=sidebar:expanded,inspector:open; Path=/; Max-Age=31536000; SameSite=Lax',
      'ag-shell-demo=sidebar:rail,inspector:open; Path=/; Max-Age=31536000; SameSite=Lax',
    ]);
    // The browser jar keeps the whole value (',' is not a cookie delimiter).
    expect(document.cookie).toBe('ag-shell-demo=sidebar:rail,inspector:open');
    document.cookie = 'ag-shell-demo=; Path=/; Max-Age=0';
  });

  it('subscribe notifies listeners and unsubscribes cleanly', () => {
    const root = makeRoot();
    const hits: number[] = [];
    const off = subscribe(root, () => hits.push(1));
    setSidebar(root, 'collapsed');
    expect(hits).toHaveLength(1);
    off();
    setSidebar(root, 'expanded');
    expect(hits).toHaveLength(1);
  });
});

/* REQ-SURF-17: the mode is whatever app-shell.css resolved and published as
   --_ag-app-shell-mode on the frame. jsdom evaluates neither @container nor
   rules inside @layer, so each case injects the exact declaration the
   matching app-shell.css rule writes (asserted rule-by-rule in
   app-shell.css.test.ts), and pins a contradicting element width to prove
   no width ever feeds the mode. */
describe('appShellStore mode is CSS-resolved (REQ-SURF-17)', () => {
  const RealRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
  let observers: { cb: ResizeObserverCallback; targets: Element[] }[] = [];
  // A fresh store per case: the shared observer is module state.
  let store: typeof import('./appShellStore');

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    observers = [];
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      private rec: { cb: ResizeObserverCallback; targets: Element[] };
      constructor(cb: ResizeObserverCallback) {
        this.rec = { cb, targets: [] };
        observers.push(this.rec);
      }
      observe(t: Element) {
        this.rec.targets.push(t);
      }
      unobserve() {}
      disconnect() {}
    };
    jest.isolateModules(() => {
      store = require('./appShellStore') as typeof import('./appShellStore');
    });
  });
  afterEach(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RealRO;
  });

  /** What one app-shell.css rule writes on the frame (e.g. the medium container rule). */
  const cssWrites = (mode: string) => {
    const style = document.createElement('style');
    style.textContent = `.ag-app-shell__frame { --_ag-app-shell-mode: ${mode}; }`;
    document.head.append(style);
    return style;
  };
  const pinWidth = (el: HTMLElement, px: number) =>
    Object.defineProperty(el, 'offsetWidth', { configurable: true, get: () => px });

  it('reads the frame value, not the shell width', () => {
    cssWrites('medium');
    const root = makeRoot();
    pinWidth(root, 1920); // a width-based rule would say "wide"
    expect(store.getSnapshot(root).mode).toBe('medium');
    expect(root.dataset['mode']).toBe('medium');
  });

  it('falls back to the pinned layout before the stylesheet applies', () => {
    const auto = makeRoot({ layout: 'auto' });
    const desktop = makeRoot({ layout: 'desktop' });
    const mobile = makeRoot({ layout: 'mobile' });
    for (const r of [auto, desktop, mobile]) pinWidth(r, 300);
    expect([auto, desktop, mobile].map((r) => store.getSnapshot(r).mode)).toEqual(['expanded', 'wide', 'compact']);
  });

  it('one shared ResizeObserver re-reads the CSS mode on resize and closes a stale drawer', () => {
    const style = cssWrites('compact');
    const a = makeRoot();
    const b = makeRoot();
    const hits: string[] = [];
    store.subscribe(a, () => hits.push(store.getSnapshot(a).mode));
    store.subscribe(b, () => {});
    expect(observers).toHaveLength(1);
    expect(observers[0]!.targets).toEqual([a, b]);
    store.setDrawer(a, 'open');
    expect(store.getSnapshot(a).drawer).toBe('open');
    // The container grew past 1023px: CSS now resolves wide.
    style.textContent = '.ag-app-shell__frame { --_ag-app-shell-mode: wide; }';
    pinWidth(a, 200); // the callback must not consult the width
    observers[0]!.cb([{ target: a } as unknown as ResizeObserverEntry], {} as ResizeObserver);
    expect(store.getSnapshot(a)).toMatchObject({ mode: 'wide', drawer: 'closed' });
    expect(a.dataset['mode']).toBe('wide');
    expect(hits).toContain('wide');
  });

  it('compact mode does not inert the inline sidebar (CSS display:none owns it)', () => {
    cssWrites('compact');
    const root = makeRoot();
    expect(store.getSnapshot(root).mode).toBe('compact');
    expect(root.querySelector('[data-ag-slot="sidebar"]')!.hasAttribute('inert')).toBe(false);
  });

  it('ignores an unknown CSS value', () => {
    cssWrites('huge');
    const root = makeRoot({ layout: 'mobile' });
    expect(store.getSnapshot(root).mode).toBe('compact');
  });
});
