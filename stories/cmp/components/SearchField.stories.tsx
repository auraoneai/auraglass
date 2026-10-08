import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SearchField } from '../../../src/components/search-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/SearchField',
  component: SearchField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'SearchField', kind: 'component' } satisfies StoryAgParameters },
  args: { 'aria-label': 'Search' },
} satisfies Meta<typeof SearchField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <SearchField label="Search" shortcut="⌘K" loading description="Type to filter." error="No index" />
  ),
};

export const WithValue: Story = {
  render: () => <SearchField label="Search" defaultValue="glass" />,
};
