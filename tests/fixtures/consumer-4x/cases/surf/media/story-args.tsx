/* Frozen 4.x story props for the W4 (media + backdrops) compat adapters —
   REQ-SURF-13. Copied from the named release/4.x story files (645735fce):
   meta `args` merged with the Default story's args / explicit props.
   viewerImage() data URLs are replaced by static paths; styles omitted;
   `fn()` callbacks are injected by the test. GlassGallery has no adapter
   (removed name, media-gallery registry item). */
import * as React from 'react';
import type { StoryArgs } from '../app-shell/story-args';

export const W4_STORY_ARGS: Record<string, StoryArgs> = {
  LiquidGlassMediaControls: {
    story: 'src/components/media/LiquidGlassMediaControls.stories.tsx (Default)',
    props: { playing: false, currentTime: 30, duration: 120, volume: 0.68, variant: 'clear' },
  },
  GlassMediaControls: {
    story: 'src/components/media/LiquidGlassMediaControls.tsx GlassMediaControls alias (no own 4.x story; LiquidGlassMediaControls Default props)',
    props: { playing: false, currentTime: 30, duration: 120, volume: 0.68 },
  },
  LiquidGlassNowPlayingBar: {
    story: 'src/components/media/LiquidGlassNowPlayingBar.stories.tsx (Default)',
    props: { title: 'Liquid Study', subtitle: 'Aura System', progress: 0.42, artwork: <div>art</div> },
    expectText: ['Liquid Study', 'Aura System'],
  },
  LiquidGlassPhotoInspector: {
    story: 'src/components/media/LiquidGlassPhotoInspector.stories.tsx (Default)',
    props: {
      open: true,
      title: 'Photo Inspector',
      selectionLabel: 'Campaign hero - selected',
      metadata: { Camera: 'AuraCam Pro', Lens: '35mm', Exposure: '1/250', Color: 'Display P3' },
      tags: ['portrait', 'review', 'hero'],
      materialVariant: 'clear',
    },
    expectText: ['Photo Inspector', 'Campaign hero - selected', 'AuraCam Pro', 'portrait, review, hero'],
  },
  GlassImageViewer: {
    story: 'src/components/interactive/GlassImageViewer.stories.tsx (meta args)',
    props: {
      images: [
        { src: '/landscape.svg', alt: 'Sample Image 1', title: 'Beautiful Landscape', description: 'A stunning landscape view', width: 800, height: 600 },
        { src: '/architecture.svg', alt: 'Sample Image 2', title: 'Urban Architecture', description: 'Modern city architecture', width: 800, height: 600 },
        { src: '/nature.svg', alt: 'Sample Image 3', title: 'Nature Close-up', description: 'Detailed nature photography', width: 800, height: 600 },
      ],
      initialIndex: 0,
      enableZoom: true,
      enablePan: true,
      enableRotation: true,
      enableFullscreen: true,
      enableNavigation: true,
      showZoomControls: true,
      showRotationControls: true,
      showDownloadButton: true,
      showImageInfo: true,
      autoPlay: false,
      autoPlayInterval: 3000,
    },
  },
  GlassCarousel: {
    story: 'src/components/interactive/GlassCarousel.stories.tsx (Default)',
    props: { children: 'Default' },
    expectText: ['Default'],
  },
  LiquidGlassCarouselRail: {
    story: 'src/components/data-display/LiquidGlassCarouselRail.stories.tsx (Default)',
    props: { items: Array.from({ length: 6 }, (_, i) => <div key={i}>Slide {i + 1}</div>) },
    expectText: ['Slide 1', 'Slide 6'],
  },
  AuroraBackground: {
    story: 'src/components/marketing/AuroraBackground.stories.tsx (meta args)',
    props: { particles: 24, grain: true, vignette: true, seed: 'storybook-contained' },
  },
  AuroraOrb: {
    story: 'src/components/marketing/AuroraOrb.stories.tsx (meta args)',
    props: { size: 280, pulse: true, glow: 'strong' },
  },
  AtmosphericBackground: {
    story: 'src/components/backgrounds/AtmosphericBackground.stories.tsx (meta args)',
    props: { variant: 'clear', intensity: 0.5, animate: false },
  },
  GlassDynamicAtmosphere: {
    story: 'src/components/backgrounds/GlassDynamicAtmosphere.stories.tsx (Default)',
    props: { type: 'subtle', intensity: 0.5, speed: 0.5 },
  },
  DynamicAtmosphere: {
    story: 'src/components/backgrounds/GlassDynamicAtmosphere.stories.tsx (DynamicAtmosphere alias; Default)',
    props: { type: 'subtle', intensity: 0.5, speed: 0.5 },
  },
  GlassMeshGradient: {
    story: 'src/components/advanced/GlassMeshGradient.stories.tsx (Default)',
    props: {
      'aria-label': 'GlassMeshGradient animated mesh gradient preview',
      colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#ffffff'],
      points: 6,
      speed: 0.32,
      blur: 72,
      opacity: 0.92,
      variant: 'vibrant',
    },
  },
};
