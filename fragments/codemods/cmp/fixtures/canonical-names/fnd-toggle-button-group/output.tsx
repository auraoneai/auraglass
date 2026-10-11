// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleGroup } from 'aura-glass';

export function X() {
  return <ToggleGroup value={[v]} onValueChange={(nv)=>setV(nv[0])}>{opts.map(renderOpt)}</ToggleGroup>;
}
