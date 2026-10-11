// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleGroup } from 'aura-glass';

export function X() {
  return <ToggleGroup value={on?["on"]:[]} onValueChange={(v)=>setOn(v.includes("on"))}><ToggleGroup.Item value="on"/></ToggleGroup>;
}
