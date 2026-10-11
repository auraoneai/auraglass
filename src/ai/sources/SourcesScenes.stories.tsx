// SourcesScenes.stories.tsx — AI/Sources composition scene (REQ-SURF-124/125):
// inline Citations plus the in-message SourceList they target. Kept apart from
// Citation.stories.tsx / SourceList.stories.tsx, whose stories render only
// their own parts (S-31). Story id: ai-sources--citation-in-message.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Citation, type AgCitationSource } from './Citation';
import { SourceList, SourceScope } from './SourceList';

const meta = {
  title: 'AI/Sources',
  parameters: { ag: { subject: 'Citation', kind: 'scene' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const src = (i: number): AgCitationSource => ({
  type: 'source-url', sourceId: `s${i}`, url: `https://docs.internal/ref-${i}`, title: `Reference ${i}`,
  snippet: `Excerpt ${i}: keys rotate every 90 days and on any suspected exposure.`,
} as AgCitationSource);

/**
 * A message with four sources (so the list starts collapsed) and inline
 * citations. Activating a citation (Enter, click or tap) expands the list
 * and focuses `#ag-src-cite-msg-s{n}`.
 */
const SOURCES = [1, 2, 3, 4].map(src);
export const CitationInMessage: Story = {
  render: () => (
    <SourceScope>
      <article data-ag-part="message" aria-label="Assistant" style={{ maxInlineSize: '36rem', padding: 16 }}>
        <p data-ag-part="text-part">
          Rotate the signing keys <Citation messageId="cite-msg" source={SOURCES[0]!} index={1} /> and
          revoke the old ones within 24 hours <Citation messageId="cite-msg" source={SOURCES[3]!} index={4} />.
        </p>
        <SourceList messageId="cite-msg" sources={SOURCES} />
      </article>
    </SourceScope>
  ),
};
