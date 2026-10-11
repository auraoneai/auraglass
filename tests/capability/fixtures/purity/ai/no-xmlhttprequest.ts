// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned AI pattern
export function ask(q: string) {
  const xhr = new XMLHttpRequest();
  xhr.send(q);
  return xhr;
}
