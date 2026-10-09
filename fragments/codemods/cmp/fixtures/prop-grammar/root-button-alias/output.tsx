// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Button } from 'aura-glass';

export function X() {
  return <Button.Root variant="prominent" onClick={go}>Save</Button.Root>;
}
