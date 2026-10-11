import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../../../src/icons';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Icon',
  component: Icon,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Icon', kind: 'component' } },
} satisfies Meta<typeof Icon>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Icon', id: 'core-icon--default' } },
  render: () => <Icon name="spark" />,
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Icon', id: 'core-icon--sizes' } },
  render: () => (
    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <Icon name="user" size={16} />
      <Icon name="user" size={24} />
      <Icon name="user" size={32} />
    </span>
  ),
};
