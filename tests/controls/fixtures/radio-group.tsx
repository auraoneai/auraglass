import * as React from 'react';
import { RadioGroup } from '../../../src/components/radio-group';

export function RadioGroupFixture(props: Record<string, unknown>) {
  return (
    <RadioGroup.Root defaultValue="a" aria-label="plan" {...props}>
      <RadioGroup.Item value="a">Annual</RadioGroup.Item>
      <RadioGroup.Item value="b">Monthly</RadioGroup.Item>
    </RadioGroup.Root>
  );
}
