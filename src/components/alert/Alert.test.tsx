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

describe('Alert REQ-CMP-116', () => {
  it('root carries content-layer material attrs', () => {
    const { container } = render(<Alert title="t" />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-ag-layer')).toBe('content');
    expect(el.getAttribute('data-ag-content')).toBe('content-raised');
  });

  it('banner roles: banner without urgent → status, with urgent → alert', () => {
    const { container: c1, unmount } = render(<Alert appearance="banner" title="t" />);
    expect(c1.querySelector('[data-ag-part="root"]')!.getAttribute('role')).toBe('status');
    expect(c1.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-appearance')).toBe('banner');
    unmount();
    const { container: c2 } = render(<Alert appearance="banner" urgent title="t" />);
    expect(c2.querySelector('[data-ag-part="root"]')!.getAttribute('role')).toBe('alert');
  });

  it('href actions render <a>; ReactNode actions pass through', () => {
    const { container: c1, unmount } = render(
      <Alert title="t" actions={[{ label: 'Go', href: '/x' }, { label: 'Do' }]} />,
    );
    expect(c1.querySelector('a.ag-alert-action')!.getAttribute('href')).toBe('/x');
    expect(c1.querySelector('button.ag-alert-action')!.textContent).toBe('Do');
    unmount();
    const { container: c2 } = render(<Alert title="t" actions={<button data-testid="custom">c</button>} />);
    expect(c2.querySelector('[data-testid="custom"]')).not.toBeNull();
  });

  it('description prop renders the description part', () => {
    const { container } = render(<Alert title="t" description="d text" />);
    expect(container.querySelector('[data-ag-part="description"]')!.textContent).toBe('d text');
  });
});
