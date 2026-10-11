// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Root openOnHover><Popover.Trigger><Anchor/></Popover.Trigger><Popover.Content><Card/></Popover.Content></Popover.Root>;
}
