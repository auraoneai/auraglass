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
module.exports = {
  strict: {
    'no-forward-ref': CONTROLS,
    'require-data-ag-part': CONTROLS,
  },
};
