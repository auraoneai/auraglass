// Reasoning.stories.tsx — AI/Reasoning (SURF-348).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Reasoning } from './Reasoning';

const meta = {
  title: 'AI/Reasoning',
  parameters: { ag: { subject: 'Reasoning', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Streaming: Story = { render: () => <Reasoning text="Comparing timestamps across the two deploys…" state="streaming" /> };
export const DoneCollapsed: Story = { render: () => <Reasoning text="Checked three releases; the regression started after 4.2.1." state="done" durationMs={4200} /> };
export const DoneExpanded: Story = { render: () => <Reasoning text="Checked three releases; the regression started after 4.2.1." state="done" durationMs={4200} defaultOpen /> };
