/** @jest-environment jsdom */
// tests/ai/a11y.axe.test.tsx — AC-SURF-12 (SURF-358): jest-axe over every AI
// story state (0 violations). The browser axe sweep (colour contrast) runs on
// QUAL's L5 over SURF stories; this suite covers the state matrix in jsdom.

import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as React from 'react';

import { Thread } from '../../src/ai/thread/Thread';
import { Message } from '../../src/ai/message/Message';
import { StreamingText } from '../../src/ai/message/StreamingText';
import { Composer } from '../../src/ai/composer/Composer';
import { ToolCall } from '../../src/ai/tool/ToolCall';
import { Reasoning } from '../../src/ai/reasoning/Reasoning';
import { AgentSteps } from '../../src/ai/agent/AgentSteps';
import { SourceList } from '../../src/ai/sources/SourceList';
import { Citation } from '../../src/ai/sources/Citation';
import { UsageMeter } from '../../src/ai/usage/UsageMeter';
import { ProviderErrorState } from '../../src/ai/error/ProviderErrorState';
import type { AgMessage } from '../../src/ai/types';

const messages: AgMessage[] = [
  { id: 'a1', role: 'user', parts: [{ type: 'text', text: 'Summarise the incident.' }] },
  {
    id: 'a2', role: 'assistant',
    parts: [
      { type: 'text', text: 'The window was brief.' },
      { type: 'source-url', sourceId: 's1', url: 'https://status.internal/postmortem', title: 'Postmortem' },
    ],
  },
];

async function noViolations(ui: React.ReactElement) {
  const { container } = render(ui);
  const results = await axe(container) as { violations: unknown[] };
  expect(results.violations).toHaveLength(0);
}

describe('ai a11y axe (AC-SURF-12)', () => {
  it('Thread empty', () => noViolations(<Thread messages={[]} />));
  it('Thread short', () => noViolations(<Thread messages={messages} />));
  it('Thread streaming', () => noViolations(<Thread messages={[
    ...messages,
    { id: 'a3', role: 'assistant', parts: [{ type: 'text', text: 'partial' }], metadata: { status: 'streaming' } },
  ]} />));
  it('Message user/assistant', () => noViolations(<>{messages.map((m) => <Message key={m.id} message={m} />)}</>));
  it('Message streaming text', () => noViolations(<StreamingText text="partial" streaming />));
  it('Composer ready/draft/near-limit/disabled', async () => {
    await noViolations(<Composer />);
    await noViolations(<Composer defaultValue="draft" />);
    await noViolations(<Composer defaultValue="x" maxLength={2} />);
    await noViolations(<Composer disabled />);
  });
  it('ToolCall every display state', async () => {
    const states = ['input-streaming', 'input-available', 'approval-requested', 'approval-responded', 'output-available', 'output-error', 'output-denied'] as const;
    for (const state of states) {
      await noViolations(<ToolCall part={{ type: 'tool-a', toolCallId: `t-${state}`, state, input: {} } as never} />);
    }
  });
  it('Reasoning streaming/done', async () => {
    await noViolations(<Reasoning text="thinking" state="streaming" />);
    await noViolations(<Reasoning text="thought" state="done" durationMs={4200} />);
  });
  it('AgentSteps', () => noViolations(<AgentSteps steps={[{ id: 's1', label: 'Look up', state: 'succeeded' }, { id: 's2', label: 'Compose', state: 'running' }]} />));
  it('SourceList + Citation', async () => {
    const sources = [{ type: 'source-url' as const, sourceId: 's1', url: 'https://docs.internal/x', title: 'Doc' }];
    await noViolations(<SourceList messageId="m1" sources={sources} />);
    await noViolations(<Citation messageId="m1" source={sources[0]!} index={1} />);
  });
  it('UsageMeter', () => noViolations(<UsageMeter usage={{ inputTokens: 900, outputTokens: 300, contextWindow: 4096 }} />));
  it('ProviderErrorState kinds', async () => {
    for (const kind of ['rate-limit', 'auth', 'network', 'content-filter', 'context-length', 'aborted', 'unknown'] as const) {
      await noViolations(<ProviderErrorState kind={kind} />);
    }
  });
});
