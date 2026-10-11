/* O1→O2 frozen seam: anchored-overlay lanes import ONLY through this barrel
   (never deep paths). Export names committed day-0 per contract S-30/S-34. */
export { overlayMaterial } from './overlaySurface';
export { defaultPositionerProps } from './positioning';
export { useOverlayLayer } from './useOverlayLayer';
export { useOverlayAnimating } from './useOverlayAnimating';
export { OverlayPortal } from './overlayPortal';
export { toOverlayReason } from './overlayTypes';
export type {
  OverlayKind, OverlayOpenChangeDetails, OverlayOpenReason as OverlayReason,
} from './overlayTypes';
