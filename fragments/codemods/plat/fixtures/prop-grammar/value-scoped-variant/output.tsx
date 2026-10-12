// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassButton } from 'aura-glass';

export function X() {
  return (
    <>
      <GlassButton prominent>Save</GlassButton>
      <GlassButton variant='regular'>Cancel</GlassButton>
      <GlassButton variant='identity'>More</GlassButton>
      <GlassButton intent='danger'>Delete</GlassButton>
    </>
  );
}
