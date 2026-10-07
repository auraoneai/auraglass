import * as React from 'react';
import { Select } from '../../../src/components/select';

export function SelectFixture(props: Record<string, unknown>) {
  return (
    <Select.Root defaultValue="a" {...props}>
      <Select.Trigger placeholder="Pick" />
      <Select.Content>
        <Select.Item value="a" label="Alpha" />
        <Select.Item value="b" label="Beta" />
      </Select.Content>
    </Select.Root>
  );
}
