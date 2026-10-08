import * as React from 'react';
import { TextField } from '../../../src/components/text-field';

export function TextFieldFixture(props: Record<string, unknown>) {
  return <TextField label="Name" defaultValue="x" {...props} />;
}
