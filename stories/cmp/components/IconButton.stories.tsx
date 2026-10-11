import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { IconButton } from '../../../src/components/icon-button';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Caption, Glyph, Row, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/IconButton',
  component: IconButton,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'IconButton', kind: 'component' } },
  args: { label: 'Close' },
} satisfies Meta<typeof IconButton>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  args: { label: 'Close', icon: <Glyph name="close" /> },
  render: (args) => (
    <Stage>
      <Scene>
        <IconButton {...args} />
      </Scene>
    </Stage>
  ),
};

export const Overview: Story = {
  args: { icon: <Glyph name="close" /> },
  render: (args) => (
    <Stage>
      <Section title="Icon buttons" note="Square-to-capsule glass at the control-height tokens; the hit area still reaches the 44 px target.">
        <Scene>
          <IconButton label="Share" icon={<Glyph name="share" />} />
          <IconButton label="Favourite" icon={<Glyph name="heart" />} />
          <IconButton label="Settings" icon={<Glyph name="gear" />} />
          <IconButton {...args} />
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Shapes: Story = {
  args: { label: 'Capsule', icon: null },
  render: () => (
    <Stage>
      <Section title="Shapes">
        <Scene>
          <Row gap="var(--ag-space-6)">
            <Row gap="var(--ag-space-2)">
              <IconButton label="Capsule" icon={<Glyph name="close" />} />
              <Caption>capsule</Caption>
            </Row>
            <Row gap="var(--ag-space-2)">
              <IconButton label="Fixed" icon={<Glyph name="close" />} shape="fixed" />
              <Caption>fixed</Caption>
            </Row>
          </Row>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Sizes: Story = {
  args: { label: 'x', icon: null },
  render: () => (
    <Stage>
      <Section title="Sizes" note="sm / md / lg = 28 / 36 / 44 px.">
        <Scene>
          <IconButton label="small" icon={<Glyph name="plus" />} size="sm" />
          <IconButton label="medium" icon={<Glyph name="plus" />} size="md" />
          <IconButton label="large" icon={<Glyph name="plus" />} size="lg" />
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Toggle: Story = {
  args: { label: 'Pin', icon: null },
  render: () => (
    <Stage>
      <Section title="Toggle" note="Pressed uses the selected material row: accent tint plus a heavier accent rim.">
        <Scene>
          <IconButton label="Pin" icon={<Glyph name="pin" />} defaultPressed />
          <IconButton label="Favourite" icon={<Glyph name="heart" />} defaultPressed={false} />
        </Scene>
      </Section>
    </Stage>
  ),
};
