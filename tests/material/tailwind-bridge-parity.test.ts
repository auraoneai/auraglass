/* @jest-environment node */
/* MAT-133 — tailwind-bridge parity: every opaque fill emitted by
   src/tailwind/bridge.css (DS-owned, 2a-T chain output) must be identical to a
   public --ag-* token -- never a literal px. While bridge.css is absent on
   `next`, the suite reports pending and returns. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BRIDGE = join(__dirname, '../../src/tailwind/bridge.css');
const MATERIAL = join(__dirname, '../../src/material/css/material.css');

describe('tailwind bridge parity (MAT-133)', () => {
  if (!existsSync(BRIDGE)) {
    it('is pending: src/tailwind/bridge.css has not landed on next yet', () => {
      console.warn('[pending] src/tailwind/bridge.css absent — parity assertions run once DS emits it');
      expect(true).toBe(true);
    });
    return;
  }
  const bridge = readFileSync(BRIDGE, 'utf8');
  const material = existsSync(MATERIAL) ? readFileSync(MATERIAL, 'utf8') : '';

  it('emits no literal px fill values', () => {
    const fills = bridge.match(/(?:background(?:-color|-image)?|--[\w-]+)\s*:[^;]*px[^;]*;/g) ?? [];
    expect(fills).toEqual([]);
  });

  it('only references public --ag-* tokens that exist in the token set', () => {
    const refs = new Set([...bridge.matchAll(/var\(--ag-[\w-]+\)/g)].map((m) => m[0].slice(4, -1)));
    const defined = new Set([...material.matchAll(/(--ag-[\w-]+)\s*:/g)].map((m) => m[1]));
    const missing = [...refs].filter((r) => !defined.has(r));
    expect(missing).toEqual([]);
  });
});
