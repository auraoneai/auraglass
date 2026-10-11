// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleButton } from 'aura-glass';

export function X() {
  return <ToggleButton selected={on} onChange={set}>B</ToggleButton>;
}
