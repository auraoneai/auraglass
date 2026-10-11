// SourceList.stories.tsx — AI/SourceList (SURF-348/349).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SourceList, type AgSourcePart } from './SourceList';

const meta = {
  title: 'AI/SourceList',
  parameters: { ag: { subject: 'SourceList', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const src = (i: number): AgSourcePart => ({
  type: 'source-url', sourceId: `s${i}`, url: `https://docs.internal/ref-${i}`, title: `Reference ${i}`,
} as AgSourcePart);
const doc = { type: 'source-document', sourceId: 'd1', mediaType: 'application/pdf', title: 'Runbook', filename: 'runbook.pdf' } as AgSourcePart;

export const Three: Story = { render: () => <SourceList messageId="m" sources={[src(1), src(2), src(3)]} /> };
export const Twelve: Story = { render: () => <SourceList messageId="m" sources={Array.from({ length: 12 }, (_, i) => src(i + 1))} /> };
export const WithDocument: Story = { render: () => <SourceList messageId="m" sources={[src(1), doc]} /> };
