import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { SourceList } from '../SourceList';
import type { AgPart } from '../../types';

const src = (id: string, url: string, title?: string): Extract<AgPart, { type: 'source-url' }> =>
  ({ type: 'source-url', sourceId: id, url, ...(title ? { title } : {}) });

describe('SourceList', () => {
  const sources = [
    src('a', 'https://docs.x/keys', 'Key policy'),
    src('b', 'https://rb.x/rot', 'Runbook'),
    src('c', 'https://x.y/z'),
  ];
  it('count label "{n} sources"; open by default for 3, closed for 4', () => {
    render(<SourceList messageId="m" sources={sources} />);
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('3 sources');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const r2 = render(<SourceList messageId="m" sources={[...sources, src('d', 'https://x.y/4')]} />);
    expect(r2.getAllByRole('button')[1]!.getAttribute('aria-expanded')).toBe('false');
  });
  it('item ids and external link attrs', () => {
    render(<SourceList messageId="m" sources={sources} />);
    expect(document.getElementById('ag-src-m-a')).not.toBeNull();
    const a = screen.getByRole('link', { name: /Key policy/ });
    expect(a.getAttribute('rel')).toContain('noopener');
    expect(a.getAttribute('target')).toBe('_blank');
  });
  it('rejects javascript: and data: URLs — renders text only', () => {
    render(<SourceList messageId="m" sources={[src('e', 'javascript:alert(1)', 'evil'), src('f', 'data:text/html,x', 'data')]} />);
    expect(document.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(document.querySelector('a[href^="data:"]')).toBeNull();
    expect(screen.getByText('evil')).toBeTruthy();
  });

  it('source {url:\'mailto:x\'} with no title renders text \'mailto:x\'', () => {
    render(<SourceList messageId="m" sources={[src('g', 'mailto:x')]} />);
    const item = document.getElementById('ag-src-m-g')!;
    expect(item.querySelector('[data-ag-part="source-text"]')!.textContent).toBe('mailto:x');
    expect(item.querySelector('a')).toBeNull();
  });

  it('invalid URL with no title shows the raw url; http without title shows the hostname', () => {
    render(<SourceList messageId="m" sources={[src('h', 'not a url'), src('i', 'https://host.example/p')]} />);
    expect(document.getElementById('ag-src-m-h')!.querySelector('[data-ag-part="source-text"]')!.textContent).toBe('not a url');
    expect(document.getElementById('ag-src-m-i')!.querySelector('[data-ag-part="source-link"]')!.textContent).toBe('host.example (opens in new tab)');
  });

  it('closed list keeps its items mounted (hidden) so #ag-src-… and aria-controls resolve', () => {
    render(<SourceList messageId="m" sources={[...sources, src('d', 'https://x.y/4')]} />);
    const trigger = document.querySelector('[data-ag-part="source-list"] > [data-ag-part="trigger"]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    expect(panel.tagName).toBe('OL');
    expect(panel.hidden).toBe(true);
    expect(document.getElementById('ag-src-m-d')).not.toBeNull();
  });
});
