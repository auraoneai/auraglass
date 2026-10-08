// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Field } from 'aura-glass';

export function X() {
  return <Field.Root invalid={!!err}><Field.Error>{err}</Field.Error></Field.Root>;
}
