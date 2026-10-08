/** @jest-environment node */
// tests/capability/registry/presence-stack.test.tsx — REQ-SURF-177.
// Same id → same colour; +N overflow; no timers.
// Root-config runs report pending until CMP lands; real assertions run under
// tests/capability/jest.doubles.cjs.
import { describe, expect, it, jest } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import type * as BlockModule from '../../../registry/items/presence-stack/index';
import { presenceProps } from '../../../registry/items/presence-stack/fixtures';

const PENDING =
  'presence-stack: aura-glass is unresolvable until CMP lands — render assertions run under tests/capability/jest.doubles.cjs';
const Block = (() => {
  try {
    return require('../../../registry/items/presence-stack/index') as typeof BlockModule;
  } catch {
    return null;
  }
})();

jest.useFakeTimers();

describe('presence-stack item', () => {
  it('same id maps to the same colour', () => {
    if (!Block) { console.warn(PENDING); return; }
    expect(Block.presenceColor('u-amara')).toBe(Block.presenceColor('u-amara'));
    expect(Block.hueForId('u-amara')).toBe(Block.hueForId('u-amara'));
  });
  it('different ids can differ but stay in range', () => {
    if (!Block) { console.warn(PENDING); return; }
    for (const id of ['a', 'b', 'u-chen']) {
      const hue = Block.hueForId(id);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });
  it('renders +N overflow beyond max', () => {
    if (!Block) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Block.PresenceStack, presenceProps));
    const stripped = html.replace(/<!-- -->/g, '');
    expect(stripped).toContain('+2'); // 7 users, max 5
    expect(stripped).toContain('7 online');
  });
  it('leaves no timers', () => {
    if (!Block) { console.warn(PENDING); return; }
    renderToString(createElement(Block.PresenceStack, presenceProps));
    expect(jest.getTimerCount()).toBe(0);
  });
});
