/* MAT-47 (REQ-MAT-47): the motion runtime reads input capability through the
   shared media registry instead of calling matchMedia itself. readPointerSignal
   shares one MediaQueryList per (window, query) and stays out of the store's
   OS-signal subscription set. */
import { describe, expect, it } from '@jest/globals';
import {
  MEDIA_QUERIES, POINTER_QUERIES, readPointerSignal, subscribeOsSignals,
} from '../preferences/media';

const fakeWindow = (matching: ReadonlySet<string>) => {
  const calls: string[] = [];
  const win = {
    matchMedia: (q: string) => {
      calls.push(q);
      return {
        matches: matching.has(q),
        addEventListener: () => {}, removeEventListener: () => {},
      } as unknown as MediaQueryList;
    },
  } as unknown as Window;
  return { win, calls };
};

describe('readPointerSignal (MAT-47)', () => {
  it('reports the fine-hover and fine-pointer queries', () => {
    const fine = fakeWindow(new Set([POINTER_QUERIES.fineHover, POINTER_QUERIES.fine]));
    expect(readPointerSignal(fine.win, 'fineHover')).toBe(true);
    expect(readPointerSignal(fine.win, 'fine')).toBe(true);
    const coarse = fakeWindow(new Set());
    expect(readPointerSignal(coarse.win, 'fineHover')).toBe(false);
    expect(readPointerSignal(coarse.win, 'fine')).toBe(false);
  });

  it('creates one MediaQueryList per (window, query)', () => {
    const { win, calls } = fakeWindow(new Set([POINTER_QUERIES.fineHover]));
    readPointerSignal(win, 'fineHover');
    readPointerSignal(win, 'fineHover');
    readPointerSignal(win, 'fineHover');
    expect(calls.filter((q) => q === POINTER_QUERIES.fineHover)).toHaveLength(1);
  });

  it('is false when the window has no media-query support', () => {
    expect(readPointerSignal({} as Window, 'fineHover')).toBe(false);
  });

  it('does not join the store OS-signal subscription set', () => {
    const { win, calls } = fakeWindow(new Set());
    const off = subscribeOsSignals(win, () => {});
    off();
    expect(new Set(calls)).toEqual(new Set(Object.values(MEDIA_QUERIES)));
    expect(calls).not.toContain(POINTER_QUERIES.fineHover);
    expect(calls).not.toContain(POINTER_QUERIES.fine);
  });
});
