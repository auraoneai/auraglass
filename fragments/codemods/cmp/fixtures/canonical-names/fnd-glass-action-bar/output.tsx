// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Toolbar } from 'aura-glass';

export function X() {
  return <Toolbar.Root aria-label="Action bar">{acts.map(renderItem)}</Toolbar.Root>;
}
