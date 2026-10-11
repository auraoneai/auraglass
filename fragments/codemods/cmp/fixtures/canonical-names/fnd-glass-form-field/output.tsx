// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Field } from 'aura-glass';

export function X() {
  return <Field.Root invalid={!!err}><Field.Label>Email</Field.Label><Field.Control/><Field.Error>{err}</Field.Error></Field.Root>;
}
