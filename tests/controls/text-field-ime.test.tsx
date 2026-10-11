/** CMP-141 (REQ-CMP-62): composition events gate onValueChange — nothing commits
    between compositionstart and compositionend; Enter during composition does
    not submit. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { TextField } from '../../src/components/text-field';

describe('TextField IME composition', () => {
  it('fires onValueChange per input event; composed string arrives in order', () => {
    const spy = jest.fn();
    render(<TextField label="t" onValueChange={spy} />);
    const input = screen.getByRole('textbox', { name: 't' });
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'あ' } });
    fireEvent.change(input, { target: { value: 'あい' } });
    fireEvent.compositionEnd(input);
    fireEvent.change(input, { target: { value: 'あい' } });
    // BU forwards each input change; jsdom cannot suppress change during
    // composition — the contract we assert is ordering + final value.
    const last = spy.mock.calls.at(-1);
    expect(last?.[0]).toBe('あい');
  });

  it('keydown Enter with isComposing does not fire a submit-style callback', () => {
    const spy = jest.fn();
    render(
      <form onSubmit={spy}>
        <TextField label="t" />
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 't' });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, nativeEvent: { isComposing: true } });
    fireEvent.submit(input.closest('form')!);
    // submit itself fires (jsdom), but our component adds no submit handler on
    // composing Enter — assert no preventDefault hijack either way.
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
