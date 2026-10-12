import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolCall } from '../ToolCall';
import type { AgToolPart } from '../../types';

// Announcer double (jest.mock is hoisted above the imports): every announce()
// call is recorded; the rest of the theme stays real.
const mockAnnounce = jest.fn<(message: string, opts?: unknown) => void>();
jest.mock('../../../theme', () => {
  const actual = jest.requireActual<typeof import('../../../theme')>('../../../theme');
  return { ...actual, useAnnouncer: () => ({ announce: mockAnnounce, clear: () => undefined }) };
});
beforeEach(() => { mockAnnounce.mockClear(); });

const trigger = (c: HTMLElement) => c.querySelector<HTMLButtonElement>('[data-ag-part="trigger"]')!;

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
    const t = trigger(container);
    expect(t.getAttribute('aria-expanded')).toBe('true');
    expect(t.getAttribute('aria-controls')).toBeTruthy();
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

  it('opens on transition to needs-approval: input-streaming → approval-requested expands and shows Approve', () => {
    const onApprovalResponse = jest.fn();
    const { container, rerender } = render(<ToolCall part={part('input-streaming')} onApprovalResponse={onApprovalResponse} />);
    expect(trigger(container).getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
    rerender(<ToolCall part={part('approval-requested', { approval: { id: 'ap-1' } })} onApprovalResponse={onApprovalResponse} />);
    expect(trigger(container).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: 'Approve' })).toBeTruthy();
    expect(mockAnnounce).toHaveBeenCalledWith('Approval needed: search', { politeness: 'assertive' });
  });

  it('opens on transition to failed and announces the failure exactly once; no role=alert', () => {
    const { container, rerender } = render(<ToolCall part={part('input-available')} />);
    expect(trigger(container).getAttribute('aria-expanded')).toBe('false');
    rerender(<ToolCall part={part('output-error', { errorText: 'timeout' })} />);
    expect(trigger(container).getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[data-ag-part="error-text"]')!.textContent).toBe('timeout');
    expect(container.querySelector('[role=alert]')).toBeNull();
    rerender(<ToolCall part={part('output-error', { errorText: 'timeout' })} />);
    const failures = mockAnnounce.mock.calls.filter(([m]) => m === 'search failed: timeout');
    expect(failures).toHaveLength(1);
    expect(failures[0]![1]).toEqual({ politeness: 'assertive' });
  });

  it('a call rendered already failed (history) opens but is not announced', () => {
    render(<ToolCall part={part('output-error', { errorText: 'timeout' })} />);
    expect(mockAnnounce).not.toHaveBeenCalled();
  });

  it('a user toggle suppresses the auto-open on a later transition', () => {
    const { container, rerender } = render(<ToolCall part={part('input-available')} />);
    fireEvent.click(trigger(container)); // user opens
    fireEvent.click(trigger(container)); // user closes
    expect(trigger(container).getAttribute('aria-expanded')).toBe('false');
    rerender(<ToolCall part={part('output-error', { errorText: 'x' })} />);
    expect(trigger(container).getAttribute('aria-expanded')).toBe('false');
  });

  it('panel stays mounted while closed so aria-controls always resolves', () => {
    const { container } = render(<ToolCall part={part('output-available')} />);
    const t = trigger(container);
    expect(t.getAttribute('aria-expanded')).toBe('false');
    const panel = document.getElementById(t.getAttribute('aria-controls')!);
    expect(panel).not.toBeNull();
    expect(panel!.getAttribute('data-ag-part')).toBe('content');
    expect(panel!.hidden).toBe(true);
    fireEvent.click(t);
    expect(t.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(t.getAttribute('aria-controls')!)!.hidden).toBe(false);
  });

  it.each([
    ['input-streaming', 'queued', 'Preparing'], ['input-available', 'running', 'Running'],
    ['approval-requested', 'needs-approval', 'Needs approval'], ['output-available', 'succeeded', 'Done'],
    ['output-error', 'failed', 'Failed'], ['output-denied', 'denied', 'Denied'],
  ] as const)('%s header shows the %s icon and the text "%s"', (state, display, label) => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<ToolCall part={part(state)} />);
    const icon = trigger(container).querySelector('svg[data-ag-part="state-icon"]')!;
    expect(icon.getAttribute('data-icon')).toBe(display);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(trigger(container).querySelector('[data-ag-part="tool-state"]')!.textContent).toBe(label);
    warn.mockRestore();
  });

  it('per-state icons are distinct glyphs', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const states = ['input-streaming', 'input-available', 'approval-requested', 'output-available', 'output-error', 'output-denied'] as const;
    const paths = states.map((st) => {
      const { container, unmount } = render(<ToolCall part={part(st)} />);
      const d = container.querySelector('svg[data-ag-part="state-icon"] path')!.getAttribute('d');
      unmount();
      return d;
    });
    expect(new Set(paths).size).toBe(6);
    warn.mockRestore();
  });

  it('approval resets on new approval id', () => {
    const onApprovalResponse = jest.fn();
    const { rerender } = render(<ToolCall part={part('approval-requested', { approval: { id: 'ap-1' } })} onApprovalResponse={onApprovalResponse} />);
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect((screen.getByRole('button', { name: 'Approve' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Deny' }) as HTMLButtonElement).disabled).toBe(true);
    // The same call is asked again under a new approval id (component stays mounted).
    rerender(<ToolCall part={part('approval-requested', { approval: { id: 'ap-2' } })} onApprovalResponse={onApprovalResponse} />);
    const approve = screen.getByRole('button', { name: 'Approve' }) as HTMLButtonElement;
    expect(approve.disabled).toBe(false);
    expect((screen.getByRole('button', { name: 'Deny' }) as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(approve);
    expect(onApprovalResponse).toHaveBeenCalledTimes(2);
    expect(onApprovalResponse.mock.calls[1]![0]).toMatchObject({ approvalId: 'ap-2', approved: true });
  });

  it('approval resets when part.state changes away and back', () => {
    const onApprovalResponse = jest.fn();
    const { rerender } = render(<ToolCall part={part('approval-requested', { approval: { id: 'ap-1' } })} onApprovalResponse={onApprovalResponse} />);
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(onApprovalResponse.mock.calls[0]![0]).toMatchObject({ approvalId: 'ap-1', approved: false });
    rerender(<ToolCall part={part('approval-responded', { approval: { id: 'ap-1', approved: false } })} onApprovalResponse={onApprovalResponse} />);
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
    rerender(<ToolCall part={part('approval-requested', { approval: { id: 'ap-3' } })} onApprovalResponse={onApprovalResponse} />);
    expect((screen.getByRole('button', { name: 'Approve' }) as HTMLButtonElement).disabled).toBe(false);
    expect(screen.queryByLabelText('Reason (optional)')).toBeNull();
  });

  it('deny reason is a CMP TextField labelled "Reason (optional)"', () => {
    render(<ToolCall part={part('approval-requested', { approval: { id: 'ap-9' } })} onApprovalResponse={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    const input = screen.getByLabelText('Reason (optional)');
    expect(input.getAttribute('data-ag-part')).toBe('control');
    expect(input.closest('.ag-text-field')).not.toBeNull();
  });

});
