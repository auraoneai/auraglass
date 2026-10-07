import { describe, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Combobox } from './index';
import { AuraGlassProvider } from '../../theme';

describe('dbg2', () => {
  it('announcer', async () => {
    render(
      <AuraGlassProvider>
        <Combobox.Root items={['A']} loading>
          <Combobox.Input placeholder="p" />
          <Combobox.Content><Combobox.Empty /><Combobox.Item value="A">A</Combobox.Item></Combobox.Content>
        </Combobox.Root>
      </AuraGlassProvider>,
    );
    await act(async () => {});
    const input = screen.getByRole('combobox') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await act(async () => {});
    const nodes = [...document.querySelectorAll('[aria-live]')].map((e) => `${e.getAttribute('aria-live')}:${e.textContent}`);
    console.log('LIVE:', JSON.stringify(nodes));
    console.log('announcer-el:', document.querySelector('[data-ag-announcer]')?.outerHTML?.slice(0, 300));
  });
});
