import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Select } from '../src/components/select/index';
import { Combobox } from '../src/components/combobox/index';

it('probe: popups without provider', async () => {
  render(<>
    <Select.Root defaultOpen>
      <Select.Trigger>s</Select.Trigger>
      <Select.Content>
        <Select.Item value="a">a</Select.Item>
      </Select.Content>
    </Select.Root>
    <Combobox.Root defaultOpen items={[{value:'x',label:'x'}]}>
      <Combobox.Input />
      <Combobox.Content>
        <Combobox.Item value="x">x</Combobox.Item>
      </Combobox.Content>
    </Combobox.Root>
  </>);
  await act(async () => { await new Promise(r => setTimeout(r, 40)); });
  const popups = [...document.querySelectorAll('[data-ag-overlay]')].map(n => `${n.getAttribute('data-ag-overlay')}|${n.getAttribute('data-ag-thickness')}|${n.getAttribute('data-ag-layer')}|${n.classList.contains('ag-surface')}`);
  // eslint-disable-next-line no-console
  console.log('OVERLAYS:', JSON.stringify(popups));
});
