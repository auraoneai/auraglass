// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned timer outside the allowlist
export function poll(fn: () => void) {
  setInterval(fn, 1000);
}
