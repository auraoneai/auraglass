/* CMP-304: DescriptionList — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { DescriptionList } from './index';

describe('DescriptionList', () => {
  it('renders dl/dt/dd structure with parts', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionList.Item>
          <DescriptionList.Term>Term</DescriptionList.Term>
          <DescriptionList.Details>Detail</DescriptionList.Details>
        </DescriptionList.Item>
      </DescriptionList>,
    );
    expect(container.querySelector('dl[data-ag-part="root"]')).not.toBeNull();
    expect(container.querySelector('dt[data-ag-part="label"]')).not.toBeNull();
    expect(container.querySelector('dd[data-ag-part="value"]')).not.toBeNull();
    expect(container.querySelector('div[data-ag-part="item"]')).not.toBeNull();
  });
  it('stacked|inline layout attr', () => {
    const { container } = render(<DescriptionList layout="inline"><DescriptionList.Item><DescriptionList.Term>t</DescriptionList.Term></DescriptionList.Item></DescriptionList>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-layout')).toBe('inline');
  });
});

describe('DescriptionList REQ-CMP-119', () => {
  it('flat items render Term/Details parts', () => {
    const { container } = render(
      <DescriptionList items={[{ term: 'CPU', details: '8 cores' }, { term: 'RAM', details: '16 GB' }]} />,
    );
    expect(container.querySelectorAll('[data-ag-part="item"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-ag-part="label"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-ag-part="value"]')).toHaveLength(2);
  });

  it('orientation=horizontal resolves to inline layout', () => {
    const { container } = render(<DescriptionList orientation="horizontal" items={[{ term: 't', details: 'd' }]} />);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-layout')).toBe('inline');
  });

  it('dl wrapper is its own inline-size container (standalone stacking)', () => {
    const css = require('node:fs').readFileSync(require('node:path').join(__dirname, 'DescriptionList.css'), 'utf8');
    expect(css).toMatch(/\.ag-dl \{[^}]*container-type: inline-size/);
    expect(css).toContain('@container (max-width: 400px)');
    expect(css).not.toContain('@container ag-container');
  });
});
