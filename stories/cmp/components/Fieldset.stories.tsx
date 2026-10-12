import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Fieldset } from '../../../src/components/field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Fieldset',
  component: Fieldset,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Fieldset', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Fieldset>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Fieldset renders its root and legend parts only; the grouped controls are native inputs so the rendered parts
   stay the fieldset's own (S-33). */
const option: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--ag-space-2)' };
const stack: React.CSSProperties = { display: 'grid', gap: 'var(--ag-space-2)' };

/* Usage: a legend naming a group of related inputs. */
export const Playground: Story = {
  render: () => (
    <Fieldset legend="Shipping address" style={stack}>
      <label style={stack}>Street <input type="text" autoComplete="street-address" defaultValue="18 Harbour Road" /></label>
      <label style={stack}>City <input type="text" autoComplete="address-level2" defaultValue="Portsmouth" /></label>
    </Fieldset>
  ),
};

/* Enabled, disabled (disables every descendant control) and without a legend. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-6)' }}>
      <Fieldset legend="Delivery window" style={stack}>
        <label style={option}><input type="radio" name="window-a" value="am" defaultChecked /> Morning</label>
        <label style={option}><input type="radio" name="window-a" value="pm" /> Afternoon</label>
      </Fieldset>
      <Fieldset legend="Delivery window (locked after dispatch)" disabled style={stack}>
        <label style={option}><input type="radio" name="window-b" value="am" defaultChecked /> Morning</label>
        <label style={option}><input type="radio" name="window-b" value="pm" /> Afternoon</label>
      </Fieldset>
      <Fieldset aria-label="Gift options" style={stack}>
        <label style={option}><input type="checkbox" value="wrap" /> Gift wrap</label>
        <label style={option}><input type="checkbox" value="note" /> Add a note</label>
      </Fieldset>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <Fieldset legend="Notifications">
      <input type="checkbox" aria-label="email" />
      <input type="checkbox" aria-label="sms" />
    </Fieldset>
  ),
};

/* Two fieldsets on one form, each with its own legend. */
export const Grouped: Story = {
  render: () => (
    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 'var(--ag-space-6)' }}>
      <Fieldset legend="Contact" style={stack}>
        <label style={stack}>Email <input type="email" autoComplete="email" defaultValue="ops@northwind.example" /></label>
      </Fieldset>
      <Fieldset legend="Billing" style={stack}>
        <label style={option}><input type="radio" name="cycle" value="monthly" defaultChecked /> Monthly</label>
        <label style={option}><input type="radio" name="cycle" value="annual" /> Annual</label>
      </Fieldset>
    </form>
  ),
};
