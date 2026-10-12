import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ButtonGroup } from '../../../src/components/button-group';
import { Button } from '../../../src/components/button';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Glyph, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  /* ButtonGroup has no ComponentMeta.flagship number, so it is a Core title (REQ-QUAL-49), not a Flagships one. */
  title: 'Core/ButtonGroup',
  component: ButtonGroup,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'ButtonGroup', kind: 'component' } },
  args: { 'aria-label': 'Actions' },
} satisfies Meta<typeof ButtonGroup>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Real Buttons (the stories used raw UA <button>s). suppressInnerParts keeps
   the rendered part set to ButtonGroup's own meta parts (root, item). */
const B = (props: React.ComponentProps<typeof Button>) => <Button suppressInnerParts {...props} />;

export const Default: Story = {
  render: (args) => (
    <Stage>
      <Section title="Attached" note="Joined segments with a hairline seam; outer corners stay concentric with the capsule.">
        <Scene>
          <ButtonGroup {...args}>
            <B>Day</B>
            <B>Week</B>
            <B>Month</B>
          </ButtonGroup>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Detached and vertical layouts share one story (Core titles stay within the
   smallest flagship title's story count, story-titles/oversize-title). */
export const Layouts: Story = {
  args: { 'aria-label': 'Actions' },
  render: (args) => (
    <Stage>
      <Section title="Detached">
        <Scene>
          <ButtonGroup {...args} attached={false}>
            <B startIcon={<Glyph name="undo" />}>Undo</B>
            <B startIcon={<Glyph name="redo" />}>Redo</B>
          </ButtonGroup>
        </Scene>
      </Section>
      <Section title="Vertical">
        <Scene>
          <ButtonGroup aria-label="Reorder" orientation="vertical">
            <B>Move to top</B>
            <B>Move to bottom</B>
          </ButtonGroup>
        </Scene>
      </Section>
    </Stage>
  ),
};
