// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassPopover, GlassTooltip } from 'aura-glass';

export function X() {
  return (
    <>
      <GlassPopover placement="bottom-start" content={<C />}><A /></GlassPopover>
      <GlassTooltip content="t" position="left"><B /></GlassTooltip>
    </>
  );
}
