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
