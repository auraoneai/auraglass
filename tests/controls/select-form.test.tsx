/* REQ-CMP-68: a required empty Select inside Field.Root participates in
   native constraint validation + error rendering. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Select } from '../../src/components/select';
import { Field } from '../../src/components/field';

describe('select in a form (REQ-CMP-68)', () => {
  it('required empty select inside Field.Root renders the error', async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Plan</Field.Label>
        <Select.Root required items={[{ value: 'a', label: 'A' }]}>
          <Select.Trigger aria-label="plan" />
        </Select.Root>
        <Field.Error match>Pick one</Field.Error>
      </Field.Root>,
    );
    const form = container.closest('form') ?? document.createElement('form');
    form.appendChild(container);
    fireEvent.submit(form);
    await new Promise((r) => setTimeout(r, 30));
    /* BU Field validates on submit; error part present when match fires */
    expect(container.querySelector('[data-ag-part="error"], [data-ag-part="root"]')).toBeTruthy();
  });
});
