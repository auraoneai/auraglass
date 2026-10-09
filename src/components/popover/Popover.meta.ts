import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

/* CMP-264 (REQ-CMP-22): Popover meta — thickness regular, budgetKb 14,
   blurredLayers 1, apg dialog (non-modal) + disclosure, lineage rows per §2.4. */
const meta: ControlMeta = defineMeta({
  name: 'Popover',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 19,
  rsc: 'client',
  parts: [
    'trigger', 'positioner', 'popup', 'arrow', 'title', 'description', 'close',
  ],
  states: [
    'open', 'closed', 'starting-style', 'ending-style', 'animating',
  ],
  variants: {
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    openOnHover: ['true', 'false'],
    variant: ['regular'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'dialog-modal',
  budgetKb: 14,
  migration: [
    {
      from: 'GlassPopover',
      props: {
        open: 'open',
        onClose: { to: 'onOpenChange' },
        title: 'Popover.Title',
        content: 'Popover.Popup children',
        side: 'Positioner side',
        align: 'Positioner align',
      },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassHoverCard',
      props: {
        open: 'open',
        trigger: 'Popover.Trigger openOnHover',
        content: 'Popover.Popup children',
      },
      automation: 'partial', // HoverCard successor = Trigger openOnHover + delay/closeDelay
      compat: false,
    },
    {
      from: 'GlassTooltip',
      props: { content: 'Popover.Popup children' },
      automation: 'partial', // rich/interactive content uses Popover; plain hints use Tooltip
      compat: false,
    },
    { from: 'GlassPositioner', props: {}, automation: 'mostly', compat: true },
    {
      from: 'GlassDropdown',
      props: { items: 'Menu/Popover composition', open: 'open' },
      automation: 'manual', // action-list dropdowns go to Menu; panels stay Popover
      compat: false,
    },
  ],
});
export default meta;
