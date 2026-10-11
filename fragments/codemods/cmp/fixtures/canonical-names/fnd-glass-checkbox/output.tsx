// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Checkbox } from 'aura-glass';

export function X() {
  return <Checkbox checked={c} onCheckedChange={setC}>Agree</Checkbox>;
}
