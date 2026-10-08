import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ImageViewer',
  owner: 'SURF',
  entry: './media',
  tier: 'T2',
  rsc: 'client',
  parts: ['viewer', 'trigger', 'popup', 'stage', 'toolbar', 'caption', 'inspector', 'prev', 'next', 'counter', 'zoom-in', 'zoom-out', 'zoom-reset', 'close'],
  states: ['closed', 'open', 'zoomed'],
  variants: {},
  budgetKb: 10,
  migration: [
    { from: 'GlassImageViewer', props: { images: 'items', initialIndex: 'defaultValue' }, automation: 'partial', compat: true },
    { from: 'GlassGallery', props: { images: 'items' }, automation: 'partial', compat: true },
    { from: 'LiquidGlassPhotoInspector', props: { photo: 'items' }, automation: 'partial', compat: true },
  ],
  selectors: [{ from: '.glass-image-viewer', to: '[data-ag-part="image-viewer-popup"]' }],
});
