// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned AI pattern
export function flush(payload: string) {
  navigator.sendBeacon('/beacon', payload);
}
