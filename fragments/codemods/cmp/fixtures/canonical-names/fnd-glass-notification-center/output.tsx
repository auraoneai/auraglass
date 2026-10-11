// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover } from 'aura-glass';

export function X() {
  return <Popover.Root><Popover.Trigger/><Popover.Portal><Popover.Positioner><Popover.Popup>{/* notification list */}</Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>;
}
