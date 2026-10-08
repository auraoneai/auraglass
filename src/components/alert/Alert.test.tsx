/* CMP-306: Alert — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Alert } from './index';

describe('Alert', () => {
  it('polite by default: role=status', () => {
    const { container } = render(<Alert title="Saved" />);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('role')).toBe('status');
  });
  it('urgent escalates to role=alert', () => {
    const { container } = render(<Alert urgent intent="danger" title="Error" />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('data-ag-intent')).toBe('danger');
  });
  it('renders icon/title/description/actions parts', () => {
    const { container } = render(
      <Alert title="T" icon={<i />} actions={[{ label: 'Undo', onPress: () => {} }]}>D</Alert>,
    );
    for (const p of ['root', 'icon', 'title', 'description', 'actions', 'action']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).not.toBeNull();
    }
  });
});
