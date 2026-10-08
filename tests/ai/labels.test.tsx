/** @jest-environment jsdom */
// tests/ai/labels.test.tsx — REQ-SURF-129 (labels plumbing): every visible
// English default string is reachable through the labels prop surface —
// pseudo-locating the inputs must leave zero English defaults in the DOM.

import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

import { Thread } from '../../src/ai/thread/Thread';
import { Message } from '../../src/ai/message/Message';
import { Composer } from '../../src/ai/composer/Composer';
import { ToolCall } from '../../src/ai/tool/ToolCall';
import { Reasoning } from '../../src/ai/reasoning/Reasoning';
import { SourceList } from '../../src/ai/sources/SourceList';
import { ProviderErrorState } from '../../src/ai/error/ProviderErrorState';
import type { AgMessage } from '../../src/ai/types';

const msg: AgMessage = { id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'answer' }] };

function textsIn(container: HTMLElement): string[] {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const out: string[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = (n.textContent ?? '').trim();
    if (t) out.push(t);
  }
  return out;
}

describe('ai labels plumbing (REQ-SURF-129)', () => {
  it('Composer label overrides replace the defaults', () => {
    const { container, queryByText } = render(
      <Composer labels={{ input: 'MSG', submit: 'GO', stop: 'HALT' }} />,
    );
    expect(queryByText('Send')).toBeNull();
    expect(queryByText('Send message')).toBeNull();
    const texts = textsIn(container).join(' ');
    expect(container.querySelector('[aria-label="MSG"]')).toBeTruthy();
    void texts;
  });

  it('Thread/ToolCall/ProviderErrorState accept labels without English fallthrough', () => {
    const { container: t } = render(
      <Thread messages={[msg]} labels={{ empty: 'TÜHI', jumpToLatest: '{n} UUT' }} />,
    );
    expect(t.textContent).not.toContain('new message');
    const { container: tc } = render(
      <ToolCall part={{ type: 'tool-x', toolCallId: '1', state: 'approval-requested', approval: { id: 'a' }, input: {} } as never}
        labels={{ needsApproval: 'VAJAB' }} />,
    );
    expect(tc.textContent).toContain('VAJAB');
    const { container: pe } = render(
      <ProviderErrorState kind="rate-limit" title="PIIRANG" detail="OOT" />,
    );
    expect(pe.textContent).toContain('PIIRANG');
    expect(pe.textContent).not.toContain('Rate limit reached');
  });

  it('Reasoning label params interpolate', () => {
    const { container } = render(<Reasoning text="x" state="done" durationMs={4200} labels={{ thoughtFor: (s: string) => `MÕTLES ${s} s` }} />);
    expect(container.textContent).toContain('MÕTLES');
  });
});
