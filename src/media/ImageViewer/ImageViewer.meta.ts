import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ImageViewer',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  rsc: 'client',
  // No Dialog 'backdrop' part: the popup renders with backdrop={false}; image-viewer-scrim is the scrim.
  parts: ['hit-area', 'image-viewer-caption', 'image-viewer-close', 'image-viewer-counter', 'image-viewer-inspector', 'image-viewer-next', 'image-viewer-popup', 'image-viewer-prev', 'image-viewer-scrim', 'image-viewer-stage', 'image-viewer-toolbar', 'image-viewer-trigger', 'image-viewer-zoom-in', 'image-viewer-zoom-out', 'image-viewer-zoom-reset', 'media-glyph'],
  states: ['closed', 'open', 'zoomed'],
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  variants: {},
  budgetKb: 13,
  migration: [
    { from: 'GlassImageViewer', props: { images: 'items', initialIndex: 'defaultValue' }, selectors: { '.glass-image-viewer': '[data-ag-part="image-viewer-popup"]' }, automation: 'partial', compat: true },
    { from: 'GlassGallery', props: { images: 'items' }, selectors: { '.glass-image-viewer': '[data-ag-part="image-viewer-popup"]' }, automation: 'partial', compat: true },
    { from: 'LiquidGlassPhotoInspector', props: { photo: 'items' }, selectors: { '.glass-image-viewer': '[data-ag-part="image-viewer-popup"]' }, automation: 'partial', compat: true },
  ],
});
