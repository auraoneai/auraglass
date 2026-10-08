import * as React from 'react';
import { Combobox } from '../../../src/components/combobox';

export function ComboboxFixture(props: Record<string, unknown>) {
  return (
    <Combobox.Root items={['alpha', 'beta']} defaultValue="alpha" {...props}>
      <Combobox.Input placeholder="Pick" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.Item value="alpha">Alpha</Combobox.Item>
        <Combobox.Item value="beta">Beta</Combobox.Item>
      </Combobox.Content>
    </Combobox.Root>
  );
}
