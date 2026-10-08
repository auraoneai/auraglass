// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Toolbar } from 'aura-glass';

export function X() {
  return <Toolbar.Root aria-label="Command bar">{cmds.map(renderItem)}</Toolbar.Root>;
}
