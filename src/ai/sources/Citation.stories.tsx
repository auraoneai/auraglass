// Citation.stories.tsx — AI/Citation (SURF-348/349).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Citation } from './Citation';
import type { AgSourcePart } from './SourceList';

const meta = {
  title: 'AI/Citation',
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
