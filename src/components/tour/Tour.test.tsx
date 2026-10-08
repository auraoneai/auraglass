/* CMP-320: Tour — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Tour } from './index';

const steps = [
  { target: '#t1', title: 'First', description: 'one' },
  { target: '#t2', title: 'Second', description: 'two' },
];

describe('Tour', () => {
  it('anchors a non-modal role=dialog step to the target element', async () => {
    render(
      <div>
        <button id="t1">A</button><button id="t2">B</button>
        <Tour.Root defaultOpen steps={steps} />
      </div>,
    );
    await act(async () => {});
    const dlg = document.querySelector('[data-ag-part="step"]')!;
    expect(dlg).not.toBeNull();
    expect(dlg.getAttribute('role')).toBe('dialog');
    expect(dlg.textContent).toContain('First');
    expect(dlg.textContent).toContain('1 / 2');
  });
  it('Next advances and Back returns', async () => {
    render(<div><button id="t1">A</button><button id="t2">B</button><Tour.Root defaultOpen steps={steps} /></div>);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="step"]')!.textContent).toContain('Second');
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="step"]')!.textContent).toContain('First');
  });
  it('Done closes the tour', async () => {
    render(<div><button id="t1">A</button><Tour.Root defaultOpen steps={[steps[0]!]} /></div>);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: /done|finish|close/i }));
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="step"]')).toBeNull();
  });
});
