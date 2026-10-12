// StreamingText.stories.tsx — StreamingText (REQ-SURF-113). `id` keeps the
// published story ids (ai-streamingtext--*).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StreamingText } from './StreamingText';

const meta = {
  title: 'Core/StreamingText',
  id: 'ai-streamingtext',
  parameters: { ag: { subject: 'StreamingText', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/* meta.states: streaming (caret shown) and done, side by side. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-3)' }}>
      <StreamingText text="Compiling the incident timeline" streaming />
      <StreamingText text="Incident timeline compiled." />
    </div>
  ),
};
