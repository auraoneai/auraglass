// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Slider } from 'aura-glass';

export function X() {
  return <Slider value={[v]} onValueChange={(nv)=>setV(nv[0])} />;
}
