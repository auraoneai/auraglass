// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Tooltip } from 'aura-glass';

export function X() {
  return <Tooltip.Root><Tooltip.Trigger><Btn/></Tooltip.Trigger><Tooltip.Portal><Tooltip.Positioner side="top"><Tooltip.Popup>Hint</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root>;
}
