import * as React from 'react';
import { Checkbox, CheckboxGroup } from '../../../src/components/checkbox';

export function CheckboxFixture(props: Record<string, unknown>) {
  return (
    <CheckboxGroup defaultValue={['a']}>
      <Checkbox value="a" {...props}>Option A</Checkbox>
      <Checkbox value="b">Option B</Checkbox>
    </CheckboxGroup>
  );
}
