// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Combobox } from 'aura-glass';

export function X() {
  return <Combobox.Root multiple creatable value={tags} onValueChange={setTags}><Combobox.Chips /></Combobox.Root>;
}
