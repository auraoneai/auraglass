/* @jest-environment node */
/* REQ-SURF-160 (L2): css fragments ship concatenated into dist/<bundle>, so a
   relative url() written against the source file is rebased onto the asset's
   dist copy, and the copy is reported for assembleAllCss to write. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assembleBundle, collectCssFragments, rebaseCssUrls } from '../../scripts/build/lib/css.mjs';

const ROOT = process.cwd();

describe('css url() rebasing (REQ-SURF-160)', () => {
  it('rebases the grain tiles from src/backdrops/presets/grain.css onto dist/backdrops/assets', () => {
    const src = readFileSync(join(ROOT, 'src/backdrops/presets/grain.css'), 'utf8');
    const { css, assets } = rebaseCssUrls(src, 'src/backdrops/presets/grain.css', 'backdrops.css', ROOT);
    expect(css).toContain("url('./backdrops/assets/grain-112.avif') type('image/avif')");
    expect(css).toContain("url('./backdrops/assets/grain-112.png') type('image/png')");
    expect(css).not.toContain('../assets/');
    expect(assets).toEqual([
      { from: 'src/backdrops/assets/grain-112.avif', to: 'dist/backdrops/assets/grain-112.avif' },
      { from: 'src/backdrops/assets/grain-112.png', to: 'dist/backdrops/assets/grain-112.png' },
    ]);
  });

  it('a nested bundle path gets a ../ prefix', () => {
    const { css } = rebaseCssUrls("a{b:url(../assets/grain-112.png)}", 'src/backdrops/presets/grain.css', 'compat/x.css', ROOT);
    expect(css).toBe('a{b:url(../backdrops/assets/grain-112.png)}');
  });

  it('leaves absolute, scheme, #id and var() urls untouched', () => {
    const input = 'a{b:url(/x.png);c:url(data:image/png;base64,AA);d:url(#m);e:url("https://x/y.png")}';
    const { css, assets } = rebaseCssUrls(input, 'src/backdrops/presets/grain.css', 'backdrops.css', ROOT);
    expect(css).toBe(input);
    expect(assets).toEqual([]);
  });

  it('a relative url() to a missing file fails the build', () => {
    expect(() => rebaseCssUrls('a{b:url(../assets/nope.avif)}', 'src/backdrops/presets/grain.css', 'backdrops.css', ROOT))
      .toThrow(/src\/backdrops\/assets\/nope\.avif does not exist/);
  });

  it('the assembled dist/styles.css carries the full material engine with the grain tile rebased', async () => {
    // styles.css is the only sheet consumers and the cert Storybook load and
    // is documented as "the component and material CSS": the hand-authored
    // engine (host paint, ::before optics, @property registry, scrim and
    // ScrollEdge rules) must ship inside it, not only in dist/material.css.
    const fragments = await collectCssFragments(ROOT);
    const assets: Array<{ from: string; to: string }> = [];
    const css = await assembleBundle('styles.css', fragments, ROOT, assets);
    expect(css).toContain('@property --_ag-grain-opacity');
    expect(css).toContain('backdrop-filter: blur(var(--_ag-blur))');
    expect(css).toContain('[data-ag-layer="scrim"]');
    expect(css).toContain('[data-ag-part="scroll-edge"]');
    expect(css).toContain("url(./material/assets/ag-grain-128.avif)");
    expect(css).not.toContain('../assets/ag-grain-128.avif');
    expect(assets).toContainEqual({ from: 'src/material/assets/ag-grain-128.avif', to: 'dist/material/assets/ag-grain-128.avif' });
  });

  it('the assembled dist/backdrops.css references only rebased, existing grain assets', async () => {
    const fragments = await collectCssFragments(ROOT);
    const assets: Array<{ from: string; to: string }> = [];
    const css = await assembleBundle('backdrops.css', fragments, ROOT, assets);
    const urls = [...css.matchAll(/url\(\s*(['"]?)([^'")\s]+)\1\s*\)/g)].map((m) => m[2]);
    expect(urls).toEqual(['./backdrops/assets/grain-112.avif', './backdrops/assets/grain-112.png']);
    expect(assets.map((a) => a.to)).toEqual(['dist/backdrops/assets/grain-112.avif', 'dist/backdrops/assets/grain-112.png']);
  });
});
