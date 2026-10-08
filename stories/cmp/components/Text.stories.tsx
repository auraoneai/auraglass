import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../../src/components/text';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Text',
  component: Text,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Text', kind: 'component' } },
} satisfies Meta<typeof Text>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Text', id: 'core-text--default' } },
  render: () => (
    <Text>Body text</Text>
  ),
};

export const Matrix: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Text', id: 'core-text--matrix' } },
  render: () => (
    <div>
      <Text type="callout">Callout</Text>
      <Text type="caption">Caption</Text>
      <Text type="label">Label</Text>
      <Text type="mono">Mono</Text>
      <Text intent="success">Success</Text>
      <Text intent="warning">Warning</Text>
      <Text intent="danger">Danger</Text>
      <Text muted>Muted</Text>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Text', id: 'core-text--sizes' } },
  render: () => (
    <div>
      <Text size="xs">xs</Text><Text size="sm">sm</Text><Text size="md">md</Text><Text size="lg">lg</Text>
    </div>
  ),
};

