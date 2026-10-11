/** @jest-environment jsdom */
// REQ-SURF-13 (W3): every AI compat adapter renders its 5.0 ./ai successor
// from its 4.x story props and warns exactly once with its DEP-S id; the
// 4.x ChatMessage → AgMessage mapping is asserted part by part.
import { describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { expectAdapter, type CompatRow } from '../app-shell/compat-harness';
import { W3_STORY_ARGS as A } from '../fixtures/consumer-4x/cases/surf/ai/story-args';
import * as compat from '../../src/compat/surf';
import { COMPAT_IDS } from '../fixtures/consumer-4x/cases/surf/compat-ids';
import { toAgMessages } from '../../src/compat/surf/ai/_messages';

type C = React.ComponentType<Record<string, unknown>>;
const row = (name: keyof typeof compat & keyof typeof A, part: string, extra?: Record<string, unknown>): CompatRow => ({
  name, id: COMPAT_IDS[name]!.id, part, C: compat[name] as unknown as C, args: A[name]!, ...(extra ? { extra } : {}),
});

export const W3_ROWS: CompatRow[] = [
  row('GlassChat', 'section[aria-label="General Chat"] [data-ag-part="message"]', { onSendMessage: jest.fn() }),
  row('GlassChatInput', '[data-ag-part="composer"]', { onSend: jest.fn() }),
  row('GlassMessageList', '[data-ag-part="message"]'),
  row('GlassTypingIndicator', '[role="status"]'),
];

describe('W3 compat adapters render from 4.x story props (REQ-SURF-13)', () => {
  it.each(W3_ROWS.map((r) => [r.name, r] as const))('%s', (_name, r) => {
    expectAdapter(r);
  });
});

describe('W3 ChatMessage → AgMessage mapping', () => {
  const quiet = () => jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  it('maps content → text part, attachments → file parts, system type, user/assistant roles, timestamp → createdAt', () => {
    const at = new Date(Date.UTC(2026, 9, 7, 12, 0, 0));
    const ag = toAgMessages(
      [
        { id: '1', content: 'hi', sender: { id: 'me' }, timestamp: at, attachments: [{ name: 'a.pdf', type: 'application/pdf', url: '/a.pdf' }] },
        { id: '2', content: 'hello', sender: { id: 'agent' } },
        { id: '3', content: 'joined', sender: { id: 'system' }, type: 'system' },
      ],
      'me',
    );
    expect(ag[0]).toEqual({
      id: '1',
      role: 'user',
      parts: [{ type: 'text', text: 'hi' }, { type: 'file', mediaType: 'application/pdf', url: '/a.pdf', filename: 'a.pdf' }],
      metadata: { createdAt: '2026-10-07T12:00:00.000Z' },
    });
    expect(ag[1]!.role).toBe('assistant');
    expect(ag[2]!.role).toBe('system');
  });

  it('GlassChatInput onSend(text) maps to Composer onSubmit({text})', () => {
    quiet();
    const onSend = jest.fn();
    const { getByLabelText, getByRole } = render(<compat.GlassChatInput onSend={onSend} placeholder="Say" />);
    fireEvent.change(getByLabelText('Say'), { target: { value: 'hello' } });
    act(() => { getByRole('button', { name: /send/i }).click(); });
    expect(onSend).toHaveBeenCalledWith('hello');
    cleanup();
  });

  it('GlassTypingIndicator renders the 4.x text template and hides when not visible', () => {
    quiet();
    const one = render(<compat.GlassTypingIndicator users="Ops assistant" text="{users} {isAre} summarizing the handoff..." />);
    expect(one.container.textContent).toContain('Ops assistant is summarizing the handoff...');
    cleanup();
    const hidden = render(<compat.GlassTypingIndicator visible={false} />);
    expect(hidden.container.innerHTML).toBe('');
    cleanup();
  });
});
