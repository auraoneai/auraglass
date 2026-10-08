/** @jest-environment jsdom */
// tests/media/compat.test.tsx — SURF-509: every W4 compat adapter renders
// from its 4.x story props and fires exactly one dev warning (REQ-SURF-13).

import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../src/theme';
import { PORTAL_ROOT_MARKUP } from '../../src/contracts/preferences';

import { LiquidGlassMediaControls } from '../../src/compat/surf/media/LiquidGlassMediaControls';
import { GlassMediaControls } from '../../src/compat/surf/media/GlassMediaControls';
import { LiquidGlassNowPlayingBar } from '../../src/compat/surf/media/LiquidGlassNowPlayingBar';
import { LiquidGlassPhotoInspector } from '../../src/compat/surf/media/LiquidGlassPhotoInspector';
import { GlassImageViewer } from '../../src/compat/surf/media/GlassImageViewer';
import { GlassGallery } from '../../src/compat/surf/media/GlassGallery';
import { GlassCarousel } from '../../src/compat/surf/media/GlassCarousel';
import { LiquidGlassCarouselRail } from '../../src/compat/surf/media/LiquidGlassCarouselRail';
import { AuroraBackground } from '../../src/compat/surf/backdrops/AuroraBackground';
import { AuroraOrb } from '../../src/compat/surf/backdrops/AuroraOrb';
import { AtmosphericBackground } from '../../src/compat/surf/backdrops/AtmosphericBackground';
import { GlassDynamicAtmosphere, DynamicAtmosphere } from '../../src/compat/surf/backdrops/GlassDynamicAtmosphere';
import { GlassMeshGradient } from '../../src/compat/surf/backdrops/GlassMeshGradient';

const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

function withPortal() {
  if (!document.body.querySelector('[data-ag-portal-root]')) {
    document.body.insertAdjacentHTML('beforeend', PORTAL_ROOT_MARKUP);
  }
}

describe('compat media adapters (REQ-SURF-13)', () => {
  it('LiquidGlassMediaControls maps onPlayPause → onPlayingChange and warns once', () => {
    const onPlayPause = jest.fn();
    render(<LiquidGlassMediaControls playing={false} onPlayPause={onPlayPause} duration={120} />);
    expect(document.querySelector('[data-ag-part="media-controls"]')).toBeTruthy();
    fireEvent.click(document.querySelector('[data-ag-part="media-play"]')!);
    expect(onPlayPause).toHaveBeenCalledWith(true);
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('LiquidGlassMediaControls'))).toHaveLength(1);
  });
  it('GlassMediaControls renders the toolbar', () => {
    render(<GlassMediaControls playing={false} />);
    expect(document.querySelector('[role="toolbar"]')).toBeTruthy();
  });
  it('LiquidGlassNowPlayingBar renders title + progressbar', () => {
    const { container } = render(<LiquidGlassNowPlayingBar playing={false} title="Track" subtitle="Artist" />);
    expect(container.textContent).toContain('Track');
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy();
  });
  it('GlassImageViewer images → items opens the popup', () => {
    withPortal();
    const { container } = render(
      <AuraGlassProvider>
        <GlassImageViewer images={[{ src: '/a.jpg', alt: 'a' }, { src: '/b.jpg' }]} />
      </AuraGlassProvider>,
    );
    const triggers = container.querySelectorAll('[data-ag-part="image-viewer-trigger"]');
    expect(triggers).toHaveLength(2);
    fireEvent.click(triggers[0]!);
    expect(document.body.querySelector('[data-ag-part="image-viewer-popup"]')).toBeTruthy();
    document.body.querySelector('[data-ag-portal-root]')?.remove();
  });
  it('GlassGallery renders a grid of triggers', () => {
    withPortal();
    const { container } = render(
      <AuraGlassProvider>
        <GlassGallery images={[{ src: '/a.jpg' }, { src: '/b.jpg' }]} />
      </AuraGlassProvider>,
    );
    expect(container.querySelectorAll('[data-ag-part="image-viewer-trigger"]')).toHaveLength(2);
    document.body.querySelector('[data-ag-portal-root]')?.remove();
  });
  it('LiquidGlassPhotoInspector renders with a photo', () => {
    withPortal();
    render(
      <AuraGlassProvider>
        <LiquidGlassPhotoInspector photo={{ src: '/p.jpg', alt: 'p' }} open />
      </AuraGlassProvider>,
    );
    expect(document.body.querySelector('[data-ag-part="image-viewer-popup"]')).toBeTruthy();
    document.body.querySelector('[data-ag-portal-root]')?.remove();
  });
  it('GlassCarousel infinite → loop; children become slides', () => {
    const { container } = render(
      <GlassCarousel label="C" infinite><div>a</div><div>b</div></GlassCarousel>,
    );
    expect(container.querySelector('[aria-roledescription="carousel"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-ag-part="carousel-slide"]')).toHaveLength(2);
    const next = container.querySelector('[data-ag-part="carousel-next"]')!;
    expect(next.getAttribute('aria-disabled')).not.toBe('true');
  });
  it('LiquidGlassCarouselRail renders', () => {
    const { container } = render(<LiquidGlassCarouselRail items={[<div key="a">a</div>]} label="R" />);
    expect(container.querySelector('[aria-roledescription="carousel"]')).toBeTruthy();
  });
  it('backdrop adapters render the Backdrop root', () => {
    for (const [C, props] of [
      [AuroraBackground, { motion: 'subtle' }],
      [AuroraOrb, {}],
      [AtmosphericBackground, { variant: 'storm' }],
      [GlassDynamicAtmosphere, { type: 'sunset' }],
      [DynamicAtmosphere, {}],
      [GlassMeshGradient, { colors: ['#fff', '#000'], animate: true }],
    ] as const) {
      const { container } = render(<C {...(props as Record<string, unknown>)} />);
      expect(container.querySelector('.ag-backdrop')).toBeTruthy();
    }
  });
});
