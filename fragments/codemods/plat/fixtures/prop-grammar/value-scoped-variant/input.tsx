// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassButton } from 'aura-glass';

export function X() {
  return (
    <>
      <GlassButton variant="primary">Save</GlassButton>
      <GlassButton variant="secondary">Cancel</GlassButton>
      <GlassButton variant="ghost">More</GlassButton>
      <GlassButton variant="danger">Delete</GlassButton>
    </>
  );
}
