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
describe('Tour REQ-CMP-128', () => {
  it('renders a Skip button that dismisses', async () => {
    const seen: boolean[] = [];
    render(<div><button id="t1">A</button><Tour.Root defaultOpen onOpenChange={(o) => seen.push(o)} steps={[{ target: '#t1', title: 'T' }]} /></div>);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    await act(async () => {});
    expect(seen[0]).toBe(false);
  });

  it('step title is id-linked via aria-labelledby', async () => {
    render(<div><button id="t1">A</button><Tour.Root defaultOpen steps={[{ target: '#t1', title: 'Step title' }]} /></div>);
    await act(async () => {});
    const step = document.querySelector('[data-ag-part="step"]')!;
    const id = step.getAttribute('aria-labelledby');
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)!.textContent).toBe('Step title');
  });

  it('focus restores to the opener element on close', () => {
    const btn = document.createElement('button');
    btn.textContent = 'opener';
    document.body.appendChild(btn);
    btn.focus();
    const { rerender } = render(<Tour.Root open steps={[{ target: 'body', title: 'T' }]} />);
    rerender(<Tour.Root open={false} steps={[{ target: 'body', title: 'T' }]} />);
    expect(document.activeElement).toBe(btn);
    document.body.removeChild(btn);
  });
});
