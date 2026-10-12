import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Switch } from '../../../src/components/switch';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, SettingRow, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Switch',
  component: Switch,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Switch', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Switch>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Switch is a content control: it sits on a content-raised panel over the
   scene (never directly on glass). */
/* An element builder, not a component: stories call it so Switch stays in the
   story's static element tree (the ref-forwarding check attaches `ref` there). */
function notificationSettings() {
  return (
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
  );
}

/* Usage: one switch with its setting label. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Switch" note="Flip a setting that applies immediately.">
        <Scene>
          <Panel title="Privacy" width={400}>
            <SettingRow label="Share usage data" hint="Helps us prioritise fixes.">
              <Switch aria-label="Share usage data" />
            </SettingRow>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Every state side by side: off, on, disabled off, disabled on. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="Off, on, and both disabled states keep the same track geometry.">
        <Scene>
          <Panel title="Device sync" width={400}>
            <SettingRow label="Off" hint="Not syncing.">
              <Switch aria-label="Off" />
            </SettingRow>
            <SettingRow label="On" hint="Syncing every hour.">
              <Switch aria-label="On" defaultChecked />
            </SettingRow>
            <SettingRow label="Disabled, off" hint="Blocked by policy.">
              <Switch aria-label="Disabled, off" disabled />
            </SettingRow>
            <SettingRow label="Disabled, on" hint="Required by policy.">
              <Switch aria-label="Disabled, on" defaultChecked disabled />
            </SettingRow>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = { render: () => notificationSettings() };

/* The story tests/a11y/apg/cmp/switch.apg.spec.ts drives (Space / Enter per SWITCH_KEYS). */
export const Keyboard: Story = { tags: ['apg'], render: () => notificationSettings() };
