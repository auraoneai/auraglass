// ProviderErrorState.stories.tsx — AI/ProviderErrorState, one per kind + retry countdown (SURF-348).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ProviderErrorState } from './ProviderErrorState';

const meta = {
  title: 'AI/ProviderErrorState',
  parameters: { ag: { subject: 'ProviderErrorState', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const RateLimit: Story = { render: () => <ProviderErrorState kind="rate-limit" onRetry={() => undefined} /> };
export const Auth: Story = { render: () => <ProviderErrorState kind="auth" /> };
export const Network: Story = { render: () => <ProviderErrorState kind="network" onRetry={() => undefined} /> };
export const ContentFilter: Story = { render: () => <ProviderErrorState kind="content-filter" /> };
export const ContextLength: Story = { render: () => <ProviderErrorState kind="context-length" /> };
export const Aborted: Story = { render: () => <ProviderErrorState kind="aborted" /> };
export const Unknown: Story = { render: () => <ProviderErrorState kind="unknown" onRetry={() => undefined} /> };
export const RetryCountdown: Story = { render: () => <ProviderErrorState kind="rate-limit" retryAfterMs={5000} onRetry={() => undefined} /> };
