import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Switch } from '../../../src/components/switch';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, SettingRow, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Switch',
  component: Switch,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Switch', kind: 'component' } },
} satisfies Meta<typeof Switch>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Switch is a content control: it sits on a content-raised panel over the
   scene (never directly on glass). */
export const Default: Story = {
  render: () => (
    <Stage>
      <Section title="Switch" note="Accent track when on; a sunken track with a hairline rim when off.">
        <Scene>
          <Panel title="Notifications" width={400}>
            <SettingRow label="Enabled" hint="Deliver alerts to this device.">
              <Switch aria-label="Enabled" />
            </SettingRow>
            <SettingRow label="Weekly digest" hint="A summary every Monday morning.">
              <Switch aria-label="Weekly digest" defaultChecked />
            </SettingRow>
            <SettingRow label="Sync over cellular" hint="Managed by your organisation.">
              <Switch aria-label="Sync over cellular" disabled />
            </SettingRow>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};
