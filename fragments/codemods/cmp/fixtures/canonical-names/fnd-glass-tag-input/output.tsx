// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Combobox } from 'aura-glass';

export function X() {
  return <Combobox multiple creatable value={tags} onValueChange={setTags}><Combobox.Chips /></Combobox>;
}
