// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Toolbar } from 'aura-glass';

export function X() {
  return <Toolbar.Root aria-label="Toolbar">{items.map(renderItem)}</Toolbar.Root>;
}
