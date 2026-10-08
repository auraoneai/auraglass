// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Switch } from 'aura-glass';

export function X() {
  return <Switch checked={on} onCheckedChange={setOn} />;
}
