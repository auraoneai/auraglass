// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleGroup } from 'aura-glass';

export function X() {
  return <ToggleGroup.Root value={on ? ["b"] : []} onValueChange={(v: any) =>set(v.includes("b"))}><ToggleGroup.Item value="b">B</ToggleGroup.Item></ToggleGroup.Root>;
}
