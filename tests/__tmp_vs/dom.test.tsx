import * as React from 'react';
import { render, act } from '@testing-library/react';
import { it } from '@jest/globals';
import { Combobox } from '../../src/components/combobox';
it('dom', async () => {
  const { container } = render(
    <Combobox.Root items={['a','b']} multiple defaultValue={['a']}>
      <Combobox.Chips><Combobox.Chip>a</Combobox.Chip></Combobox.Chips>
      <Combobox.Input placeholder="x" />
    </Combobox.Root>);
  await act(async () => {});
  console.log(container.innerHTML);
});
