// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Root openOnHover><Popover.Trigger><Anchor/></Popover.Trigger><Popover.Portal><Popover.Positioner><Popover.Popup><Card/></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>;
}
