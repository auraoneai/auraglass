import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TextField } from '../../../src/components/text-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/TextField',
  component: TextField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'TextField', kind: 'component' } },
} satisfies Meta<typeof TextField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <Stage>
      <Section title="Text field" note="Opaque content-sunken shell with a hairline rim, adornments and a live counter.">
        <Scene>
          <Panel title="New project" width={420}>
            <TextField
              label="Project name"
              description="Up to 40 characters."
              startAdornment={<span aria-hidden="true">@</span>}
              endAdornment={<span aria-hidden="true">.ai</span>}
              maxLength={40}
              showCount
              placeholder="northern-lights"
            />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Stage>
      <Section title="Invalid" note="A heavier danger rim plus the error message, never colour alone.">
        <Scene>
          <Panel title="Invite a teammate" width={420}>
            <TextField label="Email" error="Enter an address like name@example.com." defaultValue="not-an-email" />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Multiline: Story = {
  render: () => (
    <Stage>
      <Section title="Multiline" note="Grows with its content up to eight rows.">
        <Scene>
          <Panel title="Profile" width={420}>
            <TextField
              label="Bio"
              multiline
              rows={3}
              autoResize
              maxRows={8}
              defaultValue="Field photographer based in Tromsø, chasing the aurora every winter."
            />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};
