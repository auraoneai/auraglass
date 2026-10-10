/** @jest-environment jsdom */
import { beforeEach, describe, expect, it } from '@jest/globals';
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
  if (attrs['persistKey']) el.dataset['agPersistKey'] = attrs['persistKey'];
  const side = document.createElement('aside');
  side.dataset['agSlot'] = 'sidebar';
  el.append(side);
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
    const root = makeRoot({ sidebar: 'rail', inspector: 'open', layout: 'wide' });
    const s = getServerSnapshot(root);
    expect(s.sidebar).toBe('rail');
    expect(s.inspector).toBe('open');
    expect(s.mode).toBe('wide');
  });

  it('always writes both cookie keys (SURF-21)', () => {
    const root = makeRoot({ persistKey: 'demo' });
    document.cookie = '';
    setInspector(root, 'open');
    const jar = document.cookie;
    expect(jar).toContain('sidebar:');
    expect(jar).toContain('inspector:');
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
