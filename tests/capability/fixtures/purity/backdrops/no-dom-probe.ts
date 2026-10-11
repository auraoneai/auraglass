// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned backdrop pattern
export function top(x: number, y: number) {
  return document.elementFromPoint(x, y);
}
