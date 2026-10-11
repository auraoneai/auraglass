// @ts-nocheck
// Fixture: the preference store is the one place allowed to read OS signals.
export const reduced = (win: Window) => win.matchMedia('(prefers-reduced-motion: reduce)').matches;
