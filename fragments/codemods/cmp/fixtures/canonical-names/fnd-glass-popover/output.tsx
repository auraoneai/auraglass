// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Root><Popover.Trigger><Anchor/></Popover.Trigger><Popover.Portal><Popover.Positioner side="bottom" align="start"><Popover.Popup><Menu/></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>;
}
