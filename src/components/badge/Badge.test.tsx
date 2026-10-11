/* CMP-301/421: Badge — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Badge } from './index';

describe('Badge', () => {
  it('emits intent on the root', () => {
    const { container } = render(<Badge intent="success">ok</Badge>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-intent')).toBe('success');
  });
  it('dot renders the indicator without a label', () => {
    const { container } = render(<Badge dot intent="danger" />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.hasAttribute('data-dot')).toBe(true);
  });
  it('count clamps at max as "<max>+"', () => {
    const { container } = render(<Badge count={120} max={99} />);
    expect(container.querySelector('[data-ag-part="root"]')!.textContent).toContain('99+');
  });
  it('count below max renders the number verbatim', () => {
    const { container } = render(<Badge count={4} max={99} />);
    expect(container.querySelector('[data-ag-part="root"]')!.textContent).toContain('4');
  });
  it('label goes through VisuallyHidden', () => {
    render(<Badge count={2} label="2 notifications" />);
    expect(screen.getByText('2 notifications')).toBeTruthy();
  });
});
