/** @jest-environment node */
// SURF-398 (REQ-SURF-14): every §9 media/backdrop name has a
// fragments/deprecations/surf.ts entry; compat-covered names carry a compat
// field matching the shipped adapter; since/codemod/doc fields are consistent.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import fragment from '../../fragments/deprecations/surf';
import type { DeprecationFragment } from '../../src/contracts/fragments';

type Row = DeprecationFragment[number];
const rows = fragment as readonly Row[];
const bySymbol = new Map(rows.map((r) => [r.symbol, r]));

/** §9 media/backdrop names the 5.0 surface absorbs or removes. */
const N9 = [
  'LiquidGlassMediaControls', 'GlassMediaControls', 'LiquidGlassNowPlayingBar',
  'LiquidGlassPhotoInspector', 'GlassImageViewer', 'GlassGallery',
  'GlassCarousel', 'LiquidGlassCarouselRail',
  'ImageList', 'ImageListItem', 'ImageListItemBar', 'GlassLazyImage',
  'GlassVideoPlayer', 'GlassAdvancedVideoPlayer', 'GlassAdvancedAudioPlayer',
  'GlassMediaProvider', 'GlassVoiceWaveform', 'GlassMusicVisualizer',
  'ParticleBackground', 'GlassParticles', 'GlassParticleField',
  'AuroraBackground', 'AuroraOrb', 'AtmosphericBackground',
  'GlassDynamicAtmosphere', 'DynamicAtmosphere', 'GlassMeshGradient',
  'AuroraPro', 'SeasonalParticles', 'GlassAuroraDisplay', 'GlassNebulaClouds',
  'LiquidGlassBackdropSampler', 'useLiquidGlassBackdrop',
];

/** Names with a shipped aura-glass/compat adapter. */
const COMPAT_NAMES = new Set([
  'LiquidGlassMediaControls', 'GlassMediaControls', 'LiquidGlassNowPlayingBar',
  'LiquidGlassPhotoInspector', 'GlassImageViewer', 'GlassGallery',
  'GlassCarousel', 'LiquidGlassCarouselRail',
  'AuroraBackground', 'AuroraOrb', 'AtmosphericBackground',
  'GlassDynamicAtmosphere', 'DynamicAtmosphere', 'GlassMeshGradient',
]);

function* compatFiles(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) yield* compatFiles(p);
    else if (n.endsWith('.tsx')) yield p;
  }
}

describe('W4 deprecation coverage (SURF-398)', () => {
  it.each(N9)('%s has a deprecation row', (name) => {
    expect(bySymbol.has(name)).toBe(true);
  });

  it('compat-covered names point at their adapter and keep removeIn 6.0.0', () => {
    for (const name of COMPAT_NAMES) {
      const row = bySymbol.get(name);
      expect(row).toBeDefined();
      expect(row!.compat).toBe(name === 'DynamicAtmosphere' ? 'GlassDynamicAtmosphere' : name);
      expect(row!.removeIn).toBe('6.0.0');
      expect(row!.breaking).toBe('B4');
    }
  });

  it('removed names carry codemod "removed" and removeIn 5.0.0', () => {
    for (const name of N9) {
      if (COMPAT_NAMES.has(name)) continue;
      const row = bySymbol.get(name);
      if (!row) continue; // covered by the it.each above
      expect(row.codemod).toBe('removed');
      expect(row.removeIn).toBe('5.0.0');
    }
  });

  it('every W4 (§9 media/backdrop) row ids to DEP-S06xx', () => {
    // Ids are pre-allocated per lane (W1 S0001–0199 … W4 S0600–0799); rows
    // from other lanes in the same fragment use their own ranges.
    for (const name of N9) {
      const row = bySymbol.get(name);
      if (!row) continue; // covered by the it.each above
      expect(row.id).toMatch(/^DEP-S06\d\d$/);
    }
  });

  it('every row has since 4.2.0/4.3.0, doc anchor #dep-s0NNN, message <= 200', () => {
    for (const r of rows) {
      expect(r.id).toMatch(/^DEP-S\d{4}$/);
      expect(r.doc).toBe(`#${r.id.toLowerCase()}`);
      expect(['4.2.0', '4.3.0']).toContain(r.since);
      expect(r.message.length).toBeLessThanOrEqual(200);
    }
  });

  it('every shipped W4 compat adapter file has a deprecation row', () => {
    const dir = join(__dirname, '..', '..', 'src', 'compat', 'surf');
    const files = [...compatFiles(dir)].filter((f) => f.includes('/media/') || f.includes('/backdrops/'));
    const adapterNames = files.map((f) => f.split('/').pop()!.replace(/\.tsx$/, ''));
    expect(adapterNames.length).toBeGreaterThanOrEqual(13);
    for (const name of adapterNames) {
      if (name === 'GlassDynamicAtmosphere' || name === 'DynamicAtmosphere') continue;
      expect(bySymbol.has(name)).toBe(true);
    }
  });
});
