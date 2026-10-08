import * as React from 'react';
import { NumberField } from '../../../src/components/number-field';

export function NumberFieldFixture(props: Record<string, unknown>) {
  return <NumberField label="Qty" defaultValue={2} min={0} max={10} {...props} />;
}
