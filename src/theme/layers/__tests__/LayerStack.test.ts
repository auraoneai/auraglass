/* MAT-289/290/294 (A11Y-057): the per-document layer stack — push/pop/top,
   one Escape keydown listener per document dispatching to the top layer only
   (O(1), stopPropagation, isComposing guard), ref-counted inert + scroll lock,
   focus restore. */
import { describe, expect, it, jest } from '@jest/globals';
import { createLayerStack, layerStackFor, layerRootForKind } from '../LayerStack';
import type { LayerEntry } from '../../../contracts/preferences';

const entry = (over: Partial<LayerEntry> = {}): LayerEntry => ({
  kind: 'dialog', modal: true, open: true, onEscape: jest.fn() as () => void, element: null,
  ...over,
});

const keydown = (doc: Document, over: Partial<KeyboardEventInit> = {}) => {
  doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', ...over }));
};

describe('LayerStack', () => {
  it('push/top/pop order and ids', () => {
    const doc = document.implementation.createHTMLDocument();
    const s = createLayerStack(doc);
    const a = s.push(entry());
    const b = s.push(entry());
    expect(a).not.toBe(b);
    expect(s.top()?.id).toBe(b);
    expect(s.isTop(a)).toBe(false);
    expect(s.isTop(b)).toBe(true);
    expect(s.depth(a)).toBe(0);
    expect(s.depth(b)).toBe(1);
    s.pop(b);
    expect(s.top()?.id).toBe(a);
    s.dispose();
  });

  it('Escape reaches only the top layer, once, with stopPropagation', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = '<main></main>';
    const s = createLayerStack(doc);
    const low = jest.fn() as unknown as () => void;
    const top = jest.fn() as unknown as () => void;
    s.push(entry({ onEscape: low }));
    s.push(entry({ onEscape: top }));
    const stopSpy = jest.spyOn(KeyboardEvent.prototype, 'stopPropagation');
    keydown(doc);
    expect(top).toHaveBeenCalledTimes(1);
    expect(low).not.toHaveBeenCalled();
    expect(stopSpy).toHaveBeenCalled();
    stopSpy.mockRestore();
    s.dispose();
  });

  it('ignores Escape while composing or keyCode 229', () => {
    const doc = document.implementation.createHTMLDocument();
    const s = createLayerStack(doc);
    const onEscape = jest.fn() as unknown as () => void;
    s.push(entry({ onEscape }));
    const ev = new KeyboardEvent('keydown', { key: 'Escape' });
    Object.defineProperty(ev, 'isComposing', { value: true });
    doc.dispatchEvent(ev);
    expect(onEscape).not.toHaveBeenCalled();
    keydown(doc, { keyCode: 229 } as Partial<KeyboardEventInit>);
    expect(onEscape).not.toHaveBeenCalled();
    s.dispose();
  });

  it('closed top layer swallows nothing', () => {
    const doc = document.implementation.createHTMLDocument();
    const s = createLayerStack(doc);
    const onEscape = jest.fn() as unknown as () => void;
    s.push(entry({ onEscape, open: false }));
    keydown(doc);
    expect(onEscape).not.toHaveBeenCalled();
    s.dispose();
  });

  it('modal layers inert body children except the portal root, ref-counted', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = `
      <main><button id="x">x</button></main>
      <aside>rail</aside>
      <div data-ag-portal-root>
        <div data-ag-layer-root="overlay"><div id="dlg"></div></div>
        <div data-ag-layer-root="transient"></div>
        <div data-ag-layer-root="toast"></div>
      </div>`;
    const s = createLayerStack(doc);
    const dlg = doc.getElementById('dlg')!;
    const a = s.push(entry({ element: dlg }));
    const b = s.push(entry({ element: dlg }));
    const main = doc.querySelector('main')!;
    const aside = doc.querySelector('aside')!;
    const portalRoot = doc.querySelector('[data-ag-portal-root]')!;
    expect(main.hasAttribute('inert')).toBe(true);
    expect(aside.getAttribute('aria-hidden')).toBe('true');
    expect(portalRoot.hasAttribute('inert')).toBe(false);
    // first pop: still a modal left -> inert persists
    s.pop(b);
    expect(main.hasAttribute('inert')).toBe(true);
    s.pop(a);
    expect(main.hasAttribute('inert')).toBe(false);
    expect(aside.hasAttribute('aria-hidden')).toBe(false);
    s.dispose();
  });

  it('scroll lock is ref-counted on <html> via the attribute (no inline style)', () => {
    const doc = document.implementation.createHTMLDocument();
    const s = createLayerStack(doc);
    const a = s.push(entry());
    const b = s.push(entry());
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBe('');
    expect(doc.documentElement.getAttribute('style')).toBeNull();
    s.pop(b);
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBe('');
    s.pop(a);
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBeNull();
    s.dispose();
  });

  it('lockScroll: false modal gets inert without the scroll lock', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = '<main></main>';
    const s = createLayerStack(doc);
    const id = s.push(entry({ lockScroll: false }));
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBeNull();
    expect(doc.querySelector('main')!.hasAttribute('inert')).toBe(true);
    s.pop(id);
    s.dispose();
  });

  it('non-modal layers get no inert or scroll effects', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = '<main></main>';
    const s = createLayerStack(doc);
    s.push(entry({ modal: false }));
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBeNull();
    expect(doc.querySelector('main')!.hasAttribute('inert')).toBe(false);
    s.dispose();
  });

  it('restores focus to restoreFocusTo on pop, skipped when false', () => {
    // needs a document with a defaultView (jsdom cannot focus elements of a
    // detached createHTMLDocument document)
    const doc = document;
    const opener = doc.createElement('button');
    const other = doc.createElement('button');
    doc.body.append(opener, other);
    const s = createLayerStack(doc);
    const a = s.push({ ...entry(), restoreFocusTo: opener });
    const b = s.push({ ...entry(), restoreFocusTo: false });
    other.focus();
    s.pop(b); // no restore
    expect(doc.activeElement).toBe(other);
    s.pop(a);
    expect(doc.activeElement).toBe(opener);
    s.dispose();
    opener.remove();
    other.remove();
  });

  it('update() transitions modal effects on open/modal flips', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = '<main></main>';
    const s = createLayerStack(doc);
    const id = s.push(entry({ open: false }));
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBeNull();
    s.update(id, { open: true });
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBe('');
    s.update(id, { modal: false });
    expect(doc.documentElement.getAttribute('data-ag-scroll-locked')).toBeNull();
    s.dispose();
  });

  it('layerRootForKind maps kinds to roots; layerStackFor memoizes per document', () => {
    expect(layerRootForKind('toast')).toBe('toast');
    expect(layerRootForKind('tooltip')).toBe('transient');
    expect(layerRootForKind('dialog')).toBe('overlay');
    expect(layerRootForKind('menu')).toBe('overlay');
    const d = document.implementation.createHTMLDocument();
    expect(layerStackFor(d)).toBe(layerStackFor(d));
    expect(layerStackFor(d)).not.toBe(layerStackFor(document));
  });
});
