import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Field } from '../../../src/components/field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Field',
  component: Field.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Field', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Field.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Usage: a label, a control and its description. */
export const Playground: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Workspace name</Field.Label>
      <Field.Control render={<input />} defaultValue="Northwind Ops" />
      <Field.Description>Visible to everyone you invite.</Field.Description>
    </Field.Root>
  ),
};

/* Enabled, disabled, read-only and invalid, side by side. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-6)', maxInlineSize: '24rem' }}>
      <Field.Root>
        <Field.Label>Project code</Field.Label>
        <Field.Control render={<input />} defaultValue="NW-2041" />
        <Field.Description>Editable.</Field.Description>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>Region</Field.Label>
        <Field.Control render={<input />} defaultValue="eu-west-2" />
        <Field.Description>Fixed when the workspace was created.</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>Workspace ID</Field.Label>
        <Field.Control render={<input />} readOnly defaultValue="ws_8f3k2" />
        <Field.Description>Read-only; copy it for support requests.</Field.Description>
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>Billing email</Field.Label>
        <Field.Control render={<input />} defaultValue="billing@" />
        <Field.Error match={true}>Enter a complete email address.</Field.Error>
      </Field.Root>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Display name</Field.Label>
      <Field.Control render={<input />} />
      <Field.Description>Shown on your profile.</Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Field.Control render={<input />} />
      <Field.Description>We never share it.</Field.Description>
      <Field.Error match={true}>Enter a valid email.</Field.Error>
    </Field.Root>
  ),
};
