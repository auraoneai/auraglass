/* tests/docs/docs-examples-render.test.tsx — REQ-PLAT-100 (REQ-FIN-43).
   Every apps/docs/examples/<slug>/*.tsx renders in jsdom without throwing and
   without a React console.error (key, prop-type, act or nesting warnings).
   `aura-glass[/subpath]` resolves to the repository source through the jest
   moduleNameMapper; the packed .d.ts compile of the same files is
   scripts/docs/compile-snippets.mjs (plat:build:docs). */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import { AuraGlassProvider } from 'aura-glass';

const DIR = join(__dirname, '..', '..', 'apps', 'docs', 'examples');
const files = existsSync(DIR)
  ? readdirSync(DIR).filter((d) => statSync(join(DIR, d)).isDirectory()).sort()
    .flatMap((slug) => readdirSync(join(DIR, slug)).filter((f) => f.endsWith('.tsx')).sort().map((f) => `${slug}/${f}`))
  : [];

beforeEach(() => {
  // jsdom lacks these browser APIs; components feature-detect or observe them.
  const g = globalThis as Record<string, unknown>;
  g.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
  g.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
  window.matchMedia ??= ((q: string) => ({
    matches: false, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});
afterEach(cleanup);

describe('docs examples render', () => {
  it('finds the examples', () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it.each(files)('%s', (file) => {
    const errors: string[] = [];
    const spy = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => { errors.push(args.map(String).join(' ')); });
    try {
      const mod = require(join(DIR, file)) as { default?: React.ComponentType };
      expect(typeof mod.default).toBe('function');
      const Demo = mod.default!;
      // The docs app mounts every page inside AuraGlassProvider (apps/docs/app/layout.tsx).
      const { container } = render(<AuraGlassProvider><Demo /></AuraGlassProvider>);
      expect(container.childNodes.length + document.body.childNodes.length).toBeGreaterThan(0);
    } finally {
      spy.mockRestore();
    }
    expect(errors).toEqual([]);
  });
});
