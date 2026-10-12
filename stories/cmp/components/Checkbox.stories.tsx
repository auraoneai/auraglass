import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Checkbox } from '../../../src/components/checkbox';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Checkbox',
  component: Checkbox,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Checkbox', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Checkbox>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const column: React.CSSProperties = { display: 'grid', gap: 'var(--ag-space-3)' };

function EmailPreferences() {
  return (
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
  );
}

/* Usage: a single opt-in. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Checkbox" note="A single opt-in with its label as the hit target.">
        <Scene>
          <Panel title="Terms" width={400}>
            <Checkbox value="terms">I agree to the subscription terms</Checkbox>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Every state: unchecked, checked, mixed, and the disabled pair. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="Unchecked, checked and mixed, enabled and disabled.">
        <Scene>
          <Panel title="Workspace access" width={400}>
            <div style={column}>
              <Checkbox value="read">Read</Checkbox>
              <Checkbox value="write" defaultChecked>Write</Checkbox>
              <Checkbox value="admin" indeterminate>Admin (some projects)</Checkbox>
              <Checkbox value="owner" disabled>Owner</Checkbox>
              <Checkbox value="audit" defaultChecked disabled>Audit log</Checkbox>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = { render: () => <EmailPreferences /> };

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

/* The story tests/a11y/apg/cmp/checkbox.apg.spec.ts drives (each box a tab stop; Space flips aria-checked). */
export const Keyboard: Story = { tags: ['apg'], render: () => <EmailPreferences /> };
