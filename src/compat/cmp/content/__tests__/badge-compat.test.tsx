/* REQ-CMP-114 compat legs: the three absorbed badge names warn their DEP ids
   and render 5.0 Badge output. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import { act } from 'react';
import * as React from 'react';
import { GlassStatusDot } from '../GlassStatusDot';
import { GlassConnectionStatus } from '../GlassConnectionStatus';
import { LiquidGlassBadgeCluster } from '../LiquidGlassBadgeCluster';

async function warns(el: React.ReactElement, id: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await act(async () => { render(el); });
  const calls = warn.mock.calls.filter((c) => String(c[0]).includes(id));
  warn.mockRestore();
  return calls;
}

describe('Badge compat (REQ-CMP-114)', () => {
  it('GlassStatusDot warns DEP-C0228 and renders a dot badge', async () => {
    expect((await warns(<GlassStatusDot label="on" />, 'DEP-C0228')).length).toBeGreaterThan(0);
    const el = document.querySelector('[data-ag-part="root"]')!;
    expect(el.hasAttribute('data-ag-dot')).toBe(true);
  });

  it('GlassConnectionStatus maps status to intent', async () => {
    expect((await warns(<GlassConnectionStatus status="online" />, 'DEP-C0229')).length).toBeGreaterThan(0);
    const el = document.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-ag-intent')).toBe('success');
  });

  it('LiquidGlassBadgeCluster warns DEP-C0227 and renders', async () => {
    expect((await warns(<LiquidGlassBadgeCluster count={3} />, 'DEP-C0227')).length).toBeGreaterThan(0);
    expect(document.querySelector('.ag-badge')).not.toBeNull();
  });
});
