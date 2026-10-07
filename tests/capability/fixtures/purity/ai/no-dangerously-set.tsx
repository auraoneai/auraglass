// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned AI pattern
export function Body({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
