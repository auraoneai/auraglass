/* CMP-221 (REQ-CMP-89/-91): AlertDialog family suite — real Base UI. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { AlertDialog } from './index';

function Demo({ root = {}, action = 'Delete' }: { root?: Record<string, unknown>; action?: React.ReactNode }) {
  return (
    <AlertDialog.Root {...root}>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete item?</AlertDialog.Title>
        <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>{action}</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

const popup = () => document.querySelector<HTMLElement>('[data-ag-part="popup"]');

describe('AlertDialog (CMP-217, 221)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });
  afterEach(() => { jest.restoreAllMocks(); });

  it('role=alertdialog; initial focus lands on the Cancel (least destructive) part', async () => {
    render(<Demo root={{ defaultOpen: true }} />);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    const el = popup()!;
    expect(el.getAttribute('role')).toBe('alertdialog');
    expect(el.getAttribute('data-ag-overlay')).toBe('alert-dialog');
    const cancel = el.querySelector('[data-ag-part="cancel"]')!;
    expect(document.activeElement === cancel || cancel.contains(document.activeElement)).toBe(true);
  });

  it('outside press never closes', async () => {
    const onOpenChange = jest.fn();
    render(<Demo root={{ defaultOpen: true, onOpenChange }} />);
    await act(async () => {});
    fireEvent.pointerDown(document.body);
    fireEvent.pointerUp(document.body);
    fireEvent.click(document.body);
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    expect(popup()?.isConnected).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'outside-press' }));
  });

  it('Escape closes with reason escape-key', async () => {
    const onOpenChange = jest.fn();
    render(<Demo root={{ defaultOpen: true, onOpenChange }} />);
    await act(async () => {});
    (popup() as HTMLElement).focus();
    await userEvent.keyboard('{Escape}');
    await act(async () => {});
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
  });

  it("intent='danger' styles only the action button", async () => {
    render(<Demo root={{ defaultOpen: true, intent: 'danger' }} />);
    await act(async () => {});
    const el = popup()!;
    const action = el.querySelector('[data-ag-part="action"]')!;
    const cancel = el.querySelector('[data-ag-part="cancel"]')!;
    expect(action.getAttribute('data-ag-intent')).toBe('danger');
    expect(cancel.getAttribute('data-ag-intent')).toBeNull();
    expect(el.getAttribute('data-ag-intent')).toBeNull();
    expect(el.getAttribute('data-ag-thickness')).toBe('thick');
  });
});
