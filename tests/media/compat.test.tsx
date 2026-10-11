/** @jest-environment jsdom */
// REQ-SURF-13 (W4): every media + backdrop compat adapter renders its 5.0
// successor from its 4.x story props and warns exactly once with its DEP-S id.
// GlassGallery is a removed name with no adapter (media-gallery registry item).
import { describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { expectAdapter, type CompatRow } from '../app-shell/compat-harness';
import { W4_STORY_ARGS as A } from '../fixtures/consumer-4x/cases/surf/media/story-args';
import * as compat from '../../src/compat/surf';
import { COMPAT_IDS } from '../fixtures/consumer-4x/cases/surf/compat-ids';

type C = React.ComponentType<Record<string, unknown>>;
const row = (name: keyof typeof compat & keyof typeof A, part: string, extra?: Record<string, unknown>): CompatRow => ({
  name, id: COMPAT_IDS[name]!.id, part, C: compat[name] as unknown as C, args: A[name]!, ...(extra ? { extra } : {}),
});

export const W4_ROWS: CompatRow[] = [
  row('LiquidGlassMediaControls', '[data-ag-part="media-controls"]', { onPlayPause: jest.fn(), onSeek: jest.fn(), onVolumeChange: jest.fn() }),
  row('GlassMediaControls', '[data-ag-part="media-controls"]', { onPlayPause: jest.fn() }),
  row('LiquidGlassNowPlayingBar', '[data-ag-part="now-playing-title"]', { onPlayPause: jest.fn() }),
  row('LiquidGlassPhotoInspector', 'aside[data-ag-part="inspector"][aria-label="Photo Inspector"] [data-ag-part="inspector-field"]', { onOpenChange: jest.fn() }),
  row('GlassImageViewer', '[data-ag-part="image-viewer-trigger"]', { onImageChange: jest.fn() }),
  row('GlassCarousel', '[aria-roledescription="carousel"] [data-ag-part="carousel-slide"]', { onSlideChange: jest.fn() }),
  row('LiquidGlassCarouselRail', '[aria-roledescription="carousel"] [data-ag-part="carousel-slide"]'),
  row('AuroraBackground', '.ag-backdrop'),
  row('AuroraOrb', '.ag-backdrop'),
  row('AtmosphericBackground', '.ag-backdrop'),
  row('GlassDynamicAtmosphere', '.ag-backdrop'),
  row('DynamicAtmosphere', '.ag-backdrop'),
  row('GlassMeshGradient', '.ag-backdrop'),
];

describe('W4 compat adapters render from 4.x story props (REQ-SURF-13)', () => {
  it.each(W4_ROWS.map((r) => [r.name, r] as const))('%s', (_name, r) => {
    expectAdapter(r);
  });

  it('GlassGallery is not an adapter (removed name)', () => {
    expect('GlassGallery' in compat).toBe(false);
  });
});

describe('W4 prop mapping', () => {
  const quiet = () => jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  it('LiquidGlassMediaControls fires onPlayPause from the play control', () => {
    quiet();
    const onPlayPause = jest.fn();
    const { container } = render(<compat.LiquidGlassMediaControls {...A.LiquidGlassMediaControls!.props} onPlayPause={onPlayPause} />);
    fireEvent.click(container.querySelector('[data-ag-part="media-play"]')!);
    expect(onPlayPause).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('GlassImageViewer maps description → caption and alt', () => {
    quiet();
    const { container } = render(<compat.GlassImageViewer {...A.GlassImageViewer!.props} />);
    const imgs = [...container.querySelectorAll('[data-ag-part="image-viewer-trigger"] img')].map((i) => i.getAttribute('alt'));
    expect(imgs).toEqual(['Sample Image 1', 'Sample Image 2', 'Sample Image 3']);
    cleanup();
  });

  it('GlassCarousel infinite → loop; items become slides', () => {
    quiet();
    const { container } = render(
      <compat.GlassCarousel infinite items={[{ id: 'a', content: 'A' }, { id: 'b', content: 'B' }]} />,
    );
    expect(container.querySelectorAll('[data-ag-part="carousel-slide"]')).toHaveLength(2);
    expect(container.querySelector('[data-ag-part="carousel-next"]')!.getAttribute('aria-disabled')).not.toBe('true');
    cleanup();
  });

  it('backdrop adapters map motion / scheme / palette', () => {
    quiet();
    const mesh = render(<compat.GlassMeshGradient variant="dark" />);
    const m = mesh.container.querySelector('.ag-backdrop')!;
    expect(m.getAttribute('data-ag-motion')).toBe('drift');
    cleanup();
    const orb = render(<compat.AuroraOrb palette="ocean" pulse={false} />);
    expect(orb.container.querySelector('.ag-backdrop')!.getAttribute('data-ag-motion')).toBe('static');
    cleanup();
  });
});
