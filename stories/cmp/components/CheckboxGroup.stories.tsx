import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CheckboxGroup } from '../../../src/components/checkbox';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'CheckboxGroup', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof CheckboxGroup>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* CheckboxGroup renders only its root part; its stories use native checkboxes so the rendered parts stay the
   group's own (S-33). Checkbox's parts are covered by Checkbox.stories.tsx. */
const option: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--ag-space-2)' };
const stack: React.CSSProperties = { display: 'grid', gap: 'var(--ag-space-2)' };
const caption: React.CSSProperties = { margin: 0, fontWeight: 'var(--ag-type-label-weight)' };

/* An element builder, not a component: stories call it so CheckboxGroup stays in the
   story's static element tree (the ref-forwarding check attaches `ref` there). */
function twoBoxes() {
  return (
    <CheckboxGroup defaultValue={['a']}>
      <input type="checkbox" aria-label="a" defaultChecked />
      <input type="checkbox" aria-label="b" />
    </CheckboxGroup>
  );
}

function Regions({ title, checked, disabled = false }: { title: string; checked: string[]; disabled?: boolean }) {
  return (
    <div style={stack}>
      <p style={caption}>{title}</p>
      <CheckboxGroup defaultValue={checked} disabled={disabled}>
        <div style={stack}>
          <label style={option}>
            <input type="checkbox" value="eu" defaultChecked={checked.includes('eu')} disabled={disabled} /> Europe
          </label>
          <label style={option}>
            <input type="checkbox" value="us" defaultChecked={checked.includes('us')} disabled={disabled} /> United States
          </label>
        </div>
      </CheckboxGroup>
    </div>
  );
}

/* Usage: a group of related opt-ins sharing one name. */
export const Playground: Story = {
  render: () => (
    <div style={stack}>
      <p style={caption}>Alert channels</p>
      <CheckboxGroup defaultValue={['email']} name="channel">
        <div style={stack}>
          <label style={option}><input type="checkbox" name="channel" value="email" defaultChecked /> Email</label>
          <label style={option}><input type="checkbox" name="channel" value="sms" /> Text message</label>
          <label style={option}><input type="checkbox" name="channel" value="push" /> Push notification</label>
        </div>
      </CheckboxGroup>
    </div>
  ),
};

/* None, some and all selected, and a disabled group. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-6)' }}>
      <Regions title="No regions selected" checked={[]} />
      <Regions title="Some regions selected" checked={['eu']} />
      <Regions title="All regions selected" checked={['eu', 'us']} />
      <Regions title="Locked by policy" checked={['eu']} disabled />
    </div>
  ),
};

export const Default: Story = { render: () => twoBoxes() };

/* The story tests/a11y/apg/cmp/checkbox.apg.spec.ts drives for the group pattern (every box stays a tab stop). */
export const Keyboard: Story = { tags: ['apg'], render: () => twoBoxes() };
