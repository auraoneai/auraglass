/** Recorded pin behaviour (BU 1.8.0) for REQ-CMP-47: what Enter does on a focused
 * Switch. Asserted by the unit suite — change here means the pin changed. */
export const SWITCH_KEYS = {
  /** 'toggles' when the pinned BU Switch activates on Enter; 'inert' when it ignores Enter. */
  enter: 'toggles',
  space: 'toggles',
} as const;
