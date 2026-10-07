/* ./media barrel (contract §4.6): exactly 7 exports at 5.0 —
 * MediaControls, NowPlayingBar, ImageViewer, CarouselRail, useMediaElement,
 * MediaScrubber, formatMediaTime. Waveform is 5.1 and NOT exported here.
 * No "use client" on this module (barrels stay neutral). */

// --- lane W4 begin ---
export { useMediaElement } from './useMediaElement';
export type { MediaHandle, MediaState, MediaError, MediaTextTrack, UseMediaElementOptions, MediaSessionMetadataInit } from './useMediaElement';
export { formatMediaTime } from './formatMediaTime';
export { MediaControls } from './MediaControls/MediaControls';
export type { MediaControlsRootProps } from './MediaControls/MediaControls';
export { MediaScrubber } from './MediaScrubber/MediaScrubber';
export type { MediaScrubberProps } from './MediaScrubber/MediaScrubber';
export { NowPlayingBar } from './NowPlayingBar/NowPlayingBar';
export type { NowPlayingBarRootProps } from './NowPlayingBar/NowPlayingBar';
export { ImageViewer } from './ImageViewer/ImageViewer';
export type { ImageViewerItem, ImageViewerRootProps, ImageViewerPopupProps } from './ImageViewer/ImageViewer';
export { CarouselRail } from './CarouselRail/CarouselRail';
export type { CarouselRailRootProps, CarouselRailSlide } from './CarouselRail/CarouselRail';
// Waveform ships at 5.1 — internal for now, not a barrel export.
// --- lane W4 end ---
