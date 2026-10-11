import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageParts } from '../MessageParts';
import type { AgMessage } from '../../types';
import type { AgTextRenderer } from '../../renderers';
import fixture from '../../__fixtures__/ui-messages.ai-sdk.json';

const asMessages = fixture.messages as unknown as AgMessage[];

/** The data-ag-part tree of a render: nested `part[state]` lines, text omitted. */
function partTree(root: Element): string {
  const lines: string[] = [];
  const walk = (el: Element, depth: number) => {
    for (const child of Array.from(el.children)) {
      const part = child.getAttribute('data-ag-part');
      if (part) {
        const attrs = ['data-state', 'data-role', 'data-index', 'data-media-type', 'href', 'download', 'rel', 'role']
          .filter((a) => child.hasAttribute(a))
          .map((a) => `${a}=${child.getAttribute(a)}`);
        lines.push(`${'  '.repeat(depth)}${part}${attrs.length ? ` [${attrs.join(' ')}]` : ''}`);
        walk(child, depth + 1);
      } else {
        walk(child, depth);
      }
    }
  };
  walk(root, 0);
  return lines.join('\n');
}

// Runs first: the dev warning is once per unknown type per module instance,
// so this sweep is the only place in the file that can observe it.
describe('MessageParts unknown parts', () => {
  it('a full fixture sweep emits exactly one console.warn, for mystery-part', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      for (const m of asMessages) render(<MessageParts message={m} />).unmount();
      for (const m of asMessages) render(<MessageParts message={m} />).unmount();
      const partWarnings = warn.mock.calls.filter((c) => String(c[0]).startsWith('Message.Parts:'));
      expect(partWarnings).toHaveLength(1);
      expect(String(partWarnings[0]?.[0])).toContain('"mystery-part"');
    } finally {
      warn.mockRestore();
    }
  });
});

describe('MessageParts (every fixture message)', () => {
  let warn: ReturnType<typeof jest.spyOn>;
  beforeAll(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined); });
  afterAll(() => { warn.mockRestore(); });

  it('the fixture has at least 20 messages', () => {
    expect(asMessages.length).toBeGreaterThanOrEqual(20);
  });

  it.each(asMessages.map((m) => [m.id, m] as const))('%s: data-ag-part tree', (_id, message) => {
    const { container } = render(<MessageParts message={message} citations="markers" showSteps />);
    expect(partTree(container)).toMatchSnapshot();
  });
});

