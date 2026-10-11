/** @jest-environment node */
// tests/media/exports/root-no-media.test.ts — SURF-491 (REQ-SURF-01): the
// root API report and the root barrel contain 0 media/backdrop names — the
// surface ships only via ./media and ./backdrops (and ./three ships []).

import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';

const MEDIA_NAMES = new Set([
  'MediaControls', 'NowPlayingBar', 'ImageViewer', 'CarouselRail',
  'MediaScrubber', 'Waveform', 'WaveformLevel', 'Backdrop', 'BackdropTone',
  'useMediaElement', 'formatMediaTime', 'MediaTranscript',
]);

describe('root surface contains no media names (SURF-491)', () => {
  it('root.surf.exports.json has no media/backdrop names', () => {
    const manifest = JSON.parse(fs.readFileSync('etc/api/root.surf.exports.json', 'utf8')) as { exports: string[] };
    for (const n of manifest.exports) expect(MEDIA_NAMES.has(n)).toBe(false);
  });
  it('the root barrel file exports no media/backdrop names', () => {
    const src = fs.existsSync('src/root/surf.ts') ? fs.readFileSync('src/root/surf.ts', 'utf8') : '';
    for (const m of src.matchAll(/export \{ ([^}]+)\}/g)) {
      for (const n of m[1]!.split(',').map((s) => s.trim())) {
        expect(MEDIA_NAMES.has(n)).toBe(false);
      }
    }
  });
  it('./three exports [] at 5.0 (OI-01)', () => {
    const src = fs.readFileSync('src/three/index.ts', 'utf8');
    expect(src).not.toMatch(/export\s+(const|function|class|default|\{[^}]*[A-Z])/);
  });
});
