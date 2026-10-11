import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { KeyValueEditor } from './KeyValueEditor';

const meta = {
  title: 'surf/key-value-editor',
  parameters: { ag: { subject: 'KeyValueEditor', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderKV = () => (
  <KeyValueEditor
    defaultValue={[
      { key: 'region', value: 'us-east-1' },
      { key: 'tier', value: 'pro' },
    ]}
  />
);
export const Basic: Story = { render: renderKV };
export const Duplicates: Story = {
  render: () => <KeyValueEditor defaultValue={[{ key: 'a', value: '1' }, { key: 'a', value: '2' }]} />,
};
