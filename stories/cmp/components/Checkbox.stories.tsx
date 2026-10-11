import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Checkbox } from '../../../src/components/checkbox';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Checkbox',
  component: Checkbox,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Checkbox', kind: 'component' } },
} satisfies Meta<typeof Checkbox>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const column: React.CSSProperties = { display: 'grid', gap: 'var(--ag-space-3)' };

export const Default: Story = {
  render: () => (
    <Stage>
      <Section title="Checkbox" note="Sunken box with a hairline rim; checked fills with the accent.">
        <Scene>
          <Panel title="Email preferences" width={400}>
            <div style={column}>
              <Checkbox value="product">Product updates</Checkbox>
              <Checkbox value="digest" defaultChecked>Weekly digest</Checkbox>
              <Checkbox value="billing" defaultChecked disabled>Billing notices</Checkbox>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <Stage>
      <Section title="Indeterminate" note="A parent whose children are partly selected.">
        <Scene>
          <Panel title="Export" width={400}>
            <div style={column}>
              <Checkbox value="all" indeterminate>All workspaces</Checkbox>
              <div style={{ ...column, paddingInlineStart: 'var(--ag-space-6)' }}>
                <Checkbox value="design" defaultChecked>Design</Checkbox>
                <Checkbox value="research">Research</Checkbox>
              </div>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};
