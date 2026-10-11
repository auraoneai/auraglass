/* ai-workspace fixtures — deterministic messages over the AgMessage model. */
import type { AgMessage } from 'aura-glass/ai';

export const MESSAGES: AgMessage[] = [
  {
    id: 'w1',
    role: 'user',
    parts: [{ type: 'text', text: 'Draft a release note for the data workspace block.' }],
    metadata: { createdAt: '2026-10-05T09:00:00Z' },
  },
  {
    id: 'w2',
    role: 'assistant',
    parts: [
      { type: 'reasoning', text: 'The block combines a collection sidebar, filter bar, table and stat cards.' },
      {
        type: `tool-list_collections`,
        toolCallId: 't1',
        state: 'output-available',
        input: { scope: 'workspace' },
        output: { collections: ['live', 'archived'] },
      },
      { type: 'step-start' },
      { type: 'text', text: 'Here is a draft release note for the data workspace.' },
      { type: 'source-url', sourceId: 's1', url: 'https://docs.auraglass.dev/blocks/data-workspace', title: 'Data workspace block' },
    ],
    metadata: { createdAt: '2026-10-05T09:00:03Z' },
  },
];

export const STREAMING_MESSAGES: AgMessage[] = [
  ...MESSAGES.slice(0, 1),
  {
    id: 'w3',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Still drafting the note' }],
    metadata: { createdAt: '2026-10-05T09:00:10Z' },
  },
];
