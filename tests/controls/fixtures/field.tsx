import * as React from 'react';
import { Field } from '../../../src/components/field';

export function FieldFixture(props: Record<string, unknown>) {
  return (
    <Field.Root {...props}>
      <Field.Label>Name</Field.Label>
      <Field.Control render={<input />} />
      <Field.Description>desc</Field.Description>
    </Field.Root>
  );
}
