// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover, Tooltip } from 'aura-glass';

export function X() {
  return (
    <>
      <Popover.Root><Popover.Trigger><A /></Popover.Trigger><Popover.Portal><Popover.Positioner side="bottom" align="start"><Popover.Popup><C /></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>
      <Tooltip.Root><Tooltip.Trigger><B /></Tooltip.Trigger><Tooltip.Portal><Tooltip.Positioner side="left"><Tooltip.Popup>t</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root>
    </>
  );
}
