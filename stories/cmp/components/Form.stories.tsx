import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Form } from '../../../src/components/field';
import { Field } from '../../../src/components/field';
import { Button } from '../../../src/components/button';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/Form',
  component: Form,
  tags: ['core'],
  parameters: { ag: { subject: 'Form', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Form>;
export default meta;
type Story = StoryObj<typeof meta>;

function FieldRow({ name, label }: { name: string; label: string }) {
  return (
    <Field.Root name={name}>
      <Field.Label>{label}</Field.Label>
      <Field.Control />
      <Field.Error />
    </Field.Root>
  );
}

export const Default: Story = {
  render: () => (
    <Form onSubmit={() => {}}>
      <FieldRow name="name" label="Name" />
      <FieldRow name="email" label="Email" />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const WithErrors: Story = {
  render: () => (
    <Form
      errors={{ email: 'Already registered', name: 'Too short' }}
      onSubmit={() => {}}
    >
      <FieldRow name="name" label="Name" />
      <FieldRow name="email" label="Email" />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const SubmitInvalid: Story = {
  name: 'Submit invalid (focus first invalid)',
  render: () => (
    <Form onSubmit={() => {}}>
      <Field.Root name="first" validate={(v) => (v ? null : 'Required')}>
        <Field.Label>First</Field.Label>
        <Field.Control />
        <Field.Error />
      </Field.Root>
      <Field.Root name="second" validate={(v) => (v ? null : 'Required')}>
        <Field.Label>Second</Field.Label>
        <Field.Control />
        <Field.Error />
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const Keyboard: Story = {
  render: () => (
    <Form onSubmit={() => {}}>
      <FieldRow name="a" label="Field A" />
      <FieldRow name="b" label="Field B" />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};
