import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Sheet',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 17,
  rsc: 'client',
  parts: [
    'trigger', 'backdrop', 'popup', 'handle', 'title', 'description',
    'close', 'action', 'header', 'body', 'footer', 'hit-area',
  ],
  states: [
    'popup-open', 'open', 'closed', 'starting-style', 'ending-style',
    'dragging', 'animating', 'full-height',
  ],
  variants: {
    side: ['start', 'end', 'top', 'bottom', 'left', 'right'],
    preset: ['panel', 'action'],
    size: ['sm', 'md', 'lg'],
    modal: ['true', 'false'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'dialog-modal',
  budgetKb: 24,
  migration: [
    {
      from: 'GlassDrawer',
      props: { position: 'side', placement: 'side', snap: 'detents', open: 'open', onClose: { to: 'onOpenChange' } },
      selectors: { '.glass-drawer': '.ag-sheet-popup' },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassBottomSheet',
      props: { snap: 'detents', height: 'detents' },
      selectors: { '.glass-bottom-sheet': ".ag-sheet-popup[data-ag-side='bottom']" },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassActionSheet',
      props: { actions: 'preset', cancelText: 'Sheet.Close' },
      selectors: { '.glass-action-sheet': '.ag-sheet' }, automation: 'partial',
      compat: true,
    },
    {
      from: 'LiquidGlassAdaptiveSheet',
      props: { snap: 'detents' },
      selectors: { '.glass-liquid-glass-adaptive-sheet': '.ag-sheet' }, automation: 'partial',
      compat: true,
    },
    {
      from: 'MobileGlassBottomSheet',
      props: { snap: 'detents' },
      selectors: { '.glass-mobile-glass-bottom-sheet': '.ag-sheet' }, automation: 'partial',
      compat: true,
    },
    {
      from: 'GlassMobileNav',
      props: { position: 'side' },
      selectors: { '.glass-mobile-nav': '.ag-sheet' }, automation: 'manual',
      compat: false,
    },
  ],
});

export default meta;
