// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Root><Popover.Trigger><Anchor/></Popover.Trigger><Popover.Content side="bottom" align="start"><Menu.Root/></Popover.Content></Popover.Root>;
}
