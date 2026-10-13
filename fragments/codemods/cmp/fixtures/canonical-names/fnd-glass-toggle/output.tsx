// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ToggleGroup } from 'aura-glass';

export function X() {
  return <ToggleGroup.Root value={on?["on"]:[]} onValueChange={(v: any) =>setOn(v.includes("on"))}><ToggleGroup.Item value="on"/></ToggleGroup.Root>;
}
