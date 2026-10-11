// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassButton } from 'aura-glass';

export function X() {
  return (
    <>
      <GlassButton variant="gradient">Go</GlassButton>
      <GlassButton variant="primary" leftIcon={<I/>}>Save</GlassButton>
    </>
  );
}
