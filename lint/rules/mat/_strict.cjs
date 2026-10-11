/* lint/rules/mat/_strict.cjs — strict escalation table (MAT-099 mechanism,
   MAT-180 per-family escalation). eslint-plugin-auraglass.js reads
   { strict: { '<rule-name>': [glob, ...] } } and emits 'error' configs for
   those globs, on top of each rule's own agConfig severity.

   MAT-180: after each family deletion/migration PR (2e-B consumes the
   removal lanes), add that family's glob here so its optics are enforced at
   'error' while the rest of src/ stays at 'warn' via optics-baseline.json
   ratchet. On 5.0 GA the whole src/ glob escalates.

   MAT-233 wiring (REQ-MOT-64): motion-no-empty-animate is error on src/**.
   REQ-MAT-51 (D.3-31): the motion rules with 0 findings in src/** are error
   on src/** too. motion-raf-via-ticker escalates through its own agConfig
   (error in the guarded dirs, ratcheted files in motion-baseline.json at warn)
   and motion-single-preference-source's remaining finding is held by the
   same baseline; scripts/mat/motion-lint-l1.mjs runs all of them at error. */
'use strict';
module.exports = {
  strict: {
    'motion-no-empty-animate': ['src/**/*.{ts,tsx,js,jsx}'],
    'motion-no-hover-transform': ['src/**/*.{ts,tsx,js,jsx}'],
    'motion-no-random': ['src/**/*.{ts,tsx,js,jsx}'],
    'motion-no-runtime-import': ['src/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    'motion-no-ungated-loop': ['src/**/*.{ts,tsx,js,jsx}'],
    'motion-transition-allowlist': ['src/**/*.{ts,tsx,js,jsx}'],
    // family globs land here per migration PR (MAT-180), e.g.
    // 'no-optics-outside-material': ['src/components/table/**', ...]
  },
};
