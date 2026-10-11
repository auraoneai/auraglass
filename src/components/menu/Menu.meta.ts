import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

/* CMP-280 (REQ-CMP-22): Menu meta — thickness regular, budgetKb 22,
   apg menu-button + menubar + context-menu lineage rows per §2.4. */
const meta: ControlMeta = defineMeta({
  name: 'Menu',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 22,
  rsc: 'client',
  parts: [
    'trigger', 'positioner', 'popup', 'arrow', 'item', 'link-item',
    'checkbox-item', 'radio-item', 'indicator', 'group', 'group-label',
    'separator', 'submenu-trigger', 'shortcut',
  ],
  states: [
    'open', 'closed', 'starting-style', 'ending-style', 'animating',
    'highlighted', 'disabled', 'checked', 'indeterminate',
  ],
  variants: {
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    loop: ['true', 'false'],
    variant: ['regular'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'menu-button',
  budgetKb: 22,
  migration: [
    {
      from: 'GlassMenu',
      props: {
        open: 'open',
        onClose: { to: 'onOpenChange' },
        items: 'Menu.Item children',
        side: 'Positioner side',
      },
      selectors: { '.glass-menu': '.ag-menu' }, automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassDropdown',
      props: { items: 'Menu.Item children', open: 'open' },
      selectors: { '.glass-dropdown': '.ag-menu' }, automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassContextMenu',
      props: { items: 'ContextMenu.Item children' },
      selectors: { '.glass-context-menu': '.ag-menu' }, automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassMenubar',
      props: { menus: 'Menubar>Menu.Root children' },
      selectors: { '.glass-menubar': '.ag-menu' }, automation: 'partial',
      compat: false,
    },
  ],
});
export default meta;
