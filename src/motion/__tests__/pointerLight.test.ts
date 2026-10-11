/* MAT-207 REQ-MOT-T10: pointer light gating + ref-counted install +
   ≤1 setProperty per frame + rect caching + leave removal. No React. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { installPointerLight, pointerLightActive } from '../pointerLight';
import * as media from '../../theme/preferences/media';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let rafQ: Array<{ id: number; cb: (t: number) => void }> = [];
let rafSeq = 0;
const step = (t: number) => { const q = rafQ; rafQ = []; for (const { cb } of q) cb(t); };

const origRAF = globalThis.requestAnimationFrame;
const origCAF = globalThis.cancelAnimationFrame;

const host = () => {
  const el = document.createElement('div');
  el.setAttribute('data-ag-pointer-light', '');
  document.body.appendChild(el);
  return el;
};
const move = (el: Element, x: number, y: number) =>
  el.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: y, bubbles: true }));

/* Input capability is read through the preference store's shared media
   registry; each fake window carries its own answer for that registry. */
const fineHoverWin = {} as Window;
const coarseWin = {} as Window;
const pointerCaps = new Map<Window, Partial<Record<media.PointerSignalKey, boolean>>>([
  [fineHoverWin, { fineHover: true, fine: true }],
  [coarseWin, { fineHover: false, fine: false }],
]);

beforeEach(() => {
  rafQ = []; rafSeq = 0;
  jest.spyOn(media, 'readPointerSignal').mockImplementation(
    (win, key) => pointerCaps.get(win)?.[key] ?? false);
  globalThis.requestAnimationFrame = ((cb: (t: number) => void) => {
    const id = ++rafSeq; rafQ.push({ id, cb }); return id;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => {
    rafQ = rafQ.filter((r) => r.id !== id);
  }) as typeof cancelAnimationFrame;
});
afterEach(() => {
  globalThis.requestAnimationFrame = origRAF;
  globalThis.cancelAnimationFrame = origCAF;
  jest.restoreAllMocks();
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-ag-highlights');
  document.documentElement.removeAttribute('data-ag-motion');
});

describe('pointerLightActive (REQ-MOT-41)', () => {
  it('true only for full + glass + fine-hover + standard|enhanced', () => {
    expect(pointerLightActive({ motion: 'full', transparency: 'glass' }, 'standard', fineHoverWin)).toBe(true);
    expect(pointerLightActive({ motion: 'full', transparency: 'glass' }, 'enhanced', fineHoverWin)).toBe(true);
  });
  it.each([
    [{ motion: 'calm', transparency: 'glass' } as const, 'standard'],
    [{ motion: 'none', transparency: 'glass' } as const, 'standard'],
    [{ motion: 'full', transparency: 'tinted' } as const, 'standard'],
    [{ motion: 'full', transparency: 'solid' } as const, 'standard'],
    [{ motion: 'full', transparency: 'glass' } as const, 'lightweight'],
  ])('false for %j tier %s', (prefs, tier) => {
    expect(pointerLightActive(prefs, tier, fineHoverWin)).toBe(false);
  });
  it('false on coarse pointer', () => {
    expect(pointerLightActive({ motion: 'full', transparency: 'glass' }, 'standard', coarseWin)).toBe(false);
  });
  it('false when [data-ag-highlights] is present', () => {
    document.documentElement.setAttribute('data-ag-highlights', '');
    expect(pointerLightActive({ motion: 'full', transparency: 'glass' }, 'standard', fineHoverWin)).toBe(false);
  });
  it('falls back to the resolved attribute when prefs omit motion', () => {
    document.documentElement.setAttribute('data-ag-motion', 'calm');
    expect(pointerLightActive({ transparency: 'glass' }, 'standard', fineHoverWin)).toBe(false);
  });
});

describe('installPointerLight (REQ-MOT-40/-42)', () => {
  it('10 installs keep exactly one listener pair', () => {
    const add = jest.spyOn(document, 'addEventListener');
    const un = Array.from({ length: 10 }, () => installPointerLight(document));
    const moveInstalls = add.mock.calls.filter(([t]) => t === 'pointermove').length;
    const leaveInstalls = add.mock.calls.filter(([t]) => t === 'pointerleave').length;
    expect(moveInstalls).toBe(1);
    expect(leaveInstalls).toBe(1);
    un.forEach((u) => u());
  });
  it('20 moves in one frame cause at most one setProperty call', () => {
    const el = host();
    const un = installPointerLight(document);
    const setProp = jest.spyOn(el.style, 'setProperty');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    for (let i = 0; i < 20; i++) move(el, i, i);
    step(16);
    expect(setProp).toHaveBeenCalledTimes(1);
    expect(setProp.mock.calls[0]![0]).toBe('--_ag-pointer');
    un();
  });
  it('writes "<x>% <y>%" with 1 decimal', () => {
    const el = host();
    const un = installPointerLight(document);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 25, 25);
    step(16);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('25% 50%');
    un();
  });
  it('getBoundingClientRect is called once per entered element (cached)', () => {
    const el = host();
    const un = installPointerLight(document);
    const rect = jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 10, 10); step(16);
    move(el, 20, 10); step(32);
    move(el, 30, 10); step(48);
    expect(rect).toHaveBeenCalledTimes(1);
    un();
  });
  it('scroll invalidates the rect cache', () => {
    const el = host();
    const un = installPointerLight(document);
    const rect = jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 10, 10); step(16);
    document.dispatchEvent(new Event('scroll'));
    move(el, 20, 10); step(32);
    expect(rect).toHaveBeenCalledTimes(2);
    un();
  });
  it('pointerleave removes the property', () => {
    const el = host();
    const un = installPointerLight(document);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 10, 10); step(16);
    expect(el.style.getPropertyValue('--_ag-pointer')).not.toBe('');
    el.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('');
    un();
  });
  it('uninstall removes the listeners and the frame subscription', () => {
    const rm = jest.spyOn(document, 'removeEventListener');
    const un = installPointerLight(document);
    un();
    const removed = rm.mock.calls.map(([t]) => t);
    expect(removed).toContain('pointermove');
    expect(removed).toContain('pointerleave');
    expect(rafQ.length).toBe(0);
  });
  it('imports no React', () => {
    const src = readFileSync(join(__dirname, '..', 'pointerLight.ts'), 'utf8');
    expect(src).not.toMatch(/from 'react'|require\('react'\)/);
  });
});
