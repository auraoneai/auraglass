# LiquidGlassBackdropSampler

`LiquidGlassBackdropSampler` and `useLiquidGlassBackdrop` estimate luminance, dominant color, media richness, and dimming requirements behind Liquid Glass.

The sampler is best-effort and SSR-safe. It uses computed style and DOM observation first, and falls back to neutral values when pixel-level backdrop sampling is unavailable.
