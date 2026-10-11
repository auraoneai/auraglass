// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned media pattern
export function bind(onKey: (e: KeyboardEvent) => void) {
  window.addEventListener('keydown', onKey);
}
