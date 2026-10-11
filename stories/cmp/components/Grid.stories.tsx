import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '../../../src/components/grid';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Grid',
  component: Grid,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Grid', kind: 'component' } },
} satisfies Meta<typeof Grid>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Grid', id: 'core-grid--default' } },
  render: () => (
    <Grid columns={3} gap={2}>
      <div>1</div><div>2</div><div>3</div>
    </Grid>
  ),
};

export const Responsive: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Grid', id: 'core-grid--responsive' } },
  render: () => (
    <Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={2}>
      <div>1</div><div>2</div>
    </Grid>
  ),
};

export const Masonry: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Grid', id: 'core-grid--masonry' } },
  render: () => (
    <Grid variant="masonry" columns={2} gap={2}>
      <div style={{ height: 60 }}>tall</div><div>short</div>
    </Grid>
  ),
};

