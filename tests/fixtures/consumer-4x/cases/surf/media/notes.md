# consumer-4x SURF/media cases (SURF-507)

Frozen 4.x usage the L11 codemod canary runs `migrate 4to5` over:

- `MediaControls.page.tsx` — LiquidGlassMediaControls (`onPlayPause` →
  `onPlayingChange`), GlassVideoPlayer (`sources`) → compat /
  removed (`media-video-player` registry item).
- `Carousel.page.tsx` — GlassCarousel (slidesToShow → slidesPerView, autoPlay
  → autoplay, infinite → loop), GlassGallery (removed, `media-gallery`),
  GlassImageViewer (`images` → `items`, `initialIndex` → `defaultValue`).
- `Backdrop.page.tsx` — AuroraBackground/AtmosphericBackground/
  DynamicAtmosphere → Backdrop presets (media-backdrops area transform).
  `GlassBackdrop`, `WaveBackdrop` and `GlassAudioPlayer` are not exports of
  `aura-glass@4.1.0`, so no case uses them.

All three are `report` cases in `../canary.json`: their TODOs are recorded,
not asserted.

- `story-args.tsx` preserves frozen 4.x story props for the compatibility adapter tests in `tests/media/compat.test.tsx`.
