import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'Dialog',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 15,
  rsc: 'client',
  parts: [
    'trigger', 'close', 'backdrop', 'popup', 'title', 'description',
    'header', 'body', 'footer',
  ],
  states: [
    'popup-open', 'open', 'closed', 'starting-style', 'ending-style',
    'nested', 'nested-dialog-open', 'nested-open', 'animating',
  ],
  variants: {
    // REQ-CMP-89: DialogSize is sm|md|lg; wide/fullscreen are the appearance axis
    size: ['sm', 'md', 'lg'],
    placement: ['center', 'top'],
    variant: ['regular', 'identity'],
    prominent: ['true', 'false'],
    modal: ['true', 'false', 'trap-focus'],
  },
  material: { layer: 'overlay', refractionEligible: false },
  apg: 'dialog-modal',
  budgetKb: 20,
  migration: [
    {
      from: 'GlassModal',
      props: {
        open: 'open',
        onClose: { to: 'onOpenChange' },
        title: 'Dialog.Title',
        description: 'Dialog.Description',
        footer: 'Dialog.Footer',
        role: null, // role=alertdialog → AlertDialog (manual check)
        size: { to: 'size', values: { small: 'sm', medium: 'md', large: 'lg', fullscreen: 'full' } },
        variant: { to: 'component', values: { drawer: 'Sheet', fullscreen: 'Dialog size=full' } },
        closeOnBackdropClick: 'dismissible',
        closeOnOverlayClick: 'dismissible',
        closeOnEscape: null,
        backdropBlur: null,
        material: null,
        materialProps: null,
        consciousness: null,
        predictive: null,
        adaptive: null,
        eyeTracking: null,
        trackAchievements: null,
        animation: null,
        compact: null,
        isContained: null,
      },
      selectors: {
        '.glass-modal': '.ag-dialog-popup',
        '.glass-modal-backdrop': '.ag-scrim',
        '.glass-modal-content': "[data-ag-part='popup']",
        '.glass-modal-title': "[data-ag-part='title']",
        '.glass-modal-close': "[data-ag-part='close']",
      },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassDialog',
      props: {
        open: 'open',
        onClose: { to: 'onOpenChange' },
        title: 'Dialog.Title',
        description: 'Dialog.Description',
        footer: 'Dialog.Footer',
        size: 'size',
        closeOnBackdropClick: 'dismissible',
        backdropBlur: null,
        material: null,
        materialProps: null,
        animation: null,
        compact: null,
      },
      selectors: {
        '.glass-dialog': '.ag-dialog-popup',
        '.glass-dialog-backdrop': '.ag-scrim',
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
