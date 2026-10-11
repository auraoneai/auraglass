/* REQ-CMP-117 compat leg: 4.x CircularProgress warns its #313 (release/4.x)
   id DEP-C0243 and renders 5.0 Progress appearance="ring" with the 4.x props
   mapped. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { CircularProgress } from '../CircularProgress';
import * as compat from '../../index';

afterEach(cleanup);

async function renderCollectingWarnings(el: React.ReactElement) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  let view!: ReturnType<typeof render>;
  await act(async () => { view = render(el); });
  const messages = warn.mock.calls.map((c) => String(c[0]));
  warn.mockRestore();
  return { view, messages };
}

describe('CircularProgress compat (REQ-CMP-117, DEP-C0243)', () => {
  it('is exported from src/compat/cmp', () => {
    expect(compat.CircularProgress).toBe(CircularProgress);
  });

  it('warns DEP-C0243 and renders the ring with the md defaults', async () => {
    const { view, messages } = await renderCollectingWarnings(<CircularProgress value={25} />);
    expect(messages.some((m) => m.includes('DEP-C0243'))).toBe(true);
    const root = view.container.querySelector('[role="progressbar"]')!;
    expect(root.classList.contains('ag-progress-ring')).toBe(true);
    expect(root.getAttribute('aria-valuenow')).toBe('25');
    const svg = view.container.querySelector('svg[data-ag-part="track"]')!;
    expect(svg.getAttribute('width')).toBe('60');
    const indicator = view.container.querySelector('[data-ag-part="indicator"]')!;
    expect(indicator.getAttribute('stroke-width')).toBe('4');
    // 4.x showValue default is false.
    expect(view.container.querySelector('[data-ag-part="value"]')).toBeNull();
  });

  it('maps size and strokeWidth', async () => {
    const { view } = await renderCollectingWarnings(<CircularProgress value={10} size="xl" strokeWidth={9} />);
    expect(view.container.querySelector('svg')!.getAttribute('width')).toBe('120');
    expect(view.container.querySelector('[data-ag-part="indicator"]')!.getAttribute('stroke-width')).toBe('9');
  });

  it('maps indeterminate to value={null} (no aria-valuenow)', async () => {
    const { view } = await renderCollectingWarnings(<CircularProgress value={50} indeterminate />);
    const root = view.container.querySelector('[role="progressbar"]')!;
    expect(root.hasAttribute('aria-valuenow')).toBe(false);
    expect(view.container.querySelector('.ag-progress-ring-indeterminate')).not.toBeNull();
  });

  it('passes showValue and className through', async () => {
    const { view } = await renderCollectingWarnings(<CircularProgress value={70} showValue className="x" />);
    expect(view.container.querySelector('[data-ag-part="value"]')).not.toBeNull();
    expect(view.container.querySelector('[role="progressbar"]')!.classList.contains('x')).toBe(true);
  });

  it('warns once for the unmappable variant and children props', async () => {
    const { messages } = await renderCollectingWarnings(
      <CircularProgress value={5} variant="success">centre</CircularProgress>,
    );
    expect(messages.some((m) => m.includes('DEP-C0243.prop.variant'))).toBe(true);
    expect(messages.some((m) => m.includes('DEP-C0243.prop.children'))).toBe(true);
  });
});
