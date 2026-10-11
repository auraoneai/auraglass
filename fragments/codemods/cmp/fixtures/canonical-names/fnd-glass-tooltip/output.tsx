// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Tooltip } from 'aura-glass';

export function X() {
  return <Tooltip.Root><Tooltip.Trigger><Btn/></Tooltip.Trigger><Tooltip.Content side="top">Hint</Tooltip.Content></Tooltip.Root>;
}
