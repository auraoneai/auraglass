import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFormBuilder } from './GlassFormBuilder';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassFormBuilder> = {
  title: 'Workflows/Glass Form Builder',
  component: GlassFormBuilder,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassformbuilder component.',
      },
    },
  },
  argTypes: {
    schema: {
      control: 'object',
      description: 'Form schema with sections and fields',
    },
    values: {
      control: 'object',
      description: 'Current form values',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'wizard', 'inline'],
      description: 'Form variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Form size',
    },
    loading: {
      control: 'boolean',
      description: 'Whether form is loading',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether form is disabled',
    },
  },
  args: {
    schema: [
      {
        id: 'personal',
        title: 'Personal Information',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Enter your message',
          },
        ],
      },
    ],
    values: {},
    variant: 'default',
    size: 'md',
    loading: false,
    disabled: false,
    onChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassFormBuilder>;

export const Default: Story = {
  args: {
    schema: [
      {
        id: 'contact',
        title: 'Contact Form',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true,
          },
          {
            id: 'subject',
            type: 'select',
            label: 'Subject',
            options: [
              { value: 'general', label: 'General Inquiry' },
              { value: 'support', label: 'Technical Support' },
              { value: 'sales', label: 'Sales' },
            ],
          },
        ],
      },
    ],
    values: {},
    onChange: fn(),
    onSubmit: fn(),
  },
};

export const Variants: Story = {
  args: {
    schema: [
      {
        id: 'personal',
        title: 'Personal Information',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'Enter your first name',
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'Last Name',
            placeholder: 'Enter your last name',
          },
        ],
      },
    ],
    values: {},
    variant: 'compact',
    onChange: fn(),
    onSubmit: fn(),
  },
};
