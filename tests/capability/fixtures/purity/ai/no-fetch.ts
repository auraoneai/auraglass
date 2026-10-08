// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned AI pattern
export async function ask(q: string) {
  return fetch('https://example.invalid/ai', { body: q, method: 'POST' });
}
