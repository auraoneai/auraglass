// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleGroup } from 'aura-glass';

export function X() {
  return <ToggleGroup.Root value={[v]} onValueChange={(nv: any) =>setV(nv[0])}>{opts.map(renderOpt)}</ToggleGroup.Root>;
}
