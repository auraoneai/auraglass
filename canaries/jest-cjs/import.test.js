/* PLAT-293: a CommonJS Jest consumer importing the ESM-only artifact —
   reports-only from beta (D-03 evidence). */
const { describe, test, expect } = require('@jest/globals');

describe('jest-cjs consumer', () => {
  test('dynamic import of aura-glass/material resolves', async () => {
    const mod = await import('aura-glass/material');
    expect(typeof mod).toBe('object');
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
