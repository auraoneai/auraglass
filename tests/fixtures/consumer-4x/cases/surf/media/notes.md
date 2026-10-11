# consumer-4x SURF/media cases (SURF-507)

Frozen 4.x usage the L11 codemod canary runs `migrate 4to5` over:

- `MediaControls.page.tsx` — LiquidGlassMediaControls (`onPlayPause` →
  `onPlayingChange`), GlassVideoPlayer/GlassAudioPlayer → compat
  LiquidGlassMediaControls-driven compositions.
- `Carousel.page.tsx` — GlassCarousel (slidesToShow → slidesPerView, autoPlay
  → autoplay, infinite → loop), GlassGallery (removed name, no compat adapter:
  the codemod leaves a removed TODO pointing at the media-gallery registry
  item), GlassImageViewer.
- `Backdrop.page.tsx` — AuroraBackground/GlassBackdrop/DynamicAtmosphere/
  WaveBackdrop → Backdrop presets (media-backdrops area transform).
- `story-args.tsx` — frozen 4.x story props the compat tests render every W4
  adapter from (REQ-SURF-13, tests/media/compat.test.tsx).
