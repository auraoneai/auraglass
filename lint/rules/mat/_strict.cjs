/* lint/rules/mat/_strict.cjs — strict escalation table (MAT-099 mechanism,
   MAT-180 per-family escalation). eslint-plugin-auraglass.js reads
   { strict: { '<rule-name>': [glob, ...] } } and emits 'error' configs for
   those globs, on top of each rule's own agConfig severity.

   MAT-180: after each family deletion/migration PR (2e-B consumes the
   removal lanes), add that family's glob here so its optics are enforced at
   'error' while the rest of src/ stays at 'warn' via optics-baseline.json
   ratchet. On 5.0 GA the whole src/ glob escalates.

   MAT-233 wiring (REQ-MOT-64): motion-no-empty-animate is error on src/**;
   all other MOT rules stay warn until MOT-090 flips them. */
'use strict';
module.exports = {
  strict: {
    'motion-no-empty-animate': ['src/**/*.{ts,tsx,js,jsx}'],
    'no-layer-global-listeners': ['src/primitives/**/*.{ts,tsx}', 'src/foundation/**/*.{ts,tsx}', 'src/theme/layers/**/*.{ts,tsx}'],
    // family globs land here per migration PR (MAT-180), e.g.
    // 'no-optics-outside-material': ['src/components/table/**', ...]
  },
};
