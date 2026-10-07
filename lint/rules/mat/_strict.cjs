/* MAT-233 wiring (REQ-MOT-64 error on src/**; all other MOT rules stay warn
   until MOT-090 flips them). The PLAT-owned eslint configs are verbatim — the
   plugin's `_strict.cjs` mechanism is the sanctioned escalation path. */
'use strict';
module.exports = {
  strict: {
    'motion-no-empty-animate': ['src/**/*.{ts,tsx,js,jsx}'],
  },
};
