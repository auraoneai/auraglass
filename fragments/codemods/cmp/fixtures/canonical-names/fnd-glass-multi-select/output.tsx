// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Combobox } from 'aura-glass';

export function X() {
  return <Combobox.Root multiple items={opts} value={vs} onValueChange={setVs} />;
}
