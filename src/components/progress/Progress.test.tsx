/* CMP-311: Progress — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Progress, ProgressRing } from './index';

describe('Progress', () => {
  it('renders progressbar with aria-valuemin/max/now', () => {
    const { container } = render(<Progress value={40} min={0} max={100} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(container.querySelector('[data-ag-part="track"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
  });
  it('value=null → indeterminate without aria-valuenow', () => {
    const { container } = render(<Progress value={null} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
  });
  it('label and value parts render', () => {
    const { container } = render(<Progress value={60} label="Loading" />);
    expect(container.querySelector('[data-ag-part="label"]')!.textContent).toBe('Loading');
    expect(container.querySelector('[data-ag-part="value"]')).not.toBeNull();
  });
  it('ProgressRing renders an svg circle track+indicator', () => {
    const { container } = render(<ProgressRing value={30} label="R" />);
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
  });
});
