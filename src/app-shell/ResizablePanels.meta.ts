import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'ResizablePanels',
  owner: 'SURF',
  entry: '.',
  flagship: 30,
  tier: 'T1',
  rsc: 'client',
  parts: ['resizable-panels', 'resizable-panel', 'resize-handle'],
  states: ['collapsed'],
  variants: {},
  migration: [{ from: 'GlassResizablePanels', props: {}, automation: 'mostly', compat: true }],
});
