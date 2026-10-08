// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassPopover } from 'aura-glass';

export function X() {
  return <GlassPopover trigger="click" placement="bottom-start" content={<Menu/>}><Anchor/></GlassPopover>;
}
