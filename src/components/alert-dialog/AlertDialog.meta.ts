import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'AlertDialog',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 16,
  rsc: 'client',
  parts: [
    'trigger', 'backdrop', 'popup', 'title', 'description',
    'cancel', 'action', 'header', 'body', 'footer',
  ],
  states: [
    'popup-open', 'open', 'closed', 'starting-style', 'ending-style',
    'nested', 'nested-dialog-open', 'animating',
  ],
  variants: {
    intent: ['neutral', 'danger'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'alertdialog',
  budgetKb: 20,
  migration: [
    {
      from: 'GlassModal',
      props: {
        role: { to: 'component', values: { alertdialog: 'AlertDialog' } },
        open: 'open',
        onClose: { to: 'onOpenChange' },
        confirmText: 'AlertDialog.Action',
        cancelText: 'AlertDialog.Cancel',
        destructive: { to: 'intent', values: { true: 'danger' } },
      },
      selectors: {
        '.glass-modal[role="alertdialog"]': '.ag-alert-dialog-popup',
      },
      automation: 'partial',
      compat: true,
    },
    {
      from: 'GlassDialog',
      props: {
        role: { to: 'component', values: { alertdialog: 'AlertDialog' } },
        confirmText: 'AlertDialog.Action',
        cancelText: 'AlertDialog.Cancel',
        destructive: { to: 'intent', values: { true: 'danger' } },
      },
      selectors: { '.glass-dialog': '.ag-alert-dialog' }, automation: 'partial',
      compat: true,
    },
  ],
});

export default meta;
