import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

/* CMP-288 (REQ-CMP-22): Toast meta — thickness regular, budgetKb 14,
   apg alert + status live regions, lineage rows per §2.4. */
const meta: ControlMeta = defineMeta({
  name: 'Toast',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 21,
  rsc: 'client',
  parts: [
    'provider', 'viewport', 'root', 'content', 'title', 'description',
    'action', 'close', 'progress',
  ],
  states: [
    'open', 'closed', 'starting-style', 'ending-style', 'animating',
    'limited', 'swiping',
  ],
  variants: {
    intent: ['info', 'success', 'warning', 'error'],
    position: [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ],
    variant: ['regular'],
  },
  material: { layer: 'transient', refractionEligible: false },
  apg: 'alert',
  budgetKb: 14,
  migration: [
    {
      from: 'GlassToast',
      props: {
        message: 'Toast.Description',
        type: 'intent',
        duration: 'timeout',
        onClose: 'useToast close',
      },
      selectors: { '.glass-toast': '.ag-toast' }, automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassSnackbar',
      props: { message: 'Toast.Title', action: 'Toast.Action' },
      selectors: { '.glass-snackbar': '.ag-toast' }, automation: 'partial',
      compat: false,
    },
    {
      from: 'toast',
      props: { 'toast()': 'useToast().add/success/error', 'toast.promise': 'useToast().promise' },
      selectors: { '.glass-toast': '.ag-toast' }, automation: 'partial',
      compat: false,
    },
    { from: 'GlassNotificationItem', props: {}, automation: 'mostly', compat: true },
    { from: 'GlassNotificationProvider', props: {}, automation: 'mostly', compat: true },
    { from: 'useNotifications', props: {}, automation: 'mostly', compat: true },
  ],
});
export default meta;
