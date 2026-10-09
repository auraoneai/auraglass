/* REQ-FIN-07 layer semantics: Escape → topmost OPEN layer; inert below topmost
   but never the toast root; data-ag-obscured on covered layers;
   data-ag-overlay-depth markers; pointerLockOutside inert pass (no scroll
   lock); no document.addEventListener outside layerInput. */
import { describe, expect, it, jest } from '@jest/globals';
import { createLayerStack, layerStackFor } from '../LayerStack';
import { layerInputFor } from '../../layerInput';
import type { LayerEntry } from '../../../contracts/preferences';

const entry = (over: Partial<LayerEntry> = {}): LayerEntry => ({
  kind: 'dialog', modal: true, open: true, onEscape: jest.fn() as () => void, element: null,
  ...over,
});

const makePortalRoot = (doc: Document) => {
  const pr = doc.createElement('div');
  pr.setAttribute('data-ag-portal-root', '');
  for (const name of ['overlay', 'transient', 'toast']) {
    const r = doc.createElement('div');
    r.setAttribute('data-ag-layer-root', name);
    pr.appendChild(r);
  }
  doc.body.appendChild(pr);
  return pr;
};

describe('REQ-FIN-07 LayerStack', () => {
  it('Escape reaches the topmost OPEN layer, skipping closed entries', () => {
    const doc = document.implementation.createHTMLDocument();
    const s = createLayerStack(doc);
    const lower = entry({ onEscape: jest.fn() });
    const closedTop = entry({ open: false, onEscape: jest.fn() });
    s.push(lower); s.push(closedTop);
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(lower.onEscape).toHaveBeenCalledTimes(1);
    expect(closedTop.onEscape).not.toHaveBeenCalled();
    s.dispose();
  });

  it('toast layer root is never inert; lower overlay children are', () => {
    const doc = document.implementation.createHTMLDocument();
    const pr = makePortalRoot(doc);
    const toastChild = doc.createElement('div');
    pr.querySelector('[data-ag-layer-root="toast"]')!.appendChild(toastChild);
    const overlayChild = doc.createElement('div');
    pr.querySelector('[data-ag-layer-root="overlay"]')!.appendChild(overlayChild);
    const s = createLayerStack(doc);
    s.push(entry());
    expect(toastChild.hasAttribute('inert')).toBe(false);
    expect(overlayChild.hasAttribute('inert')).toBe(true);
    s.dispose();
  });

  it('data-ag-obscured marks covered open layers; depth markers 0/1/2', () => {
    const doc = document.implementation.createHTMLDocument();
    const s = createLayerStack(doc);
    const [e0, e1, e2] = [doc.createElement('div'), doc.createElement('div'), doc.createElement('div')];
    s.push(entry({ element: e0 }));
    s.push(entry({ element: e1 }));
    s.push(entry({ element: e2 }));
    expect(e0.getAttribute('data-ag-overlay-depth')).toBe('0');
    expect(e1.getAttribute('data-ag-overlay-depth')).toBe('1');
    expect(e2.getAttribute('data-ag-overlay-depth')).toBe('2');
    expect(e0.hasAttribute('data-ag-obscured')).toBe(true);
    expect(e1.hasAttribute('data-ag-obscured')).toBe(true);
    expect(e2.hasAttribute('data-ag-obscured')).toBe(false);
    s.dispose();
    expect(e0.hasAttribute('data-ag-overlay-depth')).toBe(false);
  });

  it('pointerLockOutside applies the inert pass without scroll lock', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.appendChild(doc.createElement('main'));
    const s = createLayerStack(doc);
    s.push(entry({ kind: 'popover', modal: false, pointerLockOutside: true } as LayerEntry));
    expect(doc.body.children[0]!.hasAttribute('inert')).toBe(true);
    expect(doc.documentElement.hasAttribute('data-ag-scroll-locked')).toBe(false);
    s.dispose();
  });

  it('one shared dispatcher per document; subscriptions remove cleanly', () => {
    const doc = document.implementation.createHTMLDocument();
    const d1 = layerInputFor(doc);
    const d2 = layerInputFor(doc);
    expect(d1).toBe(d2);
    const hits: string[] = [];
    const off = d1.on('keydown', () => hits.push('k'));
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    off();
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    expect(hits).toEqual(['k']);
    d1.dispose();
  });
});
