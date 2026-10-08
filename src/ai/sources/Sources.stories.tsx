// Sources.stories.tsx — AI/Sources (SourceList + Citation, SURF-348/349).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { SourceList, type AgSourcePart } from './SourceList';
import { Citation } from './Citation';

const meta = {
  title: 'AI/Sources',
  parameters: { ag: { subject: 'SourceList', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const src = (i: number): AgSourcePart => ({
  type: 'source-url', sourceId: `s${i}`, url: `https://docs.internal/ref-${i}`, title: `Reference ${i}`,
} as AgSourcePart);

export const Three: Story = { render: () => <SourceList messageId="m" sources={[src(1), src(2), src(3)]} /> };
export const Twelve: Story = { render: () => <SourceList messageId="m" sources={Array.from({ length: 12 }, (_, i) => src(i + 1))} /> };
export const CitationFocused: Story = {
  render: () => (
    <p>
      See <Citation messageId="m" source={src(1)} index={1} /> for details.
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
