import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'TreeView',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: true,
  rsc: 'client',
  parts: ['tree', 'treeitem', 'treeitem-label', 'treeitem-chevron', 'treeitem-children'],
  states: ['expanded', 'collapsed', 'selected', 'focused'],
  variants: {},
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/',
  budgetKb: 8,
  migration: [
    { from: 'GlassTreeView', props: { nodes: 'items', selectedId: 'selectedKeys', onSelect: 'onSelectionChange' }, automation: 'mostly', compat: true },
    { from: 'TreeView', props: { nodes: 'items', selectedId: 'selectedKeys', onSelect: 'onSelectionChange' }, automation: 'mostly', compat: true },
    { from: 'GlassFileTree', props: {}, automation: 'manual', compat: true },
    { from: 'GlassFileExplorer', props: {}, automation: 'manual', compat: true },
  ],
  selectors: [{ from: '.glass-tree-view', to: '[data-ag-part="tree"]' }],
});
