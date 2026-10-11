import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Composer } from '../Composer';

describe('Composer', () => {
  it('two instances have unique ids', () => {
    render(<><Composer /><Composer /></>);
    const ids = Array.from(document.querySelectorAll('[data-ag-part="input"]')).map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('controlled and uncontrolled value', () => {
    const onValueChange = jest.fn();
    const { rerender } = render(<Composer defaultValue="hi" />);
    expect((screen.getByLabelText('Message') as HTMLTextAreaElement).value).toBe('hi');
    rerender(<Composer value="controlled" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'x' } });
    expect(onValueChange).toHaveBeenCalledWith('x', { event: expect.any(Event), reason: 'input-change' });
  });

  it('Enter submits, Shift+Enter does not, IME composition does not submit', async () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="hello" onSubmit={onSubmit} />);
    const ta = screen.getByLabelText('Message');
    fireEvent.keyDown(ta, { key: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
    // composing Enter — keyCode 229
    fireEvent.keyDown(ta, { key: 'Enter', keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({ text: 'hello' });
  });

  it('empty/whitespace text does not submit; Submit aria-disabled but focusable', () => {
    const onSubmit = jest.fn();
    render(<Composer defaultValue="   " onSubmit={onSubmit} />);
    const ta = screen.getByLabelText('Message');
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    const submit = screen.getByRole('button', { name: 'Send message' });
    expect(submit.getAttribute('aria-disabled')).toBe('true');
  });

  it('stop swap: streaming swaps Submit→Stop; Escape calls onStop', () => {
    const onStop = jest.fn();
    render(<Composer defaultValue="x" status="streaming" onStop={onStop} />);
    expect(screen.getByRole('button', { name: 'Stop generating' })).toBeTruthy();
    fireEvent.keyDown(screen.getByLabelText('Message'), { key: 'Escape' });
    expect(onStop).toHaveBeenCalled();
  });

  it('attachments: paste adds files, rejections call onAttachmentReject', () => {
    const onReject = jest.fn();
    render(<Composer accept="image/png" maxFileSize={10} onAttachmentReject={onReject} />);
    const form = document.querySelector('[data-ag-part="composer"]')!;
    const ok = new File(['x'], 'ok.png', { type: 'image/png' });
    const bad = new File(['x'], 'bad.txt', { type: 'text/plain' });
    const tooBig = new File([new Uint8Array(11)], 'big.png', { type: 'image/png' });
    fireEvent.paste(form, { clipboardData: { files: [ok, bad, tooBig] } });
    expect(screen.getByText('ok.png')).toBeTruthy();
    expect(onReject).toHaveBeenCalledTimes(2);
    expect(onReject.mock.calls.map((c) => (c[0] as { reason: string }).reason).sort()).toEqual(['size', 'type']);
  });

  it('counter shows len/maxLength', () => {
    render(<Composer defaultValue="abc" maxLength={100} />);
    expect(screen.getByText('3/100')).toBeTruthy();
  });
});
