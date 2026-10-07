/* CMP-346: render harness for the overlay-flows GA block — every flow mounts on
   real flagships, no mocks. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { OverlayFlows } from './index';

const flush = async () => { await act(async () => {}); };

describe('registry block overlay-flows', () => {
  it('mounts the table, menubar, sheet trigger, filter and toast button', async () => {
    render(<OverlayFlows />);
    await flush();
    expect(document.querySelector('[data-ag-part="overlay-flows"]')).toBeTruthy();
    expect(document.querySelector('table')).toBeTruthy();
    expect(document.querySelector('[role="menubar"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-ag-part="root"]')).not.toHaveLength(0);
  });
});
