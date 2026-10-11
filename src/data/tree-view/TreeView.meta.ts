import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'TreeView',
  owner: 'SURF',
  entry: './data',
  tier: 'T1',
  flagship: 33,
  rsc: 'client',
  parts: ['tree-item', 'tree-view'],
  states: ['expanded', 'collapsed', 'selected', 'focused'],
  variants: {},
  apg: 'treeview',
  budgetKb: 8,
  migration: [
    { from: 'GlassTreeView', props: { nodes: 'items', selectedId: 'selectedKeys', onSelect: 'onSelectionChange' }, selectors: { '.glass-tree-view': '[data-ag-part="tree"]' }, automation: 'mostly', compat: true },
    { from: 'TreeView', props: { nodes: 'items', selectedId: 'selectedKeys', onSelect: 'onSelectionChange' }, selectors: { '.glass-tree-view': '[data-ag-part="tree"]' }, automation: 'mostly', compat: true },
    { from: 'GlassFileTree', props: {}, selectors: { '.glass-tree-view': '[data-ag-part="tree"]' }, automation: 'manual', compat: true },
    { from: 'GlassFileExplorer', props: {}, selectors: { '.glass-tree-view': '[data-ag-part="tree"]' }, automation: 'manual', compat: true },
  ],
});
