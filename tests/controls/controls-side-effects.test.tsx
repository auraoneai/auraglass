/** CMP-112 (REQ-CMP-16): mounting and unmounting each family must not leave
    observers or window/document listeners alive. */
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { CONTROL_FAMILIES } from './families';

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('controls side effects', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: no leaked observers or global listeners', (_name, { fixture: Fixture }) => {
    const winAdd = jest.spyOn(window, 'addEventListener');
    const winRemove = jest.spyOn(window, 'removeEventListener');
    const docAdd = jest.spyOn(document, 'addEventListener');
    const docRemove = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(<Fixture />);
    unmount();

    const added = new Set([...winAdd.mock.calls, ...docAdd.mock.calls].map((c) => String(c[0])));
    const removed = new Set([...winRemove.mock.calls, ...docRemove.mock.calls].map((c) => String(c[0])));
    for (const evt of ['scroll', 'resize', 'pointermove', 'keydown']) {
      if (added.has(evt) && !removed.has(evt)) {
        throw new Error(`${_name}: leaked '${evt}' listener`);
      }
    }
  });
});
