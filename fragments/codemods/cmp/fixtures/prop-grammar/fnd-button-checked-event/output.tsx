// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Switch, Checkbox } from 'aura-glass';

export function X() {
  return (
    <>
      <Switch onCheckedChange={setOn} />
      <Checkbox onCheckedChange={setC} />
    </>
  );
}
