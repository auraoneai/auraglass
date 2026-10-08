import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DescriptionList } from '../../../src/components/description-list';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/DescriptionList',
  component: DescriptionList,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'DescriptionList', kind: 'component' } },
} satisfies Meta<typeof DescriptionList>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'DescriptionList', id: 'core-description-list--default' } },
  render: () => (
    <DescriptionList>
      <DescriptionList.Item>
        <DescriptionList.Term>Term</DescriptionList.Term>
        <DescriptionList.Details>Details</DescriptionList.Details>
      </DescriptionList.Item>
    </DescriptionList>
  ),
};

export const Inline: Story = {
  parameters: { ag: { tier: 'standard', subject: 'DescriptionList', id: 'core-description-list--inline' } },
  render: () => (
    <DescriptionList layout="inline">
      <DescriptionList.Item>
        <DescriptionList.Term>K</DescriptionList.Term>
        <DescriptionList.Details>V</DescriptionList.Details>
      </DescriptionList.Item>
    </DescriptionList>
  ),
};

