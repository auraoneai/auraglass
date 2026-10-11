// Sources.stories.tsx — AI/Sources (SourceList + Citation, SURF-348/349,
// REQ-SURF-124/125). Play functions fail when the subject is missing.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { SourceList, SourceScope, type AgSourcePart } from './SourceList';
import { Citation, type AgCitationSource } from './Citation';

const meta = {
  title: 'AI/Sources',
  parameters: { ag: { subject: 'SourceList', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const src = (i: number): AgCitationSource => ({
  type: 'source-url', sourceId: `s${i}`, url: `https://docs.internal/ref-${i}`, title: `Reference ${i}`,
  snippet: `Excerpt ${i}: keys rotate every 90 days and on any suspected exposure.`,
} as AgCitationSource);

export const Three: Story = { render: () => <SourceList messageId="m" sources={[src(1), src(2), src(3)]} /> };
export const Twelve: Story = { render: () => <SourceList messageId="m" sources={Array.from({ length: 12 }, (_, i) => src(i + 1))} /> };
export const UntitledAndNonHttp: Story = {
  render: () => (
    <SourceList
      messageId="m"
      sources={[
        { type: 'source-url', sourceId: 'u1', url: 'https://example.org/no-title' },
        { type: 'source-url', sourceId: 'u2', url: 'mailto:security@example.org' },
      ] as AgSourcePart[]}
    />
  ),
};
export const CitationFocused: Story = {
  render: () => (
    <p>
      See <Citation messageId="m" source={src(1)} index={1} /> for details.
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cite = canvas.getByRole('link', { name: 'Source 1: Reference 1' });
    cite.focus();
    await expect(cite).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(cite).toHaveFocus();
  },
};

/**
 * A message with four sources (so the list starts collapsed) and inline
 * citations. Activating a citation (Enter, click or tap) expands the list
 * and focuses `#ag-src-cite-msg-s{n}`. Story id: ai-sources--citation-in-message.
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
