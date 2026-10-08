// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { SearchField } from 'aura-glass';

export function X() {
  return (
    <>
      <SearchField onSubmit={run} />
      {/* results pane -> Combobox or registry faceted-search */}
    </>
  );
}
