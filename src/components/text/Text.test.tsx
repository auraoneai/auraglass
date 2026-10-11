/* CMP-295/420: Text — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Text } from './index';

describe('Text', () => {
  it('renders <p> by default with type/size/intent attrs', () => {
    const { container } = render(<Text>hello</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('P');
    expect(el.getAttribute('data-type')).toBe('body');
