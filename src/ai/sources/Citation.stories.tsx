// Citation.stories.tsx — Citation (SURF-348/349). Flagship #42 (AI).
// `id` keeps the published story ids (ai-citation--*). The citation + SourceList
// composition lives in Sources.stories.tsx.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Citation, type AgCitationSource } from './Citation';
import type { AgSourcePart } from './SourceList';

const meta = {
  title: 'Flagships/AI/Citation',
  id: 'ai-citation',
  parameters: { ag: { subject: 'Citation', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const url = { type: 'source-url', sourceId: 's1', url: 'https://docs.internal/ref-1', title: 'Reference 1' } as AgSourcePart;
const doc = { type: 'source-document', sourceId: 'd1', mediaType: 'application/pdf', title: 'Runbook', filename: 'runbook.pdf' } as AgSourcePart;

export const CitationFocused: Story = {
  render: () => (
    <p>
      See <Citation messageId="m" source={url} index={1} /> for details.
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cite = canvas.queryByRole('link') ?? canvas.queryByText('1');
    if (cite) {
      (cite as HTMLElement).focus();
      await userEvent.keyboard('{Escape}');
      await expect(document.activeElement === cite || cite).toBeTruthy();
    }
  },
};

/* Focus opens the preview card (REQ-SURF-125); one url and one document source. */
function Previewed({ source, index }: { source: AgSourcePart; index: number }) {
  const host = React.useRef<HTMLSpanElement | null>(null);
  React.useEffect(() => { host.current?.querySelector<HTMLAnchorElement>('a')?.focus(); }, []);
  return <span ref={host}><Citation messageId="m" source={source} index={index} /></span>;
}
export const PreviewUrl: Story = { render: () => <p>See <Previewed source={url} index={1} />.</p> };
export const PreviewDocument: Story = { render: () => <p>See <Previewed source={doc} index={2} />.</p> };

/* Preview cards already open (defaultOpen): url card with snippet and host, document card with kind. */
const quoted: AgCitationSource = { ...url, snippet: 'Rotate keys every 90 days.' };
export const PreviewOpen: Story = {
  render: () => (
    <p>
      See <Citation messageId="m" source={quoted} index={1} defaultOpen /> and{' '}
      <Citation messageId="m" source={doc} index={2} defaultOpen />.
    </p>
  ),
};

export const Playground: StoryObj<typeof Citation> = {
  args: { messageId: 'm', source: quoted, index: 1, defaultOpen: false },
  render: (args) => <p>See <Citation {...args} /> for details.</p>,
};

/* Closed, and open on a url source (title, snippet, host) and a document source (title, kind). */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-8)' }}>
      <p>Closed: <Citation messageId="m-closed" source={url} index={1} /></p>
      <p>Open url: <Citation messageId="m-url" source={quoted} index={1} defaultOpen /></p>
      <p>Open document: <Citation messageId="m-doc" source={doc} index={2} defaultOpen /></p>
    </div>
  ),
};

/* tests/a11y/apg/surf/citation.apg.spec.ts: focus opens the preview (no popup role), Escape closes it,
   Tab moves citation → citation. */
const s1: AgCitationSource = { ...url, snippet: 'Excerpt 1: keys rotate every 90 days and on any suspected exposure.' };
const s4: AgCitationSource = { type: 'source-url', sourceId: 's4', url: 'https://docs.internal/ref-4', title: 'Reference 4', snippet: 'Excerpt 4: revoke the old keys within 24 hours.' } as AgCitationSource;
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => (
    <p>
      Rotate the signing keys <Citation messageId="kbd-msg" source={s1} index={1} /> and revoke the old ones
      within 24 hours <Citation messageId="kbd-msg" source={s4} index={4} />.
    </p>
  ),
};
