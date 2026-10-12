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
  document.documentElement.removeAttribute('data-ag-transparency');
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

describe('forced colours (REQ-MAT-45)', () => {
  it('pointerLightActive is false when the store reports forcedColors', () => {
    expect(pointerLightActive({ motion: 'full', transparency: 'glass', forcedColors: true }, 'standard', fineHoverWin)).toBe(false);
    expect(pointerLightActive({ motion: 'full', transparency: 'glass', forcedColors: false }, 'standard', fineHoverWin)).toBe(true);
  });
  it('pointerLightActive is false under the forced-colours solid floor on the document', () => {
    document.documentElement.setAttribute('data-ag-transparency', 'solid');
    expect(pointerLightActive({ motion: 'full' }, 'standard', fineHoverWin)).toBe(false);
    document.documentElement.setAttribute('data-ag-transparency', 'glass');
    expect(pointerLightActive({ motion: 'full' }, 'standard', fineHoverWin)).toBe(true);
  });
  it('an installed pointer light makes 0 setProperty calls under forced colours', () => {
    document.documentElement.setAttribute('data-ag-transparency', 'solid');
    const el = host();
    const un = installPointerLight(document);
    const setProp = jest.spyOn(el.style, 'setProperty');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    for (let i = 0; i < 5; i++) { move(el, 10 + i, 10); step(16 * (i + 1)); }
    expect(setProp).toHaveBeenCalledTimes(0);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('');
    un();
  });
  it('a light written before forced colours turn on is removed on the next frame', () => {
    const el = host();
    const un = installPointerLight(document);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 25, 25); step(16);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('25% 50%');
    document.documentElement.setAttribute('data-ag-transparency', 'solid');
    const setProp = jest.spyOn(el.style, 'setProperty');
    move(el, 50, 25); step(32);
    expect(setProp).toHaveBeenCalledTimes(0);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('');
    un();
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
    // real pointerleave does not bubble: the document's capture listener sees it
    el.dispatchEvent(new Event('pointerleave', { bubbles: false }));
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('');
    un();
  });
  it('the pointerleave listener is a capture listener on the document (REQ-MAT-49)', () => {
    const add = jest.spyOn(document, 'addEventListener');
    const un = installPointerLight(document);
    const leave = add.mock.calls.find(([t]) => t === 'pointerleave');
    expect(leave?.[2]).toMatchObject({ capture: true, passive: true });
    un();
  });
  it('leaving a child inside the target keeps the light; leaving the target clears it', () => {
    const el = host();
    const child = document.createElement('span');
    el.appendChild(child);
    const un = installPointerLight(document);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(child, 50, 25); step(16);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('50% 50%');
    child.dispatchEvent(new Event('pointerleave', { bubbles: false }));
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('50% 50%');
    el.dispatchEvent(new Event('pointerleave', { bubbles: false }));
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('');
    un();
  });
  it('leaving one of two targets clears only that one', () => {
    const a = host();
    const b = host();
    const un = installPointerLight(document);
    for (const el of [a, b]) jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(a, 10, 10); step(16);
    move(b, 20, 10); step(32);
    a.dispatchEvent(new Event('pointerleave', { bubbles: false }));
    expect(a.style.getPropertyValue('--_ag-pointer')).toBe('');
    expect(b.style.getPropertyValue('--_ag-pointer')).toBe('20% 20%');
    un();
  });
  it('[data-ag-highlights] on an ancestor (not the root) disables the light', () => {
    const wrap = document.createElement('section');
    wrap.setAttribute('data-ag-highlights', '');
    document.body.appendChild(wrap);
    const el = document.createElement('div');
    el.setAttribute('data-ag-pointer-light', '');
    wrap.appendChild(el);
    const un = installPointerLight(document);
    const setProp = jest.spyOn(el.style, 'setProperty');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 10, 10); step(16);
    expect(setProp).toHaveBeenCalledTimes(0);
    expect(rafQ.length).toBe(0);
    un();
  });
  it('[data-ag-highlights] added on an ancestor after hover drops the light', () => {
    const wrap = document.createElement('section');
    document.body.appendChild(wrap);
    const el = document.createElement('div');
    el.setAttribute('data-ag-pointer-light', '');
    wrap.appendChild(el);
    const un = installPointerLight(document);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 10, 10); step(16);
    expect(el.style.getPropertyValue('--_ag-pointer')).not.toBe('');
    wrap.setAttribute('data-ag-highlights', '');
    move(el, 20, 10); step(32);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('');
    un();
  });
  it('no frame callback is scheduled while installed with no target hovered (REQ-MAT-46)', () => {
    host();
    const un = installPointerLight(document);
    expect(rafQ.length).toBe(0);
    // a move outside any target schedules nothing either
    move(document.body, 5, 5);
    expect(rafQ.length).toBe(0);
    un();
  });
  it('the frame subscription is released one frame after the pointer stops', () => {
    const el = host();
    const un = installPointerLight(document);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 50 } as DOMRect);
    move(el, 10, 10);
    expect(rafQ.length).toBe(1);
    step(16); // writes the light, stays subscribed for the next move
    move(el, 20, 10);
    step(32);
    step(48); // nothing pending: releases the subscription
    expect(rafQ.length).toBe(0);
    for (let i = 0; i < 5; i++) step(64 + i * 16);
    expect(rafQ.length).toBe(0);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('20% 20%');
    // hovering again resubscribes
    move(el, 30, 10);
    expect(rafQ.length).toBe(1);
    step(200);
    expect(el.style.getPropertyValue('--_ag-pointer')).toBe('30% 20%');
    un();
    expect(rafQ.length).toBe(0);
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
