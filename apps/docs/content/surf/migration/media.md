# Migrating to the 5.0 media layer

4.x `GlassImageViewer`, `GlassVideoPlayer`, `GlassAudioPlayer`, and
`GlassLightbox` split across `aura-glass/media` and the registry player
items: the library ships viewer and controls; the players are items that
compose them over a media element you own.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassImageViewer` | `ImageViewer` (`aura-glass/media`) |
| `GlassVideoPlayer` | the `media-video-player` registry item (`MediaControls` + `useMediaElement` from `aura-glass/media`) |
| `GlassAudioPlayer` | the `media-audio-player` registry item (`MediaControls` + `useMediaElement` from `aura-glass/media`) |
| `GlassLightbox` | `ImageViewer` (`aura-glass/media`) — its popup is the lightbox |
| `GlassMediaCarousel` | `CarouselRail` (`aura-glass/media`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `src` | `items` (`ImageViewer`), `slides` (`CarouselRail`), or the registry item's `src` | viewer items need an `id` and a required `alt` |
| `captions` | `<track kind="captions">` children (registry players) / `textTracks` (`MediaControls`) | real WebVTT tracks on your media element |
| `autoPlay` | `autoplay` (`CarouselRail`: `false` or `{ interval }`) | rotates only under the continuous-animation gate |
| `onTimeUpdate` | `MediaControls` `currentTime` + `onSeek` | read playback state from `useMediaElement` |
| `index` (carousel) | `index` + `onIndexChange` | grammar triple |

## Notes

- Right-to-left and CJK line-wrap are first-class: `dir`/`locale` flow to
  captions and controls.
- The `ImageViewer` popup focuses the dialog and restores focus on close;
  don't wrap it in your own focus trap.

## Compat

`GlassImageViewer`, `GlassCarousel` and `GlassMediaControls` adapters in
`aura-glass/compat` delegate to `aura-glass/media` and warn once; silence
them with `<AuraGlassProvider deprecations="silent">`; removed at `6.0`.
The 4.x players have no compat adapter — install the registry items.
Codemod: `npx aura-glass-cli migrate 4to5 --transform media-backdrops`.
