import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'ResizablePanels',
  owner: 'SURF',
  entry: './app-shell',
  flagship: 30,
  tier: 'T1',
  rsc: 'client',
  parts: ['resizable-panel', 'resizable-panels', 'resize-handle'],
  states: ['collapsed'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/',
  variants: {},
  migration: [{ from: 'GlassResizablePanels', props: {}, automation: 'mostly', compat: true }],
});
