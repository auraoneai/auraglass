import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolCall } from '../ToolCall';
import type { AgToolPart } from '../../types';

const part = (state: AgToolPart['state'], extra: Partial<AgToolPart> = {}): AgToolPart => ({
  type: 'tool-search', toolCallId: 'tc-1', state,
  input: { q: 'keys' }, ...(state === 'output-available' ? { output: { rows: [1] } } : {}), ...extra,
});

describe('ToolCall', () => {
  it.each([
    ['input-streaming', 'queued'], ['input-available', 'running'], ['approval-requested', 'needs-approval'],
    ['output-available', 'succeeded'], ['output-error', 'failed'], ['output-denied', 'denied'],
  ] as const)('%s → data-state %s', (state, display) => {
    const { container } = render(<ToolCall part={part(state)} />);
    expect(container.querySelector('[data-ag-part="tool-call"]')!.getAttribute('data-state')).toBe(display);
  });

  it('approval-responded approved → running; denied → denied', () => {
    const ok = render(<ToolCall part={part('approval-responded', { approval: { id: 'a', approved: true } })} />);
    expect(ok.container.querySelector('[data-ag-part="tool-call"]')!.getAttribute('data-state')).toBe('running');
    const no = render(<ToolCall part={part('approval-responded', { approval: { id: 'a', approved: false } })} />);
    expect(no.container.querySelector('[data-ag-part="tool-call"]')!.getAttribute('data-state')).toBe('denied');
  });

  it('default open for needs-approval and failed; header button has aria-expanded/controls', () => {
    const { container } = render(<ToolCall part={part('approval-requested', { approval: { id: 'ap-1' } })} />);
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
    const { container: c2 } = render(<ToolCall part={part('output-error')} />);
    expect(c2.querySelector('[data-ag-part="trigger"]')!.getAttribute('aria-expanded')).toBe('true');
    const { container: c3 } = render(<ToolCall part={part('output-available')} />);
    expect(c3.querySelector('[data-ag-part="trigger"]')!.getAttribute('aria-expanded')).toBe('false');
  });

  it('approval: Approve calls onApprovalResponse once and disables both', () => {
    const onApprovalResponse = jest.fn();
    render(<ToolCall part={part('approval-requested', { approval: { id: 'ap-9' } })} onApprovalResponse={onApprovalResponse} />);
    const approve = screen.getByRole('button', { name: 'Approve' });
    fireEvent.click(approve);
    fireEvent.click(approve);
    expect(onApprovalResponse).toHaveBeenCalledTimes(1);
    expect(onApprovalResponse.mock.calls[0]![0]).toMatchObject({ approvalId: 'ap-9', toolCallId: 'tc-1', approved: true });
    expect((approve as HTMLButtonElement).disabled).toBe(true);
  });

  it('deny reveals a reason field; denied response includes reason', () => {
    const onApprovalResponse = jest.fn();
    render(<ToolCall part={part('approval-requested', { approval: { id: 'ap-9' } })} onApprovalResponse={onApprovalResponse} />);
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    fireEvent.change(document.querySelector('[data-ag-part="deny-reason"] input')!, { target: { value: 'no' } });
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(onApprovalResponse.mock.calls[0]![0]).toMatchObject({ approved: false, reason: 'no' });
  });

  it('no handler → "Waiting for approval"', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ToolCall part={part('approval-requested')} />);
    expect(screen.getByText('Waiting for approval')).toBeTruthy();
    warn.mockRestore();
  });

  it('input/output render JSON in labelled pre; long output capped with Show all', () => {
    const big = part('output-available', { output: { blob: 'x'.repeat(5000) } });
    render(<ToolCall part={big} defaultOpen />);
    expect(document.querySelector('pre[aria-label="Input"]')).toBeTruthy();
    expect(document.querySelector('pre[aria-label="Output"]')!.textContent!.length).toBeLessThan(4300);
    fireEvent.click(screen.getByText('Show all'));
    expect(document.querySelector('pre[aria-label="Output"]')!.textContent!.length).toBeGreaterThan(5000);
  });

  it('ToolCall.displayState static', () => {
    expect(ToolCall.displayState(part('output-available'))).toBe('succeeded');
  });
});
