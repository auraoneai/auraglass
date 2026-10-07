/* REQ-CMP-77: press-and-hold repeat is whatever the BU pin binds; recorded here
   and asserted by number-field.apg.spec.ts. BU 1.8.0 repeats after ~400 ms. */
export const NUMBER_FIELD_KEYS = {
  arrowStep: 'step',
  shiftStep: 'largeStep',
  altStep: 'smallStep',
  repeatDelayMs: 400,
  repeatIntervalMs: 60,
} as const;
