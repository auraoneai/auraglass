// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Positioner side="bottom" align="start"><Menu/></Popover.Positioner>;
}
