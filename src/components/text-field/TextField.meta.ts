import { defineMeta } from '../../foundation';
import type { ControlMeta } from '../control-shared/meta';

const meta: ControlMeta = defineMeta({
  name: 'TextField',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  flagship: 9,
  rsc: 'client',
  parts: ['root', 'label', 'control-shell', 'control', 'adornment-start', 'adornment-end', 'description', 'error', 'counter'],
  states: ['hover', 'focus-visible', 'disabled', 'readOnly', 'invalid', 'valid'],
  variants: {
    invalid: ['true', 'false'],
    disabled: ['true', 'false'],
    multiline: ['true', 'false'],
    size: ['sm', 'md', 'lg'],
  },
  material: { layer: 'content', refractionEligible: false },
  apg: 'textbox',
  budgetKb: 5,
  migration: [
    {
      from: 'GlassInput',
      props: {
        onChange: { to: 'onValueChange' },
        leftIcon: 'startAdornment',
        rightIcon: 'endAdornment',
        icon: 'startAdornment',
        helperText: 'description',
        errorMessage: 'error',
        isInvalid: 'error (node) or invalid via Field.Root',
        fullWidth: null,
        glassVariant: null,
      },
      automation: 'mostly',
      compat: true,
    },
    {
      from: 'GlassTextarea',
      props: {
        onChange: { to: 'onValueChange' },
        helperText: 'description',
        errorMessage: 'error',
      },
      automation: 'mostly',
      compat: true,
    },
  ],
});

export default meta;
