import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FacetedSearch } from './index';
import { FACETS, RESULTS } from './fixtures';

const meta = {
  title: 'registry/faceted-search',
  parameters: { ag: { subject: 'faceted-search', kind: 'item' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderItem = () => <FacetedSearch facets={FACETS} results={RESULTS} />;
export const Default: Story = { render: renderItem };
export const Empty: Story = { render: () => <FacetedSearch facets={FACETS} results={[]} /> };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderItem };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderItem };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderItem };
