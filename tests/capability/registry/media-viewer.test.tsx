/** @jest-environment node */
// SURF-520 / REQ-SURF-171 — media-viewer block (MediaControls + NowPlayingBar +
// ImageViewer + CarouselRail over Backdrop preset="photo"): schema valid,
// fixtures deterministic, server-renders with 0 console errors against the
// real library sources.
import { describe, expect, it, jest } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import * as fs from 'node:fs';
// 'aura-glass/<entry>' is not mapped by the root jest config yet (REQ-FIN-09 /
// contract C-4, FIN-A): alias to the src/contracts/entries.ts sources — the
// real modules, never doubles.
jest.mock('aura-glass/media', () => jest.requireActual('../../../src/media/index'), { virtual: true });
jest.mock('aura-glass/backdrops', () => jest.requireActual('../../../src/backdrops/index'), { virtual: true });

import { MediaViewer } from '../../../registry/blocks/media-viewer/index';

describe('media-viewer block (SURF-520)', () => {
  it('schema-valid registry-item.json', () => {
    const j = JSON.parse(fs.readFileSync('registry/blocks/media-viewer/registry-item.json', 'utf8')) as Record<string, unknown>;
    expect(j['name']).toBe('media-viewer');
    expect(j['type']).toMatch(/block/);
    expect((j['dependencies'] as string[])).toContain('aura-glass');
  });
  it('fixtures are deterministic (no Math.random/Date.now/network)', () => {
    const src = fs.readFileSync('registry/blocks/media-viewer/fixtures.ts', 'utf8');
    expect(src).not.toMatch(/Math\.random|Date\.now\(|fetch\(|new Date\(\)/);
  });
  it('server-renders Backdrop, NowPlayingBar and CarouselRail with 0 console errors', () => {
    const errors: unknown[] = [];
    const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { errors.push(a); });
    try {
      const html = renderToString(createElement(MediaViewer));
      expect(html).toContain('data-ag-backdrop-preset="photo"');
      expect(html).toContain('data-ag-part="now-playing"');
      expect(html).toContain('aria-roledescription="carousel"');
    } finally {
      spy.mockRestore();
    }
    expect(errors).toHaveLength(0);
  });
});
