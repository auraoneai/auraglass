import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ImageViewer',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  rsc: 'client',
  parts: ['image-viewer-caption', 'image-viewer-close', 'image-viewer-counter', 'image-viewer-inspector', 'image-viewer-next', 'image-viewer-popup', 'image-viewer-prev', 'image-viewer-scrim', 'image-viewer-stage', 'image-viewer-toolbar', 'image-viewer-trigger', 'image-viewer-zoom-in', 'image-viewer-zoom-out', 'image-viewer-zoom-reset'],
  states: ['closed', 'open', 'zoomed'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  variants: {},
  budgetKb: 10,
  migration: [
    { from: 'GlassImageViewer', props: { images: 'items', initialIndex: 'defaultValue' }, automation: 'partial', compat: true },
    { from: 'GlassGallery', props: { images: 'items' }, automation: 'partial', compat: true },
    { from: 'LiquidGlassPhotoInspector', props: { photo: 'items' }, automation: 'partial', compat: true },
  ],
  selectors: [{ from: '.glass-image-viewer', to: '[data-ag-part="image-viewer-popup"]' }],
});
