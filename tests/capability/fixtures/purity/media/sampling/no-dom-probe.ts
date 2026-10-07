// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned media/backdrop pattern
export function sample(el: Element) {
  const under = document.elementsFromPoint(10, 10);
  return { under, style: getComputedStyle(el) };
}
