/* CMP-303/423: Kbd — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Kbd } from './index';

describe('Kbd', () => {
  it('renders a <kbd> root', () => {
    const { container } = render(<Kbd>K</Kbd>);
    expect(container.querySelector('[data-ag-part="root"]')!.tagName).toBe('KBD');
  });
  it('keys[] renders nested item kbd with + separators', () => {
    const { container } = render(<Kbd keys={['Ctrl', 'Alt', 'Del']} />);
    const items = container.querySelectorAll('[data-ag-part="item"]');
    expect(items.length).toBe(3);
    const seps = container.querySelectorAll('[data-ag-part="separator"]');
    expect(seps.length).toBe(2);
    expect(seps[0]!.textContent).toBe('+');
  });
});
