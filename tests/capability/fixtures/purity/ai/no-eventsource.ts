// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned AI pattern
export function stream(url: string) {
  return new EventSource(url);
}
