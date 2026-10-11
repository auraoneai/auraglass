// @ts-nocheck
// Fixture: one ratcheted rAF finding (row in ../baseline-ok.json).
export function scrollSoon(el: HTMLElement) {
  requestAnimationFrame(() => {
    el.scrollTop = el.scrollHeight;
  });
}
