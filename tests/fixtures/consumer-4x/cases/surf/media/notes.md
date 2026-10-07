# consumer-4x SURF/media cases (SURF-507)

Frozen 4.x usage the L11 codemod canary runs `migrate 4to5` over:

- `MediaControls.page.tsx` — LiquidGlassMediaControls (`onPlayPause` →
  `onPlayingChange`), GlassVideoPlayer/GlassAudioPlayer → compat
  LiquidGlassMediaControls-driven compositions.
- `Carousel.page.tsx` — GlassCarousel (slidesToShow → slidesPerView, autoPlay
  → autoplay, infinite → loop), GlassGallery (compat), GlassImageViewer.
- `Backdrop.page.tsx` — AuroraBackground/GlassBackdrop/DynamicAtmosphere/
  WaveBackdrop → Backdrop presets (media-backdrops area transform).
