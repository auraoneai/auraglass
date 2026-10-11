/* REQ-CMP-65: selected item labels resolve before the popup opens. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Select } from '../../src/components/select';

describe('Select selected label', () => {
  it('shows the item label before opening', () => {
    const { getByRole } = render(
      <Select.Root defaultValue="b" items={{ b: 'Beta' }}>
        <Select.Trigger />
      </Select.Root>,
    );
    expect(getByRole('combobox')).toHaveTextContent('Beta');
  });
});
