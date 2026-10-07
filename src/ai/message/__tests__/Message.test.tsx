import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Message } from '../Message';
import type { AgMessage } from '../../types';

const base: AgMessage = {
  id: 'm1', role: 'assistant',
  parts: [{ type: 'text', text: 'Hello there' }],
  metadata: { createdAt: '2026-05-12T09:14:03Z', status: 'complete' },
};

describe('Message', () => {
  it('data-role and data-state', () => {
    const { container } = render(<Message message={base} />);
    const el = container.querySelector('[data-ag-part="message"]')!;
    expect(el.getAttribute('data-role')).toBe('assistant');
    expect(el.getAttribute('data-state')).toBe('complete');
  });

  it('accessible name: hidden heading "{author}, {time}" via aria-labelledby', () => {
    render(<Message message={base} />);
    const article = screen.getByRole('article');
    const labelled = article.getAttribute('aria-labelledby')!;
    const heading = document.getElementById(labelled)!;
    expect(heading.textContent).toContain('Assistant');
  });

  it('explicit locale/timeZone used for the heading time', () => {
    render(<Message message={base} locale="en-US" timeZone="Pacific/Kiritimati" />);
    const article = screen.getByRole('article');
    const heading = document.getElementById(article.getAttribute('aria-labelledby')!)!;
    expect(heading.textContent).toMatch(/\d{1,2}:\d{2}/);
  });

  it('Actions: copy writes text and announces', async () => {
    const user = userEvent.setup();
    const writeText = jest.fn<(text: string) => Promise<void>>(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Message message={base}><Message.Content /><Message.Actions message={base} /></Message>);
    const copyBtn = screen.getByRole('button', { name: 'Copy message' });
    await user.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith('Hello there');
  });

  it('feedback toggles aria-pressed and calls onFeedback', async () => {
    const user = userEvent.setup();
    const onFeedback = jest.fn();
    render(<Message message={base}><Message.Content /><Message.Actions message={base} onFeedback={onFeedback} /></Message>);
    const up = screen.getByRole('button', { name: 'Helpful' });
    await user.click(up);
    expect(onFeedback).toHaveBeenCalledWith('m1', 'up');
    expect(up.getAttribute('aria-pressed')).toBe('true');
  });

  it('getText static joins text parts', () => {
    expect(Message.getText(base)).toBe('Hello there');
  });
});
