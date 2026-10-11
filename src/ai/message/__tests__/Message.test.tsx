import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Message, MessageRoot } from '../Message';
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

  it('Message.Root is MessageRoot', () => {
    expect(Message.Root).toBe(MessageRoot);
    render(<Message.Root message={base}><Message.Content>body</Message.Content></Message.Root>);
    expect(screen.getByRole('article').getAttribute('data-role')).toBe('assistant');
  });

  // ICU separates the time and day period with U+202F (narrow no-break
  // space) in current Node releases; normalise it so the assertion pins the
  // zone-specific value, not the ICU whitespace flavour.
  const headingText = () => {
    const article = screen.getByRole('article');
    return document.getElementById(article.getAttribute('aria-labelledby')!)!.textContent!.replace(/[\u202f\u00a0]/g, ' ');
  };

  it.each([
    ['Pacific/Kiritimati', 'Assistant, 11:14 PM'], // UTC+14
    ['America/Los_Angeles', 'Assistant, 2:14 AM'], // UTC-7 (PDT)
    ['UTC', 'Assistant, 9:14 AM'],
  ])('explicit locale/timeZone used for the heading time (%s)', (timeZone, expected) => {
    render(<Message message={base} locale="en-US" timeZone={timeZone} />);
    expect(headingText()).toBe(expected);
  });

  it('heading omits the time when createdAt is missing', () => {
    render(<Message message={{ ...base, metadata: { status: 'complete' } }} author="Ada" />);
    expect(headingText()).toBe('Ada');
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

  it('labels.copy names the copy action', () => {
    render(<Message message={base}><Message.Content /><Message.Actions message={base} labels={{ copy: 'Copier' }} /></Message>);
    expect(screen.getByRole('button', { name: 'Copier' }).getAttribute('data-ag-part')).toBe('action');
  });

  it('actions reachable: tab order reaches copy, regenerate and feedback; axe 0', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Message message={base}>
        <Message.Content><Message.Parts message={base} /></Message.Content>
        <Message.Actions message={base} onRegenerate={() => undefined} onFeedback={() => undefined} />
      </Message>,
    );
    const order: Array<string | null> = [];
    for (let i = 0; i < 4; i += 1) {
      await user.tab();
      order.push(document.activeElement?.getAttribute('aria-label') ?? null);
    }
    expect(order).toEqual(['Copy message', 'Regenerate', 'Helpful', 'Not helpful']);
    const results = (await axe(container)) as { violations: unknown[] };
    expect(results.violations).toHaveLength(0);
  });

  it('error and aborted', () => {
    const { container, rerender } = render(<Message message={{ ...base, metadata: { status: 'error' } }} />);
    expect(container.querySelector('[data-ag-part="message"]')?.getAttribute('data-state')).toBe('error');
    expect(container.querySelector('[data-ag-part="provider-error"]')).not.toBeNull();
    rerender(<Message message={{ ...base, metadata: { status: 'aborted' } }} />);
    expect(container.querySelector('[data-ag-part="message"]')?.getAttribute('data-state')).toBe('aborted');
    expect(container.querySelector('[data-ag-part="stopped"]')?.textContent).toBe('Stopped');
  });

  it('getText static joins text parts', () => {
    expect(Message.getText(base)).toBe('Hello there');
  });
});
