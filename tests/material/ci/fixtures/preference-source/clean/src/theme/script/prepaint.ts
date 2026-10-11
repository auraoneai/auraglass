// @ts-nocheck
// Fixture: allowed preference source (pre-paint script).
export const prepaint = (w: Window) => w.matchMedia?.('(prefers-contrast: more)')?.matches === true;
