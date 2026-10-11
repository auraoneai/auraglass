/** @jest-environment jsdom */
// tests/capability/registry/comment-thread.test.tsx — REQ-SURF-176
// (REQ-FIN-88, AC-FIN-88). Rendered against the REAL library sources:
// ol > li > article with <time dateTime>, onResolve, anchorLabel, a
// multiline TextField composer whose textarea keydown is IME-safe (Enter
// during composition never submits, plain Enter submits, Shift+Enter is a
// newline), and no timers.
//
// Resolution: 'aura-glass' is aliased to src/index.ts via jest.requireActual
// until the root mapper lands (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as fs from 'node:fs';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });

import { CommentThread } from '../../../registry/items/comment-thread/index';
import { comments, commentThreadProps } from '../../../registry/items/comment-thread/fixtures';

afterEach(cleanup);

/** jest-axe result shape (the package ships no types for it here). */
type AxeResult = { violations: Array<{ id: string; nodes: Array<{ target: unknown }> }> };

const composer = () => screen.getByRole('textbox', { name: 'Write a comment' }) as HTMLTextAreaElement;
const type = (v: string) => fireEvent.change(composer(), { target: { value: v } });

describe('comment-thread item', () => {
  it('renders ol > li > article with <time dateTime>', () => {
    const { container } = render(<CommentThread {...commentThreadProps} />);
    const list = container.querySelector('ol[data-ag-part="comments"]')!;
    const items = list.querySelectorAll(':scope > li');
    expect(items).toHaveLength(comments.length);
    items.forEach((li, i) => {
      const article = li.querySelector(':scope > article')!;
      expect(article).not.toBeNull();
      expect(article.textContent).toContain(comments[i]!.author);
      expect(article.textContent).toContain(comments[i]!.body);
      expect(article.querySelector('time')!.getAttribute('dateTime')).toBe(comments[i]!.at);
    });
  });

  it('the composer is a multiline TextField (textarea)', () => {
    render(<CommentThread {...commentThreadProps} />);
    expect(composer().tagName).toBe('TEXTAREA');
  });

  it('plain Enter on the textarea submits the trimmed draft and clears it', () => {
    const onSubmit = jest.fn();
    render(<CommentThread {...commentThreadProps} onSubmit={onSubmit} />);
    type('  Looks good  ');
    fireEvent.keyDown(composer(), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('Looks good');
    expect(composer().value).toBe('');
  });

  it('Enter during an IME composition does NOT submit', () => {
    const onSubmit = jest.fn();
    render(<CommentThread {...commentThreadProps} onSubmit={onSubmit} />);
    type('にほんご');
    fireEvent.keyDown(composer(), { key: 'Enter', isComposing: true });
    fireEvent.keyDown(composer(), { key: 'Enter', keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(composer().value).toBe('にほんご');
  });

  it('Shift+Enter is not intercepted (newline), and does not submit', () => {
    const onSubmit = jest.fn();
    render(<CommentThread {...commentThreadProps} onSubmit={onSubmit} />);
    type('line one');
    const ev = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true });
    composer().dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Enter on the footer outside the textarea does not submit (guard is on the textarea)', () => {
    const onSubmit = jest.fn();
    render(<CommentThread {...commentThreadProps} onSubmit={onSubmit} />);
    type('draft');
    const footer = screen.getByRole('button', { name: 'Comment' }).parentElement!;
    expect(footer.contains(composer())).toBe(true);
    fireEvent.keyDown(footer, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('the submit button submits', () => {
    const onSubmit = jest.fn();
    render(<CommentThread {...commentThreadProps} onSubmit={onSubmit} />);
    type('via button');
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));
    expect(onSubmit).toHaveBeenCalledWith('via button');
  });

  it('onResolve(id) is called from each comment\'s Resolve action', () => {
    const onResolve = jest.fn();
    render(<CommentThread {...commentThreadProps} onResolve={onResolve} />);
    fireEvent.click(screen.getByRole('button', { name: `Resolve comment by ${comments[1]!.author}` }));
    expect(onResolve).toHaveBeenCalledWith(comments[1]!.id);
  });

  it('anchorLabel names the thread region', () => {
    render(<CommentThread {...commentThreadProps} anchorLabel="Line 42 · totals row" />);
    const region = screen.getByRole('region', { name: 'Line 42 · totals row' });
    expect(within(region).getAllByRole('article')).toHaveLength(comments.length);
  });

  it('collapses the avatar column below 360 px via a container query', () => {
    const css = fs.readFileSync('registry/items/comment-thread/comment-thread.css', 'utf8');
    expect(css).toMatch(/container:\s*ag-comment-thread\s*\/\s*inline-size/);
    expect(css).toMatch(/@container ag-comment-thread \(max-width: 359\.98px\)[\s\S]*\.ag-comment-thread__avatar\s*\{\s*display:\s*none/);
  });

  it('leaves no timers', () => {
    jest.useFakeTimers();
    try {
      render(<CommentThread {...commentThreadProps} />);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });

  it('has 0 axe violations', async () => {
    const { container } = render(<CommentThread {...commentThreadProps} onResolve={() => {}} anchorLabel="Totals row" />);
    const r = (await axe(container, { rules: { region: { enabled: false } } })) as AxeResult;
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`)).toEqual([]);
  });

  it('ships no colour literals', () => {
    for (const f of ['CommentThread.tsx', 'comment-thread.css', 'index.tsx']) {
      expect(fs.readFileSync(`registry/items/comment-thread/${f}`, 'utf8')).not.toMatch(/hsl\(|#[0-9a-f]{3,6}\b/i);
    }
  });
});
