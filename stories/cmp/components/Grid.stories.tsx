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

/* REQ-CMP-112: six focusable items of uneven height, so the masonry layout
   (native grid masonry or the CSS-columns fallback) places them out of
   visual row order while DOM / Tab order stays source order.
   tests/e2e/cmp/layout/grid-masonry.spec.ts tabs through them. */
const MASONRY_HEIGHTS = [96, 48, 72, 40, 88, 56];

export const Masonry: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Grid', id: 'core-grid--masonry' } },
  render: () => (
    <Grid masonry columns={3} gap={2}>
      {MASONRY_HEIGHTS.map((h, i) => (
        <button key={i} type="button" style={{ blockSize: h, inlineSize: '100%' }}>
          Item {i + 1}
        </button>
      ))}
    </Grid>
  ),
};

/* REQ-CMP-112: the same responsive Grid inside fixed-width frames. Columns
   resolve against Grid's own shell, so no Container ancestor is needed.
   tests/e2e/cmp/layout/grid-columns.spec.ts reads the computed tracks. */
const FRAME_WIDTHS = [400, 600, 800, 1100];

export const ResponsiveContainers: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Grid', id: 'core-grid--responsive-containers' } },
  render: () => (
    <div>
      {FRAME_WIDTHS.map((w) => (
        <div key={w} data-testid={`frame-${w}`} style={{ inlineSize: w }}>
          <Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={2}>
            <div>1</div><div>2</div><div>3</div><div>4</div>
          </Grid>
        </div>
      ))}
      <div data-testid="frame-md-only" style={{ inlineSize: 800 }}>
        <Grid columns={{ base: 1, md: 3 }} gap={2}>
          <div>1</div><div>2</div><div>3</div>
        </Grid>
      </div>
    </div>
  ),
};

