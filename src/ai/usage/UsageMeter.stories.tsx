// UsageMeter.stories.tsx — AI/UsageMeter (SURF-348).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { UsageMeter } from './UsageMeter';

const meta = {
  title: 'AI/UsageMeter',
  parameters: { ag: { subject: 'UsageMeter', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = { render: () => <UsageMeter usage={{ inputTokens: 1200, outputTokens: 400, contextWindow: 128000 }} /> };
export const Warning: Story = { render: () => <UsageMeter usage={{ inputTokens: 78000, outputTokens: 22000, contextWindow: 128000 }} /> };
export const Critical: Story = { render: () => <UsageMeter usage={{ inputTokens: 118000, outputTokens: 9000, contextWindow: 128000 }} /> };
