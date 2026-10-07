// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { RadioGroup } from 'aura-glass';

export function X() {
  return <RadioGroup value={v} onValueChange={setV}>{opts.map(renderOpt)}</RadioGroup>;
}