describe('MessageParts (fixtures)', () => {
  it('renders text/source/file/step-start parts and emits one SourceList after the last text part', () => {
    const withSources = asMessages.find((m) => m.parts.some((p) => p.type === 'source-url'))!;
    const { container } = render(<MessageParts message={withSources} />);
    expect(container.querySelector('[data-ag-part="text-part"]')).not.toBeNull();
    const lists = container.querySelectorAll('[data-ag-part="source-list"]');
    expect(lists.length).toBe(1);
  });

  it('a message with sources and no text part still emits one SourceList, last', () => {
    const msg: AgMessage = {
      id: 'st', role: 'assistant',
      parts: [
        { type: 'source-document', sourceId: 'd1', mediaType: 'application/pdf', title: 'Annex' },
        { type: 'step-start' },
      ],
    };
    const { container } = render(<MessageParts message={msg} showSteps />);
    const lists = container.querySelectorAll('[data-ag-part="source-list"]');
    expect(lists).toHaveLength(1);
    const parts = Array.from(container.querySelectorAll(':scope > [data-ag-part]')).map((e) => e.getAttribute('data-ag-part'));
    expect(parts).toEqual(['step-separator', 'source-list']);
  });

  it('escapes text (no HTML injection)', () => {
    const msg: AgMessage = { id: 'x', role: 'assistant', parts: [{ type: 'text', text: '<img src=x onerror=alert(1)>' }] };
    const { container } = render(<MessageParts message={msg} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('error status renders compact ProviderErrorState; aborted renders Stopped', () => {
    const err: AgMessage = { id: 'e', role: 'assistant', parts: [], metadata: { status: 'error' } };
    const { container } = render(<MessageParts message={err} />);
    expect(container.querySelector('[data-ag-part="provider-error"]')).not.toBeNull();
    const ab: AgMessage = { id: 'a', role: 'assistant', parts: [], metadata: { status: 'aborted' } };
    const r2 = render(<MessageParts message={ab} />);
    expect(r2.container.textContent).toContain('Stopped');
  });

  it('showSteps renders role=separator for step-start parts', () => {
    const msg: AgMessage = { id: 's', role: 'assistant', parts: [{ type: 'text', text: 'a' }, { type: 'step-start' }, { type: 'text', text: 'b' }] };
    const { container } = render(<MessageParts message={msg} showSteps />);
    expect(container.querySelector('[role="separator"]')).not.toBeNull();
  });
});

describe('MessageParts citations (REQ-SURF-112)', () => {
  const cited: AgMessage = {
    id: 'cm', role: 'assistant',
    parts: [
      { type: 'text', text: 'Only the runbook [2] and the policy [^s-a]; [7] has no source.' },
      { type: 'source-url', sourceId: 's-a', url: 'https://docs.example/policy', title: 'Policy' },
      { type: 'source-url', sourceId: 's-b', url: 'https://docs.example/runbook', title: 'Runbook' },
    ],
  };

  it('[2] maps to sources[1]', () => {
    const { container } = render(<MessageParts message={cited} citations="markers" />);
    const links = Array.from(container.querySelectorAll('a[data-ag-part="citation"]'));
    expect(links[0]?.getAttribute('href')).toBe('#ag-src-cm-s-b');
    expect(links[0]?.getAttribute('data-index')).toBe('2');
    expect(screen.getByRole('link', { name: /^Source 2: Runbook/ })).toBe(links[0]);
  });

  it('[^sourceId] resolves through the sourceId index', () => {
    const { container } = render(<MessageParts message={cited} citations="markers" />);
    const links = Array.from(container.querySelectorAll('a[data-ag-part="citation"]'));
    expect(links).toHaveLength(2);
    expect(links[1]?.getAttribute('href')).toBe('#ag-src-cm-s-a');
    expect(links[1]?.getAttribute('data-index')).toBe('1');
  });

  it('a marker without a source stays literal text', () => {
    const { container } = render(<MessageParts message={cited} citations="markers" />);
    const text = container.querySelector('[data-ag-part="text-part"]')!;
    expect(text.textContent).toContain('[7] has no source.');
  });

  it('the fixture citation [2] cites Source 2', () => {
    const msg = asMessages.find((m) => m.id === 'msg-12')!;
    render(<MessageParts message={msg} citations="markers" />);
    expect(screen.getByRole('link', { name: /^Source 2: Rotation runbook/ }).getAttribute('href')).toBe('#ag-src-msg-12-s-2');
  });
});

describe('MessageParts renderers (REQ-SURF-112)', () => {
  it('renderText receives the text, streaming flag and messageId', () => {
    const renderText = jest.fn<AgTextRenderer>((text) => <i data-ag-part="custom-text">{text}</i>);
    const msg: AgMessage = { id: 'rt', role: 'assistant', parts: [{ type: 'text', text: 'hi', state: 'streaming' }] };
    render(<MessageParts message={msg} renderText={renderText} />);
    expect(renderText).toHaveBeenCalledWith('hi', { streaming: true, messageId: 'rt' });
  });

  it('dynamic-tool routes to the tool-* prefix renderer; exact beats prefix', () => {
    const msg: AgMessage = {
      id: 'dt', role: 'assistant',
      parts: [
        { type: 'dynamic-tool', toolName: 'lookup', toolCallId: 'c1', state: 'input-available', input: {} },
        { type: 'tool-search', toolCallId: 'c2', state: 'input-available', input: {} },
      ] as AgMessage['parts'],
    };
    const { container } = render(
      <MessageParts
        message={msg}
        renderers={{
          'tool-*': (p) => <b data-ag-part="tool-prefix">{p.type}</b>,
          'tool-search': () => <b data-ag-part="tool-exact">search</b>,
        }}
      />,
    );
    expect(Array.from(container.querySelectorAll('[data-ag-part="tool-prefix"]')).map((e) => e.textContent)).toEqual(['dynamic-tool']);
    expect(container.querySelector('[data-ag-part="tool-exact"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="tool-call"]')).toBeNull();
  });

  it('data-* parts render only via a named or data-* renderer', () => {
    const msg: AgMessage = { id: 'd', role: 'assistant', parts: [{ type: 'data-foo', data: { a: 1 } }] };
    const { container, rerender } = render(<MessageParts message={msg} />);
    expect(container.querySelector('[data-ag-part]')).toBeNull();
    rerender(<MessageParts message={msg} renderers={{ 'data-foo': () => <b data-ag-part="data-foo">FOO</b> }} />);
    expect(container.querySelector('[data-ag-part="data-foo"]')).not.toBeNull();
    rerender(<MessageParts message={msg} renderers={{ 'data-*': () => <b data-ag-part="data-any">ANY</b> }} />);
    expect(container.querySelector('[data-ag-part="data-any"]')).not.toBeNull();
  });

  it("'*' is not a catch-all renderer key", () => {
    const msg: AgMessage = { id: 'w', role: 'assistant', parts: [{ type: 'text', text: 'plain' }] };
    const { container } = render(<MessageParts message={msg} renderers={{ '*': () => <b data-ag-part="star">X</b> }} />);
    expect(container.querySelector('[data-ag-part="star"]')).toBeNull();
    expect(container.querySelector('[data-ag-part="text-part"]')?.textContent).toBe('plain');
  });
});

describe('MessageParts file parts (REQ-SURF-115)', () => {
  const files = (url: string, mediaType = 'application/pdf'): AgMessage => ({
    id: 'f', role: 'user', parts: [{ type: 'file', mediaType, url, filename: 'spec.pdf' }],
  });

  it('renders file parts: image thumbnail vs attachment chip', () => {
    const msg: AgMessage = {
      id: 'f1', role: 'user',
      parts: [
        { type: 'file', mediaType: 'image/png', url: 'blob:img', filename: 'shot.png' },
        { type: 'file', mediaType: 'application/pdf', url: 'blob:doc', filename: 'spec.pdf' },
      ],
    };
    const { container } = render(<MessageParts message={msg} />);
    const img = container.querySelector('img[alt="shot.png"]')!;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('width')).toBe('96');
    const chip = container.querySelector('[data-media-type="application/pdf"]')!;
    expect(chip.querySelector('[data-ag-part="attachment-type"]')?.textContent).toBe('application/pdf');
  });

  it('http pdf renders a link without download, rel=noopener', () => {
    const { container } = render(<MessageParts message={files('https://files.example/spec.pdf')} />);
    const a = container.querySelector('a[href^="https"]:not([download])');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('rel')).toBe('noopener');
    expect(screen.getByRole('link', { name: 'spec.pdf' })).toBe(a);
  });

  it('blob pdf renders a[download]', () => {
    const { container } = render(<MessageParts message={files('blob:https://app.example/123')} />);
    const a = container.querySelector('a[download]');
    expect(a?.getAttribute('href')).toBe('blob:https://app.example/123');
    expect(a?.getAttribute('download')).toBe('spec.pdf');
  });

  it.each([
    ['javascript:alert(1)'],
    ['JavaScript:alert(1)'],
    ['  javascript:alert(1)'],
    ['java\tscript:alert(1)'],
    ['vbscript:msgbox(1)'],
    ['file:///etc/passwd'],
  ])('%j is rejected: the filename renders as text, no link', (url) => {
    const { container } = render(<MessageParts message={files(url)} />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('[data-ag-part="attachment-name"]')?.textContent).toBe('spec.pdf');
  });
});
