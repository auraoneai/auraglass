// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleGroup } from 'aura-glass';

export function X() {
  return <ToggleGroup value={on ? ["b"] : []} onValueChange={(v)=>set(v.includes("b"))}><ToggleGroup.Item value="b">B</ToggleGroup.Item></ToggleGroup>;
}
