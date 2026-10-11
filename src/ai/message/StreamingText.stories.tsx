// StreamingText.stories.tsx — AI/StreamingText (REQ-SURF-113).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StreamingText } from './StreamingText';

const meta = {
  title: 'AI/StreamingText',
  parameters: { ag: { subject: 'StreamingText', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Streaming: Story = { render: () => <StreamingText text="Compiling the incident timeline" streaming /> };
export const Done: Story = { render: () => <StreamingText text="Incident timeline compiled." /> };
