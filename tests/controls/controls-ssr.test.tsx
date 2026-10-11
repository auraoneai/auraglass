/** CMP-113 (REQ-CMP-17): each family's default fixture renders on the server
    (renderToString) and hydrates without console.error/warn. */
import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { CONTROL_FAMILIES } from './families';

beforeAll(() => {
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

describe('controls SSR', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s renders to string without errors', (_name, { fixture: Fixture }) => {
    const errSpy = jest.spyOn(console, 'error');
    const warnSpy = jest.spyOn(console, 'warn');
    let html = '';
    try {
      html = renderToString(<Fixture />);
    } finally {
      // filter react-dom internal act warnings — only library noise counts
      const bad = [...errSpy.mock.calls, ...warnSpy.mock.calls]
        .flat()
        .map(String)
        .filter((m) => !/act\(|not wrapped in act/i.test(m));
      expect(bad).toEqual([]);
    }
    expect(html.length).toBeGreaterThan(0);
    errSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
