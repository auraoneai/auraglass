/* CMP-119: strict severity lanes for the $CONTROLS glob (PRD §5 controls dirs).
   eslint.config.js is contract-owned; this file is the verbatim seam the plugin
   loads — rules apply 'error' inside controls only (base agConfig keeps them
   repo-wide where registered). */
const CONTROLS = [
  'src/components/field/**/*.{ts,tsx}',
  'src/components/text-field/**/*.{ts,tsx}',
  'src/components/search-field/**/*.{ts,tsx}',
  'src/components/number-field/**/*.{ts,tsx}',
  'src/components/checkbox/**/*.{ts,tsx}',
  'src/components/radio-group/**/*.{ts,tsx}',
  'src/components/switch/**/*.{ts,tsx}',
  'src/components/slider/**/*.{ts,tsx}',
  'src/components/select/**/*.{ts,tsx}',
  'src/components/combobox/**/*.{ts,tsx}',
];
/* CMP-199: overlay scope — global-listener ban + the same strict component rules
   apply to every overlay dir (lane-3f/3i dirs included up front). */
const OVERLAYS = [
  'src/components/dialog/**/*.{ts,tsx}',
  'src/components/alert-dialog/**/*.{ts,tsx}',
  'src/components/sheet/**/*.{ts,tsx}',
  'src/components/popover/**/*.{ts,tsx}',
  'src/components/tooltip/**/*.{ts,tsx}',
  'src/components/menu/**/*.{ts,tsx}',
  'src/components/toast/**/*.{ts,tsx}',
  'src/components/overlays/**/*.{ts,tsx}',
];
module.exports = {
  strict: {
    'no-forward-ref': CONTROLS,
    'require-data-ag-part': CONTROLS,
    'no-forward-ref': [...CONTROLS, ...OVERLAYS],
    'require-data-ag-part': [...CONTROLS, ...OVERLAYS],
    'no-overlay-global-listeners': [
      'src/components/**/*.{ts,tsx}',
      'src/primitives/**/*.{ts,tsx}',
    ],
  },
};
