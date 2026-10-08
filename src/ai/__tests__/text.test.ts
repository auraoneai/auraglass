import { describe, expect, it } from '@jest/globals';
import { getMessageText } from '../text';
import type { AgMessage } from '../types';

const msg = (parts: AgMessage['parts']): AgMessage => ({ id: 'm1', role: 'assistant', parts });

describe('getMessageText', () => {
  it('single text part', () => {
    expect(getMessageText(msg([{ type: 'text', text: 'hello' }]))).toBe('hello');
  });
  it('joins two text parts with a blank line', () => {
    expect(getMessageText(msg([{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }]))).toBe('a\n\nb');
  });
  it('excludes reasoning, tool, source, file parts', () => {
    expect(getMessageText(msg([
      { type: 'reasoning', text: 'thinking' },
      { type: 'text', text: 'answer' },
      { type: 'source-url', sourceId: 's1', url: 'https://example.com' },
      { type: 'file', mediaType: 'image/png', url: 'blob:1' },
    ]))).toBe('answer');
  });
  it('empty message → empty string', () => {
    expect(getMessageText(msg([]))).toBe('');
  });
});
