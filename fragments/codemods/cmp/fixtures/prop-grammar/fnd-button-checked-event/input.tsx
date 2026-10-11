// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassSwitch, GlassCheckbox } from 'aura-glass';

export function X() {
  return (
    <>
      <GlassSwitch onChange={(e) => setOn(e.target.checked)} />
      <GlassCheckbox onChange={(e) => setC(e.target.checked)} />
    </>
  );
}
