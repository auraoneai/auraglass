/** @jest-environment node */
// tests/media/exports/media-backdrops-subpath.test.ts — SURF-490
// (REQ-SURF-01): ./media exports exactly 7 value exports at 5.0.0 (Waveform
// is 5.1, SC-12); ./backdrops exports exactly [Backdrop]. The packed-tarball
// variant (npm pack + import.meta.resolve) runs in the remote pipeline; this
// suite asserts the same invariants against the source barrels + api reports.

import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';

const MEDIA_EXPORTS = [
  'CarouselRail', 'ImageViewer', 'MediaControls', 'MediaScrubber',
  'NowPlayingBar', 'formatMediaTime', 'useMediaElement',
].sort();

function barrelValueExports(path: string): string[] {
  const src = fs.readFileSync(path, 'utf8');
  return src.split('\n')
    .filter((l) => /^export \{ /.test(l))
    .flatMap((l) => /^export \{ ([^}]+)\}/.exec(l)![1]!.split(','))
    .map((n) => n.trim())
    .filter(Boolean)
    .sort();
}

describe('media/backdrops subpath exports (SURF-490)', () => {
  it('src/media/index.ts exports exactly the 7 contract names', () => {
    expect(barrelValueExports('src/media/index.ts')).toEqual(MEDIA_EXPORTS);
  });
  it('Waveform is not exported from the ./media barrel (5.1, SC-12)', () => {
    const src = fs.readFileSync('src/media/index.ts', 'utf8');
    expect(src).not.toMatch(/export\s+\{[^}]*Waveform/);
  });
  it('src/backdrops/index.ts exports exactly [Backdrop]', () => {
    expect(barrelValueExports('src/backdrops/index.ts')).toEqual(['Backdrop']);
  });
  it('etc/api/media.exports.json equals the contract list', () => {
    const manifest = JSON.parse(fs.readFileSync('etc/api/media.exports.json', 'utf8')) as { exports: string[] };
    expect([...manifest.exports].sort()).toEqual(MEDIA_EXPORTS);
  });
  it('etc/api/backdrops.exports.json equals [Backdrop]', () => {
    const manifest = JSON.parse(fs.readFileSync('etc/api/backdrops.exports.json', 'utf8')) as { exports: string[] };
    expect(manifest.exports).toEqual(['Backdrop']);
  });
});
