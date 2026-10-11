# Migrating to the 5.0 media layer

4.x `GlassImageViewer`, `GlassVideoPlayer`, `GlassAudioPlayer`, and
`GlassLightbox` become `aura-glass/media`: viewer, captions, and image
blocks share one source model.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassImageViewer` | `ImageViewer` (`aura-glass/media`) |
| `GlassVideoPlayer` | `Video` (`aura-glass/media`) |
| `GlassAudioPlayer` | `Audio` (`aura-glass/media`) |
| `GlassLightbox` | `Lightbox` (`aura-glass/media`) |
| `GlassMediaCarousel` | `MediaCarousel` (`aura-glass/media`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `src` | `source={{ src, type }}` | typed source object |
| `captions` | `captions={{ tracks }}` | WebVTT track list |
| `autoPlay` | `autoplay` | gated by `prefers-reduced-motion` |
| `onTimeUpdate` | `time` + `onTimeChange` | grammar triple |
| `index` (carousel) | `index` + `onIndexChange` | grammar triple |

## Notes

- Right-to-left and CJK line-wrap are first-class: `dir`/`locale` flow to
  captions and controls.
- `Lightbox` focuses the dialog and restores focus on close; don't wrap it
  in your own focus trap.

## Compat

`Glass*Viewer|Player|Lightbox` adapters delegate to `aura-glass/media` and
warn once; `AG_COMPAT_MEDIA=1` silences; removed at `6.0`.
Codemod: `aura-glass-codemod media`.
