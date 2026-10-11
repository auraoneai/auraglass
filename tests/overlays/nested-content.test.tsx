/* REQ-CMP-81: a CMP control field nested inside a Dialog popup renders the
   content-sunken material (data-ag-content="content-sunken") — the nested
   surface must not inherit the dialog's overlay material. the shell emits via materialProps({ layer: 'content',
   content: 'content-sunken' }). */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from '../../src/components/dialog/index';
import { TextField } from '../../src/components/text-field/index';

describe('nested content material (REQ-CMP-81)', () => {
  it('TextField inside a Dialog popup carries data-ag-content=content-sunken', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Popup aria-label="host">
            <TextField label="Name" />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    const sunken = document.querySelector('[data-ag-content="content-sunken"]');
    expect(sunken).toBeTruthy();
    expect(document.querySelector('[aria-label="host"]')!.contains(sunken)).toBe(true);
  });
});
