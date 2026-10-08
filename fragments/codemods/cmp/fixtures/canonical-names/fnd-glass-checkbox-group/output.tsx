// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { CheckboxGroup } from 'aura-glass';

export function X() {
  return <CheckboxGroup value={sel} onValueChange={setSel}>{opts.map(renderOpt)}</CheckboxGroup>;
}
