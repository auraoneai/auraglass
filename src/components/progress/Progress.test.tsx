/* CMP-311: Progress — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Progress } from './index';

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
  it('appearance=ring renders an svg circle track+indicator', () => {
    const { container } = render(<Progress appearance="ring" value={30} label="R" />);
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
  });
});

describe('Progress REQ-CMP-117', () => {
  it('ProgressRing is no longer exported from the barrel', () => {
    const idx = require('node:fs').readFileSync(require('node:path').join(__dirname, 'index.ts'), 'utf8');
    expect(idx).not.toContain('ProgressRing');
    const barrel = require('node:fs').readFileSync(require('node:path').join(__dirname, '../../root/cmp.ts'), 'utf8');
    expect(barrel).not.toContain('ProgressRing');
  });

  it('track carries content-sunken material attrs', () => {
    const { container } = render(<Progress value={40} />);
    const track = container.querySelector('[data-ag-part="track"]')!;
    expect(track.getAttribute('data-ag-content')).toBe('content-sunken');
    expect(track.getAttribute('data-ag-layer')).toBe('content');
  });

  it('appearance=ring indeterminate has progressbar role without aria-valuenow', () => {
    const { container } = render(<Progress appearance="ring" value={null} />);
    const root = container.querySelector('[role="progressbar"]')!;
    expect(root).not.toBeNull();
    expect(root.hasAttribute('aria-valuenow')).toBe(false);
  });
});
