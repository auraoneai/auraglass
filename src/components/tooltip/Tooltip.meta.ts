import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

/* CMP-269 (REQ-CMP-22): Tooltip meta — thickness thin, budgetKb 10,
   blurredLayers 1, apg tooltip, lineage rows per §2.4. */
const meta: ControlMeta = defineMeta({
  name: 'Tooltip',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 20,
  rsc: 'client',
  parts: ['provider', 'trigger', 'positioner', 'popup', 'arrow'],
  states: ['open', 'closed', 'starting-style', 'ending-style', 'instant', 'animating'],
  variants: {
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    variant: ['regular'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'tooltip',
  budgetKb: 10,
  migration: [
    {
      from: 'GlassTooltip',
      props: {
        content: 'TooltipPopup children',
        placement: 'Positioner side/align',
        delay: 'Provider delay',
      },
      automation: 'full', // duplicate def at GlassPopover.tsx:678 folds into this component
      compat: true,
    },
    { from: 'ChartTooltip', props: {}, automation: 'manual', compat: false },
  ],
});
export default meta;
