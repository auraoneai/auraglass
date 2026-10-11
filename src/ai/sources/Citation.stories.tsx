// Citation.stories.tsx — AI/Citation (SURF-348/349, REQ-SURF-125).
// Play functions fail when the subject is missing.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Citation, type AgCitationSource } from './Citation';

const meta = {
  title: 'AI/Citation',
  parameters: { ag: { subject: 'Citation', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const src = (i: number): AgCitationSource => ({
  type: 'source-url', sourceId: `s${i}`, url: `https://docs.internal/ref-${i}`, title: `Reference ${i}`,
  snippet: `Excerpt ${i}: keys rotate every 90 days and on any suspected exposure.`,
} as AgCitationSource);
const url = src(1);
const doc = { type: 'source-document', sourceId: 'd1', mediaType: 'application/pdf', title: 'Runbook', filename: 'runbook.pdf' } as AgCitationSource;

export const CitationFocused: Story = {
  render: () => (
    <p>
      See <Citation messageId="m" source={url} index={1} /> for details.
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

/* Focus opens the preview card (REQ-SURF-125); one url and one document source. */
function Previewed({ source, index }: { source: AgCitationSource; index: number }) {
  const host = React.useRef<HTMLSpanElement | null>(null);
  React.useEffect(() => { host.current?.querySelector<HTMLAnchorElement>('a')?.focus(); }, []);
  return <span ref={host}><Citation messageId="m" source={source} index={index} /></span>;
}
export const PreviewUrl: Story = { render: () => <p>See <Previewed source={url} index={1} />.</p> };
export const PreviewDocument: Story = { render: () => <p>See <Previewed source={doc} index={2} />.</p> };

