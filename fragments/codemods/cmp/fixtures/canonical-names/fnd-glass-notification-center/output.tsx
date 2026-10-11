// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Root><Popover.Trigger/><Popover.Content>{/* notification list */}</Popover.Content></Popover.Root>;
}
