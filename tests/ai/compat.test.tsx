/** @jest-environment jsdom */
// tests/ai/compat.test.tsx — SURF-379: compat adapters at aura-glass/compat
// map the 4.x ai-kit API onto the 5.0 ./ai surface (REQ-SURF-172/-173).

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';

import { GlassChat } from '../../src/compat/surf/ai/GlassChat';
import { GlassMessageList } from '../../src/compat/surf/ai/GlassMessageList';
import { GlassChatInput } from '../../src/compat/surf/ai/GlassChatInput';
import { GlassTypingIndicator } from '../../src/compat/surf/ai/GlassTypingIndicator';

const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

describe('compat ai adapters (SURF-379)', () => {
  it('GlassChat maps 4.x ChatMessage to AgMessage and fires deprecation', () => {
    const messages = [
      { id: '1', content: 'hi', sender: { id: 'me' } },
      { id: '2', content: 'hello', sender: { id: 'agent', name: 'Agent' } },
    ];
    const { container } = render(
      <GlassChat messages={messages as never} currentUserId="me" />,
    );
    expect(container.querySelectorAll('[data-ag-part="message"]')).not.toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('GlassChat'));
  });

  it('GlassMessageList renders the mapped roles', () => {
    const messages = [{ id: '1', content: 'x', sender: { id: 'me' } }];
    const { container } = render(<GlassMessageList messages={messages as never} currentUserId="me" />);
    expect(container.textContent).toContain('x');
  });

  it('GlassChatInput onSend(text) maps to onSubmit({text})', () => {
    const onSend = jest.fn();
    const { getByLabelText, getByRole } = render(<GlassChatInput onSend={onSend} placeholder="Say" />);
    const input = getByLabelText('Say');
    fireEvent.change(input, { target: { value: 'hello' } });
    act(() => { getByRole('button', { name: /send/i }).click(); });
    expect(onSend).toHaveBeenCalledWith('hello');
  });

  it('GlassTypingIndicator is a live status', () => {
    const { container } = render(<GlassTypingIndicator />);
    expect(container.querySelector('[role="status"]')).toBeTruthy();
  });
});
