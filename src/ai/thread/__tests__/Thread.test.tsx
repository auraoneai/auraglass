import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Thread } from '../Thread';
import type { ThreadHandle } from '../Thread';
import type { AgMessage } from '../../types';

const msgs = (n: number): AgMessage[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `m-${i}`,
    role: i % 2 ? 'assistant' : 'user',
    parts: [{ type: 'text' as const, text: `message ${i}` }],
  }));

describe('Thread', () => {
  it('log semantics: role=log, aria-label, aria-relevant, tabIndex', () => {
    render(<Thread messages={msgs(3)} label="Support" />);
    const log = screen.getByRole('log');
    expect(log.getAttribute('aria-label')).toBe('Support');
    expect(log.getAttribute('aria-relevant')).toBe('additions');
    expect(log.getAttribute('tabindex')).toBe('0');
    // exactly one role=log in the tree
    expect(document.querySelectorAll('[role="log"]').length).toBe(1);
  });

  it('renders one article per message below virtualizeAfter', () => {
    render(<Thread messages={msgs(4)} />);
    expect(document.querySelectorAll('[data-ag-part="message"]').length).toBe(4);
  });

  it('shows empty state when no messages', () => {
    render(<Thread messages={[]} />);
    expect(screen.getByText('No messages yet')).toBeTruthy();
  });

  it('jump to latest: appears after arrival while unpinned, scrolls and re-pins', async () => {
    const { rerender } = render(<Thread messages={msgs(3)} />);
    const log = screen.getByRole('log');
    // Unpin: scroll up 400px (jsdom: set scrollTop and fire scroll)
    Object.defineProperty(log, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(log, 'clientHeight', { value: 400, configurable: true });
    fireEvent(log, new Event('scroll'));
    Object.defineProperty(log, 'scrollTop', { value: 500, configurable: true });
    fireEvent(log, new Event('scroll'));
    rerender(<Thread messages={msgs(4)} />);
    expect(await screen.findByText('1 new message')).toBeTruthy();
  });

  it('user send re-pins: new user message keeps pinned (no jump pill)', () => {
    const { rerender } = render(<Thread messages={msgs(2)} />);
    const next = [...msgs(2), { id: 'u', role: 'user' as const, parts: [{ type: 'text' as const, text: 'hi' }] }];
    rerender(<Thread messages={next} />);
    expect(document.querySelector('[data-ag-part="jump-to-latest"]')).toBeNull();
  });

  it('imperative handle: scrollToBottom/isPinned/scrollToMessage; 0 scrollIntoView calls', () => {
    (Element.prototype as unknown as { scrollIntoView?: () => void }).scrollIntoView ??= () => {};
    const spy = jest.spyOn(Element.prototype, 'scrollIntoView');
    const ref = React.createRef<ThreadHandle>();
    render(<Thread ref={ref} messages={msgs(5)} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.isPinned()).toBe(true);
    act(() => { ref.current!.scrollToBottom(); });
    act(() => { ref.current!.scrollToMessage('m-2'); });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
