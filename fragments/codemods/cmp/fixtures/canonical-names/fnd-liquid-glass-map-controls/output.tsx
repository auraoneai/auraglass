// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Toolbar } from 'aura-glass';

export function X() {
  return <Toolbar.Root aria-label="Map controls" orientation="vertical">{/* zoom/locate items */}</Toolbar.Root>;
}
