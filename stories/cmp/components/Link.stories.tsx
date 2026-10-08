import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '../../../src/components/link';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Link',
  component: Link,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Link', kind: 'component' } },
} satisfies Meta<typeof Link>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Link', id: 'core-link--default' } },
  render: () => (
    <Link href="#">Link</Link>
  ),
};

export const External: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Link', id: 'core-link--external' } },
  render: () => (
    <Link href="https://example.com" target="_blank">External</Link>
  ),
};

export const Danger: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Link', id: 'core-link--danger' } },
  render: () => (
    <Link href="#" intent="danger" underline="always">Delete</Link>
  ),
};

