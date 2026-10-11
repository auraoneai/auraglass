// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Popover, Tooltip } from 'aura-glass';

export function X() {
  return (
    <>
      <Popover.Root><Popover.Trigger><A /></Popover.Trigger><Popover.Content side="bottom" align="start"><C /></Popover.Content></Popover.Root>
      <Tooltip.Root><Tooltip.Trigger><B /></Tooltip.Trigger><Tooltip.Content side="left">t</Tooltip.Content></Tooltip.Root>
    </>
  );
}
