// Sources.stories.tsx — Citation + SourceList in one message (SURF-348/349, REQ-SURF-124/125).
// The composition the citation APG spec drives: a message with four sources (so
// the list starts collapsed) and inline citations. Activating a citation (Enter,
// click or tap) expands the list and focuses `#ag-src-cite-msg-s{n}`.
// Story id: ai-sources--citation-in-message. A usage composition of two
// components, not a component page: kind 'showcase', subject 'ai-sources'.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SourceList, SourceScope } from './SourceList';
import { Citation, type AgCitationSource } from './Citation';

const meta = {
  title: 'AI/Sources',
  parameters: { ag: { subject: 'ai-sources', kind: 'showcase' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const src = (i: number): AgCitationSource => ({
  type: 'source-url', sourceId: `s${i}`, url: `https://docs.internal/ref-${i}`, title: `Reference ${i}`,
  snippet: `Excerpt ${i}: keys rotate every 90 days and on any suspected exposure.`,
} as AgCitationSource);
const SOURCES = [1, 2, 3, 4].map(src);

export const CitationInMessage: Story = {
  render: () => (
    <SourceScope>
      <article aria-label="Assistant" style={{ maxInlineSize: '36rem', padding: 'var(--ag-space-4)' }}>
        <p>
          Rotate the signing keys <Citation messageId="cite-msg" source={SOURCES[0]!} index={1} /> and
          revoke the old ones within 24 hours <Citation messageId="cite-msg" source={SOURCES[3]!} index={4} />.
        </p>
        <SourceList messageId="cite-msg" sources={SOURCES} />
      </article>
    </SourceScope>
  ),
};
