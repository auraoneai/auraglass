// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Slider } from 'aura-glass';

export function X() {
  return <Slider.Root value={[v]} onValueChange={(nv: any) =>setV(nv[0])} />;
}
